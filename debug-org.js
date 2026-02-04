const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const orgs = await prisma.organization.findMany({
            include: {
                members: true
            }
        });
        console.log('Organizations and Owners:');
        orgs.forEach(org => {
            console.log(`Org: ${org.name} (ID: ${org.id}) - Owner ID: ${org.owner_id}`);
            org.members.forEach(m => {
                console.log(`  Member: ${m.email} (ID: ${m.id})`);
            });
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
