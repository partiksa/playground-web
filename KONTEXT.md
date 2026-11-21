---
stav: rozpracovaný
---
# loso (redizajn play-ground.sk)

Posledná aktualizácia: 2026-11-21 11:38

## Cieľ
Moderný web firmy PLAYGROUND (interiérové detské ihriská, Trnava) s 3D ihriskom, ktoré sa pri scrolle postaví. Identita zo starého webu: logo, farby, písmo Kanit.

## Stav
- AKTUÁLNE (2026-11-21): vetva `final` (nie `v9`) na GitHube, posledný commit 9d4da3f. Vo `v9-next/` pribudla stránka Nafukovacie atrakcie (nasadená), PHP admin pre realizácie a banner a banner na úvode (len v gite, NEnasadené). Na serveri chýba posledné kolo: číslo preč z lišty, opravené fotky atrakcií, admin, banner. Patrik nasadzuje sám: `cd v9-next`, `npm run admin:deploy`, `npm run rz:deploy` (SFTP mi blokuje systém povolení). Postup a stav adminu: `v9-next/ADMIN.md`.
- AKTUÁLNE (2026-11-17): Hero vizuál je bez výsledku. Vyskúšané tri návrhy (`loso/hero-vizual/`: index, hala, vykres) Patrik zamietol a priečinok aj so súbormi zmazal. Návrhy neboli v gite, obnoviť sa nedajú. Web (`v9-next/`) sa kvôli nim nemenil.
- AKTUÁLNE (2026-11-15): `v9-next/` je nasadená na playground.sarkozypatrik.sk (Hostzone, noindex) aj s opravami z 2026-11-14 (nemčina, pätička, formulár, fotky z ChatGPT, depth mapy, favicon, oprava loadera, poistka WebGL). Nič z 13. až 14. 11. nie je komitnuté. Rozpracovaná responzivita: automatická kontrola 560 stránok bez posunu do strany, chýb JS a neviditeľných prvkov; snímky (`/tmp/pgresp/sheets/`, 7 zariadení, SK) ešte neprezreté. Čaká sa na Patrika, či po Cmd+Shift+R zmizli pruhy na fotke `ihriska-prvky`.
- AKTUÁLNE (2026-11-14): `v9-next/` má lokálne nekomitnuté zmeny (`app/globals.css`, `app/[lang]/layout.tsx`, `components/Scripts.tsx`, `next.config.ts`, `public/js/logo-write.js`, `public/js/prerabka-3d.js`, `public/js/site.js`). Na playground.sarkozypatrik.sk je nasadená Prerábka 3D s novým poskladaním (Patrik: „poskladanie je super“) a verzia loadera s diagnostikou `?dbg`. Posledná oprava loadera (stráž triedy `ld-on`) je zbuildovaná v `out/` a overená vo WebKite, ale NEnasadená, čaká na súhlas. Po 2026-11-12 pribudli commity 0d33f29 až 4af1bcd (favicon, SEO frázy, OG obrázok, adresa beta webu, pätička #FF2712, video stavby v hale pre „Ako vzniká ihrisko“, favicon ?v=2).
- AKTUÁLNE (2026-11-12): kolo Patrikových pripomienok je vo `v9-next/` hotové, nasadené na https://playground.sarkozypatrik.sk/ (Hostzone, noindex) a pushnuté na GitHub, vetva `v9`, commit 97edefc. Nič z tohto kola Patrik ani ja nevideli v prehliadači (štýl fast, bez testov, len build a HTTP kontrola 200/404). Zmeny: bledšia červená `--red-ui` #FF4632 na tlačidlách a v pätičke, plynulé kapitoly hero (`home.js`: stará zmizne, nová nabehne po nej, obrys rámika až po podklade), zalomenia cez `|` (len široko) a `\n` v textoch, Slinkee na začiatku slova `.sl--start`, pätička s veľkým logom (max 560 px) a loptičkami (žltá, oranžová, biela, papier, tmavá) len po čiaru nad copyrightom, Ihriská (úvod vyššie, nové fotky, sekcia montáže s `video/montaz.mp4` ako cieľ odkazov „Ako ihrisko vzniká“, prvky bez čísel), Prerábka (bez fotky hore, 3D s odpadnutou penou a lesklým výsledkom vo farbách renderu f_004, nové FAQ, bez slova „čínske“), Revízie (fotka až za Rozsahom, nové FAQ), Realizácie (6 kariet hore, potom riadky po 4 podľa kategórií so scrollom do strany, šípka, drag, jemný snap, rovnako galéria v detaile), O nás (nové fotky), formulár (červený hover a výber, animácia odoslania), cookie lišta (`Cookies.tsx`, priesvitná karta, voľba v localStorage `pg-cookies`), 404 (`app/global-not-found.tsx`, experimentálne `globalNotFound` v `next.config.ts`), placeholder obrázkov (`ImgReady.tsx`, `app/extras.css`).
- Predtým (2026-11-11 15:34): pracuje sa LEN vo `v9-next/` (Next.js 16, statický export). Je nasadená na https://playground.sarkozypatrik.sk/ (Hostzone, priečinok `/home2/hkjdxbcf/playground`, noindex) a pushnutá na GitHub, vetva `v9` (partiksa/playground-web, posledný commit 0ae6d22). Je 1:1 s v9 (pixelovo overené na 7 stránkach): stránky sú TSX (`lib/v9.tsx` = port `v9/_build/build.py`, `app/[lang]/*/page.tsx`, `components/Chrome.tsx`, `Shell.tsx`, `JsonLd.tsx`), štýly `app/globals.css` (= v9 site.css), správanie poháňajú skripty z v9 v `public/js/` (site.js, home.js, ihriska.js, realizacie.js, kontakt.js, prerabka-3d.js, gsap), ktoré spúšťa `components/Scripts.tsx` po hydratácii. Z pôvodnej v9-next ostali: červený loader s písaným logom (`public/js/logo-write.js`), loptičky v pätičke (`FooterBalls.tsx`), adresy `/sk/ /cz/ /en/ /de/`, robots pre AI, `llms.txt`. Build: `cd v9-next && npm run build`, náhľad: `cd v9-next/out && python3 -m http.server 8947 --bind 127.0.0.1` → http://127.0.0.1:8947/sk/. `v9/` je zmrazená (len história, generátor build.py už nepoužívať). Záloha starého kódu v9-next: `_zalohy/v9-next-2026-11-11/` (nie je v gite).
- NAJNOVŠIE (2026-11-11, `v9/`, lokálne, nekomitnuté, nenasadené): statický web v 4 jazykoch (SK v koreni, `cz/`, `en/`, `de/`), 7 stránok, generuje ho `python3 v9/_build/build.py` (texty v `v9/_build/i18n/*.json` prevzaté z v9-next + nové texty v build.py cez `T()`). HTML sa ručne neupravuje. Úvod: render kaviarne `new render` (185 snímok `v9/kav/`, scroll 5 výšok okna), text v rámiku zo 4 čiar, priehľadná hlavička s prepínaním farby podľa jasu záberu, za príbehom služby, čísla, realizácie, FAQ. SEO: canonical, hreflang, OG (`og.jpg`), JSON-LD, `sitemap.xml`, `robots.txt`, favicon. Paleta chladná: papier #DEDDDB, ink #141310, akcent len #FF2712. Server: `cd ~/Desktop/AI/loso && python3 -m http.server 8932 --bind 127.0.0.1`, http://127.0.0.1:8932/v9/. Overené v prehliadači 1440, 2560x1080, tablet a 390 px; Safari a reálny telefón nie.
- NAJNOVŠIE (2026-11-10, lokálne, nekomitnuté, nenasadené): `v9-next/` = v9 prepísaná do Next.js 16 (statický export do `out/`, 7 stránok × SK/CZ/EN/DE na `/sk/`, `/cz/`, `/en/`, `/de/`, hreflang `cs` pre CZ). Podľa stretnutia s klientom: červený loader #FF2712 s písaným logom (z v5), jemný červený akcent, formulár (Nafukovacie atrakcie, „Iné“ otvorí pole, otázka na pôdorys a pole na súbor bez backendu, mailto), O nás 15 rokov a 6 krajín (SK, CZ, FR, IT, EE, RO), FAQ, loptičky v pätičke. SEO: metadata, sitemap, robots (aj AI roboty), JSON-LD, `llms.txt`. Texty: `messages/*.json`, `content/seo-*.json`, `faq-*.json`, `content/SEO-POZNAMKY.md`. Build: `cd v9-next && npm run build`, náhľad: `cd out && python3 -m http.server 8947 --bind 127.0.0.1`. Hosting neskôr Webglobe (`public/.htaccess`). v9 nezmenená.
- AKTUÁLNE (v6, 2026-11-09, lokálne, nekomitnuté): Patrik píše, že web v6 je hotový (úvod a 6 podstránok, rovnaký štýl a animácie, načítanie s logom). Prešiel 1440 a 390 px. Reálny telefón a Safari neskúšané. Opravy z jeho zoznamu sú v procese, súbory `v6/` sa od 2026-11-06 17:45 nezmenili.
- NAJNOVŠIE (2026-11-09, lokálne, nekomitnuté): v8 `v8/hero-pismena/` (index.html, main.js, style.css), server `v8/server.py`, adresa http://127.0.0.1:8931/hero-pismena/. Úvod: logo sa samo napíše, vo vnútri ťahov beží video, pri scrolle sa zväčší do ťahu P a kamera sa oddiali na celé ihrisko. Nadpisy vychádzajú po riadkoch raz. Nad pätičkou bazén s loptičkami (chytiť, hodiť). Sekcia „Ako ihrisko vzniká“ používa render z Blenderu, 768 snímok (`v8/render/`), video pri scrolle, zastaví sa na konci kapitoly, štítok sa prepína, snap bez zotrvačnosti. Overené v prehliadači desktop aj mobil, konzola bez chýb. Video na scroll má 17 MB, zmenšuje sa.
- Predchádzajúce (2026-11-06, commit 9236700 na GitHube, vetva V6-verzia-2): v6 prerobená podľa poznámok Patrika. Nový úvod (hero s videom a voskovkovými kresbami, karty služieb, pás realizácií), loading s čiernym logom na papieri (intro.js, zmenší sa do hlavičky), Postup a Kde sa hodia s voskovkovými ilustráciami (v6/ill/crayon), Realizácie ako veľké riadky (5 najlepších fotiek veľko, 7 menších, filter zrušený), zoznam 3D vizualizácií (`VIZ` v build_v6.py), 3D rozloženie zjednodušené na 5 častí (siete ostávajú), reduced motion sa ignoruje, poistka proti prázdnej stránke (window.__ok, trieda fs). Akcenty: voskovkové podčiarknutia (`.mk`, ul-*.webp) a škvrny (dot-*.webp) v 7 farbách, žltá `--sun` #FFC93A, výzva na podstránkach v inej farbe (modrá, tyrkysová, fialová, oranžová, žltá), úvod červená. Skripty ilustrácií: tools/crayon, tools/crayon2 (strokes.py). Review server: `python3 tools/review_server.py` (8914, `?review`), telefón: tools/phone_server.py (8915).
- NENASADENÉ: na playground-v1.sarkozypatrik.sk je staršia verzia v6 z 2026-11-06 (bez poslednej série zmien). Nasadenie len po súhlase Patrika: `python3 tools/deploy_v6.py` (dist-v6), záloha je v zaloha-playground-v1/. Príčina, prečo stránka na doméne Patrikovi nefungovala, nie je známa (v Chrome ide), čaká na jeho prehliadač a zariadenie.
- NAJNOVŠIE (2026-11-05): v6 má lokálne (nekomitnuté, nenasadené) 3D z Blendera na Ihriská na mieru a Prerábka, mriežku 12/8/4, 3 varianty červeného akcentu (A/B/C, čaká na výber), krok „Dokedy“ vo formulári, bez tlačidla Pauza, opravu sekania slov a ilustrácie (pop silkscreen, gouache). Na kontrolu beží `tools/review_server.py` (port 8914, `?review&grid`), poznámky idú do `poznamky.json`. Podstránky v6 už generuje `tools/build_v6.py` (7 HTML), bod nižšie o odkazoch na v5 je zastaraný. Mobil (2026-11-05, podľa Patrika overené): bez posunu do strany, formulár sa vojde pri 720 px výšky, 3D model zväčšený, popisy na mobile skryté. Všetko lokálne, nič nenasadené ani nekomitnuté.
- AKTUÁLNE je v6 (priečinok `v6/`, štýl quality, Switzer a Cabinet Grotesk, bez kurzívy, paleta ink #141310, papier #F7F4EE, sivá #6B6659, jediný odvážny prvok červená #FF2712). Na GitHube je vetva `V6-verzia-2` (commit 4220d93 z 2026-11-04 12:58, predtým 823aedd, bez zmien na `main` a `web`). Starší obsah nižšie (v1 až v5, identita) je história.
- v7 (priečinok `v7/`, nekomitnuté, generuje `tools/build_v7.py`): len lokálne. Nasadenie playground-v3 je od 2026-11-04 zrušené. Živé sú playground-v1 (v5) a playground-v2 (v6), obe so snímkami 1920x1080.
- v6 stránky: `index.html` (video s deťmi `v6/video/hero-deti.mp4` cez celú obrazovku, 3 panely nové ihriská, prerábka, sťahovanie s depth, červená výzva s bazénom loptičiek), `projekty.html` (stavba ihriska podľa scrollu z 240 snímok `assets/stavba`, bento mriežka 12 realizácií s náklonom, detail s depth a listovaním), `kontakt.html` (karta s 3 krokmi, ikony, vojde sa na jednu obrazovku, mailto). Odkazy Ihriská na mieru, Prerábka, Revízie, O nás vedú na v5.
- Generovanie: `python3 tools/build_v6.py` zloží 3 HTML zo spoločných častí (texty a dáta projektov sú v ňom). `v6/assets` je odkaz na `../assets`. Lokálny server: `cd v6 && python3 -m http.server 8913 --bind 127.0.0.1` (porty 8766 a 8791 patria iným projektom).
- Commitnuté v 4220d93 (2026-11-04): na Realizácie pribudla dlaždica „Vesmírne ihrisko“ (3D vizualizácia, 180 snímok v `assets/ihrisko-360-180/`, otáča sa ťahaním myšou alebo prstom, zotrvačnosť, na celú šírku, `v6/projekty.html` atribúty `data-frames` a `data-count`, `v6/main.js` blok `v360`, štýl `v6/style.css`). Úvod a stavba v tejto zmene nezmenené.
- Neoverené po poslednej úprave (Patrik povedal „fast bez testov“): nový hero s videom a posun stavby na realizácie v prehliadači, dlaždica 360 (ťahanie, výkon, mobil), mobil hero (text nebol vidno), zobrazenie „Ďakujeme“ po odoslaní formulára (v teste ostala pravá strana prázdna).
- v4 (commit f20c16b, slideshow v 24f7113): červená hlavička, úvod s logom na celej obrazovke, nadpisy Bricolage Grotesque, poznámky v hero stoja a text sa prepisuje, fotky na celú obrazovku s depth mapou, nové podstránky (projekty s panelmi a detailom, technické ihriská, jednoduché o nás, formulár). Screenshoty v screens/v4/.
- Nová identita (nekomitnutá, čaká na výber fontu a schválenie): `identita.html` + `identita.css` v koreni, screenshot `screens/identita.png`. Web v3 sa nezmenil. Mobil neladený.
- v1 (git tag `v1`), v2 (7e675eb) a v3 (HEAD) sú hotové. v3 overená: 5 stránok bez chýb v konzole, navigácia OK, screenshoty v screens/v3/.
- v3 hero: model veľký v strede, orezaný spodkom, na začiatku naklonený a vpravo. Za ním obrovské číslo kroku (#bignum), okolo 2 až 3 naklonené karty (.step > .part, texty v index.html). Ukazovateľ „07 / 12“ vpravo dole.
- v3 podstránky (pages.css): mriežka 6 stĺpcov (.page::before), obrovské orezané slovo (.mega), asymetrické fotky (.pair, .pair.rev, .grid po 6).
- Technika: čisté HTML/CSS/JS, Three.js 0.160.0 cez importmap (unpkg), bez build nástroja, bez deployu. Lokálny server: `python3 -m http.server`.
- Súbory: index.html, style.css, main.js (hero a 3D), pages.css + 4 podstránky, assets/ (PLAYGROUND.svg, photos/, textures/ ambientCG CC0, obsah/ texty a 20 fotiek z pôvodného webu, IHRISKO.md s 12 krokmi stavby).
- Farby (style.css :root): --paper #F6F3EE, --navy #15194A, --blue #2A3290, --red #FF2712 (hlavný akcent), žltá #FECF03 a oranž #FE6738 len v modeli.
- Známe odchýlky modelu od fotiek: chýba vinylový strop nad bazénom, siete bez uzlov, šmykľavka bez bočných stien, svorky len na hlavných stĺpoch. Mobil neoverený.

## Zadanie klienta
Odpovede klienta z formulára a súhrn z druhého počítača sú v `KLIENT.md`. Riadime sa ním. Hlavné: SEO a prvá strana Google, SK/EN/DE, viac samostatných stránok, jednoduchý admin, zostáva len logo, AI vizuály povolené, bez konfigurátora pre zákazníka.

## Otvorené úlohy
- [ ] v9-next: Patrik spustí `npm run admin:deploy` a `npm run rz:deploy`, potom overí `/admin/` (heslo v `~/.config/playground-admin/heslo.txt`) a banner na úvode. PHP 8 s cURL na Hostzone neoverené.
- [ ] v9-next admin: DeepL API Free kľúč do `v9-next/admin/config.php` (`deepl_key`); bez neho CZ/EN/DE dostanú slovenský text.
- [ ] v9-next admin: rozhodnúť automatické nasadenie realizácií (návrh: GitHub Actions build + SFTP po uložení v admine). Zatiaľ ručne `npm run rz:deploy`.
- [ ] v9-next admin: pri presune na Webglobe preniesť `/admin`, `/data` a `config.php`.
- [ ] Na serveri ostali nepoužívané `img/naf-hlavna.webp` a `img/naf-hlavna-d.webp`. Zmazať len so súhlasom.
- [ ] Nafukovacie atrakcie: slabé fotky (Chobotnica záber zblízka, Gladiátor detail, Klasik 440 px). Patrik: zatiaľ neriešiť, len nech sa dobre zobrazujú. Potvrdiť s klientom texty (doprava, 3 roky záruky, certifikáty).
- [ ] `TEST-2026-11-15.md` je nesledovaný; opravy z neho sú v commite 824424f.
- [ ] Dočasné súbory mimo projektu z hero pokusov: klon `/tmp/antialg/repo` a snímky `/tmp/hero*.png`. Zmazať len so súhlasom Patrika.
- [x] v9-next (824424f): opravy z testu 2026-11-15 commitnuté (Fold 5, cookie lišta na šírku, chyby formulára). Pôvodne: oprava nálezov z testu 2026-11-15 (Sonnet prešiel web v Chrome a WebKite, nič neopravil): zoznam v `v9-next/TEST-2026-11-15.md` (6 bodov + nepreverené). Opravuje Opus.
- [ ] v9-next: Patrik overí na https://playground.sarkozypatrik.sk/sk/ihriska/ (Cmd+Shift+R), či zmizli vodorovné pruhy na fotke `ihriska-prvky` (depth WebGL). Chyba sa v Playwright Chromium ani WebKit nezopakovala; nasadená je len poistka (overená len HTTP kontrola, nie vizuálne). Ak pretrváva: zistiť prehliadač a počet kariet.
- [ ] v9-next: pruhy na `ihriska-prvky` nie sú v obrázku ani v 360 (overené). Ďalší kandidát je video „Ako vzniká ihrisko“ (`video/stavba.mp4`, pridané v da49c95): pruhy pripomínajú zle dekódované video, preveriť kódovanie (kodek, profil, pixel formát).
- [ ] v9-next responzivita (štýl medium, 7 stránok × 4 jazyky, lokálne, nasadiť až po kontrole Patrika): prezrieť snímky v `/tmp/pgresp/sheets/`; preveriť DE kartu Klatovy (text pretečie na iPad Pro a Nest Hub, `de/realizacie`), slovo „Playgrounds“ mimo obrazovky na Fold 5 (344 px, `en/ihriska`), cookie lištu na mobile na šírku (asi 40 % výšky) a veľké nadpisy na 1920 a 2560 px (pretečenie > 16 px, asi prečnievanie Slinkee).
- [ ] Claude in Chrome: v tejto session nedostupné (`/chrome isn't available in this environment`). Skúsiť `claude --chrome` v novej session, inak ostáva Playwright.
- [ ] Na serveri ostali nepoužívané súbory `img/samorin-*` a `img/projekt-06.webp` (SFTP nemaže). Zmazať len so súhlasom.
- [x] v9-next: nasadiť opravu loadera (stráž `ld-on`), nasadené 2026-11-14.
- [ ] v9-next: loader je nasadený (2026-11-14); Patrik overí na iPhone (iOS 26, Safari), či sa logo napíše.
- [x] v9-next: zmeny z 13. a 14. 11. sú v commite a2d57e1. Pôvodne: commitnúť zmeny z 2026-11-13 a 14 do vetvy `v9` (len `v9-next/`, trailer JackClash99, bez Claude trailera), len po súhlase. `git status` ukazuje aj zmeny mimo v9-next (`v5/frames/render/*`, `tools/*/__pycache__`), tie do commitu nedávať.
- [ ] v9-next: na iPhone niečo mení HTML pred hydratáciou (React chyba #418, stránka sa vykreslí nanovo). Pravdepodobne rozšírenie Safari; zistiť zo zoznamu rozšírení Patrika, ak bude treba.
- [ ] v9-next: rozhodnúť o `Cache-Control: no-cache` pre HTML v serverovom `.htaccess` (aj `public/.htaccess`); Safari inak drží staré HTML heuristicky hodiny. Patrik zatiaľ neodpovedal.
- [ ] v9-next: anglické texty podľa write-good (10 návrhov, napr. „How we build a custom playground“, „Venue type“, „to handle my inquiry“): Patrik povedal „kašľať na to“, odložené.
- [ ] KONTEXT.md: Stav z 2026-11-12 uvádza pätičku #FF4632 a montáž `video/montaz.mp4`; commity 3c1153e a da49c95 to menia (pätička #FF2712, video stavby v hale). Potvrdiť s Patrikom.
- [ ] v9-next: Patrik skontroluje nové kolo v prehliadači (nikto ho nevidel): hero prechody a obrys rámika, pätička (logo, loptičky), Realizácie (riadky, šípka, drag, snap, galéria v detaile), Prerábka 3D (odpadnutá pena, farby), formulár (animácia odoslania), cookie lišta, 404, zalomenia vo všetkých 4 jazykoch.
- [ ] v9-next: alt texty pri nových fotkách (`ihriska-konstrukcia`, `ihriska-prvky`, `ihriska-sklad`, `prerabka-stahovanie`, `onas-hlavna`, `onas-zvnutra-1..3`) stále opisujú staré fotky (Pezinok, Trnava, Hlohovec, Šamorín), prepísať v `messages/*.json`.
- [ ] v9-next: od klienta potvrdiť odhady vo FAQ (revízia trvá hodiny až deň, sťahovanie dni až 1 až 2 týždne) a vetu „používame len certifikované materiály a diely“ (rovnaká otázka ako certifikát EN 1176).
- [ ] v9-next: cookie lišta zatiaľ právne netreba (web nemá analytiku), ostala podľa Patrika. Pri pridaní analytiky napojiť na `window.PG_COOKIES`; doplniť odkaz na ochranu súkromia, ak vznikne stránka.
- [ ] v9-next: 404 používa experimentálne `globalNotFound` (Next 16); pri aktualizácii Next skontrolovať, že `out/404.html` vzniká.
- [ ] v9-next: render montáže je 12 s video `public/video/montaz.mp4` (z v9); zdrojové snímky `~/Desktop/hrisko/stavba/` (240 JPG), blend `ihrisko-b-stavba.blend`.
- [ ] v9-next: od klienta potvrdiť fakty v sekcii „Prečo PLAYGROUND“: 24 mesiacov záruky, dodanie 5 až 8 týždňov, certifikácia podľa EN 1176 (kto certifikát vydal). Pred nasadením na play-ground.sk.
- [ ] v9-next: overiť na reálnom telefóne a v Safari (Patrik má zapnuté Obmedziť pohyb, web ho teraz ignoruje).
- [ ] v9-next: optimalizácia médií (`out/` má asi 65 MB), kontrast bieleho textu na #FF2712.
- [ ] v9-next: od klienta overiť rok založenia (odhad 2011), sociálne siete; preklady CZ, EN, DE dať skontrolovať rodenému hovoriacemu.
- [ ] v9-next: `projekt-06.webp` po úprave v ChatGPT má na sebe ľudí (zatiaľ sa na webe nepoužíva); `projekt-05.webp` bol v zozname „do AI neposielať“.
- [ ] v9-next: ostré nasadenie na play-ground.sk (Webglobe, `public/.htaccess`) a backend formulára; len po súhlase.
- [ ] Rozhodnúť, či vetvu `v9` zlúčiť do `main` (push na main spúšťa GitHub Pages) a či odstrániť `v9/` z repozitára.
- [x] v9: fotky z ChatGPT (projekt-01, 05, 06, 08, 12, samorin 4×) sú v `img/` aj v v9-next/public (2026-11-11, depth mapy pre ne nie sú).
- [x] v9: rozhodnúť vzťah v9 a v9-next: ide sa len vo v9-next (2026-11-11).
- [ ] v9: Patrik skontroluje web http://127.0.0.1:8932/v9/ (aj CZ/EN/DE).
- [ ] v9: kontrola animácií (prebieha): po prescrollovaní sa musia zobraziť všetky animované prvky, nič nesmie ostať neviditeľné. Na 7 stránkach, SK aj CZ/EN/DE. Počítač a mobil prejdené, reálny telefón a Safari nie.
- [ ] v9: fotky upraviť v ChatGPT podľa `v9/FOTKY-CHATGPT.md` (len svetlo, farby, perspektíva, neporiadok; deti do AI nie). Po úprave fotky v `img/` prerobiť depth mapu `-d.webp`.
- [ ] v9: nové texty v CZ, EN, DE dať skontrolovať rodenému hovoriacemu.
- [ ] v9: overiť Safari a reálny telefón.
- [ ] v9: rozhodnúť vzťah v9 a v9-next (dve paralelné verzie s rovnakým obsahom).
- [ ] v9: model v Prerábke má po prerobení farby tyrkysová, ružová, žltá; Patrik rozhodne, či prefarbiť na odtiene červenej.
- [ ] v9: `index-stavba.html` (staré hero na porovnanie) pred nasadením zmazať (v robots.txt je zakázaný).
- [x] v9 (hotové 2026-11-09): Slinkee „I“ vyzerá ako J („detI“). Patrik ho nahrádza iným písmenom, na úvode sú to veľké písmená a opravuje na veľké. Dorobiť a overiť.
- [x] v9 (hotové 2026-11-09): spojka „a“ ostáva na konci riadku. Pevná medzera za „a“ vo všetkých stránkach v6.
- [x] v9 (hotové 2026-11-09): video ako náhľad ukazuje prázdnu prvú snímku. Opraviť.
- [x] v9 (hotové 2026-11-09): detail realizácie, fokus pri otvorení nepristál na „Zavrieť“. Opraviť.
- [x] v9 (hotové 2026-11-09): detail realizácie, kláves šípky padá na udalosti bez cieľového prvku. Opraviť.
- [x] v9 (hotové 2026-11-09): mobil, odsadenie riadkov. Opravuje Patrik, bez posunu do strany na všetkých 7 stránkach.
- [ ] v6: overiť depth WebGL a formulár (Patrik overuje).
- [ ] v6: overiť na reálnom telefóne a v Safari (Patrik neskúšal).
- [ ] v8: zmenšené video na scroll (17 MB) dokončiť, overiť, že sa nezhorší plynulosť scrollu a kapitoly zostávajú čitateľné.
- [ ] v8: overiť svetlý prechod pod kapitolami na živej verzii a na telefóne (Patrik).
- [ ] v8: rozhodnúť, či sa render 768 snímok nasadí do v8 a kde (zatiaľ len lokálne, nasadenie len po súhlase).
- [ ] v6: Patrik vyberie variant červeného akcentu A, B alebo C. Potom nechať jeden, prepínač a ostatné varianty odstrániť.
- [ ] v6: prečítať `poznamky.json` (Patrikove poznámky z ?review), opraviť. Zmazať testovaciu poznámku id 72eb965f (zmazanie nástrojom bolo zablokované).
- [ ] v6: overiť opravu sekania slov na živom webe (lokálne sa chyba nedala zopakovať) a 3D v Safari a na telefóne.
- [ ] v6: Three.js pred deployom stiahnuť lokálne namiesto unpkg.
- [ ] v6: ilustrácie doladiť podľa poznámok (alebo nahradiť), rozhodnúť o ďalších ilustráciách.
- [ ] v6: commit kola z 2026-11-04 (vetva V6-verzia-2, s Co-authored-by JackClash99) a deploy na playground-v2, oboje len po súhlase.
- [ ] v6: overiť v prehliadači úvod (video, panely, bazén loptičiek), stavbu na realizáciách (kroky a časovač), dlaždicu 360 na realizáciách (ťahanie, výkon pri 180 snímkach), mobil (hero text, hlavička, formulár) a „Ďakujeme“ po odoslaní.
- [x] v6: dlaždica 360 a jej assets (`assets/ihrisko-360-180/`) sú commitnuté v 4220d93.
- [x] v6 mobil (2026-11-05, podľa Patrika): bez posunu do strany, formulár sa vojde pri 720 px výšky (výška stránky vrátane pätičky), 3D model zväčšený, popisy na mobile skryté. Hero text a hlavička na mobile ostávajú v úlohe vyššie.
- [ ] v6: zmazať staré sady `assets/ihrisko-360` (360 snímok, 25 MB) a `assets/ihrisko-360-120` (120 snímok, 8,3 MB). Zmaže Patrik sám: `rm -r assets/ihrisko-360 assets/ihrisko-360-120`. Obe sady sú už v commite 4220d93, zmazanie bude ďalší commit.
- [x] v7: nasadenie playground-v3 zrušené (2026-11-04), overovať netreba.
- [ ] v7: `v7/`, `tools/build_v7.py` sú nesledované. Rozhodnúť o commite.
- [ ] v7: ďalšie nasadenia (playground-v1, v2) sa nemenia, ak Patrik nepožiada.
- [ ] v6: video s deťmi má 5 s a kamera sa hýbe, pri slučke je vidno skok. Nahradiť dlhším alebo plynulou slučkou.
- [x] v6: podstránky Ihriská na mieru, Prerábka, Revízie, O nás sú v štýle v6 (generuje build_v6.py).
- [ ] v6: zmazať ručne nepoužité fonty `v6/fonts/Comico-Regular.woff2`, `PlusJakartaSans-VariableFont_wght.ttf`, `Switzer-VariableItalic.woff2` a `v6/.DS_Store` (zmazanie cez nástroj bolo zablokované; `.DS_Store` je v commite 823aedd).
- [ ] v6: ikony vo formulári sú vlastné obrysové SVG. Skill design-taste odporúča Reicon Filled (nenainštalovaný). Rozhodnúť.
- [ ] v6: Cabinet Grotesk má chybné `Ľ` (mäkčeň na zlom mieste). Zapísať do `font-diacritics.md` v design-taste skille, v labeloch sa `Ľ` vyhnúť.
- [ ] v6: rozhodnúť, či pustiť v6 ako živú stránku (deploy, vetva `web` alebo Cloudflare/Hostzone, spýtať sa podľa DEPLOY.md). Na playground-v2 je staršia verzia v6 (bez kola z 2026-11-04 večer), playground-v3 zrušená.
- [ ] v6: backend formulára (Resend) a jazyky SK/EN/DE (prepínač zatiaľ bez prekladu, na mobile skrytý).
- [ ] Prejsť KLIENT.md a rozhodnúť: viac URL namiesto jedného scrollu, jazyky SK/EN/DE, admin, údržba (paušál).
- [ ] Patrik overí slideshow projektov na živej stránke (Cmd+Shift+R), aj pri rýchlom klikaní.
- [ ] Patrik skontroluje v3 v prehliadači (pohyb, nielen screenshoty).
- [ ] Mobil: hero karty sa pri dlhom texte môžu prekrývať, ukazovateľ prekrýva model. Neladené.
- [ ] Obrázok ihriska-04.jpg je výrez zo starého webu (text „Vie“, čiara). Nahradiť.
- [ ] Identita: Patrik vyberie nadpisový font z troch (Bricolage Grotesque, Archivo, Familjen Grotesk). Stránka ich ukazuje vedľa seba, výber zatiaľ nie je.
- [ ] Identita: Patrik schváli farby, pomer plôch, komponenty (tlačidlo, karta kroku, obrovské slovo) a tón, alebo pošle pripomienky.
- [ ] Identita: mobil stránky `identita.html` neladiť, kým Patrik nepožiada.
- [ ] Identita: po schválení preniesť do webu (v3 zatiaľ bez zmien) a rozhodnúť o commite.
Mimo v3: zvyšných 8 podstránok z menu, doladený mobil, deploy, nové detaily 3D modelu, fotogrametria, CMS.

## Rozhodnutia
- Admin (Patrik, 2026-11-21, štýl medium, odpovede B/2 neskôr/A/A/A/A+B/A/A/A): PHP admin na Hostzone, jedno heslo, preklad DeepL Free pri uložení, preklad sa zverejní hneď a klient ho môže opraviť (ručná oprava sa neprepíše), realizácie pridať/upraviť/zmazať/poradie, banner s prednastavenými farbami aj vlastnou, text banneru sa prekladá, po scrolle zmizne a hore sa vráti. Automatické nasadenie realizácií sa rozhodne neskôr; na GitHube zapísané ako nedokončené.
- Realizácie (2026-11-21): jediný zdroj `v9-next/content/realizacie.json` (slug, skupina, titulná fotka, galéria, texty SK/CZ/EN/DE). `RZ` v `lib/v9.tsx` a `realizacie.items` v `messages` zrušené. Fotky z adminu idú do `public/rz/<slug>/NN.webp`.
- Banner (2026-11-21): web číta `/data/banner.json` za behu (bez buildu), len na úvode (`public/js/banner.js`). Farba textu podľa kontrastu WCAG (na červenej tmavý text).
- Hlavička (2026-11-21): telefón v lište menu nie je (Patrik: vyzerá zle). Menu so 7 položkami sa zbalí do tlačidla pod 1260 px (predtým 980 px), texty menu sa nelámu.
- Nafukovacie atrakcie (Patrik, 2026-11-20, štýl fast, odpovede AAAAA a ADAB): prenájom aj predaj, fotky a texty zo starého play-ground.sk bez úprav v ChatGPT, maľovanie na tvár ostáva, v menu za Revíziami. Adresa `/sk/nafukovacie-atrakcie/`, v menu SK „Nafukovacie atrakcie“, CZ „Nafukovací atrakce“, EN „Inflatables“, DE „Hüpfburgen“. Bez veľkej fotky hore (bola orezaná na pás).
- Git (2026-11-21): commity idú na vetvu `final` s trailerom Co-authored-by JackClash99, bez Claude trailera.
- Hero vizuál (Patrik, 2026-11-17): žiadny z troch návrhov sa nepoužije (`index.html`, `hala.html` so satelitným snímkom a `vykres.html` s 3D ihriskom z `ihrisko.glb`). Zmazané bez zálohy, lebo mimo gitu.
- Fotky z ChatGPT (Patrik, 2026-11-14): všade len prerobená verzia, originály sa mažú (git ich drží v histórii). Prerobené verzie prepísali súbory v galériách `rz/` pod pôvodným názvom.
- Depth mapy (Patrik, 2026-11-14): na všetkých fotkách podstránok vrátane kariet realizácií, nie v galérii po rozkliku. Generuje Depth Anything V2 Small (cache HF) cez `uv run --with torch --with transformers` skriptom `/tmp/pgdepth/run.py`, výstup `<foto>-d.webp` šírka 900. Galéria `realizacie` filtruje `-d.webp`.
- Favicon (Patrik, 2026-11-14): čierne (ink #141310) P na červenej #FF2712, ťah hrubší obrysom 7 jednotiek (hrúbka 10 zalieva vnútro P). Verzia ikon `?v=3`. Ak Patrik chce čistú #000, zmeniť v `public/favicon.svg`.
- Pätička (Patrik, 2026-11-14): len veľké logo, malé logo pri claime odstránené.
- Slinkee nemá Ä, Ö, Ü, ß ani diakritiku: v `{X}` značkách používať len ASCII písmená (DE „Wän{D}en“).
- WebGL depth (2026-11-14): pri `webglcontextlost` sa plátno odstráni a ostane fotka; MAXGL 6 (predtým 10).
- Testovanie responzivity: Playwright WebKit aj Chromium v `/tmp/pwk`, skript `/tmp/pwk-scripts/resp.js` (20 zariadení podľa Chrome DevTools, `LANGS`, `DEVS`, `SHOT=1`, `OUT`), cookie voľba v localStorage `pg-cookies` = `necessary`.
- Prerábka 3D (Patrik, 2026-11-13): pokazené diely (odpadnutá pena) úplne preč. Časť 1 staré ihrisko inak poskladané (plošiny a šmykľavka otočené o 180° okolo stredu konštrukcie `PIVOT`), časť 2 rozloženie, prefarbenie a otočenie do nového poskladania, časť 3 nové ihrisko.
- Loader (2026-11-13): logo sa kreslí cez requestAnimationFrame a atribúty (nie Web Animations), skripty z `public/js` sa sťahujú súbežne a majú verziu buildu v adrese (`?v=PG_V` z `next.config.ts`), limit loadera 9 s, CSS poistka 10 s. Stráž triedy `ld-on` v inline skripte v `app/[lang]/layout.tsx` (`window.__pgLd`), lebo pri chybe hydratácie #418 React zmaže triedy na `<html>`.
- Testovanie Safari bez iPhonu (Patrik, 2026-11-13: „vyrieš to bez iphone“): Playwright WebKit v `/tmp/pwk` (emulácia iPhone 15 Pro), skripty `/tmp/pwk-scripts/`. Web Inspector so Safari 27.2 na Macu iPhone v menu Vývoj nezobrazil.
- Kolo 2026-11-11 večer (Patrik, štýl fast, bez testov): červená na tlačidlách a v pätičke len o kúsok bledšia (#FF4632, nie ružová), loader a bodky ostávajú #FF2712. Filter v Realizáciách zrušený, nahradený riadkami podľa kategórií. Pätička: veľké logo namiesto napísaného slova, loptičky padajú za textom od horného okraja po čiaru nad copyrightom. Slovo „čínske“ sa nepoužíva (je „nekvalitné“). Fotky z ChatGPT sa nasadzujú ako `public/img/<názov>.webp` (WebP q80, šírka 1800). Prerábka 3D: staré ihrisko má odpadnutú penu, výsledné farby podľa `v5/frames/render/f_004.webp`.
- Model a delegovanie (Patrik, 2026-11-11): práca so Sonnetom 5 na ľahšie úlohy, Opus 5 len na naozaj zložité; usage bolo na 73 %, preto sa väčšina robila priamo bez subagentov (subagent len na cookies, 404, placeholder).
- Len v9-next (Patrik, 2026-11-11): ďalej sa pracuje iba v Next.js verzii, v9 sa nemení. Adresy `/sk/`, `/cz/`, `/en/`, `/de/` (koreň presmeruje na /sk/). Prvky len z v9-next (červený loader s písaným logom, loptičky v pätičke) ostávajú.
- Pätička červená #FF2712 s tmavým textom (Patrik, 2026-11-11), mení predchádzajúce „Pätička ink“. Loptičky v pätičke v papierovej, bielej a tmavej.
- Loader (Patrik, 2026-11-11): len na úvode, vždy (aj po kliknutí na logo a pri obnovení), na podstránkach nikdy.
- Obmedziť pohyb (prefers-reduced-motion) sa ignoruje (Patrik, 2026-11-11): loader, depth fotky, 3D Prerábky aj prechody bežia vždy. Patrik bol upozornený na prístupnosť.
- Sekcia „Prečo PLAYGROUND“ (Patrik, 2026-11-11): 5 výhod s čiarovými ikonami (tmavá čiara, červená bodka) na úvode, v Ihriskách na mieru (sekcia 06) a v O nás. Vlastný text, nie prevzatý od konkurencie (interieroveihriska.sk = REATEK). Fakty podľa Patrika: 24 mesiacov záruky, 5 až 8 týždňov, „Certifikované produkty“ (EN 1176).
- Testovacia subdoména playground.sarkozypatrik.sk má `X-Robots-Tag: noindex` len v nahranej kópii (`.htaccess`), lokálne súbory sú bez neho.
- Kompozícia a responzivita (2026-11-11, štýl medium): menšie medzery sekcií, krátke zoznamy v 2 stĺpcoch, obsah max. 2000 px na širokom monitore s väčším písmom od 1600 px, iPad realizácie a karty v 2 až 3 stĺpcoch.
- Farby v9 (Patrik, 2026-11-10): žiadna béžová, ostáva chladný papier #DEDDDB; akcent len červená #FF2712, odtiene len jej bledosť (napr. hover), nie iné farby ani tmavé červené plochy. Pätička ink, výzva bez farebného podkladu.
- Hero v9 (Patrik, 2026-11-10): render kaviarne na celú obrazovku (cover, nikdy nenaťahovať), rýchlejší scroll (viac snímok na scroll), text v rámiku animovanom s textom, hlavička priehľadná bez podkladu.
- Jazyky v9 (2026-11-11): SK, CZ, EN, DE ako v9-next; adresy podstránok slovenské vo všetkých jazykoch. Fakty zo stretnutia s klientom: 15 rokov, 180+ projektov, 6 krajín (SK, CZ, FR, IT, EE, RO).
- Slinkee nemá písmená s diakritikou a „I“ vyzerá ako J; v prekladoch sú tieto nadpisy prepísané v `OVR` v build.py.
- v6 načítanie (Patrik, 2026-11-09): logo v strede cez celú obrazovku, preletí na svoje miesto v hlavičke, pod ním sa odkryje stránka. Ukáže sa len pri prvej návšteve, pri prechode medzi stránkami sa neopakuje.
- Slinkee „I“ (Patrik, 2026-11-09): vyzerá ako J, preto sa nahrádza iným písmenom. Tvar Patrik ešte doladí.
- v6 mobil (Patrik, 2026-11-05): na mobile sa 3D model zväčší a popisy dielov sa skryjú, lebo sa prekrývali. Kroky pod modelom to vysvetľujú.
- v6 mobil (Patrik, 2026-11-05): formulár sa overuje na výške 720 px a 1280x720 podľa snímky, výška stránky sa počíta aj s pätičkou.
- v6 mobil (Patrik, 2026-11-05): mobil nesmie mať posun do strany. Je to záväzná podmienka pri každej ďalšej úprave.
- v6 kolo 2026-11-04 večer (Patrik, štýl medium, odpovede AACAAA): 3D ako GLB + Three.js rozloženie pri scrolle (Ihriská na mieru), prerábka ako 3D „staré → nové“, akcent 3 varianty na výber, mriežka 12/8/4, poznámky cez lokálny server do súboru, výsledok len na localhoste, deploy až po kontrole. Ilustrácie kreslí skill claude-drawing (kódom, zadarmo), nie Gemini.
- Snímky stavby a renderu (Patrik, 2026-11-04): 1920x1080, WebP q75 (80 MB spolu), na v5, v6 a oboch nasadeniach.
- playground-v3 (Patrik, 2026-11-04): subdoména aj priečinok zmazané, lokálne v7 ostáva.
- Deploy v7 (Patrik, 2026-11-04): Hostzone (cPanel, SFTP), nie Cloudflare. Adresa je nová subdoména `playground-v3.sarkozypatrik.sk` (Patrik napísal „sarkozy.patrik“, doména je `sarkozypatrik.sk`). Priečinok `/home2/hkjdxbcf/playground-v3`, rovnaká štruktúra ako `playground-v2`. Subdoménu založil cez cPanel UAPI až po ÁNO. Ďalšie domény, DNS ani súbory mimo `playground-v3` sa nemenia.
- v6 (Patrik, 2026-11-03 a 04): žiadny homemade štýl, ide sa len quality podľa skillu design-taste. Font Switzer (hlavný), Cabinet Grotesk len na malé štítky, bez kurzívy. Jediné odvážne rozhodnutie je plná červená #FF2712 (výzva), červená bodka pri štítkoch a časovači. Terakota a krém z homemade sa zahodili (aj preto, že je to štandardná AI kombinácia).
- v6 úvod: len video s deťmi cez celú obrazovku, 3D stavba z úvodu preč a presunutá na Realizácie (Patrik: „zatiaľ“). Tri panely podľa KLIENT.md (nové ihriská, prerábka a sťahovanie, revízie len okrajovo).
- v6 realizácie: bento mriežka s 3D náklonom a svetlom pod kurzorom (inšpirácia award-winning-website bez GSAP, clip-path vynechaný, len transform a opacity), detail s depth. Depth mapy pre všetkých 12 projektov už sú v `assets/depth/`.
- v6 realizácie (2026-11-04): dlaždica „Vesmírne ihrisko“ je 3D vizualizácia, otáča sa ťahaním, nie automaticky, aby sa nehýbala stránka. Na celú šírku, lebo ide o hlavný vizuál. Počet snímok: pôvodne 360, potom 120, teraz 180 (každá 2. snímka renderu, začiatok snímka 11). Patrik (2026-11-04): 180 snímok je aktuálna sada, staré sady sa zmažú sám.
- v6 dopyt: rozbaľovací výber (Nové ihrisko, Prerábka, Presťahovanie, Revízia) v hlavičke, hero a výzve, odkaz `kontakt.html?co=...` predvolí službu. Formulár: jedna obrazovka, výber jedným klikom, odosiela cez mailto.
- v6 GitHub: vetva `V6-verzia-2` (existuje aj Patrikova `V6-verzia-1` z nahrania cez web, nemenená). Commit s `Co-authored-by: JackClash99` podľa pravidla nižšie, bez Claude trailera.
- Video s deťmi bolo vygenerované cez Gemini (nie Claude) a Patrik ho dal do `v6/video/`. Skripty `tools/gemini_*_v6.py` čítajú `GEMINI_API_KEY` z prostredia, kľúč sa nikam neukladá. Kľúč bol vložený do chatu, odporúčané ho vymeniť.
- Pred každým plateným krokom (Gemini video, obrázky) ukázať cenu a počkať na súhlas. Fonty sú v `~/Desktop/AI/mytaste/v1/fonts/` (quality, homemade).
- 3D model sa neskôr nahradí realistickou animáciou po snímkach (Seedance), viazanou na scroll. Zatiaľ ostáva 3D model.
- Nadpisový font: Bricolage Grotesque (ligatúry nemá; fonty Google s dekoratívnymi ligatúrami sa nehodia). Telo ostáva Kanit.
- Depth mapy: Depth Anything V2 Small lokálne (venv v ~/.cache/loso-depth), výstup assets/depth/.
- Projekty: 1 fotka na projekt, slideshow pripravený; Šamorín má 8 fotiek. Formulár zatiaľ otvorí e-mail (mailto), skutočné odosielanie pri deployi.
- Slideshow projektov: nová fotka sa celá načíta (decode), potom sa 0,4 s prelinie cez starú, takže nie je prázdna plocha. Logo počas načítania sa nedáva. Ostatné fotky projektu sa načítajú pri otvorení detailu. Zastaraná fotka pri rýchlom klikaní sa nezobrazí.
- Nová identita (štýl fast, len farby, písma, tón a pravidlá; logo ostáva; hravý, ale dospelý charakter; cieľová skupina: majitelia prevádzok). Mení predchádzajúce „Zostane: farby, písmo Kanit“:
  - Červená `#FF2712` je hlavná farba a podpis značky. Používa sa na veľké plochy (sekcie, obrovské slová, tlačidlá).
  - Navy je text, papier je pozadie. Modrá `#2A3290` je len malý doplnok. Žltá a oranž ostávajú v 3D modeli.
  - Nadpisový font sa mení z Kanit (výber medzi tromi, viď Otvorené úlohy).
  - Dôvod: červená je najvýraznejšia a najľahšie rozpoznateľná, Patrik to zvolil.
- Výsledky z Gemini sa nečakajú, postup bez nich.
- Zostane: farby, logo, písmo Kanit, 3D ihrisko a 12 krokov. Všetko ostatné sa môže meniť (rozloženie, texty, prechody), čo nesedí.
- Prístup 1 z Awwwards inšpirácie: objekt v strede s kartami okolo (More Nutrition), tenké čiary a veľa bielej na podstránkach (MECHA). Nick Ho nemá 3D hero, použiteľné je len obrovské číslo ako hrdina. Videné boli len statické snímky, pohyb nie.
- Štýl v3: medium. Verzia v tom istom priečinku, nový commit.
- Pri session nad 50 % limitov: builder na haiku tam, kde to ide.
- Písmená fontov sa nikdy neupravujú (žiadny obrys, ťah ani prekresľovanie). Slinkee sa používa len ako pôvodný font. Platí natrvalo, Patrik 2026-11-03. Výnimka (Patrik, 2026-11-03, kolo 4): Slinkee má rovnomerný obrys vo farbe textu (0,057 em), aby drieky mali hrúbku ako Jakarta Bold. Tvar písmen sa nemení.
- Nadpisy sa nepíšu ani nemajú charakter (dieťa). Písanie čiarou ostáva len pre logo.
- Pôvodné rozhodnutia: model z jednoduchých tvarov podľa fotiek Šamorín, PBR textúry CC0, žiadne padanie dielov (fade a malý posun), logo biele SVG cez CSS mask, len lokálne.

## Posledné zmeny
### 2026-11-21: admin pre realizácie a banner, číslo preč z lišty
- PHP admin `v9-next/admin/` (prihlásenie, realizácie, banner, upload s kontrolou, CSRF, DeepL) a banner na úvode; overené lokálne cez `php -S` a agent-browser (API, upload, banner na 1280 a 390 px, galéria realizácií).
- Realizácie presunuté do `content/realizacie.json`; počet projektov v nadpise sa počíta sám.
- Zverejnenie `scripts/publish.mjs` (`npm run rz:publish`, `rz:deploy`, `admin:deploy`), depth mapy `scripts/depth.py`; postup v `v9-next/ADMIN.md`.
- Telefón odstránený z lišty menu; Nafukovacie atrakcie: Dino fotka vymenená, Drak bez vodoznaku OPPO, bez veľkej fotky hore.
- GitHub `final`: 4d59c9d, 9d4da3f. Na serveri nič z tohto dňa (SFTP zablokované systémom povolení, nasadí Patrik).

### 2026-11-20: Nafukovacie atrakcie, deploy, menu 1260 px
- Nová stránka `v9-next/app/[lang]/nafukovacie-atrakcie/` v 4 jazykoch: prenájom (11 kariet), predaj, FAQ, výzva; 12 fotiek zo starého webu (WebP, depth mapy), SEO, sitemap, JSON-LD, `llms.txt`.
- Menu so 7 položkami sa lámalo; texty bez zalomenia, zbalenie pod 1260 px (namerané v 4 jazykoch).
- Commity 824424f (opravy zo 16. 11.) a 97edefc na vetve `final`, pushnuté.
- Deploy na playground.sarkozypatrik.sk (SFTP, 17 s), HTTP 200 pre 4 nové stránky, 404 pre neexistujúcu, noindex ostáva.

### 2026-11-17: hero vizuál, tri pokusy zmazané
- Pripravené tri hero návrhy v `loso/hero-vizual/`: `index.html`, `hala.html` (satelitný snímok, fluorescenčná farba, seed `seed.py visual`, bez región a prostredie zo seedu) a `vykres.html` (3D ihrisko z `ihrisko.glb` ako výkres, začína pôdorysom, prepínač Pôdorys a Axonometria).
- Patrik všetky tri zamietol, priečinok zmazaný, server na porte 8951 zastavený. Ostatné súbory sa nemenili, `identita-hero.html` a `tools/gemini_hero_snimky.py` nie sú z tejto session.
- Dočasné súbory mimo projektu (`/tmp/antialg/repo`, `/tmp/hero*.png`) ostali, čaká sa na súhlas na zmazanie.

### 2026-11-15: pruhy na ihriska-prvky, poistka nasadená, kandidát video
- Fotka `ihriska-prvky` aj jej depth mapa sú v poriadku, chyba je pri vykresľovaní WebGL efektu (reprodukcia na stránke Ihriská v prehliadači).
- Vylúčená 360 vizualizácia (pruhy sa v nej nevyskytujú). Ďalší kandidát: video „Ako vzniká ihrisko“ (`video/stavba.mp4`, da49c95), pruhy pripomínajú zle dekódované video, kódovanie ešte nepreverené.
- Poistka WebGL funguje: po strate kontextu sa plátno odstráni, ostane fotka a efekt sa znovu nespustí. Nasadená na playground.sarkozypatrik.sk (nový `site.js` na serveri), HTTP 200 pre stránky, 404 pre neexistujúcu adresu. Chyba sa nedala zopakovať, oprava nie je overená.
- Rýchla kontrola, že nič nie je rozbité, nie je zaznamenaná. Overená je len HTTP kontrola po nasadení.
### 2026-11-14: opravy kola, deploy, responzivita, poistka WebGL
- Nemčina: „W{Ä}nden“ na „Wän{D}en“ (Slinkee nemá Ä). Pätička bez malého loga. Formulár: „Iné“ pri type prevádzky otvorí pole `typ_ine` (aj do e-mailu).
- Fotky: 11 originálov v galériách a kartách (Pezinok, Karviná tubing, Trnava, Praha, Hlohovec, Šamorín ×4, `projekt-02`, `projekt-10`) nahradené verziami z ChatGPT; 9 nepoužitých kópií v `img/` zmazaných. 17 nových depth máp.
- Favicon čierne hrubšie P na červenej (SVG, PNG, ICO, apple-touch), `?v=3`.
- Deploy 2× na playground.sarkozypatrik.sk (SFTP dávka `/tmp/pg-sftp.txt`), HTTP 200/404 overené. Druhý deploy: poistka WebGL kvôli pruhom na `ihriska-prvky` v Patrikovom prehliadači (nezopakované).
- Responzivita: automatická kontrola 20 zariadení × 7 stránok × 4 jazyky bez zásadných chýb; zoznam na preverenie v Otvorených úlohách.
### 2026-11-13: Prerábka 3D nové poskladanie, oprava loadera na iPhone
- Prerábka 3D: najprv jemnejšie pokazené diely (nasadené), potom pokazenie zrušené a nahradené iným poskladaním starého ihriska, ktoré sa v časti 2 preskladá na nové (nasadené, overené snímkami v 5 fázach).
- Loader na iPhone (iOS 26, Safari): len bliknutie červenej. Opravy: rAF kreslenie, súbežné sťahovanie skriptov, verzia `?v=` v adrese, limity 9 s a 10 s (nasadené, nepomohlo).
- Príčina reprodukovaná vo WebKite: zmena HTML pred hydratáciou spôsobí chybu React #418, React zmaže `ld-on`, loader sa preskočí. Oprava: stráž `ld-on` v inline skripte; diagnostika `?dbg` odstránená (zbuildované, nenasadené).
- write-good (btford/write-good) na anglických textoch: 17 nálezov, 10 návrhov opráv, Patrik ich odložil.
- Safari na Macu aktualizovaný na 27.2 (Patrik), Web Inspector iPhone nevidí.
### 2026-11-12: kolo pripomienok, deploy a push (97edefc)
- Všetky body z Patrikovho zoznamu implementované vo `v9-next/` (pozri Stav): červená, hero prechody, zalomenia, pätička, Ihriská, Prerábka, Revízie, Realizácie, O nás, formulár, cookies, 404, placeholder; texty a FAQ vo všetkých 4 jazykoch.
- Deploy na playground.sarkozypatrik.sk cez SFTP: nahraté `_next _not-found 404 cz de en sk img js rz video` + koreňové súbory; `kav frames 360 models vendor fonts` a serverový `.htaccess` (noindex) bez zmeny. HTTP: stránky 200, neexistujúca adresa 404.
- GitHub: commit 97edefc na vetve `v9` (len `v9-next/`, trailer Co-authored-by JackClash99), `main` bez zmeny.
- Chyba: texty a zalomenia v CZ, EN, DE som nastavil v kóde, ale vizuálne neprešiel. Pri Cookies a 404 doplnil Sonnet experimentálnu voľbu `globalNotFound`.
### 2026-11-11: v9-next 1:1 s v9, deploy na playground.sarkozypatrik.sk, GitHub vetva v9
- Kompozícia (bez prázdnych miest) a responzivita (390, 820, 1180, 1440, 2560 px) vo v9; fotky z ChatGPT nasadené.
- v9-next prepísaná 1:1 podľa v9 (TSX + skripty z v9), pixelovo porovnané; build bez chýb.
- Deploy na Hostzone: nová subdoména playground.sarkozypatrik.sk (cPanel UAPI), najprv v9, potom nahradená v9-next. Staré HTML v9 zo servera zmazané.
- Pridané: červená pätička, sekcia „Prečo PLAYGROUND“ (úvod, Ihriská, O nás), loader len na úvode a vždy, ignorovanie Obmedziť pohyb.
- GitHub: vetva `v9` (commity 49ee390 až 0ae6d22) s v9 aj v9-next, `main` bez zmeny.

### 2026-11-11: v9 jazyky, SEO, nové sekcie, render kaviarne (lokálne, nekomitnuté, nenasadené)
- Generátor `v9/_build/build.py`, 28 stránok (SK, CZ, EN, DE), sitemap, robots, JSON-LD, OG, favicon. Záloha stavu pred generátorom: `v9/_build/snapshot-2026-11-10/`.
- Úvod: render `new render` (185 snímok), rámik zo 4 čiar, priehľadná hlavička; nové sekcie služby, čísla, realizácie, FAQ.
- Podstránky: Ihriská (postup, realizácie, FAQ), Prerábka (kedy sa oplatí, realizácie, FAQ, oprava import mapy 3D), Revízie (čo kontrolujeme, priebeh, FAQ), Realizácie (filter, popisy, otvorenie cez #slug), O nás (15 rokov, 6 krajín), Kontakt (nafukovacie atrakcie, „Iné“, pôdorys).
- Paleta späť na chladnú, akcent #FF2712; Slinkee G v pätičke odsunuté od Y.
- Chyba: generátor raz prepísal ručné úpravy inej relácie, obnovené zo zálohy a prenesené do build.py.
### 2026-11-09: v6 finálne kolo, Patrikove pripomienky (lokálne, nekomitnuté)
- Patrik: web v6 hotový (úvod a 6 podstránok), načítanie s logom funguje, 7 stránok prešiel na 1440 a 390 px.
- Opravy v procese: Slinkee „I“, spojka „a“ na konci riadku, prázdna prvá snímka videa, fokus a šípky v detaile realizácie, odsadenie riadkov na mobile.
- Overené Patrikom: detail realizácie. Overuje sa: depth WebGL, formulár, mobil.
- Neskúšané: reálny telefón a Safari. Súbory `v6/` sa od 2026-11-06 17:45 nezmenili, opravy zatiaľ nie sú v kóde.

### 2026-11-09: v8 hero-pismena (lokálne, nekomitnuté, nenasadené)
- Nová stránka `v8/hero-pismena/`: úvod s písaným logom a videom vo vnútri ťahov, pri scrolle zväčšenie do ťahu P a oddialenie kamery.
- Nadpisy po riadkoch raz pri prvom zobrazení. Nad pätičkou bazén s loptičkami (chytiť, hodiť, pri prvom zobrazení napadajú).
- Sekcia „Ako ihrisko vzniká“: render 768 snímok hotový, spájaný do videa. Video sa zastaví na konci kapitoly, štítok sa prepína. Snap bez zotrvačnosti scrollu (vždy najbližšia kapitola). Pod kapitolami svetlý prechod kvôli čitateľnosti.
- Overené v prehliadači desktop a mobil, konzola bez chýb. Stav videa 17 MB: zmenšenie v procese.
- Poznámka: session zhrnutie malo dva údaje o renderi (snímka 460 zo 768 a hotových 768). Zapísaný je posledný stav (hotový).

### 2026-11-05: v6 mobil (lokálne, nekomitnuté, nenasadené)
- Mobil nemá posun do strany. Podľa Patrika overené.
- Formulár: pri 1280x720 sa vojde (výška stránky vrátane pätičky, overené na snímke). Pri 720 px výšky sa vojde tiež.
- 3D na mobile: model zväčšený, popisy dielov skryté, lebo sa prekrývali. Kroky pod modelom to vysvetľujú.
- Snímky stavby a renderu, playground-v3 zrušená: bez zmeny oproti záznamu z 2026-11-04.
- Stav: Patrik overil, zatvoril prehliadač. Zmeny sú len na localhoste.

### 2026-11-04: v6 (playground-v2) kolo medium: 3D, mriežka, akcent, ilustrácie, poznámky (lokálne, nekomitnuté, nenasadené)
- Sekanie slov: nadpisy sa delia na slová až po načítaní písma (`fontsReady` v main.js), do tej doby sú skryté (`body:not(.go)`), fonty `font-display: block`. Príčina: `text-wrap: balance` + swap písma zalomili riadky dvakrát. Lokálne sa písmo načíta hneď, preto sa pôvodná chyba nedala zopakovať; over na živom webe.
- Hero: tlačidlo Pauza zrušené (video beží, pri reduced-motion stojí).
- Formulár: nový krok 3 „Dokedy má byť ihrisko hotové“ (Čo najskôr, Do troch mesiacov, Do pol roka, Zatiaľ sa len pýtam, ako vo v5), 4 kroky v ukazovateli, termín ide do e-mailu. Vojde sa pri 1280x720.
- Mriežka: premenné `--cols` (12 desktop, 8 pri 861 až 1100 px, 4 mobil) a `--gap` vo všetkých sekciách, bento má rovnakú medzeru. Prekrytie mriežky: `?grid` v adrese alebo kláves G.
- Červený akcent, 3 varianty, prepínač A/B/C vľavo dole len na localhoste (pamätá sa v localStorage, `?accent=a|b|c`): A kľúčové slovo nadpisu a čísla sekcií červené, B červené loptičky v hlavičke podstránok a pri šípkach, C červené linky, plochy a hover.
- 3D z `~/Desktop/hrisko/ihrisko-b-realita.blend`: export Blender CLI do `v6/models/ihrisko.glb` (1,9 MB, len ihrisko bez haly) a `models/gulicky.json` (5 210 loptičiek). Modul `v6/play3d.js` (Three.js 0.160 z unpkg, importmap v hlavičke): Ihriská na mieru = rozloženie na časti s popismi pri scrolle, Prerábka = staré žlto-červené ihrisko sa rozoberie, zmení farby, pribudnú prvky, zloží sa. Ťahaním sa otáča. Na mobile bez popisov.
- Ilustrácie skillom claude-drawing (nainštalovaný do `~/.claude/skills/claude-drawing`, z github.com/cloveric/claude-drawing-skill, bez GIF ukážok): `tools/ill_pop.py` (pop silkscreen, 4 panely šmykľavka a loptičky, na úvode nad výzvou) a `tools/ill_gouache.py` (retro gouache bazén, v O nás). Výstup `v6/ill/*.webp`.
- Poznámky k prvkom: `python3 tools/review_server.py` (port 8914), adresa `...?review`, klik na prvok, poznámka sa uloží do `poznamky.json` v koreni. Kláves R vypne / zapne. V súbore je 1 testovacia poznámka (zmazanie bolo zablokované), zmaž ju krížikom v zozname.
- Overené (agent-browser): 1440, 1000, 390 px bez posunu do strany, konzola bez chýb, 3D v oboch režimoch, uloženie poznámky. Neoverené: Safari, výkon 3D na telefóne.

### 2026-11-04: snímky 1920x1080, zrušená playground-v3
- Stavba (240) a render (360) nanovo z `~/Desktop/hrisko` ako WebP 1920x1080 q75 (stavba 29 MB, render 51 MB, predtým 1600x900 q72, 53 MB). Lokálne v `v5/frames`, `v6/frames` (`v7/frames` je odkaz na v6).
- Hostzone: nahraté do `playground-v1/frames` (obsah v5) a `playground-v2/frames` (obsah v6). Overené cez HTTP: 200, veľkosti sedia so zdrojom.
- Subdoména `playground-v3.sarkozypatrik.sk` zrušená (cPanel API2 SubDomain::delsubdomain), priečinok `/home2/hkjdxbcf/playground-v3` zmazaný. Adresa vracia 404. Lokálne `v7/` ostalo.

### 2026-11-04: commit 4220d93, v7 nasadená na playground-v3 (Hostzone)
- Commit 4220d93 (12:58) na `V6-verzia-2`: stavba ihriska, realizácie, podstránky, výzva. V commite sú aj sady `ihrisko-360-180`, `ihrisko-360-120` a `ihrisko-360`, staré dve treba zmazať.
- Vznikol priečinok `v7/` (nekomitnutý) a `tools/build_v7.py`.
- Deploy na Hostzone: nová subdoména `playground-v3.sarkozypatrik.sk`, priečinok `/home2/hkjdxbcf/playground-v3`. Nahraté 8 HTML stránok, CSS, skripty, fonty, assets, frames 240 + 360, video (cca 64 MB, upload 43 s).
- Pred deployom existovali `playground-v1` a `playground-v2`. Nemenili sa.
- Overenie: výsledok HTTP kontroly v zápise chýba. Stav „funguje“ zatiaľ neplatí.

### 2026-11-04: nové rendery, písaná výzva, realizácie v5, texty v6 (Sonnet + Opus, nekomitnuté)
- Fyzikálne 3D ihrisko je zrušené všade (súbory `playground3d.js`, `pg.css` zmazané). Patrikovi sa nepáčilo.
- Snímky z Blenderu (`~/Desktop/hrisko/stavba` 240, `render` 360) sú ako WebP 1600x900 v `v5/frames/` a `v6/frames/` (stavba 20 MB, render 33 MB, nie sú v gite).
- v5 hero: stavba v hale z `frames/stavba` (hero-video.js, snímok vyplní plochu).
- v5 výzva „Napíšte nám“ na konci každej podstránky aj na úvode: nápis sa napíše písmom Slinkee (maska po stredovej čiare, diakritika dokreslená), čiara pokračuje slučkami k tlačidlu „Napísať dopyt“ a obtiahne ho. `v5/cta.js`, dáta `v5/brand/cta-write.js` z `tools/cta_write.py`, štýly `.cta-end` v `v5/style.css`.
- v5 Realizácie: vľavo karty 12 projektov (hover zväčší, klik otvorí detail so slideshow), vpravo prilepený render, ktorý sa otáča pri scrolle (`v5/seq.js`). Galérie projektov stiahnuté zo starého webu do `assets/obsah/projekty/<slug>/` (2 až 10 fotiek). Slideshow: šípky, klávesy, potiahnutie prstom.
- v5 Prerábka: kreslené ihrisko (`v5/sketch.js`), pri scrolle šedá skica, potom farby a loptičky, klik pridá loptičky.
- v5 všade: plynulý scroll Lenis 1.1.13 z unpkg (len myš), jednotný prechod medzi stránkami (brand.js, brand.css).
- v6: Postup zarovnaný do mriežky, podnadpisy kategórií zrušené, výzva `cta-end` na podstránkach (bez dropdownu služieb). Realizácie: stavba z `frames/stavba` s novými krokmi, dlaždica 360 z `frames/render` (360 snímok). Animované texty: nadpisy po slovách, štítky, zoznamy, čísla (main.js, koniec style.css).
- Overené: 14 stránok v5 a v6 na 1440 a 390 px bez chýb a bez posunu do strany.
- Neoverené: pocit Lenis a výzvy na reálnom telefóne a v Safari, veľkosť snímok pri pomalom pripojení.

### 2026-11-04: fyzikálne ihrisko, podstránky v6, formuláre (štýl medium, nekomitnuté)
- Nový modul `v5/playground3d.js` a jeho kópia `v6/playground3d.js` (farby v6): zjednodušený 3D model ihriska (Three.js 0.160 + cannon-es 0.20 cez importmap z unpkg). Diely sú pružne držané pri domovskej polohe, dajú sa chytiť myšou alebo prstom, ťahať a hádzať, 40 loptičiek v bazéne. Tlačidlá „Poskladať“ a „Rozsypať“. Parameter `{ scatter: true }` začne rozsypaný.
- v5: sekcia v `projekty.html` (zložený štart) a v `prerabka.html` (rozsypaný štart, „Zo starého nové“), štýly v `v5/pg.css`.
- v5 formulár: pribudli plocha a výška stropu, termín (štítky), honeypot, po odoslaní panel so súhrnom, tlačidlami Otvoriť e-mail a Skopírovať text (kontakt.html, kontakt.js, kontakt.css).
- v6: nové podstránky `ihriska.html`, `prerabka.html` (s fyzikálnym ihriskom), `revizie.html`, `o-nas.html` generuje `tools/build_v6.py`. Odkazy už nejdú na v5. V generátore je aj blok 360 vizualizácie (`V360`), ktorý bol v `projekty.html` len ručne. CSS podstránok a `.pg` na konci `v6/style.css`.
- v6 formulár: „Ďakujeme“ sa zobrazuje správne (overené), pribudli tlačidlá Otvoriť e-mail a Skopírovať text.
- Overené v prehliadači (1440 a 390 px): konzola bez chýb, mobil bez horizontálneho posunu, ťahanie dielov a obe tlačidlá fungujú.
- Neoverené: čísla v O nás („13 rokov“, „180+ projektov“) sú zo starého webu, treba potvrdiť od klienta. Dotykové ťahanie na reálnom telefóne. Ladenie fyziky (tuhosť pružín) na pocit.

### 2026-11-04: hero v5, svetlý prechod za nadpisom (commit 487ad2e, pushnutý)
- Za veľkým nadpisom na hero je svetlý prechod (`v5/home.css`, 5 riadkov): zospodu plne svetlý, smerom nahor slabne a stratí sa asi v polovici výšky ihriska.
- Farba je #F6F3EE (pozadie stránky), nie čisto biela, aby na okraji prechodu nebol vidno pás.
- Nadpis aj text pod ním sú čitateľné aj nad celým ihriskom. Overené na snímke, nie v prehliadači.
- Commit je na `origin/V6-verzia-2`. Vetva `v5-verzia-1` existuje len na remote.

### 2026-11-04: dlaždica 360 na 180 snímkach (nekomitnuté)
- Patrik zvolil 180 snímok z renderu: každá 2. snímka (1, 3, 5, ... 359), 12 MB, `assets/ihrisko-360-180/`. Začiatok zostáva snímka 11.
- Adresa na overenie: http://127.0.0.1:8793/v6/projekty.html (Cmd+Shift+R). Výkon a ťahanie sa overili len kódom, nie v prehliadači.

### 2026-11-04: dlaždica 360 na realizáciách (nekomitnuté)
- Na stránke Realizácie je nová dlaždica „Vesmírne ihrisko“ na celú šírku (bento riadky 8 až 9), 120 snímok, ťahanie myšou alebo prstom so zotrvačnosťou, bez automatického otáčania, keď používateľ ťahá alebo klikne do dlaždice.
- Mobil: dlaždica zaberá 2 riadky (`.bento > .bt-360`). Nové súbory v `v6/projekty.html`, `v6/main.js` (blok `v360`), `v6/style.css`.
- Overené len kódom, v prehliadači ešte nie.

### 2026-11-04: v6 komitnutá na GitHub (vetva V6-verzia-2)
- Commit 823aedd, push na `origin/V6-verzia-2`. Bez fontov Comico, Jakarta a Switzer kurzíva, bez screenshotov a starých Gemini skriptov.
- Lokálna vetva je teraz `V6-verzia-2`, nie `main`. KONTEXT.md je nekomitnutý.

### 2026-11-03: v6 stavba, od homemade po quality (nekomitnuté okrem poslednej verzie)
- Najprv homemade (Comico, scribbles, nástenka), potom prerobené na quality. Hero najprv stavba podľa scrollu, potom video s deťmi; stavba presunutá na Realizácie.
- Pridané: panely s depth, bazén loptičiek (`v6/balls.js`, fyzika a odhadzovanie kurzorom, aj po odoslaní formulára), bento s náklonom, detail s depth, rozbaľovací výber dopytu, kroky stavby s časovačom, formulár s číslovanými krokmi a ikonami.
- Overené v prehliadači (1440 px, 390 px): konzola bez chýb, mobil bez horizontálneho posunu, formulár sa vojde pri 1280x720.

### Pravidlo commitov (Patrik, 2026-11-03)
- Každý commit v tomto projekte má na konci `Co-authored-by: JackClash99 <74911058+JackClash99@users.noreply.github.com>`.

### 2026-11-03: v5 kolo 6, väčšie video, zarovnanie Slinkee, formulár (štýl fast, nekomitnuté)
- Hero video: canvas cez celý hero, spodok stavby je za nadpisom. Začína snímkom 26 (pred ním je prázdne pozadie), ten sa prednačíta.
- Slinkee: výška verzálky Jakarta 745, Slinkee 652, driek 136 a 72 (upm 1000). Veľkosť 1,05 em, obrys 0,0575 em, posun nahor 0,0275 em. Spodok sedí na základnej čiare, vrch na výške verzálky Jakarty. Glyfy bez zmeny.
- Kontakt: formulár v štýle v5 (štítky služieb, polia so spodnou linkou, pri zameraní červená, po odoslaní hláška). Odosiela sa stále cez mailto, backend nie je.

### 2026-11-03: v5 kolo 5, hero z videa, nadpisy bez skákania, jednoznaky (štýl fast, nekomitnuté)
- Hero: namiesto 3D modelu (Three.js) sa podľa scrollu prehráva 240 snímok z `video/stavba-720p.mp4` (`v5/hero-video.js`, `v5/assets/stavba/f001..f240.webp`, 1024x576, 5,3 MB). Farba pozadia snímok je dorovnaná na paper #F6F3EE, okraje sa plynulo strácajú v canvase. `hero.js` ostal v repozitári, ale úvod ho už nenačítava (importmap odstránený).
- Skákanie nadpisov: príčinou bolo písmo (podmnožina latin-ext sa dotiahla až po štarte) a pohyb po slovách. Písma sa načítajú s reálnym textom, nadpisy sa zobrazujú celé naraz (`brand.js` reveal, trieda `rh`). `words()` v brand.js sa už nepoužíva.
- Jednoznaky: pevná medzera (&nbsp;) za k, s, v, z, o, u, a, i vo všetkých HTML a v textoch `projekty.js`.

### 2026-11-03: v5 kolo 4, podčiarknutie, hrúbka Slinkee, animácie (štýl fast, nekomitnuté)
- Logo: podčiarknutie je v `assets/PLAYGROUND.svg` samostatný tvar (cesty 0 až 4), písmená sú cesty 5 a 6. `write.js` ich kreslí v dvoch vrstvách. Písmená odkrýva maska po čiare, podčiarknutie maska zľava doprava. Kúsky v slučkách y a g sa už neukazujú skôr. `logo-write.svg` (načítavanie na podstránkach) to ešte nemá.
- Slinkee: drieky Jakarta Bold 0,136 em, Slinkee 0,072 em. Obrys `-webkit-text-stroke: 0.057em` a veľkosť 1,06 em ich dorovnajú, okraj 0,03 em proti dotyku so susedmi.
- Väčšie nadpisy: hero 9,4vw na celú šírku, text a tlačidlo pod ním. Väčšie aj o nás, depth a výzva.
- Animácie (`brand.js` reveal, `brand.css` `.mo`): slová nadpisov vyjdú zospodu postupne, texty a bloky sa objavia posunom a zosvetlením, linky na o nás sa nakreslia zľava, čísla sa napočítajú, tlačidlá sa pri hover jemne zdvihnú. IntersectionObserver, len transform a opacity, `prefers-reduced-motion` ich vypne. Na úvode sa spustia až po odchode loga.
- `GEMINI-ANIMACIA.md`: zadanie a prompty pre video animáciu v Gemini (nič negenerované).

### 2026-11-03: v5 návrat písma, logo s podčiarknutím na konci (štýl fast, nekomitnuté)
- Nadpisy sú znova živý text: Jakarta Bold a pôvodné Slinkee (cez `brand.js` slink), bez obrysu na Slinkee. Písanie nadpisov a charakter sú preč.
- Logo: najprv P, potom písmená zľava doprava, podčiarknutie (spojené z kúskov okolo y a g) na konci po krátkej pauze. Opravené bodky pred začiatkom ťahov (dlhá medzera v dash).
- `tools/write.py` generuje len logo (`--headings` zapne aj staré nadpisy). `writing.js` má 34 kB.
- Index: 3D model hore, celý viditeľný, nadpis a text pod ním. Realizácie ostali len na podstránke, na úvode sú dve fotky s preklikmi (depth) ako predtým.
- Záznam nižšie (písanie čiarou) je z veľkej časti zrušený.

### 2026-11-03: v5 písanie čiarou, nový hero, o nás (štýl fast, nekomitnuté)
- Písanie: `tools/write.py` (venv `~/.cache/loso-write`) z obrysov Jakarta, Slinkee a loga vytiahne stredovú čiaru a uloží ťahy do `v5/brand/writing.js` a `brand/logo-write.svg`. Nadpisy sú v `tools/headings.json` (riadky, ktoré písmená sú Slinkee). Po zmene textu nadpisu treba generátor spustiť znova.
- `v5/brand/write.js`: Jakarta sa odkrýva maskou po čiare, Slinkee sa kreslí ako ťah. Na najdlhšom klesajúcom úseku Slinkee písmena sa šmykne malý charakter (`kid`) a na konci odskočí. `?slow` v adrese spomalí písanie 5x (na kontrolu).
- Medzery pri Slinkee: podľa atramentu, nie podľa šírky znaku.
- Index: logo sa napíše čiarou, potom nadpis „IHRISKÁ NA MIERU“. 3D sa stavia plynulo bez krokov a čísel (`hero.js`, 280vh). Realizácie: zoznam 12 projektov a veľká fotka, charakter sedí na ráme a hojdá nohami. Výzva na červenej.
- O nás: písané nadpisy, štatistiky s charakterom, riadky s tenkými linkami (`about.css`).
- Náhodné písmená (scramble) sú vypnuté všade.
- Overené len desktop 1440 px, bez chýb v konzole. Mobil neladený. Ostatné podstránky sa nemenili (okrem vypnutého scramble).

### 2026-11-03: v5 rýchly náhľad (štýl fast, nekomitnuté)
- Priečinok `v5/` (kópia webu, `v5/assets` je symlink na `../assets`). Pôvodný web v koreni bez zmien.
- Písmo: Plus Jakarta Sans, nadpisy Bold, verzálky. 1 až 2 písmená v nadpise sa vymenia za Slinkee (len A, E, G, M, N, nikdy s diakritikou). `brand.js` (slink), `brand.css`, font v `v5/brand/` (OFL).
- Obrovské slovo už nie je orezané v polovici.
- Logo sa píše: úvod na index (inline SVG, ťah a potom výplň), načítavanie obrázkov a podstránok (`brand/logo-write.svg`, v slučke).
- Menu podľa klienta: Ihriská na mieru, Prerábka, Revízie, Realizácie, O nás, Kontakt. Nové `prerabka.html`, `revizie.html` (len text zo starého webu). Prepínač SK/EN/DE bez prekladu. Formulár bez backendu (mailto ako predtým).
- Hero B (`index-b.html`, `hero-b.css`, vetva `B` v main.js): namiesto čísla obrovský názov kroku za modelom, popis dielu na čiare k bodu na modeli, tenký ukazovateľ hore, bez čísel. Hero A (`index.html`) ostal s číslami.
- Overené len desktop 1440 px, bez chýb v konzole. Mobil neladený. Screenshoty v screens/v5/.

### 2026-11-01: slideshow bez bliknutia
- Pri „Ďalej“ a „Späť“ v detaile projektu už nebliká navy pozadie. Fotky sa plynulo prelínajú (projekty.js, projekty.css, commit 24f7113).
- Na GitHub išli len projekty.js a projekty.css (vetva `web`). KONTEXT.md a vetva `main` sa nepushujú.

### 2026-11-01: online na GitHub Pages
- Web: https://partiksa.github.io/playground-web/ (verejný repozitár partiksa/playground-web, workflow .github/workflows/pages.yml pri pushi na main).
- Na GitHub ide len lokálna vetva `web` (orphan, len súbory webu, bez KONTEXT.md, screens/, identita.*, .md v assets). Lokálna `main` (commit f20c16b) sa nepushuje.
- Aktualizácia: skopírovať súbory webu z main do vetvy `web`, commit, `git push origin web:main`.
- video/: referenčné video 3D modelu (27 s) a prvá a posledná snímka pre Seedance/Veo. Nie je v gite.

### 2026-11-01: v4 úpravy projektov
- Projekty: preč text „Scrollujte…“. Detail: fotka 84 % výšky, dole vidno začiatok textu, depth efekt ostáva.
- scramble.js: prepis cez náhodné písmená na podstránkach (obrovské slovo, nadpisy sekcií raz pri zobrazení, nadpis a miesto v detaile projektu).
- Globálny CLAUDE.md: zákaz zbytočných podtextov a návodov na webe.

### 2026-11-01: v4 postavená
- Hero: úvod s logom, krok drží asi 1 obrazovku, názov kroku v navy kontajneri, 3 poznámky stoja a text sa prepisuje cez náhodné písmená.
- Index: 2 fotky na celú obrazovku s depth efektom (Šamorín, Oravice). depth.js, intro.js.
- Podstránky: mriežka skrytá, ihriská len text, projekty 12 panelov (hover 2/5, klik otvorí detail so slideshow, #hash), o nás jeden stĺpec, kontakt formulár so službami.
- Overené v prehliadači 1440 px: bez chýb v konzole. Mobil neladený.

### 2026-11-01: identita, prvý návrh
- Vznikla stránka `identita.html` + `identita.css` (zatiaľ nekomitnutá): farby, tri fonty na porovnanie, pravidlá a tón, komponenty.
- Červená vedie, navy je text, papier pozadie. Konzola bez chýb, skontrolovaný len desktop screenshot.
- Mobil bez ladenia podľa voľby Patrika. Web v3 a commity sa nezmenili.

### 2026-11-01: v3 hotová
- Hero podľa More Nutrition: veľký model, číslo kroku za ním, naklonené karty dielov. Kamera: place() v main.js (side = úvod/záver, náklon rotateZ).
- Podstránky podľa MECHA: tenká mriežka, orezané slovo, asymetrické fotky.
- Overenie: hero 0, 20, 50, 85, 100 %, 4 podstránky, mobil 390 px (len kontrola). Bez chýb.

### 2026-11-01: návrh v3 schválený
- Researcher a builder prešli 3 weby z Awwwards (Nick Ho, More Nutrition, MECHA), vybraná kompozícia podľa More Nutrition.
- Patrik schválil prístup 1 a rozsah: hero aj 4 podstránky, build v novej session.
- git tag `v1` na commite 7e675eb.

### 2026-11-01: v2 hotová
- Hero: PBR textúry, fade-in animácia, kamera zaostruje na diel, 12 kariet s popisom, svetlá téma s červenou ako akcentom. Oranžová stena odstránená, vinyl stĺpov hladký.
- Podstránky ihriska, projekty, o-nas, kontakt + pages.css, spoločná hlavička a pätička.
- Overenie: 5 stránok bez chýb a 404, navigácia OK, CTA viditeľné. Commit 7e675eb.

### 2026-11-01: v1 hotová
- Hero stránka s 3D ihriskom z fotiek (projekt Šamorín), 12 krokov stavby pri scrolle. Commit aa128ed.
- Assety z play-ground.sk: logo, fotky, farby, písmo Kanit.

## Ďalší krok
Počkať na výsledok Patrikovho nasadenia (`npm run admin:deploy`, `npm run rz:deploy`): ak admin ukáže chybu, preveriť verziu PHP v cPaneli; potom doplniť DeepL kľúč a rozhodnúť automatické nasadenie realizácií.
