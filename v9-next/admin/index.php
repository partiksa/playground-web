<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header("Content-Security-Policy: default-src 'self'; img-src 'self' blob: data:; style-src 'self'; script-src 'self'; frame-ancestors 'none'");
$ok = logged_in();
$v = (string)filemtime(__DIR__ . '/app.js');
?><!doctype html>
<html lang="sk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Admin · PLAYGROUND</title>
<link rel="icon" href="/favicon.svg">
<link rel="stylesheet" href="app.css?v=<?= $v ?>">
</head>
<body>
<?php if (!$ok): ?>
<main class="login">
  <form id="login">
    <i class="logo" aria-hidden="true"></i>
    <h1>Admin</h1>
    <label>Heslo<input type="password" name="password" autocomplete="current-password" required autofocus></label>
    <button class="btn btn--red" type="submit">Prihlásiť</button>
    <p class="err" role="alert"></p>
  </form>
</main>
<?php else: ?>
<header class="top">
  <i class="logo" aria-hidden="true"></i>
  <nav class="tabs" role="tablist">
    <button role="tab" data-tab="rz" aria-selected="true">Realizácie</button>
    <button role="tab" data-tab="bn" aria-selected="false">Banner</button>
  </nav>
  <a class="site" href="/sk/" target="_blank" rel="noopener">Web</a>
  <button class="link" id="logout" type="button">Odhlásiť</button>
</header>
<main id="app" data-csrf="<?= htmlspecialchars($_SESSION['csrf']) ?>"></main>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<?php endif; ?>
<script src="app.js?v=<?= $v ?>"></script>
</body>
</html>
