const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const orgs = await prisma.organization.findMany({
            where: { owner_id: null },
            include: { members: true }
        });

        console.log(`Found ${orgs.length} organizations with no owner.`);

        for (const org of orgs) {
            if (org.members.length > 0) {
                // Find if any member has the same name as the org partial or just pick the first
                // For fduarte@elganadosrl.com in "El Ganado SRL", it's a good candidate.
                // Let's just pick the first member as a fallback.
                const firstMember = org.members[0];
                await prisma.organization.update({
                    where: { id: org.id },
                    data: { owner_id: firstMember.id }
                });
                console.log(`Assigned owner ${firstMember.email} to organization ${org.name}`);
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
