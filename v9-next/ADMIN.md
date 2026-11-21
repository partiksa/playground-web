# Admin (realizácie a banner)

> **Stav: backend nie je dokončený.** Admin beží len na testovacej doméne (Hostzone).
> Banner funguje hneď. Realizácie z adminu sa na web dostanú až po ručnom zverejnení (`npm run rz:deploy` na Macu správcu).
> Automatické nasadenie (napr. GitHub Actions: build + SFTP po uložení v admine) sa ešte rozhodne.
> Pri presune na ostrý hosting (Webglobe) treba admin, `/data` a `config.php` preniesť a nastaviť nanovo.

## Čo admin vie
- Adresa: `/admin/`, jedno heslo pre klienta.
- **Realizácie:** pridať, upraviť, zmazať, zmeniť poradie (prvých 6 je na webe hore). Kategória, názov, miesto, druh práce, popis, fotky (titulná, poradie). Fotky sa zmenšia v prehliadači (max 2000 px, JPEG).
- **Preklad:** pri uložení preloží DeepL slovenčinu do CZ, EN, DE. Ručne upravený preklad sa pri ďalšej zmene slovenčiny neprepíše. Bez kľúča DeepL dostanú jazyky slovenský text.
- **Banner:** pás pod hlavičkou len na úvode. Zapnúť alebo vypnúť, text (max 160 znakov), farba (červená, tmavá, papier alebo vlastná), obrázky vpravo (1 = statický, viac = slideshow každé 4 s). Pri prvom scrolle zmizne, po návrate hore sa ukáže. Na webe sa zmení hneď (web číta `/data/banner.json`).

## Súbory
- `admin/` PHP admin (`index.php`, `api.php`, `lib.php`, `app.js`, `app.css`). `config.php` nie je v gite (vzor `config.example.php`).
- Na serveri `/data/`: `realizacie.json`, `banner.json`, nahraté fotky `rz/_u/`, `banner/`. Deploy webu tento priečinok nemení.
- `content/realizacie.json` jediný zdroj realizácií pre build (texty v 4 jazykoch, titulná fotka, galéria).
- `public/js/banner.js` zobrazenie banneru na úvode.
- `scripts/publish.mjs` zverejnenie realizácií, `scripts/depth.py` depth mapy.

## Príkazy (v `v9-next/`)
- `npm run admin:deploy` nahrá admin a pripraví `/data` na serveri (dáta realizácií nahrá len prvýkrát).
- `npm run rz:publish` stiahne dáta z adminu, nové fotky prevedie do `public/rz/<slug>/NN.webp` (+ depth mapa titulnej), zapíše `content/realizacie.json` a zbuildí. Nič nenahrá.
- `npm run rz:deploy` to isté + nahrá web, nové fotky a dáta s novými cestami k fotkám.
- Test bez servera: `node scripts/publish.mjs --local data` (priečinok `data/` je v `.gitignore`).

## Nastavenie
1. Heslo: `php -r 'echo password_hash("HESLO", PASSWORD_DEFAULT), "\n";'` a hash do `admin/config.php`.
2. DeepL: účet DeepL API Free (500 000 znakov mesačne zadarmo), kľúč do `deepl_key`.
3. Server potrebuje PHP 8 s cURL a povolený `.htaccess` (Apache 2.4).

## Bezpečnosť
- Session cookie len pre `/admin/`, SameSite Strict, CSRF token pri každej zmene, max 8 pokusov o heslo za 15 min.
- Upload len JPG, PNG, WebP (kontrola obsahu cez `getimagesize`), max 12 MB, náhodné mená.
- V `/data/` nesmie bežať žiadny skript (`data/.htaccess`).
- Texty od klienta idú na web cez React (escapované) a v galérii cez `esc()`.
