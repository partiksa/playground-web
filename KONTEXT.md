---
stav: rozpracovaný
---
# loso (redizajn play-ground.sk)

Posledná aktualizácia: 2026-11-01 17:48

## Cieľ
Moderný web firmy PLAYGROUND (interiérové detské ihriská, Trnava) s 3D ihriskom, ktoré sa pri scrolle postaví. Identita zo starého webu: logo, farby, písmo Kanit.

## Stav
- v4 (nekomitnutá): červená hlavička, úvod s logom na celej obrazovke, nadpisy Bricolage Grotesque, poznámky v hero stoja a text sa prepisuje, fotky na celú obrazovku s depth mapou, nové podstránky (projekty s panelmi a detailom, technické ihriská, jednoduché o nás, formulár). Screenshoty v screens/v4/.
- Nová identita (nekomitnutá, čaká na výber fontu a schválenie): `identita.html` + `identita.css` v koreni, screenshot `screens/identita.png`. Web v3 sa nezmenil. Mobil neladený.
- v1 (git tag `v1`), v2 (7e675eb) a v3 (HEAD) sú hotové. v3 overená: 5 stránok bez chýb v konzole, navigácia OK, screenshoty v screens/v3/.
- v3 hero: model veľký v strede, orezaný spodkom, na začiatku naklonený a vpravo. Za ním obrovské číslo kroku (#bignum), okolo 2 až 3 naklonené karty (.step > .part, texty v index.html). Ukazovateľ „07 / 12“ vpravo dole.
- v3 podstránky (pages.css): mriežka 6 stĺpcov (.page::before), obrovské orezané slovo (.mega), asymetrické fotky (.pair, .pair.rev, .grid po 6).
- Technika: čisté HTML/CSS/JS, Three.js 0.160.0 cez importmap (unpkg), bez build nástroja, bez deployu. Lokálny server: `python3 -m http.server`.
- Súbory: index.html, style.css, main.js (hero a 3D), pages.css + 4 podstránky, assets/ (PLAYGROUND.svg, photos/, textures/ ambientCG CC0, obsah/ texty a 20 fotiek z pôvodného webu, IHRISKO.md s 12 krokmi stavby).
- Farby (style.css :root): --paper #F6F3EE, --navy #15194A, --blue #2A3290, --red #FF2712 (hlavný akcent), žltá #FECF03 a oranž #FE6738 len v modeli.
- Známe odchýlky modelu od fotiek: chýba vinylový strop nad bazénom, siete bez uzlov, šmykľavka bez bočných stien, svorky len na hlavných stĺpoch. Mobil neoverený.

## Otvorené úlohy
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
- Pôvodné rozhodnutia: model z jednoduchých tvarov podľa fotiek Šamorín, PBR textúry CC0, žiadne padanie dielov (fade a malý posun), logo biele SVG cez CSS mask, len lokálne.

## Posledné zmeny
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
Patrik pozrie v4 na localhost:8765 a napíše pripomienky. Potom commit.
