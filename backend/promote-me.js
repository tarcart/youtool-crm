const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'admin@test.com'; // Your current login

    console.log(`👑 Promoting ${email} to SUPER_ADMIN...`);

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { role: 'SUPER_ADMIN' }
        });
        console.log(`✅ SUCCESS: ${user.email} is now a ${user.role}`);
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());