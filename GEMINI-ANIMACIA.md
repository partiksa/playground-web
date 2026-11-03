# Gemini animácia pre hero (play-ground.sk, v5)

Pointa: 10 s video 16:9 (a 9:16 pre mobil) na papierovom pozadí `#F6F3EE`, kde sa z jednoduchých farebných dielov postaví ihrisko. Najprv kľúčový obrázok (nano-banana), potom video z neho (omni-flash). Celý plán vyjde asi na 5 až 6 EUR. Nič sa negeneruje bez Patrikovho súhlasu s cenou.

## 1. Cieľ a umiestnenie
- Kde: hero na úvode, nad nadpisom „Ihriská na mieru“. Nahradí alebo doplní terajšiu 3D animáciu (`v5/hero.js`, 280vh, scroll).
- Rozhodnutie pred generovaním (Patrik): náhrada alebo doplnok?
  - Doplnok (odporúčané): 3D model ostáva pre scroll, video ide ako krátky úvod alebo pozadie.
  - Náhrada: video sa neviaže na scroll. Scroll by sa dal zachovať len cez prehrávanie po snímkach (iná technika, samostatná úloha).
- Formáty: 16:9 pre desktop, 9:16 pre mobil. Iné pomery model nevie.
- Dĺžka: 10 s (jedno generovanie). Predĺženie (do 40 s) len ak 10 s nestačí.
- Slučka: video sa stavia a na konci drží hotový celok. Plynulá slučka sa rieši na webe (viď bod 6), nie v modeli.
- Texty a logo do videa nedávať. Nadpis je HTML.

## 2. Vizuálny štýl
- Pozadie: plná rovná farba `#F6F3EE` (web `--paper`), žiadny prechod, žiadna podlaha, len jemný mäkký tieň pod ihriskom (v 3D je to `ShadowMaterial` s nízkou krytosťou).
- Farby dielov (z modelu v `hero.js` a `IHRISKO.md`):
  - tmavočervená `#B0291F` (stĺpy)
  - web červená `#FF2712` (akcent, malé plochy)
  - oranžová `#F08A1C`
  - žltá `#F2C21B`
  - modrá `#3F77C9` (šmykľavka)
  - navy `#15194A` (len detaily, čierne siete `#111111`)
  - ružová `#E58BA0` (guľôčky)
- Svetlo: mäkké denné, zhora vpravo spredu (rovnako ako slnko v 3D: pozícia 5, 11, 8), jemné vyplnenie zľava. Žiadne tvrdé tiene, žiadny lesk.
- Kamera: pevná, mierne zhora (asi 25 až 30 stupňov), objektív ako 50 mm, ihrisko v strede, okolo voľné pozadie (pre text). Pomalý jemný posun alebo otočka max. 15 stupňov.
- Tempo: pomalé, plynulé, diely sa objavujú po jednom (fade a malý posun, bez padania, ako v 3D modeli).
- Vzhľad: čisté hladké tvary z mäkkého vinylu, štýl 3D ilustrácie, nie fotorealizmus.
- Zakázané: reálne deti, tváre, ľudia v detaile, text, logá, vodoznaky, vzhľad hotovej zákazky. Ak sa objaví postava, len jednoduchá bezvýrazná figúrka bez tváre (alebo bez postáv).
- Fotky skutočných detí do AI nenahrávať. Ako referencia sa môže použiť len náš render (`video/snimka-zaciatok.png`, `video/snimka-koniec.png`), nie fotky z realizácií.

## 3. Postup
1. Kľúčový obrázok koncového stavu (hotové ihrisko) cez `gemini-nano-banana-2.1`, 16:9, 1K. Kontrola: pozadie presne `#F6F3EE`, žiadne tváre, žiadny text.
2. Voliteľne obrázok začiatku (prázdne pozadie alebo prvý diel), ak model podporuje začiatočnú a koncovú snímku. Inak stačí jeden obrázok.
3. Video cez `gemini-omni-1.1-flash` z kľúčového obrázka, 16:9, 720p, 10 s.
4. Kontrola farby pozadia na prvej a poslednej snímke (viď bod 6). Ak sa líši, doladiť na webe.
5. Ak sa osvedčí, 9:16 verzia (nový kľúčový obrázok 9:16, nie orez).
6. Predĺženie len ak 10 s nestačí (stavba nie je dokončená). Každých ďalších 10 s je ďalší platený krok.
- Pred každým krokom: ukázať cenu a počkať na súhlas. Strop 10 EUR na celý projekt.
- Oprava: ak obrázok nesedí, opraviť obrázok (lacné), nie generovať nové video.

