# Zadanie od klienta (PLAYGROUND, s.r.o.)

Zdroj: odpovede z Google formulára (2026-11-02) a súhrn session z iného počítača (2026-11-03). Týmto sa riadime pri návrhu a stavbe. Pri rozpore s KONTEXT.md platí tento súbor, dôvody a zmeny sú v sekcii „Rozpory“.

## Firma
- PLAYGROUND, s.r.o., Poštová 6562/20, 917 01 Trnava, IČO 47051990
- +421 905 724 437, info@play-ground.sk
- Údaje (roky pôsobenia, počet projektov a revízií) treba od klienta. Starý web uvádza „13 rokov“, copyright 2023, počítadlá bez čísel. Nič nedopĺňať bez overenia.

## Čo chce klient
- Cieľ: nové zákazky. Hlavná priorita je SEO a prvá strana Google. Terajšia pozícia je na 2. strane, hoci podľa klienta patria prvé priečky.
- Zákazníci: rodinné centrá, kaviarne, hotely, škôlky a ďalší. Krajiny: SK, CZ, DE, AT.
- Hlavná ponuka: nové ihriská, prerábka a sťahovanie starých. Revízie, vonkajšie ihriská a nafukovacie atrakcie len okrajovo.
- Terajší web: pomalý, nemoderný dizajn, slabé SEO. Nič, čo funguje dobre.
- Stránky: Úvod, Ihriská na mieru, Prerábka starých ihrísk, Revízie, Realizácie, O nás, Kontakt. Klient sa pýtal, či všetko pôjde na jednom scrolle.
- Jazyky: SK, EN, DE.
- Texty: upraviť terajšie a doplniť nové, hlavne kľúčové slová.
- Vzhľad: zachovať len logo. Moderný, pohyblivý. „Ihriská musia žiť, hýbať sa, hýriť farbami.“
- Fotky a dizajny: klient má veľa.
- AI vizuály: áno, jednoznačne. Námety: stavanie ihriska, lietajúce loptičky, dieťa na šmykľavke.
- Nové funkcie: dopytový formulár áno. Interaktívny model, v ktorom si zákazník postaví ihrisko, klient nevie predstaviť („nech to zákazník nenavrhuje sám“). Kalkulačka ceny nevyjadrená.
- SEO: „môj primárny zámer“.
- Reklamy: ak je nutné, áno. Platené reklamy na Slovensku mu veľmi nepomáhali. Chce, aby sme navrhli, čo je nutné a dáva zmysel.
- Prístupy: má doménu, hosting aj admin terajšieho webu (WordPress).
- Admin: veľmi jednoduchý, len pridávanie fotiek a akcií.
- Starostlivosť po spustení: chce web bez nutnosti ďalšej starostlivosti.
- Termín: žiadny pevný, zmena je nutná čo najskôr.
- Rozpočet: neuvedený. Chce od nás návrh a cenu toho, čo je nutné.

## Rozpory a dôsledky
- Klient: len logo zostáva. KONTEXT.md: zostáva logo, farby, Kanit. Teda farby a písmo sa môžu meniť (nová identita s červenou je v súlade).
- Klient chce SEO a jeden dopyt „na jednom scrolle?“. Odporúčanie z druhého počítača: viac samostatných stránok, nie jeden scroll. Hero so 3D ihriskom môže ostať na úvode, ostatné ako samostatné URL.
- Klient chce web bez údržby. Žiadny web nejde bez údržby (aktualizácie, zálohy). Navrhnúť ročný paušál a povedať to klientovi priamo.
- Klient nechce interaktívny konfigurátor. 3D ihrisko ostáva len ako animácia stavby (hero), nie nástroj pre zákazníka.
- Aktuálne loso je čisté HTML/CSS/JS bez adminu. Klient chce jednoduchý admin, to je potrebné riešiť pred ostrým nasadením.

## Z druhého počítača (Samuel, 2026-11-03)
Platí pre rovnaký projekt play-ground.sk. Pracovné priečinky sú na Samuelovom Macu (`~/Desktop/AI/web-ai/play-ground/`, `~/Desktop/AI/media-engine/`), tu nie sú.

### Zistenia zo súčasného webu
- Sitemap má 267 URL, z toho 246 v `/portfolio/`. Pri prechode zachovať alebo presmerovať 301.
- Úvod má dve H1 a 6 obrázkov bez alt textu.
- 17 titulkov sa opakuje, 8 stránok nemá popis.
- PageSpeed sa nepodarilo zmerať (limit API).
- V HTML je 267 stránok stiahnutých na Samuelovom Macu, fotky nie sú stiahnuté.

### Pravidlá návrhu
- Žiadne zbytočné pod-texty.
- Prvé kolo: úvod a jedna podstránka (Ihriská na mieru).
- Dizajn neriešiť slovnými otázkami, ukázať reálne stránky.
- Realizácie len zo skutočných fotiek, aby AI vizuál nepôsobil ako hotová zákazka.
- Fotky skutočných detí nenahrávať do AI.

### Gemini media engine (použiteľné pre náhradu 3D modelu animáciou)
- Obrázky: `gemini-nano-banana-2.1`. Video: `gemini-omni-1.1-flash`.
- Ceny: obrázok 1K 0,0336 USD, 2K 0,0504 USD, video 720p asi 0,10 USD/s (reálne 10 s stálo 1,01 USD).
- Video len 16:9 alebo 9:16. Jedno generovanie 10 s, predĺženie do 40 s.
- Veo 3.1 Preview v Gemini API skončilo 22. 10. 2026. Poznámka: KONTEXT.md plánuje Seedance, alternatíva je Gemini (video otočky vyšlo veľmi dobre).
- Video nemá priehľadné pozadie, vidno obdĺžnik. Pri animácii stavby riešiť pozadie (napr. rovnaká farba pozadia webu).
- Pred každým plateným krokom ukázať cenu a čakať na súhlas. Strop 10 EUR na projekt.

### Prístupy, ktoré sa pýtajú od klienta
- Žiadne heslá. Klient pridá firemný účet s obmedzenou rolou: Google Business Profile (manažér), Search Console (úplný používateľ), WordPress (vlastný admin, po práci zmazať), GA4 len ak sa bude merať.
- Reklamy (Google Ads, Meta) riešiť až po spustení webu.
- Hotový návrh správy klientovi je v súhrne od Samuela. Neodoslaný, chýba e-mail.

### Doména a nasadenie (pasce)
- Držiteľ domény podľa whois: Martin Lošonský - Escape Media, nie PLAYGROUND, s.r.o. Registrátor Webglobe, platnosť do 6. 3. 2027. Vyriešiť pred spustením.
- DNS ukazuje na `nic.sk` / `nichosting.sk`. Poskytovateľ nie je potvrdený.
- `webmail` a `pop` ukazujú na hlavnú doménu. Pred prepnutím nastaviť priamo na starú IP `212.57.32.72`.
- MX záznamy (`mx-hub`) sa nesmú meniť. Starý hosting nerušiť, kým poskytovateľ nepotvrdí, že na ňom nezávisí pošta.
- Odporúčanie Samuela (nepotvrdené): Next.js a Laravel admin na malom VPS cez Ploi. Alternatívy: statický Next.js, alebo WordPress s vlastnou šablónou.
- Postup: testovacia adresa blokovaná pred Googlom, 301 pre 267 URL, po súhlase klienta znížiť TTL a zmeniť len záznam A pre doménu a `www`.
- Kontaktný formulár: Resend na `info@`, Reply-To zákazníkovi, záznamy ideálne pre subdoménu.
- Údržba: ročný paušál (hosting, zálohy, aktualizácie), v zmluve záväzok odovzdať kód a dáta. Cena nepočítaná. Zmluvu o spracovaní údajov (čl. 28 GDPR) overiť právne.

### SEO
- Pre AI Overviews a AI Mode netreba nič špeciálne, platí bežné SEO. Neblokovať Googlebot a `OAI-SearchBot`.
- Každá služba a mesto majú mať vlastnú stránku s konkrétnymi faktami.
- `llms.txt` nepomáha.
- Samostatná stránka s recenziami sa neoplatí. Lepšie: skutočné recenzie v Google Business Profile, na Firmy.cz (CZ) a podstránka s referenciami so súhlasom klientov.
- Meranie: Search Console hneď, GA4 až keď treba. GA4 by vyžadovalo cookie lištu.
- Plugin `claude-seo` je nainštalovaný u Samuela, audit ešte nebežal.

### Otvorené rozhodnutia (Samuel)
1. Potvrdiť stack (Next.js + Laravel admin na VPS).
2. Potvrdiť samostatný VPS (platená služba).
3. Rozpočet na AI vizuály (odporúčanie 10 EUR).
4. Povedať „ideme“ na prvé kolo.
5. Dodať e-mail na prístupy pre správu klientovi.

### Pravidlá
- Pred nasadením, zmenou DNS, platenou službou a odoslaním čohokoľvek zákazníkovi vždy najprv súhlas.
- Normy, čísla a referencie nedopĺňať bez overenia.
