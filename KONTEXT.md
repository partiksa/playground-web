---
stav: rozpracovaný
---
# loso (redizajn play-ground.sk)

Posledná aktualizácia: 2026-11-01 19:27

## Cieľ
Moderný web firmy PLAYGROUND (interiérové detské ihriská, Trnava) s 3D ihriskom, ktoré sa pri scrolle postaví. Identita zo starého webu: logo, farby, písmo Kanit.

## Stav
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
Patrik overí slideshow na https://partiksa.github.io/playground-web/projekty.html (Cmd+Shift+R) a napíše pripomienky k v4.
