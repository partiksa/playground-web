<?php
/* Dopytový formulár: prijme dopyt z /js/kontakt.js a pošle ho e-mailom firme cez Resend.
 * Nastavenie (kľúč, adresy) je mimo webu v ~/pg-config.php, pozri server/NASADENIE.md.
 * Odpoveď: {"ok":true} alebo {"ok":false,"error":"..."}; pri chybe prehliadač otvorí e-mail (mailto) ako zálohu. */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');

function odpoved(bool $ok, string $chyba = '', int $kod = 200): void
{
  http_response_code($kod);
  echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'error' => $chyba], JSON_UNESCAPED_UNICODE);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') odpoved(false, 'Len POST', 405);

$cfgFile = getenv('PG_CONFIG') ?: dirname(__DIR__, 3) . '/pg-config.php';
if (!is_file($cfgFile)) odpoved(false, 'Chýba nastavenie', 500);
$cfg = require $cfgFile;

/* robot: vyplnené skryté pole alebo odoslanie skôr ako 3 s po načítaní → tvárime sa, že prešlo */
$t0 = (int)($_POST['t0'] ?? 0);
if (trim((string)($_POST['web'] ?? '')) !== '' || ($t0 > 0 && (microtime(true) * 1000 - $t0) < 3000)) odpoved(true);

/* limit: najviac 5 dopytov z jednej IP za 10 minút */
$ip = (string)($_SERVER['REMOTE_ADDR'] ?? '');
$lf = sys_get_temp_dir() . '/pg-kontakt-' . md5($ip) . '.json';
$teraz = time();
$zoznam = is_file($lf) ? (json_decode((string)file_get_contents($lf), true) ?: []) : [];
$zoznam = array_values(array_filter($zoznam, fn($t) => is_int($t) && $t > $teraz - 600));
if (count($zoznam) >= 5) odpoved(false, 'Príliš veľa dopytov', 429);

/* vstup */
$riadok = fn(string $s, int $max) => mb_substr(trim(preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $s)), 0, $max);
$meno = $riadok((string)($_POST['meno'] ?? ''), 120);
$email = trim((string)($_POST['email'] ?? ''));
$predmet = $riadok((string)($_POST['predmet'] ?? ''), 200);
$text = mb_substr(str_replace("\r", '', (string)($_POST['text'] ?? '')), 0, 8000);
$text = preg_replace('/[\x00-\x08\x0B-\x1F\x7F]/u', '', $text);
$jazyk = in_array($_POST['lang'] ?? '', ['sk', 'cz', 'en', 'de'], true) ? $_POST['lang'] : 'sk';

if ($meno === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 200) odpoved(false, 'Meno alebo e-mail', 422);
if ($predmet === '') $predmet = 'Dopyt z webu: ' . $meno;

/* príloha (pôdorys): pdf, png, jpg, dwg, dxf, najviac 10 MB */
$prilohy = [];
$sub = $_FILES['subor'] ?? null;
if ($sub && ($sub['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
  if ($sub['error'] !== UPLOAD_ERR_OK || $sub['size'] > 10 * 1024 * 1024) odpoved(false, 'Príloha', 422);
  $nazov = basename((string)$sub['name']);
  if (!preg_match('/\.(pdf|png|jpe?g|dwg|dxf)$/i', $nazov)) odpoved(false, 'Typ prílohy', 422);
  $nazov = preg_replace('/[^A-Za-z0-9._-]+/', '-', iconv('UTF-8', 'ASCII//TRANSLIT', $nazov) ?: 'priloha') ?: 'priloha';
  $prilohy[] = ['filename' => mb_substr($nazov, -100), 'content' => base64_encode((string)file_get_contents($sub['tmp_name']))];
}

$telo = $text . "\n\n---\nOdoslané z formulára na " . ($cfg['site'] ?? 'play-ground.sk') . " (jazyk: " . strtoupper($jazyk) . ", " . date('j. n. Y H:i') . ").\n"
  . "Odpovedzte priamo na tento e-mail, odpoveď pôjde zákazníkovi ($email).";

$data = [
  'from' => $cfg['mail_from'],
  'to' => (array)$cfg['mail_to'],
  'reply_to' => $email,
  'subject' => $predmet,
  'text' => $telo,
];
if ($prilohy) $data['attachments'] = $prilohy;

$ch = curl_init('https://api.resend.com/emails');
curl_setopt_array($ch, [
  CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 25,
  CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $cfg['resend_key'], 'Content-Type: application/json'],
  CURLOPT_POSTFIELDS => json_encode($data, JSON_UNESCAPED_UNICODE),
]);
$res = curl_exec($ch);
$kod = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($kod < 200 || $kod >= 300) {
  error_log('pg-kontakt: Resend ' . $kod . ' ' . substr((string)$res, 0, 300));
  odpoved(false, 'Odoslanie zlyhalo', 502);
}

$zoznam[] = $teraz;
file_put_contents($lf, json_encode($zoznam));
odpoved(true);
