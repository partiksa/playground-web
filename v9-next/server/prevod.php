<?php
/* Prevod realizácií z adminu pre build (spúšťa server/zverejnit.sh).
 *   php server/prevod.php <www/data> <public> <content/realizacie.json>
 * 1. Nové fotky z adminu (data/rz/_u/*.jpg) prevedie na WebP do data/rz-web/<slug>/NN.webp (max 1800 px šírka).
 * 2. V data/realizacie.json prepíše cesty na rz/<slug>/NN.webp (pod rovnakým zámkom ako admin).
 * 3. Zapíše content/realizacie.json pre build (bez pomocného poľa manual).
 * Fotky z data/rz-web sa pred buildom kopírujú do public/rz, takže git pull o ne nepríde. */
declare(strict_types=1);

[$_, $data, $pub, $content] = $argv + [null, null, null, null];
if (!$data || !$pub || !$content || !is_file("$data/realizacie.json")) { fwrite(STDERR, "Použitie: php prevod.php <data> <public> <content.json>\n"); exit(1); }

$lock = fopen("$data/.lock", 'c');
flock($lock, LOCK_EX);

$items = json_decode((string)file_get_contents("$data/realizacie.json"), true);
if (!is_array($items) || !$items) { fwrite(STDERR, "Dáta realizácií sú prázdne, končím bez zmeny.\n"); exit(1); }

function cislo(string $dir): int
{
  $n = 0;
  foreach (is_dir($dir) ? scandir($dir) : [] as $f) if (preg_match('/^(\d+)\.webp$/', $f, $m)) $n = max($n, (int)$m[1]);
  return $n;
}

function na_webp(string $src, string $dst): void
{
  $info = getimagesize($src);
  $im = match ($info['mime'] ?? '') {
    'image/jpeg' => imagecreatefromjpeg($src),
    'image/png' => imagecreatefrompng($src),
    'image/webp' => imagecreatefromwebp($src),
    default => throw new RuntimeException("Neznámy typ fotky: $src"),
  };
  $w = imagesx($im); $h = imagesy($im);
  if ($w > 1800) {
    $nh = (int)round($h * 1800 / $w);
    $sm = imagecreatetruecolor(1800, $nh);
    imagecopyresampled($sm, $im, 0, 0, 0, 0, 1800, $nh, $w, $h);
    imagedestroy($im); $im = $sm;
  }
  if (!is_dir(dirname($dst))) mkdir(dirname($dst), 0755, true);
  imagewebp($im, $dst, 80);
  imagedestroy($im);
}

$mapa = [];
foreach ($items as $it) {
  $nove = array_values(array_unique(array_filter(array_merge($it['photos'] ?? [], [$it['cover'] ?? '']), fn($p) => str_starts_with((string)$p, 'data/'))));
  if (!$nove) continue;
  $slug = preg_replace('/[^a-z0-9-]/', '', (string)$it['slug']);
  $n = max(cislo("$pub/rz/$slug"), cislo("$data/rz-web/$slug"));
  foreach ($nove as $p) {
    $src = $data . '/' . substr($p, strlen('data/'));
    if (!is_file($src)) { fwrite(STDERR, "Chýba fotka $src, preskakujem.\n"); continue; }
    $meno = str_pad((string)++$n, 2, '0', STR_PAD_LEFT) . '.webp';
    na_webp($src, "$data/rz-web/$slug/$meno");
    $mapa[$p] = "rz/$slug/$meno";
    echo "  $p -> {$mapa[$p]}\n";
  }
}

$oprav = fn(array $list) => array_map(fn($it) => array_merge($it, [
  'cover' => $mapa[$it['cover']] ?? $it['cover'],
  'photos' => array_values(array_filter(array_map(fn($p) => $mapa[$p] ?? $p, $it['photos']), fn($p) => !str_starts_with($p, 'data/'))),
]), $list);

$items = array_map(function ($it) {
  if (str_starts_with((string)$it['cover'], 'data/') && $it['photos']) $it['cover'] = $it['photos'][0];
  return $it;
}, $oprav($items));
if ($mapa) {
  $tmp = "$data/realizacie.json." . bin2hex(random_bytes(4)) . '.tmp';
  file_put_contents($tmp, json_encode($items, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . "\n");
  rename($tmp, "$data/realizacie.json");
}
flock($lock, LOCK_UN);

$ciste = array_map(function ($it) { unset($it['manual']); return $it; }, $items);
file_put_contents($content, json_encode($ciste, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . "\n");
echo "Realizácie: " . count($ciste) . ", nové fotky: " . count($mapa) . "\n";
