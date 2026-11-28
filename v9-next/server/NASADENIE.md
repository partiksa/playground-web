# Nasadenie PLAYGROUND na Hetzner (vetva `hetzner`)

Od 2026-11-28 na `prod-s-moje-projekty` (`ssh prod-s-projekty`, 178.104.76.100), spravované cez Ploi. Prehľad servera: `~/Desktop/AI/zdielane/servery.md`.

| Čo | Kde |
|---|---|
| Test | `https://playground.codx.sk` (A v zóne codx.sk, noindex cez hlavičku `X-Robots-Tag`) |
| Ostrá adresa | `https://play-ground.sk`, zatiaľ NEPREPNUTÁ (DNS vo Webglobe, A `@` stále na Webglobe 212.57.32.72) |
| Ploi | site 440349, používateľ `playground` (system user 96689), PHP 8.4 pool `playground`, cert 685017 (playground.codx.sk), cron 364252 |
| Priečinok | `/home/playground/playground.codx.sk` = git clone `partiksa/playground-web` (HTTPS, verejné repo), vetva `hetzner` |
| Web root | `www/` (mimo gitu): výstup `out/`, `www/admin` (PHP admin), `www/api/kontakt.php`, `www/data` (dáta adminu, NEMAZAŤ) |
| Nastavenie | `/home/playground/pg-config.php` (640): `site`, `admin_hash`, `deepl_key`, `resend_key`, `mail_from`, `mail_to` |
| Admin | `/admin/`, len heslo (bez mena), heslo na Macu v `~/.config/playground-admin/heslo-hetzner.txt` |
| Formulár | `/api/kontakt.php` → Resend z `web@codx.sk`, `reply_to` = zákazník. Počas testu `mail_to` = Samuelov Gmail, pri prepnutí zmeniť na `info@play-ground.sk` |
| Log zverejnenia | `/home/playground/zverejnit.log` |

## Ako to funguje

- `server/zverejnit.sh`: realizácie z `www/data/realizacie.json` → `content/realizacie.json`, nové fotky z adminu → WebP (`server/prevod.php`, GD) do `www/data/rz-web/<slug>/` a kópia do `public/rz/`, `next build`, `rsync out/ → www/`, admin a API do `www/`.
- Admin po uložení, zmazaní alebo zmene poradia vytvorí `www/data/.zverejnit`. Cron každú minútu spustí `zverejnit.sh --cron`, ten zbuildí len pri príznaku. Na webe je zmena do 1 až 2 minút (overené 2026-11-28).
- Depth mapy pre nové titulné fotky sa na serveri nerobia (chýba torch), karta je potom bez efektu pri pohybe myšou.
- Nginx: `server/nginx.conf` (vložené v Ploi site konfigurácii), presmerovania 266 starých WordPress adries v `server/presmerovania.conf` (include priamo z repa, po zmene `nginx -t` a reload).

## Nasadenie zmeny kódu

1. Lokálne: `npx tsc --noEmit && npm run build`.
2. Commit a push do `hetzner`.
3. Ploi deploy (site 440349) alebo ručne: `sudo -u playground -H bash -lc "cd ~/playground.codx.sk && git checkout -- v9-next/content/realizacie.json && git pull --ff-only origin hetzner && ./v9-next/server/zverejnit.sh"`. Pri zmene PHP reload PHP-FPM.

## Prepnutie na play-ground.sk (až po súhlase Samuela a klienta)

1. Deň vopred vo Webglobe znížiť TTL `@` na 300.
2. V Ploi pridať doménu `play-ground.sk` a `www.play-ground.sk` k site (alias) a vydať certifikát až po zmene DNS.
3. Webglobe DNS: A `@` → 178.104.76.100. `www` je CNAME na `@`. **`webmail` je CNAME na `@`**: zmeniť na A 212.57.32.72, inak prestane fungovať webmail. MX, `mail`, `ftp`, `autodiscover`, SPF a `google-site-verification` NEMENIŤ.
4. `pg-config.php`: `site` → `https://play-ground.sk`, `mail_to` → `info@play-ground.sk`, potom `zverejnit.sh` (canonical, sitemap a hreflang sa prepíšu).
5. Overiť presmerovania, formulár, admin, Search Console (nová sitemap).
6. WordPress na Webglobe nechať 1 až 3 mesiace ako zálohu.

## Otvorené

- DeepL API kľúč do `pg-config.php` (`deepl_key`), bez neho nové realizácie majú v CZ/EN/DE slovenský text.
- Ochrana osobných údajov (`lib/gdpr.ts`) je NÁVRH: klient potvrdí dobu uchovania (3 roky) a zoznam príjemcov.
- Úplná záloha WordPressu (DB + súbory) z Webglobe pred prepnutím. Verejná kópia (267 stránok, 1166 fotiek) je v `~/Desktop/AI/zalohy/play-ground-wp-2026-11-28/`.
- Údaje od klienta (záruka, EN 1176, rok založenia, krajiny) pred prepnutím.
