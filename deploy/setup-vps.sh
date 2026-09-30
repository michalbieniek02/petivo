#!/usr/bin/env bash
set -euo pipefail

deploy_user=${SUDO_USER:-$USER}
script_dir=$(cd -- "$(dirname -- "$0")" && pwd)

sudo apt-get update
sudo apt-get install -y nginx nodejs

node_major=$(node --version | sed -E 's/^v([0-9]+).*/\1/')
if (( node_major < 20 )); then
  echo "Node.js 20 or newer is required." >&2
  exit 1
fi

if ! sudo test -f /etc/letsencrypt/live/petivo.shop/fullchain.pem; then
  echo "The existing petivo.shop certificate was not found." >&2
  exit 1
fi

sudo install -d -o "$deploy_user" -g "$deploy_user" -m 0755 /var/www/petivo/releases
sed "s/__DEPLOY_USER__/$deploy_user/g" "$script_dir/petivo.service" | sudo tee /etc/systemd/system/petivo.service >/dev/null
sudo install -m 0644 "$script_dir/nginx.conf" /etc/nginx/sites-available/petivo.shop
sudo ln -sfn /etc/nginx/sites-available/petivo.shop /etc/nginx/sites-enabled/petivo.shop
printf '%s ALL=(root) NOPASSWD: /usr/bin/systemctl restart petivo\n' "$deploy_user" | sudo tee /etc/sudoers.d/petivo-deploy >/dev/null
sudo chmod 0440 /etc/sudoers.d/petivo-deploy
sudo visudo -cf /etc/sudoers.d/petivo-deploy
sudo systemctl daemon-reload
sudo systemctl enable petivo
sudo nginx -t
sudo systemctl reload nginx

echo "VPS is ready for the first GitHub Actions deployment."
