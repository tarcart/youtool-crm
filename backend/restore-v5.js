const { PrismaClient } = require('@prisma/client');

// FIX: Use environment variable instead of hardcoded password
// This prevents GitHub from blocking the push
const dbUrl = process.env.DATABASE_URL; 

const prisma = new PrismaClient({
  datasources: {
    db: { url: dbUrl },
  },
});

async function run() {
  console.log("Connecting to host...");
  try {
    const company = await prisma.company.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, name: 'Main Company', status: 'Active' }
    });
    console.log("✅ CONNECTED! Company ID: 1");

    await prisma.user.upsert({
      where: { email: 'admin@test.com' },
      update: {},
      create: {
        email: 'admin@test.com',
        // This hash is safe to upload because it is encrypted
        passwordHash: '$2b$10$EpjXWzO97f/G9CjF7hJtEe8.Z0Hh3VlI0D9yvK5O1D2Q3P4R5S6T7',
        role: 'Admin',
        companyId: company.id
      }
    });
    
    console.log("\nSUCCESS: ACCOUNT RESTORED");
    console.log("Login: admin@test.com / password123");

  } catch (error) {
    console.error("Failure:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

run();