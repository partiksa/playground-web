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

## Ďalší krok
Patrik pozrie stránku a rozhodne o úpravách.