## 4. Prompty (angličtina)

### Spoločný blok (pridať na koniec každého promptu)
```
Style: clean soft 3D illustration, smooth matte vinyl surfaces, simple rounded geometric shapes, gentle global illumination, soft daylight from upper right front, very soft contact shadow under the object only. Background: perfectly flat solid color #F6F3EE, no gradient, no floor texture, no horizon, no vignette. Color palette limited to dark red #B0291F, red #FF2712, orange #F08A1C, yellow #F2C21B, blue #3F77C9, black #111111 and pink #E58BA0. Object centered with generous empty space around it. Static camera at a slight high angle, 50 mm lens.
```

### Negatívne pokyny (spoločné)
```
No people, no children, no faces, no hands, no text, no letters, no logos, no watermark, no photorealism, no real room, no walls, no windows, no ceiling, no floor pattern, no gradient background, no dramatic lighting, no lens flare, no motion blur, no camera shake, no fast cuts, no falling or bouncing parts, no extra objects.
```

### Variant A: stavba ihriska po moduloch (hlavný)
Kľúčový obrázok (nano-banana, 16:9):
```
A finished modular indoor kids playground, seen from a slight high angle: a two-level cage-like structure with dark red soft-wrapped vinyl columns, orange and yellow padded horizontal bars, black rope-net sides, a yellow vinyl roof panel, a blue open slide leading down into a small ball pit filled with pink, yellow and white balls, soft red floor mats, two yellow pyramid-shaped soft blocks on the upper level. Toy-like, simplified, no people.
[Spoločný blok]
```
Video (omni-flash, 16:9, 10 s, vstup: kľúčový obrázok):
```
Time-lapse assembly of the playground shown in the reference image. Start with an empty flat #F6F3EE background. Over 10 seconds the parts appear one by one, each with a gentle fade-in and a tiny upward slide of a few centimeters, in this order: soft red floor mats, dark red columns, orange and yellow horizontal bars, upper-level floor with yellow pyramids, ball pit with colored balls, blue slide, black nets on the sides, yellow roof panel. Parts never fall or bounce. The camera is almost static with a very slow smooth orbit of about 10 degrees to the right. In the last 2 seconds the finished playground holds still. Calm, steady pace.
[Spoločný blok] [Negatívne pokyny]
```

### Variant B: lietajúce loptičky
Kľúčový obrázok (nano-banana, 16:9):
```
Many colorful smooth balls (pink, yellow, orange, red, blue, white) floating in the air in a loose cloud arranged around a small empty central area, a small blue slide partly visible at the bottom center. Toy-like, simplified, no people.
[Spoločný blok]
```
Video (omni-flash, 16:9, 10 s):
```
The colorful balls float slowly upward and drift gently in a soft swirl, then settle in a loose arc that gathers into a ball pit at the base of the small blue slide. Slow, weightless, smooth movement, balls keep their size and shape, no collisions, no bouncing. Static camera, very slight push-in. Large empty areas of flat #F6F3EE background stay visible at the top and left for a headline.
[Spoločný blok] [Negatívne pokyny]
```

### Variant C: figúrka na šmykľavke (len ak Patrik chce)
Kľúčový obrázok (nano-banana, 16:9):
```
A simple faceless toy figure made of a smooth rounded yellow capsule body with no facial features, sitting at the top of a blue open slide attached to a dark red and orange playground frame. Minimalist, abstract, clearly not a real child.
[Spoločný blok]
```
Video (omni-flash, 16:9, 10 s):
```
The faceless toy figure slides down the blue slide at a calm steady speed, lands softly in a pink, yellow and white ball pit, and the balls gently ripple. Then the figure is lifted out of the frame by nothing visible and the scene returns to its starting state, ready for a loop. Static camera.
[Spoločný blok] [Negatívne pokyny, bez "no people" a "no faces", doplniť: no realistic child, no facial details]
```
- Riziko: postava môže vyzerať ako dieťa. Variant C je najrizikovejší a najmenej odporúčaný.

### 9:16 verzia
- Nový kľúčový obrázok s textom na začiatku: `Vertical 9:16 composition, object centered in the lower two thirds, empty #F6F3EE space in the upper third.` Zvyšok promptu rovnaký ako vo variante A.

