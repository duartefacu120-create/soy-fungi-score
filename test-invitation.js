const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const invite = await prisma.invitation.findFirst();
        console.log('Success connection to Invitation table:', invite);
    } catch (e) {
        console.error('Error accessing Invitation table:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
