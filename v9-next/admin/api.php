<?php
/* JSON API adminu. Všetko okrem prihlásenia vyžaduje session a CSRF token v hlavičke X-CSRF. */
declare(strict_types=1);
require __DIR__ . '/lib.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');

function out($d, int $code = 200): void { http_response_code($code); echo json_encode($d, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); exit; }
function fail(string $msg, int $code = 400): void { out(['error' => $msg], $code); }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Len POST', 405);
start_session();
$act = (string)($_GET['a'] ?? '');
$in = str_starts_with((string)($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')
  ? (json_decode((string)file_get_contents('php://input'), true) ?: []) : $_POST;

if ($act === 'login') {
  if (!login_allowed()) fail('Príliš veľa pokusov. Skúste o 15 minút.', 429);
  $hash = (string)cfg('password_hash');
  if ($hash === '' || !password_verify((string)($in['password'] ?? ''), $hash)) { login_failed(); sleep(1); fail('Nesprávne heslo.', 401); }
  session_regenerate_id(true);
  $_SESSION['ok'] = true;
  out(['ok' => true, 'csrf' => $_SESSION['csrf']]);
}

if (empty($_SESSION['ok'])) fail('Prihláste sa znova.', 401);
if (!hash_equals($_SESSION['csrf'], (string)($_SERVER['HTTP_X_CSRF'] ?? ''))) fail('Neplatný token, obnovte stránku.', 403);

/* ---------- pomocné ---------- */
function valid_path(string $p): bool
{
  return (bool)preg_match('#^(rz|img|data/rz)/[a-z0-9_/-]+\.(webp|jpe?g|png)$#', $p) && !str_contains($p, '..');
}

/* preklad polí z SK do jazykov, ktoré klient neupravil ručne */
function translate_block(array $sk, array $new, ?array $old, array $manual, bool $force, array $fields, array &$miss): array
{
  $res = [];
  $skChanged = $old === null || array_diff_assoc(array_intersect_key($sk, array_flip($fields)), array_intersect_key($old['sk'] ?? [], array_flip($fields)));
  foreach (LANGS as $l) {
    $given = [];
    foreach ($fields as $f) $given[$f] = clean((string)($new[$l][$f] ?? ''), 2000);
    if (!$force && !empty($manual[$l])) { $res[$l] = $given; continue; }
    $empty = !array_filter($given, fn($v) => $v !== '');
    if (!$force && !$skChanged && !$empty) { $res[$l] = $old[$l] ?? $given; continue; }
    $keys = array_values(array_filter($fields, fn($f) => $sk[$f] !== ''));
    $tr = deepl(array_map(fn($f) => $sk[$f], $keys), $l);
    if ($tr === null) { if ((string)cfg('deepl_key') !== '') $miss[] = $l; $res[$l] = array_intersect_key($sk, array_flip($fields)); continue; }
    $res[$l] = array_fill_keys($fields, '');
    foreach ($keys as $i => $f) $res[$l][$f] = $tr[$i];
  }
  return $res;
}

/* ---------- akcie ---------- */
switch ($act) {
  case 'state':
    out(['items' => read_json('realizacie.json', []), 'banner' => read_json('banner.json', null), 'deepl' => (string)cfg('deepl_key') !== '']);

  case 'logout':
    $_SESSION = [];
    session_destroy();
    out(['ok' => true]);

  case 'saveItem':
    $it = $in['item'] ?? null;
    if (!is_array($it)) fail('Chýbajú dáta.');
    $force = !empty($in['retranslate']);
    $res = with_lock(function () use ($it, $force) {
      $items = read_json('realizacie.json', []);
      $slug = (string)($it['slug'] ?? '');
      $idx = $slug === '' ? -1 : array_search($slug, array_column($items, 'slug'), true);
      $old = $idx === false || $idx < 0 ? null : $items[$idx];
      $sk = [];
      foreach (FIELDS as $f) $sk[$f] = clean((string)($it['sk'][$f] ?? ''), $f === 'd' ? 2000 : 160);
      if ($sk['t'] === '') fail('Vyplňte názov.');
      if ($old === null) { // nová realizácia: jedinečný slug z názvu
        $base = slugify($sk['t'] . ' ' . $sk['p']); $slug = $base; $n = 2;
        while (in_array($slug, array_column($items, 'slug'), true)) $slug = $base . '-' . $n++;
      }
      $photos = array_values(array_unique(array_filter(array_map('strval', (array)($it['photos'] ?? [])), 'valid_path')));
      if (!$photos) fail('Pridajte aspoň jednu fotku.');
      $cover = (string)($it['cover'] ?? '');
      if (!valid_path($cover)) $cover = $photos[0];
      $manual = array_intersect_key((array)($it['manual'] ?? []), array_flip(LANGS));
      $miss = [];
      $tr = translate_block($sk, $it, $old, $manual, $force, FIELDS, $miss);
      $row = ['slug' => $slug, 'group' => in_array($it['group'] ?? '', GROUPS, true) ? $it['group'] : 'nove',
        'cover' => $cover, 'photos' => $photos, 'sk' => $sk + ['alt' => '']] + $tr;
      foreach (array_merge(['sk'], LANGS) as $l) $row[$l]['alt'] = trim($row[$l]['t'] . ($row[$l]['p'] !== '' ? ', ' . $row[$l]['p'] : ''));
      $row['manual'] = (object)($force ? [] : array_filter(array_map('boolval', $manual)));
      if ($old === null) array_unshift($items, $row); else $items[$idx] = $row;
      write_json('realizacie.json', $items);
      mark_publish();
      return ['item' => $row, 'untranslated' => $miss];
    });
    out($res);

  case 'deleteItem':
    $slug = (string)($in['slug'] ?? '');
    with_lock(function () use ($slug) {
      $items = array_values(array_filter(read_json('realizacie.json', []), fn($r) => $r['slug'] !== $slug));
      write_json('realizacie.json', $items);
      mark_publish();
    });
    out(['ok' => true]);

  case 'reorder':
    $order = array_map('strval', (array)($in['slugs'] ?? []));
    with_lock(function () use ($order) {
      $items = read_json('realizacie.json', []);
      $pos = array_flip($order);
      usort($items, fn($a, $b) => ($pos[$a['slug']] ?? PHP_INT_MAX) <=> ($pos[$b['slug']] ?? PHP_INT_MAX));
      write_json('realizacie.json', $items);
      mark_publish();
    });
    out(['ok' => true]);

  case 'upload': // fotka zmenšená v prehliadači (JPEG), kind = rz | banner
    $kind = ($in['kind'] ?? '') === 'banner' ? 'banner' : 'rz/_u';
    $f = $_FILES['file'] ?? null;
    if (!$f || $f['error'] !== UPLOAD_ERR_OK) fail('Fotka sa nenahrala.');
    if ($f['size'] > 12 * 1024 * 1024) fail('Fotka je väčšia ako 12 MB.');
    $info = @getimagesize($f['tmp_name']);
    $ext = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'][$info['mime'] ?? ''] ?? null;
    if (!$ext) fail('Podporované sú len JPG, PNG a WebP.');
    $dir = data_path($kind);
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $name = date('ymd') . '-' . bin2hex(random_bytes(5)) . '.' . $ext;
    if (!move_uploaded_file($f['tmp_name'], "$dir/$name")) fail('Fotku sa nepodarilo uložiť.', 500);
    out(['path' => "data/$kind/$name", 'w' => $info[0], 'h' => $info[1]]);

  case 'saveBanner':
    $b = $in['banner'] ?? null;
    if (!is_array($b)) fail('Chýbajú dáta.');
    $force = !empty($in['retranslate']);
    $res = with_lock(function () use ($b, $force) {
      $old = read_json('banner.json', null);
      $sk = ['text' => clean((string)($b['text']['sk'] ?? ''), 160)];
      $new = []; foreach (LANGS as $l) $new[$l] = ['text' => (string)($b['text'][$l] ?? '')];
      $oldN = $old ? ['sk' => ['text' => $old['text']['sk'] ?? '']] + array_map(fn($l) => ['text' => $old['text'][$l] ?? ''], array_combine(LANGS, LANGS)) : null;
      $manual = array_intersect_key((array)($b['manual'] ?? []), array_flip(LANGS));
      $miss = [];
      $tr = translate_block($sk, $new, $oldN, $manual, $force, ['text'], $miss);
      $imgs = array_values(array_filter(array_map('strval', (array)($b['images'] ?? [])),
        fn($p) => (bool)preg_match('#^/data/banner/[a-z0-9-]+\.(jpe?g|png|webp)$#', $p)));
      $row = [
        'on' => !empty($b['on']),
        'color' => preg_match('/^#[0-9A-Fa-f]{6}$/', (string)($b['color'] ?? '')) ? strtoupper($b['color']) : '#FF2712',
        'text' => ['sk' => $sk['text']] + array_map(fn($x) => $x['text'], $tr),
        'images' => array_slice($imgs, 0, 8),
        'manual' => (object)($force ? [] : array_filter(array_map('boolval', $manual))),
        'updated' => date('c'),
      ];
      write_json('banner.json', $row);
      return ['banner' => $row, 'untranslated' => $miss];
    });
    out($res);
}
fail('Neznáma akcia.', 404);