## 5. Odhad ceny
Podklad z `KLIENT.md`: obrázok 1K 0,0336 USD, video 720p asi 0,10 USD/s (reálne 10 s stálo 1,01 USD). Prepočet je konzervatívne 1 USD = 1 EUR (reálny kurz je o niečo priaznivejší).

| Krok | Počet | Cena za kus | Spolu |
|---|---|---|---|
| Kľúčový obrázok 1K (A, B, 9:16, opravy) | 6 | 0,034 | 0,20 |
| Video A 16:9, 10 s | 2 (jeden pokus navyše) | 1,01 | 2,02 |
| Video A 9:16, 10 s | 1 | 1,01 | 1,01 |
| Video B 16:9, 10 s | 1 | 1,01 | 1,01 |
| Spolu odporúčaný plán | | | asi 4,24 USD |
| Rezerva: predĺženie A o 10 s | 1 | 1,01 | 1,01 |
| Rezerva: ďalší pokus A alebo B | 2 | 1,01 | 2,02 |
| Spolu s rezervou | | | asi 7,27 USD |

- Obrázky v 2K (0,0504 USD) nie sú treba, pre video stačí 1K.
- Variant C a 40 s verzia by pridali 3 až 4 EUR. Stále pod stropom 10 EUR, ale rezerva by sa zúžila.
- Reálna cena videa sa môže líšiť od 0,10 USD/s. Po prvom videu prepočítať a upraviť plán.
- Poradie: najprv A 16:9. Ak vyjde, ďalej. Ak nie, zmeniť prompt pred ďalším platením.

## 6. Vloženie na web
Video tag (do hero v `v5/index.html`):
```html
<video class="hero-video" autoplay muted loop playsinline preload="metadata"
       poster="assets/hero/hero-poster.jpg" width="1920" height="1080">
  <source media="(max-width: 700px)" src="assets/hero/hero-9x16.mp4" type="video/mp4">
  <source src="assets/hero/hero-16x9.mp4" type="video/mp4">
</video>
```
- Pozícia: `position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:0`. Text a hlavička nad ním.
- Poster: posledná snímka videa (hotové ihrisko), JPG, do 150 kB. Zobrazí sa pri načítaní a pri `prefers-reduced-motion`.
- `prefers-reduced-motion: reduce`: video sa nespúšťa, ostane poster. Cez JS `video.pause()` a `video.removeAttribute('autoplay')`, alebo `<picture>` a skrytie videa v CSS:
```css
@media (prefers-reduced-motion: reduce) { .hero-video { display: none; } .hero-poster { display: block; } }
```
- Farba pozadia: video kompresia mierne posunie `#F6F3EE`. Riešenie: zmerať farbu rohu prvej snímky (`ffmpeg`/screenshot) a nastaviť rovnakú farbu ako `background` hero, alebo okraje zjemniť `mask-image: radial-gradient(...)`. Skontrolovať pri otvorení stránky, že nie je vidieť obdĺžnik.
- Slučka: video drží hotové ihrisko na konci. Plynulú slučku urobiť ffmpeg prelínaním posledných 1 s s prvým (`xfade`), alebo namiesto `loop` použiť po skončení fade späť na poster a restart po pauze.
- Veľkosť súboru (cieľ pre rýchly web, SEO):
  - 16:9: 1280x720, H.264, bez zvuku, CRF 26 až 28, +faststart: asi 1 až 2 MB na 10 s (cieľ do 2 MB).
  - 9:16: 720x1280, rovnako, do 1,5 MB.
  - Voliteľne WebM (VP9) ako prvý `<source>`, o 30 % menší.
  - Príkaz: `ffmpeg -i in.mp4 -an -vf scale=1280:-2 -c:v libx264 -crf 27 -preset slow -movflags +faststart hero-16x9.mp4`
- Načítanie: `preload="metadata"`, video mimo kritickej cesty (LCP je poster). Mobil na pomalej sieti: ak `navigator.connection.saveData`, video nenačítať.
- Súbory dať do `v5/assets/hero/` (`v5/assets` je symlink na `../assets`, teda `assets/hero/`).

## Otvorené (Patrik)
1. Doplnok alebo náhrada 3D modelu?
2. Ktoré varianty spustiť (odporúčané: A, potom B)?
3. Súhlas s cenou prvého kroku (kľúčový obrázok A, asi 0,034 USD).
