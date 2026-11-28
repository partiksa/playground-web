<?php
/* Spoločné funkcie adminu: konfigurácia, prihlásenie, CSRF, zápis JSON so zámkom, preklad DeepL. */
declare(strict_types=1);

const LANGS = ['cz', 'en', 'de'];
const DEEPL_LANG = ['cz' => 'CS', 'en' => 'EN-US', 'de' => 'DE'];
const FIELDS = ['t', 'p', 'y', 'd'];
const GROUPS = ['nove', 'prerabka', 'obnova'];

function cfg(string $k)
{
  static $c = null;
  if ($c === null) {
    $f = __DIR__ . '/config.php';
    if (!is_file($f)) { http_response_code(500); exit('Chýba admin/config.php'); }
    $c = require $f;
  }
  return $c[$k] ?? null;
}

function data_path(string $rel = ''): string
{
  return rtrim((string)cfg('data_dir'), '/') . ($rel === '' ? '' : '/' . $rel);
}

function start_session(): void
{
  if (session_status() === PHP_SESSION_ACTIVE) return;
  session_name('pgadmin');
  session_set_cookie_params(['lifetime' => 0, 'path' => '/admin/', 'httponly' => true, 'samesite' => 'Strict',
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off']);
  session_start();
  if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16));
}

function logged_in(): bool
{
  start_session();
  return !empty($_SESSION['ok']);
}

/* jednoduchá brzda proti hádaniu hesla: max 8 pokusov za 15 min z jednej IP */
function login_allowed(): bool
{
  $f = sys_get_temp_dir() . '/pgadmin-' . md5($_SERVER['REMOTE_ADDR'] ?? '') . '.json';
  $now = time();
  $list = is_file($f) ? (json_decode((string)file_get_contents($f), true) ?: []) : [];
  $list = array_values(array_filter($list, fn($t) => $t > $now - 900));
  return count($list) < 8;
}
function login_failed(): void
{
  $f = sys_get_temp_dir() . '/pgadmin-' . md5($_SERVER['REMOTE_ADDR'] ?? '') . '.json';
  $list = is_file($f) ? (json_decode((string)file_get_contents($f), true) ?: []) : [];
  $list[] = time();
  file_put_contents($f, json_encode($list));
}

function read_json(string $rel, $default)
{
  $f = data_path($rel);
  if (!is_file($f)) return $default;
  $d = json_decode((string)file_get_contents($f), true);
  return $d === null ? $default : $d;
}

/* atomický zápis: dočasný súbor + rename, aby web nikdy nenačítal polovičný JSON */
function write_json(string $rel, $data): void
{
  $f = data_path($rel);
  if (!is_dir(dirname($f))) mkdir(dirname($f), 0755, true);
  $tmp = $f . '.' . bin2hex(random_bytes(4)) . '.tmp';
  file_put_contents($tmp, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . "\n");
  rename($tmp, $f);
}

/* zámok na celú operáciu čítanie -> zmena -> zápis */
function with_lock(callable $fn)
{
  if (!is_dir(data_path())) mkdir(data_path(), 0755, true);
  $h = fopen(data_path('.lock'), 'c');
  flock($h, LOCK_EX);
  try { return $fn(); } finally { flock($h, LOCK_UN); fclose($h); }
}

/** preloží zoznam textov zo slovenčiny; bez kľúča alebo pri chybe vráti null */
function deepl(array $texts, string $lang): ?array
{
  $key = (string)cfg('deepl_key');
  if ($key === '' || !$texts) return null;
  $url = str_ends_with($key, ':fx') ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate';
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 20,
    CURLOPT_HTTPHEADER => ['Authorization: DeepL-Auth-Key ' . $key, 'Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode(['text' => array_values($texts), 'source_lang' => 'SK', 'target_lang' => DEEPL_LANG[$lang]]),
  ]);
  $res = curl_exec($ch);
  $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if ($code !== 200 || !$res) return null;
  $d = json_decode((string)$res, true);
  if (!isset($d['translations'])) return null;
  return array_map(fn($t) => (string)$t['text'], $d['translations']);
}

function slugify(string $s): string
{
  $s = iconv('UTF-8', 'ASCII//TRANSLIT', $s) ?: $s;
  $s = strtolower(preg_replace('/[^A-Za-z0-9]+/', '-', $s));
  return trim(substr($s, 0, 50), '-') ?: 'realizacia';
}

function clean(string $s, int $max): string
{
  $s = trim(preg_replace('/[\x00-\x09\x0B-\x1F\x7F]/u', '', $s));
  return mb_substr($s, 0, $max);
}

/* príznak pre server: realizácie sa zmenili, web treba prebuildovať (spracuje server/zverejnit.sh cez cron) */
function mark_publish(): void
{
  @touch(data_path('.zverejnit'));
}

