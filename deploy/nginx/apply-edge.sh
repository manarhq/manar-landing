#!/usr/bin/env bash
# Install the manar.vax.sh edge config on webserver-vax and retire the old Manar console routes.
# Run as root from the directory containing manar.conf and the snippets:
#   sudo bash apply-edge.sh
# Backs up every file it replaces or removes, and restores them if `nginx -t` fails.
set -euo pipefail

src="$(cd "$(dirname "$0")" && pwd)"
backup="/root/nginx-backup-manar-$(date +%Y%m%d-%H%M%S)"
old_stream=/etc/nginx/stream-conf.d/agents-mtls.conf   # manar-api agent mTLS passthrough (retired)

for f in "$src/manar.conf" "$src/manar-realip.conf" "$src/manar-proxy.conf" "$src/manar-security-headers.conf"; do
  [ -f "$f" ] || { echo "missing $f" >&2; exit 1; }
done

mkdir -p "$backup/conf.d" "$backup/snippets" "$backup/stream-conf.d"
cp -a /etc/nginx/conf.d/manar.conf "$backup/conf.d/" 2>/dev/null || true
cp -a /etc/nginx/snippets/manar-realip.conf /etc/nginx/snippets/manar-proxy.conf /etc/nginx/snippets/manar-security-headers.conf "$backup/snippets/" 2>/dev/null || true
cp -a "$old_stream" "$backup/stream-conf.d/" 2>/dev/null || true
echo "Backup: $backup"

restore() {
  echo "nginx -t failed; restoring previous files" >&2
  rm -f /etc/nginx/snippets/manar-realip.conf /etc/nginx/snippets/manar-proxy.conf /etc/nginx/snippets/manar-security-headers.conf
  cp -a "$backup/conf.d/." /etc/nginx/conf.d/
  cp -a "$backup/snippets/." /etc/nginx/snippets/
  cp -a "$backup/stream-conf.d/." /etc/nginx/stream-conf.d/
  nginx -t
  exit 1
}

install -o root -g root -m 0644 "$src/manar-realip.conf" /etc/nginx/snippets/manar-realip.conf
install -o root -g root -m 0644 "$src/manar-proxy.conf" /etc/nginx/snippets/manar-proxy.conf
install -o root -g root -m 0644 "$src/manar-security-headers.conf" /etc/nginx/snippets/manar-security-headers.conf
install -o root -g root -m 0644 "$src/manar.conf" /etc/nginx/conf.d/manar.conf
rm -f "$old_stream"

nginx -t || restore
systemctl reload nginx
echo "nginx reloaded. Rollback: sudo cp -a $backup/conf.d/. /etc/nginx/conf.d/ && sudo cp -a $backup/stream-conf.d/. /etc/nginx/stream-conf.d/ && sudo systemctl reload nginx"
