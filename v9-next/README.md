# PLAYGROUND web (v9-next)

Statický web (Next.js 16, export do `out/`), jazyky SK, CZ, EN, DE. Bez servera, databázy a prihlásenia. Formulár len otvorí `mailto:`.

## Build

- `npm run build` vytvorí `out/`
- náhľad: `cd out && python3 -m http.server 8947 --bind 127.0.0.1`

## Bezpečnosť: na čo sa pozrieť

Zoznam útokov sme prešli 2026-11-15. Web je statický, preto sa väčšina netýka nás. Čo sa týka, treba riešiť.

### Týka sa kódu a servera webu

- [ ] Hlavičky v `public/.htaccess`. Živý web posiela len `X-Content-Type-Options` a `Referrer-Policy`. Chýba:
  - CSP (pozor: statický export nemá nonce, inline skripty Next.js a import map vyžadujú `'unsafe-inline'` alebo hashe),
  - HSTS (najprv krátky `max-age`),
  - `X-Frame-Options` a `frame-ancestors`,
  - Permissions-Policy,
  - COOP.
- [ ] HTTPS presmerovanie. `http://` vracia 200, presmerovanie v `.htaccess` je zakomentované.
- [ ] Unicode a vstup vo formulári: `public/js/kontakt.js` vkladá `?co=` do CSS selektora. Zlá hodnota zhodí skript formulára. Povoliť len známe hodnoty.
- [ ] Zakázať v `.htaccess` prístup k dot-súborom, zálohám a mapám zdrojov.
- [ ] `npm audit` pred každým nasadením.
- [ ] Cache poisoning: nízke riziko (statika, nič sa neodráža z hlavičiek). Pri zmene `Cache-Control` pre HTML skontrolovať znova.

### Týka sa hostingu a účtov (nie kódu)

- [ ] HTTP/2 rapid reset a request smuggling: rieši server (LiteSpeed u Hostzone), alebo Cloudflare pred webom. Opýtať sa hostingu na záplaty, alebo zvážiť Cloudflare.
- [ ] n0AUTH email spoof: skontrolovať SPF, DKIM a DMARC pre `play-ground.sk`.
- [ ] 2FA na cPanel, GitHub a Cloudflare. SFTP radšej cez kľúč.

### Týka sa až pri backende formulára

- [ ] Spoofed IP header: rate limit podľa skutočnej IP (`CF-Connecting-IP` za Cloudflare), nie podľa `X-Forwarded-For`.
- [ ] ReDoS: regexy na serveri bez vnorených kvantifikátorov. Teraz je jediný regex kontrola prípony súboru.
- [ ] Validácia vstupu, limit veľkosti, Turnstile alebo iná ochrana proti botom, bez e-mailových hlavičiek zo vstupu.
- [ ] Tokeny len z `crypto.getRandomValues`, nie `Math.random`. Teraz sa `Math.random` používa len na vizuály (loptičky, ID v SVG).

### Netýka sa (web nemá účty, API ani databázu)

52 character username, SAML bypass, GraphQL aliases, 2FA code replay (v kóde), JWT alg confusion, Views bypass RLS, Timing attack, Padding oracle, Template injection, XXE file read, Websocket hijack, Prototype pollution.
Ak pribudne prihlásenie, API alebo databáza, prejsť zoznam znova.

### Už v poriadku

- Všetky skripty a 3D knižnice sú lokálne (bez CDN).
- `dangerouslySetInnerHTML` sa používa len pre pevné reťazce a JSON-LD s escapovaným `<`.
- V `out/` nie sú `.map`, `.md`, `.env` ani zálohy.
