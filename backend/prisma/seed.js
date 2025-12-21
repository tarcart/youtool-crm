// backend/prisma/seed.js
require('dotenv').config();
const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');

async function main() {
  console.log("🌱 Seeding database with Admin credentials...");

  // 1. Ensure the Default Company exists
  const company = await prisma.company.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'YouTool Admin Corp',
    },
  });

  const hashedVal = await bcrypt.hash('YourPassword123', 10);
  
  // 2. Create Admin User with ALL required fields
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: hashedVal, // Resolved from previous error
      role: 'ADMIN',           // RESOLVING CURRENT ERROR
      companyId: company.id,
    },
  });

  console.log('✔ Admin user created: admin@example.com');
  console.log('✔ Password: YourPassword123');
  console.log('🚀 You are ready to log in!');
}

main()
  .catch((e) => {
    console.error('✘ SEED ERROR:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });