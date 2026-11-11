# Fotky na jemnú úpravu (ChatGPT)

Pravidlá:
- Upravuje sa len svetlo, farby, perspektíva a neporiadok. Ihrisko (konštrukcia, farby, prvky) musí ostať presne také, aké je. Sú to fotky skutočných realizácií.
- Fotky, na ktorých sú deti, do AI nenahrávať. Tie sú v časti C, rieši sa to orezom.
- Originály ostávajú v `assets/`. Upravenú fotku ulož pod rovnakým názvom do `v9/img/` alebo `v9/rz/<projekt>/` (webp, dlhšia strana 1600 až 1800 px).
- Pri fotkách v `img/` treba po úprave prerobiť aj depth mapu (`-d.webp`), inak efekt hĺbky nesedí. Ak nová depth mapa nebude, súbor `-d.webp` zmaž a fotka bude bez efektu.

Spoločný začiatok promptu (vlož pred každý konkrétny prompt):

```
Edit this photo subtly for a professional company website. This is documentation of a real indoor playground,
so keep the playground exactly as it is: same structure, same colours, same proportions, same elements, same position.
Do not add, remove or move any part of the playground. Do not add people, text or logos.
Keep the same framing and aspect ratio. Photorealistic, natural light, no HDR look, no oversaturation.
```

## A. Najviditeľnejšie (obálky a veľké zábery)

| Súbor | Kde je na webe | Čo nesedí | Prompt (za spoločný začiatok) |
|---|---|---|---|
| `img/projekt-01.webp` (Králův Dvůr) | Realizácie, Prerábka: karta | Na podlahe náradie, rebrík, káble, nečistota po montáži | `Remove the tools, ladder, cables, boxes and construction debris from the floor and the carpet. Clean the carpet. Neutral white balance, slightly brighter.` |
| `img/projekt-12.webp` (Karviná, tubing) | Realizácie, Úvod: realizácie | Ploché svetlo, modrý nádych | `Correct the blue colour cast to a neutral white balance, add gentle contrast and clarity, keep the window light natural.` |
| `img/projekt-08.webp` (Praha) | Realizácie | Bledé, sivé svetlo | `Neutral white balance, slightly warmer and brighter, gentle contrast. Straighten the vertical lines of the walls and posts.` |
| `rz/oravice/07.webp` (Oravice) | Realizácie: obálka, Ihriská: karta | Šikmé vertikály, tmavé okraje | `Straighten converging verticals, brighten the dark left and right edges, neutral white balance.` |
| `img/samorin-5671.webp`, `img/samorin-5679.webp`, `img/samorin-5684.webp` | O nás: Pohľad zvnútra | Silné skreslenie širokouhlého objektívu, oranžový nádych | `Correct the wide-angle lens distortion so straight posts and edges are straight, reduce the strong orange colour cast to a natural warm white, keep the colours of the playground.` |
| `img/samorin-5667.webp` | O nás: veľký pás | Teplý nádych, sklon | `Straighten the verticals, slightly reduce the orange cast on the walls, keep the floor and playground colours.` |

## B. Galérie realizácií (detail po kliknutí)

| Súbor | Čo nesedí | Prompt (za spoločný začiatok) |
|---|---|---|
| `rz/trnava/01.webp` | Čierne vrece a odpad v popredí | `Remove the black plastic bag and the rubbish in the foreground, fill the floor with the matching floor pattern.` |
| `rz/praha/01.webp` | Náradie a obaly na podlahe | `Remove the tools, packaging and loose parts from the floor.` |
| `rz/kraluv-dvur/02.webp`, `rz/kraluv-dvur/03.webp` | Náradie, rebrík, nečistota | `Remove the tools, ladder and construction debris from the floor, clean the carpet.` |
| `rz/oravice/01.webp` až `rz/oravice/05.webp` | Montáž v procese, náradie, pracovníci | Odporúčam tieto zábery nechať ako dokumentáciu montáže a zo zábery vybrať len `rz/oravice/06.webp` až `08.webp` ako hlavné. Ak predsa: `Remove the tools, cables and packaging from the floor. Keep the workers' scene unchanged if removing would change the playground.` |
| `rz/pezinok/01.webp` | Montáž, rebrík | `Remove the ladder and tools around the structure.` |

## C. Neposielať do AI

- `rz/uhersky-brod/04.webp`: na šmykľavkách sú deti. Riešiť orezom alebo z galérie vyradiť.
- `img/projekt-05.webp` (Pezinok, Ihriská na mieru sekcia 01 a karta na úvode): v konštrukcii lezie osoba, vek sa nedá určiť. Do AI neposielať. Ak vadí, orezať alebo nahradiť `rz/pezinok/10.webp`. Svetlo sa dá upraviť v bežnom editore (jas, vyváženie bielej).
- `rz/uhersky-brod/07.webp`, `rz/klatovy/05.webp`, `img/projekt-06.webp`: sú na nich dospelí. Do AI ísť môžu s doplnkom `Remove the people and fill the area with the matching background.` Obálku Klatov a kartu „Revízie a servis“ na úvode som už vymenil za `rz/klatovy/02.webp` (bez ľudí).
- Úzke panorámy `rz/hlohovec/01.webp`, `rz/hlohovec/06.webp`, `rz/uhersky-brod/01.webp`, `rz/oravice/09.webp`: sú skreslené a v galérii pôsobia ako pásik. Dopĺňanie okolia (outpainting) by vymyslelo priestor, ktorý neexistuje. Odporúčam ich z galérie vyradiť.

## D. Nové zábery (ak chcete viac atmosféry)

Na Revíziách je jedna AI ilustrácia (ruka pri sieti) a je na webe označená ako ilustrácia. Ďalšie AI zábery dávať len ako ilustrácie, nie ako realizácie.
