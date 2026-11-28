#!/usr/bin/env bash
# Build a zverejnenie webu PLAYGROUND na serveri (Hetzner, používateľ playground).
#   server/zverejnit.sh           build vždy (po git pull, pri nasadení)
#   server/zverejnit.sh --cron    len ak admin nastavil príznak www/data/.zverejnit (cron každú minútu)
# Postup: realizácie z adminu → content/realizacie.json a public/rz, next build, rsync out/ → www/.
# www/data (admin dáta a fotky), www/admin a www/api sa pri rsync nemažú.
set -euo pipefail

SITE_DIR="${SITE_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
APP="$SITE_DIR/v9-next"
WWW="$SITE_DIR/www"
DATA="$WWW/data"
CFG="$HOME/pg-config.php"
LOG="$HOME/zverejnit.log"

exec 9>"$HOME/.zverejnit.lock"
if ! flock -n 9; then echo "Build už beží." >&2; exit 0; fi

if [[ "${1:-}" == "--cron" ]]; then
  [[ -f "$DATA/.zverejnit" ]] || exit 0
  exec >>"$LOG" 2>&1
  echo "=== $(date "+%F %T") zverejnenie z adminu"
fi
rm -f "$DATA/.zverejnit"

mkdir -p "$DATA/rz/_u" "$DATA/banner" "$DATA/rz-web" "$WWW/admin" "$WWW/api"
cd "$APP"

# prvé spustenie: počiatočné dáta realizácií z gitu
[[ -f "$DATA/realizacie.json" ]] || cp content/realizacie.json "$DATA/realizacie.json"

php "$SITE_DIR/v9-next/server/prevod.php" "$DATA" "$APP/public" "$APP/content/realizacie.json"
rsync -a "$DATA/rz-web/" "$APP/public/rz/"

# závislosti len pri zmene package-lock.json
if [[ ! -d node_modules || package-lock.json -nt node_modules/.pg-stamp ]]; then
  npm ci --no-audit --no-fund
  touch node_modules/.pg-stamp
fi

PG_SITE="$(php -r '$c = require getenv("HOME")."/pg-config.php"; echo $c["site"];')" npm run build

rsync -a --delete --exclude=/data/ --exclude=/admin/ --exclude=/api/ --exclude=/.well-known/ out/ "$WWW/"

# admin a API formulára
rsync -a --delete --exclude=config.php --exclude=config.example.php --exclude=data.htaccess --exclude=.htaccess admin/ "$WWW/admin/"
WWW="$WWW" php -r '$c = require getenv("HOME")."/pg-config.php"; $w = getenv("WWW"); file_put_contents("$w/admin/config.php", "<?php\nreturn " . var_export(["password_hash" => $c["admin_hash"], "deepl_key" => $c["deepl_key"] ?? "", "data_dir" => "$w/data"], true) . ";\n");'
chmod 640 "$WWW/admin/config.php"
rsync -a --delete server/api/ "$WWW/api/"

# web ostal pôvodný obsah v gite (prevod.php ho prepisuje), aby git pull nenarazil
git -C "$SITE_DIR" checkout -- v9-next/content/realizacie.json

echo "Hotovo $(date "+%F %T")"
