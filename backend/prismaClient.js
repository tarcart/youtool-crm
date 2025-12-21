const { PrismaClient } = require('@prisma/client');

// This is the standard, stable connection for Prisma v5.22.0
const prisma = new PrismaClient();

module.exports = prisma;