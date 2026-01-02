const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("--- CURRENT USERS IN DB ---");
  users.forEach(u => {
    console.log(`Email: ${u.email}`);
    console.log(`Hash:  ${u.passwordHash}`);
  });
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());