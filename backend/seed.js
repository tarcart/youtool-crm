const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ 
    connectionString, 
    ssl: { rejectUnauthorized: false } 
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Starting seed...');

    const passwordHash = await bcrypt.hash('SecurePassword123', 10);

    const company = await prisma.company.create({
        data: {
            name: 'TechCorp Solutions',
            status: 'Active',
            users: {
                create: {
                    email: 'admin@techcorp.com',
                    passwordHash: passwordHash,
                    role: 'ADMIN',
                }
            }
        }
    });

    console.log(`✅ Seed finished! Created company: ${company.name}`);
    console.log(`👤 Super Admin: admin@techcorp.com / SecurePassword123`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });