<?php
/* Kópia ako config.php (nie je v gite). Heslo: php -r 'echo password_hash("HESLO", PASSWORD_DEFAULT), "\n";' */
return [
  // hash hesla do adminu
  'password_hash' => '',
  // DeepL API kľúč (Free končí na :fx). Prázdny = bez prekladu, CZ/EN/DE dostanú slovenský text.
  'deepl_key' => '',
  // priečinok s dátami (realizacie.json, banner.json, nahraté fotky); musí byť verejný na adrese /data/
  'data_dir' => dirname(__DIR__) . '/data',
];
