#!/usr/bin/env node
/* Zverejnenie realizácií z adminu (dočasné riešenie, kým nie je automatické nasadenie, pozri ADMIN.md).
 *
 *   node scripts/publish.mjs               stiahne dáta z adminu, skonvertuje fotky, zbuildí web (bez nahrania)
 *   node scripts/publish.mjs --deploy      to isté + nahrá web, nové fotky a upravené dáta na server
 *   node scripts/publish.mjs --admin       nahrá admin (PHP) a pripraví priečinok /data na serveri
 *   --local <priečinok>                    namiesto servera číta dáta z lokálneho priečinka (test)
 *   --no-depth                             bez depth máp pre nové titulné fotky
 *
 * Server: SFTP alias „cpanel“ z ~/.ssh/config, web v /home2/hkjdxbcf/playground (Hostzone, len SFTP).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const REMOTE = "/home2/hkjdxbcf/playground";
const HOST = "cpanel";
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const LOCAL = has("--local") ? path.resolve(args[args.indexOf("--local") + 1]) : null;
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "pg-publish-"));

function run(cmd, a, opt = {}) {
  const r = spawnSync(cmd, a, { stdio: opt.input ? ["pipe", "inherit", "inherit"] : "inherit", input: opt.input, cwd: opt.cwd ?? ROOT });
  if (r.status !== 0 && !opt.soft) { console.error(`\nZlyhalo: ${cmd} ${a.join(" ")}`); process.exit(1); }
  return r.status === 0;
}
function sftp(lines, soft = false) {
  return run("sftp", ["-q", "-b", "-", HOST], { input: lines.join("\n") + "\n", soft });
}
/** stiahne súbor z /data na serveri (alebo skopíruje z --local) */
function fetchData(rel, dest) {
  if (LOCAL) { fs.copyFileSync(path.join(LOCAL, rel), dest); return; }
  sftp([`get "${REMOTE}/data/${rel}" "${dest}"`]);
}

/* ---------- admin ---------- */
if (has("--admin")) {
  const A = path.join(ROOT, "admin");
  if (!fs.existsSync(path.join(A, "config.php"))) { console.error("Chýba admin/config.php (pozri ADMIN.md)."); process.exit(1); }
  console.log("Nahrávam admin na server...");
  sftp([
    `-mkdir ${REMOTE}/admin`, `-mkdir ${REMOTE}/data`, `-mkdir ${REMOTE}/data/rz`, `-mkdir ${REMOTE}/data/rz/_u`, `-mkdir ${REMOTE}/data/banner`,
    `lcd ${A}`, `cd ${REMOTE}/admin`,
    "put index.php", "put api.php", "put lib.php", "put app.js", "put app.css", "put .htaccess", "put config.php",
    `put data.htaccess ${REMOTE}/data/.htaccess`,
  ]);
  // počiatočné dáta realizácií len vtedy, ak na serveri ešte nie sú (inak by sa prepísali zmeny klienta)
  if (!sftp([`ls ${REMOTE}/data/realizacie.json`], true)) {
    console.log("Na serveri nie sú dáta realizácií, nahrávam content/realizacie.json.");
    sftp([`put "${path.join(ROOT, "content/realizacie.json")}" ${REMOTE}/data/realizacie.json`]);
  }
  console.log("Admin: https://playground.sarkozypatrik.sk/admin/");
  process.exit(0);
}

/* ---------- 1. dáta z adminu ---------- */
console.log(LOCAL ? `Dáta z ${LOCAL}` : "Sťahujem dáta z adminu...");
const srcJson = path.join(TMP, "realizacie.json");
fetchData("realizacie.json", srcJson);
const items = JSON.parse(fs.readFileSync(srcJson, "utf8"));
if (!Array.isArray(items) || !items.length) { console.error("Dáta realizácií sú prázdne, končím bez zmeny."); process.exit(1); }

/* ---------- 2. nové fotky (data/rz/_u/*.jpg) -> public/rz/<slug>/NN.webp ---------- */
const map = {}; // stará cesta -> nová cesta
const touched = new Set(); // priečinky rz/<slug> so zmenou
const newCovers = [];
for (const it of items) {
  const dir = path.join(ROOT, "public/rz", it.slug);
  const fresh = [...new Set([...it.photos, it.cover])].filter((p) => p.startsWith("data/"));
  if (!fresh.length) continue;
  fs.mkdirSync(dir, { recursive: true });
  let n = Math.max(0, ...fs.readdirSync(dir).map((f) => parseInt(f, 10)).filter(Number.isFinite));
  for (const p of fresh) {
    const name = String(++n).padStart(2, "0") + ".webp";
    const tmp = path.join(TMP, path.basename(p));
    fetchData(p.slice("data/".length), tmp);
    run("cwebp", ["-quiet", "-q", "80", "-metadata", "none", "-resize", "1800", "0", "-resize_mode", "down_only", tmp, "-o", path.join(dir, name)]);
    map[p] = `rz/${it.slug}/${name}`;
    console.log(`  ${p} -> ${map[p]}`);
  }
  touched.add(it.slug);
  if (it.cover.startsWith("data/")) newCovers.push(map[it.cover]);
}
const fix = (list) => list.map((it) => ({ ...it, cover: map[it.cover] ?? it.cover, photos: it.photos.map((p) => map[p] ?? p) }));

/* titulné fotky dostanú depth mapu (efekt pri pohybe myšou), ako ostatné karty */
if (newCovers.length && !has("--no-depth")) {
  console.log("Depth mapy pre nové titulné fotky...");
  run("uv", ["run", "-q", "--with", "torch", "--with", "transformers", "--with", "pillow", "python", "-I",
    path.join(ROOT, "scripts/depth.py"), ...newCovers.map((c) => path.join(ROOT, "public", c))], { soft: true });
}

/* ---------- 3. content/realizacie.json (bez pomocného poľa manual) a build ---------- */
const clean = fix(items).map(({ manual, ...rest }) => rest);
fs.writeFileSync(path.join(ROOT, "content/realizacie.json"), JSON.stringify(clean, null, 2) + "\n");
console.log(`Realizácie: ${clean.length}, nové fotky: ${Object.keys(map).length}. Build...`);
run("npm", ["run", "build"]);

if (!has("--deploy")) { console.log("\nHotovo lokálne (bez nahrania). Náhľad: out/. Nahratie: node scripts/publish.mjs --deploy"); process.exit(0); }
if (LOCAL) { console.error("--deploy s --local nie je povolený."); process.exit(1); }

/* ---------- 4. nahratie ---------- */
console.log("Nahrávam web...");
sftp([
  `lcd ${path.join(ROOT, "out")}`, `cd ${REMOTE}`,
  "put -R _next", "put -R _not-found", "put -R 404", "put -R cz", "put -R de", "put -R en", "put -R sk", "put -R js",
  "put 404.html", "put index.html", "put index.txt", "put __next.*.txt", "put llms.txt", "put robots.txt", "put sitemap.xml",
  "-mkdir rz", "cd rz",
  ...[...touched].flatMap((s) => [`-mkdir ${s}`, `put -R rz/${s}`]),
]);

/* dáta na serveri: znova stiahnuť (klient medzitým mohol niečo zmeniť) a len prepísať cesty k fotkám */
if (Object.keys(map).length) {
  const again = path.join(TMP, "again.json");
  fetchData("realizacie.json", again);
  const out = path.join(TMP, "out.json");
  fs.writeFileSync(out, JSON.stringify(fix(JSON.parse(fs.readFileSync(again, "utf8"))), null, 2) + "\n");
  sftp([`put "${out}" ${REMOTE}/data/realizacie.json`]);
}
console.log("\nZverejnené: https://playground.sarkozypatrik.sk/sk/realizacie/ (otvor s Cmd+Shift+R)");
