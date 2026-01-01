#!/bin/bash
# Load your database URL from the .env file
export $(grep -v '^#' /root/youtool-crm/backend/.env | xargs)

echo "🚀 Starting Secure Deployment..."

# 1. DATABASE BACKUP (The Safety Net)
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="/root/youtool-backups"
mkdir -p $BACKUP_DIR

echo "💾 Backing up database to $BACKUP_DIR/db_backup_$TIMESTAMP.sql..."
pg_dump $DATABASE_URL > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

# 2. PULL LATEST CODE
cd /root/youtool-crm
git pull origin main

# 3. UPDATE BACKEND
cd backend
npm install
npx prisma generate
pm2 restart all --update-env

# 4. BUILD FRONTEND
cd ../frontend
npm install
npm run build
rm -rf /var/www/youtool/*
cp -r dist/* /var/www/youtool/

# 5. RESTART NGINX
systemctl restart nginx

echo "✅ Backup saved and Deployment Successful!"
