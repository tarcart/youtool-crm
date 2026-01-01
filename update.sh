#!/bin/bash
cd ~/youtool-crm
git pull origin main
cd frontend
npm run build
# Clean both potential asset locations
rm -rf /var/www/youtool/frontend/dist/*
rm -rf /var/www/youtool/assets/*
# Copy to both locations to be safe
cp -r dist/* /var/www/youtool/frontend/dist/
cp -r dist/assets/* /var/www/youtool/assets/
sudo systemctl restart nginx
echo "🚀 Site updated and ghost versions cleared!"
