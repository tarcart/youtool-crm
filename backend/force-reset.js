const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // Using the exact library your auth.js uses

const prisma = new PrismaClient();

async function main() {
    console.log("--- FORCING PASSWORD RESET ---");
    
    const email = 'admin@test.com';
    const newPassword = 'password123';

    // 1. Verify user exists
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
        console.error(`❌ User ${email} not found! Run restore-v5.js first.`);
        return;
    }

    // 2. Generate a fresh hash using the same salt rounds as auth.js
    const saltRounds = 10;
    const newHash = await bcrypt.hash(newPassword, saltRounds);

    // 3. Force update the database
    await prisma.user.update({
        where: { email },
        data: { passwordHash: newHash }
    });

    console.log(`✅ SUCCESS: Password for ${email} has been manually reset.`);
    console.log(`🔑 NEW PASSWORD: ${newPassword}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });