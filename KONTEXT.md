---
stav: rozpracovaný
---
# loso (redizajn play-ground.sk)

Posledná aktualizácia: 2026-11-01 15:25

## Cieľ
Moderný web firmy PLAYGROUND (interiérové detské ihriská, Trnava) s 3D ihriskom, ktoré sa pri scrolle postaví. Identita zo starého webu: logo, farby, písmo Kanit.

## Stav
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
Mimo v3: zvyšných 8 podstránok z menu, doladený mobil, deploy, nové detaily 3D modelu, fotogrametria, CMS.

## Rozhodnutia
- Zostane: farby, logo, písmo Kanit, 3D ihrisko a 12 krokov. Všetko ostatné sa môže meniť (rozloženie, texty, prechody), čo nesedí.
- Prístup 1 z Awwwards inšpirácie: objekt v strede s kartami okolo (More Nutrition), tenké čiary a veľa bielej na podstránkach (MECHA). Nick Ho nemá 3D hero, použiteľné je len obrovské číslo ako hrdina. Videné boli len statické snímky, pohyb nie.
- Štýl v3: medium. Verzia v tom istom priečinku, nový commit.
- Pri session nad 50 % limitov: builder na haiku tam, kde to ide.
- Pôvodné rozhodnutia: model z jednoduchých tvarov podľa fotiek Šamorín, PBR textúry CC0, žiadne padanie dielov (fade a malý posun), logo biele SVG cez CSS mask, len lokálne.

## Posledné zmeny
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
Patrik pozrie v3 lokálne (`python3 -m http.server`) a rozhodne: ladiť v3, mobil, alebo ďalšie podstránky.
