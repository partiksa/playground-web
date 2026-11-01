# KONTEXT: loso (redizajn play-ground.sk)

## Cieľ
Jedna hero stránka s 3D ihriskom z fotiek play-ground.sk. Ihrisko sa pri scrolle postaví.

## Štýl
fast. Overenie: runner raz na konci. Reviewer nie.
Menej prepracované: mobil a responzivita. Viac pozornosti: animácia, materiály, texty.

## Rozhodnutia
- Čisté HTML/CSS/JS + Three.js (bez build nástroja).
- Model z jednoduchých tvarov podľa fotiek, minimum štylizácie.
- Logo, farby, písmo z play-ground.sk. Rozloženie podľa skillu design-taste (smer quality).
- Fotky ihriska stiahnuť z play-ground.sk.
- Len lokálne, bez deployu.

## Čo tam nebude
Ďalšie stránky a sekcie, doladený mobil, deploy, fotogrametria, CMS.

## Overenie
Lokálny server, screenshot hero pri 0 %, 50 % a 100 % scrollu.

## Stav úloh
- [x] Brainstorming, návrh schválený (2026-11-01)
- [x] Analýza pôvodného webu: Kanit (Google Fonts), modrá #2A3290, červená #FF2712, žltá #FECF03, oranž #FE6738, text #666666
- [x] Assety v assets/: logo PLAYGROUND.svg, 8 fotiek (projekt Šamorín), IHRISKO.md (12 krokov stavby)
- [x] Stránka: index.html, style.css, main.js (Three.js 0.160.0 cez importmap, 500dvh scroll, 12 krokov stavby)
- [x] Overenie: konzola bez chýb, screenshoty screens/s0, s50, s100 (1440x900)
- [x] Git commit

## Známe odchýlky od fotiek
Bez miestnosti, hladké stĺpy, zjednodušená plachta a šmykľavka, redšie siete, tunel len rúra, chýbajú žlté valce na poschodí. Logo SVG je biele, preto modrý pás hore. Mobil neoverený.

## Verzia 2 (schválené 2026-11-01, štýl fast)
Požiadavka: luxusnejšie, plynulejšie, lepšie vysvetlené detaily, reálnejší model, náhľad podstránok.
- Menej prepracované: mobil a responzivita. Viac: animácia, materiály, texty.
- Model: PBR textúry CC0 (ambientCG alebo Poly Haven) na kov, gumu, koberec, sieť. Odrazy prostredia, jemné tiene, detaily spojov. Základné tvary zostanú.
- Animácia: diely sa jemne vynárajú (fade a malý posun), žiadne padanie. Kamera pomalá, dlhý easing, zaostrí na diel.
- Detaily: pri každom z 12 krokov popis dielu (nadpis a 1 až 2 vety) pri modeli.
- Farby: svetlá téma, hlboká navy (z #2A3290), teplá off-white, červená #FF2712 ako hlavný akcent (tlačidlá, čiary, zvýraznenia). Žltá a oranž len v modeli.
- Podstránky (základný náhľad, obsah z play-ground.sk): Interiérové ihriská, Realizované projekty, O nás, Kontakt. Spoločná hlavička a pätička.
- Mimo: zvyšných 8 podstránok, fotogrametria, doladený mobil, deploy.
- Overenie: runner raz na konci, screenshoty hero (0, 50, 100 %) a 4 podstránok.

### Stav v2
- [x] Hero: PBR textúry ambientCG CC0 (assets/textures/), RoomEnvironment, fade-in animácia, kamera zaostruje na diel, 12 kariet s popisom. Oranžová stena odstránená, vinyl stĺpov hladký.
- [x] Farby v style.css :root (--paper #F6F3EE, --navy #15194A, --red #FF2712). Logo cez CSS mask.
- [x] Podstránky: ihriska.html, projekty.html, o-nas.html, kontakt.html + pages.css. Obsah z assets/obsah/.
- [x] Overenie: 5 stránok bez chýb a 404, navigácia OK, CTA viditeľné. Commit.
- Odchýlky modelu: chýba vinylový strop nad bazénom, siete bez uzlov, šmykľavka bez bočných stien, svorky len na hlavných stĺpoch. Mobil neoverený.

## Ďalší krok
Patrik pozrie v2 a rozhodne o úpravách.
