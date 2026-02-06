"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { getUserSession, setUserSession, clearUserSession } from "@/lib/auth";

// --- Authentication & Organization ---

export async function login(formData: FormData) {
    const email = formData.get("email") as string;

    if (!email) {
        return { error: "El email es requerido." };
    }

    try {
        const user = await prisma.profile.findUnique({
            where: { email },
        });

        if (!user) {
            return { error: "Usuario no encontrado." };
        }

        await setUserSession(email);
    } catch (e: any) {
        console.error("Login error:", e);
        return { error: `Error de conexión: ${e.message || "Reintente"}` };
    }

    redirect("/dashboard");
}

export async function signup(formData: FormData) {
    const email = formData.get("email") as string;
    const companyName = (formData.get("company_name") as string) || email.split("@")[0];

    if (!email) {
        return { error: "El email es requerido." };
    }

    try {
        const crypto = require("crypto");
        const orgId = crypto.randomUUID();
        const profileId = crypto.randomUUID();

        const organization = await prisma.organization.create({
            data: {
                id: orgId,
                name: companyName,
                owner_id: profileId
            }
        });

        await prisma.profile.create({
            data: {
                id: profileId,
                email,
                organization_id: organization.id
            },
        });

        await setUserSession(email);
    } catch (e: any) {
        console.error("Signup error:", e);
        return { error: `Error: ${e.message || "Error al crear cuenta"}` };
    }

    redirect("/campaigns/new");
}

export async function logout() {
    await clearUserSession();
    redirect("/login");
}


export async function deleteAccount() {
    const user = await getCurrentUser();

    // If owner, deleting the organization triggers massive cascade
    const ownedOrg = await prisma.organization.findFirst({
        where: { owner_id: user.id }
    });

    if (ownedOrg) {
        // This will delete Organization, Campaigns, Establishments, Lots, Assessments, Invitations
        await prisma.organization.delete({
            where: { id: ownedOrg.id }
        });
    }

    // Explicitly cleanup anything they created as a guest in other organizations
    await prisma.campaign.deleteMany({ where: { user_id: user.id } });
    await prisma.establishment.deleteMany({ where: { user_id: user.id } });

    // Delete the person
    await prisma.profile.delete({
        where: { id: user.id }
    });

    await clearUserSession();
    redirect("/login");
}

export async function forgotPassword(formData: FormData) {
    const email = formData.get("email") as string;
    if (!email) return { error: "El email es requerido." };

    try {
        const user = await prisma.profile.findUnique({
            where: { email }
        });

        if (user) {
            console.log(`Password reset link requested for: ${email}`);
            // In a production app, integrate with Resend/Postmark/SendGrid here
        }

        return { success: true };
    } catch (e: any) {
        console.error("ForgotPassword error:", e);
        return { error: "Error al procesar la solicitud. Intente más tarde." };
    }
}

// --- User & Org context ---

export async function getCurrentUser() {
    const email = await getUserSession();
    if (!email) redirect("/login");

    const user = await prisma.profile.findUnique({
        where: { email },
        include: { organization: true }
    });

    if (!user) {
        redirect("/login");
    }

    return user;
}

export async function getCurrentCampaignId(orgId: string) {
    const campaign = await prisma.campaign.findFirst({
        where: { organization_id: orgId, is_active: true }
    });
    return campaign?.id || null;
}

// --- Teams & Invitations ---

export async function inviteUser(email: string) {
    try {
        const user = await getCurrentUser();
        if (!user.organization_id) throw new Error("No tienes organización vinculada.");

        // Check if user already in the org
        const existingMember = await prisma.profile.findFirst({
            where: { email, organization_id: user.organization_id }
        });
        if (existingMember) return { success: false, message: "Este usuario ya es miembro de tu empresa." };

        const existingInvite = await prisma.invitation.findFirst({
            where: { organization_id: user.organization_id, email, status: "PENDING" }
        });
        if (existingInvite) return { success: false, message: "Ya existe una invitación pendiente para este email." };

        const invitationId = crypto.randomUUID();
        await prisma.invitation.create({
            data: {
                id: invitationId,
                organization_id: user.organization_id,
                email,
                status: "PENDING"
            }
        });

        revalidatePath("/team");
        return { success: true, message: "Invitación enviada correctamente." };
    } catch (e: any) {
        console.error("inviteUser error:", e);
        return { success: false, message: `Error al enviar invitación: ${e.message}` };
    }
}

export async function getSentInvitations() {
    try {
        const user = await getCurrentUser();
        if (!user.organization_id) return [];

        return await prisma.invitation.findMany({
            where: { organization_id: user.organization_id, status: "PENDING" },
            orderBy: { created_at: 'desc' }
        });
    } catch (e) {
        console.error("getSentInvitations error:", e);
        return [];
    }
}

export async function updateOrganizationName(newName: string) {
    const user = await getCurrentUser();
    if (!user.organization_id) throw new Error("No tienes organización.");

    await prisma.organization.update({
        where: { id: user.organization_id },
        data: { name: newName }
    });

    revalidatePath("/team");
}

export async function getInvitations() {
    try {
        const email = await getUserSession();
        if (!email) return [];

        return await prisma.invitation.findMany({
            where: { email, status: "PENDING" },
            include: { organization: true }
        });
    } catch (e) {
        console.error("getInvitations error:", e);
        return [];
    }
}

export async function acceptInvitation(invitationId: string) {
    const user = await getCurrentUser();
    const invitation = await prisma.invitation.findUnique({
        where: { id: invitationId }
    });

    if (!invitation || invitation.email !== user.email) throw new Error("Invitación no válida.");

    await prisma.profile.update({
        where: { id: user.id },
        data: { organization_id: invitation.organization_id }
    });

    await prisma.invitation.update({
        where: { id: invitationId },
        data: { status: "ACCEPTED" }
    });

    revalidatePath("/dashboard");
    redirect("/dashboard");
}

export async function removeMemberFromOrganization(memberId: string) {
    const user = await getCurrentUser();
    if (!user.organization_id) throw new Error("No tienes organización.");

    const organization = await prisma.organization.findUnique({
        where: { id: user.organization_id }
    });

    if (organization?.owner_id !== user.id) {
        throw new Error("Solo el dueño de la empresa puede eliminar miembros.");
    }

    if (memberId === user.id) {
        throw new Error("No puedes eliminarte a ti mismo (eres el dueño). Debes transferir la propiedad primero.");
    }

    await prisma.profile.update({
        where: { id: memberId },
        data: { organization_id: null }
    });

    revalidatePath("/team");
}

export async function leaveOrganization() {
    const user = await getCurrentUser();
    if (!user.organization_id) return;

    const organization = await prisma.organization.findUnique({
        where: { id: user.organization_id }
    });

    if (organization?.owner_id === user.id) {
        throw new Error("Como dueño de la empresa no puedes abandonarla. Debes eliminar la empresa o transferir la propiedad.");
    }

    await prisma.profile.update({
        where: { id: user.id },
        data: { organization_id: null }
    });

    revalidatePath("/team");
    redirect("/campaigns/new"); // Redirect to create a new org
}

export async function transferOwnership(newOwnerId: string) {
    try {
        const user = await getCurrentUser();
        if (!user.organization_id) throw new Error("No tienes organización.");

        const organization = await prisma.organization.findUnique({
            where: { id: user.organization_id }
        });

        if (organization?.owner_id !== user.id) {
            throw new Error("Solo el dueño actual puede transferir la propiedad.");
        }

        if (newOwnerId === user.id) {
            throw new Error("Ya eres el dueño de esta empresa.");
        }

        // Verify new owner is a member
        const newOwner = await prisma.profile.findFirst({
            where: { id: newOwnerId, organization_id: user.organization_id }
        });

        if (!newOwner) {
            throw new Error("El usuario seleccionado debe ser miembro de la empresa.");
        }

        await prisma.organization.update({
            where: { id: user.organization_id },
            data: { owner_id: newOwnerId }
        });

        revalidatePath("/team");
        return { success: true, message: "Propiedad transferida correctamente." };
    } catch (e: any) {
        console.error("transferOwnership error:", e);
        return { success: false, message: e.message };
    }
}

export async function handleTransferOwnershipAction(memberId: string) {
    const result = await transferOwnership(memberId);
    redirect(`/team?message=${encodeURIComponent(result.message)}`);
}

export async function getOrgMembers() {
    try {
        const user = await getCurrentUser();
        if (!user.organization_id) return [];

        return await prisma.profile.findMany({
            where: { organization_id: user.organization_id },
            orderBy: { email: 'asc' }
        });
    } catch (e) {
        console.error("getOrgMembers error:", e);
        return [];
    }
}

export async function handleInviteAction(formData: FormData) {
    const email = formData.get("email") as string;
    const result = await inviteUser(email);
    redirect(`/team?message=${encodeURIComponent(result.message)}`);
}

export async function handleAcceptAction(formData: FormData) {
    const id = formData.get("invitationId") as string;
    await acceptInvitation(id);
    // acceptInvitation already redirects
}

export async function handleUpdateNameAction(formData: FormData) {
    const newName = formData.get("companyName") as string;
    if (newName) {
        await updateOrganizationName(newName);
        redirect(`/team?message=Nombre de la empresa actualizado.`);
    }
}

export async function handleLeaveAction() {
    try {
        await leaveOrganization();
    } catch (e: any) {
        redirect(`/team?message=${encodeURIComponent(e.message)}`);
    }
}

export async function removeMemberAction(memberId: string) {
    try {
        await removeMemberFromOrganization(memberId);
        redirect(`/team?message=Miembro eliminado correctamente.`);
    } catch (e: any) {
        redirect(`/team?message=${encodeURIComponent(e.message)}`);
    }
}

export async function updateAssessment(
    id: string,
    score: number,
    recommendation: string,
    inputs: any,
    variety: string
) {
    await prisma.assessment.update({
        where: { id },
        data: {
            total_score: score,
            recommendation_result: recommendation,
            soybean_variety: variety,
            input_data: JSON.stringify(inputs)
        }
    });

    revalidatePath("/dashboard");
    revalidatePath(`/assessments/${id}`);
}

export async function cancelInvitation(invitationId: string) {
    try {
        const user = await getCurrentUser();
        if (!user.organization_id) throw new Error("No tienes organización.");

        const invitation = await prisma.invitation.findUnique({
            where: { id: invitationId }
        });

        if (!invitation) throw new Error("Invitación no encontrada.");
        if (invitation.organization_id !== user.organization_id) {
            throw new Error("No tienes permiso para cancelar esta invitación.");
        }

        await prisma.invitation.delete({
            where: { id: invitationId }
        });

        revalidatePath("/team");
        return { success: true, message: "Invitación cancelada correctamente." };
    } catch (e: any) {
        console.error("cancelInvitation error:", e);
        return { success: false, message: e.message };
    }
}

export async function handleCancelInvitationAction(invitationId: string) {
    const result = await cancelInvitation(invitationId);
    redirect(`/team?message=${encodeURIComponent(result.message)}`);
}

// --- Campaigns ---

export async function getCampaigns() {
    const user = await getCurrentUser();
    if (!user.organization_id) return [];

    return await prisma.campaign.findMany({
        where: { organization_id: user.organization_id },
        orderBy: { created_at: 'desc' }
    });
}

export async function createCampaign(formData: FormData) {
    const user = await getCurrentUser();
    const name = formData.get("name") as string;
    const orgId = user.organization_id;

    if (!orgId) throw new Error("No org");

    try {
        const crypto = require("crypto");
        const campId = crypto.randomUUID();

        await prisma.campaign.updateMany({
            where: { organization_id: orgId },
            data: { is_active: false }
        });

        await prisma.campaign.create({
            data: {
                id: campId,
                organization_id: orgId,
                user_id: user.id,
                name,
                is_active: true
            }
        });

        revalidatePath("/campaigns");
    } catch (e) {
        console.error(e);
    }
    redirect("/dashboard?success=campaign");
}

export async function deleteCampaign(id: string) {
    await prisma.campaign.delete({ where: { id } });
    revalidatePath("/campaigns");
}

export async function setActiveCampaign(id: string) {
    const user = await getCurrentUser();
    const orgId = user.organization_id;
    if (!orgId) return;

    await prisma.campaign.updateMany({
        where: { organization_id: orgId },
        data: { is_active: false }
    });

    await prisma.campaign.update({
        where: { id },
        data: { is_active: true }
    });

    revalidatePath("/campaigns");
}

// --- Dashboard & Stats ---

export async function getDashboardStats() {
    const user = await getCurrentUser();
    const orgId = user.organization_id;
    if (!orgId) redirect("/campaigns");

    const campaignId = await getCurrentCampaignId(orgId);
    if (!campaignId) redirect("/campaigns");

    const activeCampaign = await prisma.campaign.findUnique({ where: { id: campaignId } });

    const establishmentCount = await prisma.establishment.count({ where: { organization_id: orgId } });
    const lotCount = await prisma.lot.count({ where: { establishment: { organization_id: orgId } } });

    // Get all assessments for current campaign with lot hectares
    const assessments = await prisma.assessment.findMany({
        where: { campaign_id: campaignId },
        include: { lot: true }
    });

    const assessmentCount = assessments.length;

    const applyCount = assessments.filter(a => a.recommendation_result === "Aplicar").length;
    const hectaresApply = assessments
        .filter(a => a.recommendation_result === "Aplicar")
        .reduce((sum, a) => sum + (a.lot?.hectares || 0), 0);

    const noApplyCount = assessments.filter(a => a.recommendation_result === "No Aplicar").length;
    const hectaresNoApply = assessments
        .filter(a => a.recommendation_result === "No Aplicar")
        .reduce((sum, a) => sum + (a.lot?.hectares || 0), 0);

    const monitorCount = assessments.filter(a => a.recommendation_result === "Monitorear y decidir con pronóstico").length;
    const hectaresMonitor = assessments
        .filter(a => a.recommendation_result === "Monitorear y decidir con pronóstico")
        .reduce((sum, a) => sum + (a.lot?.hectares || 0), 0);

    const recentAssessments = await prisma.assessment.findMany({
        where: { campaign_id: campaignId },
        take: 50,
        orderBy: { date_performed: 'desc' },
        include: { lot: { include: { establishment: true } } }
    });

    return {
        activeCampaign,
        establishmentCount,
        lotCount,
        assessmentCount,
        applyCount,
        hectaresApply,
        noApplyCount,
        hectaresNoApply,
        monitorCount,
        hectaresMonitor,
        recentAssessments
    };
}

export async function getEnterpriseStats() {
    try {
        const totalAssessments = await prisma.assessment.count().catch(() => 0);
        const totalLots = await prisma.lot.count().catch(() => 0);

        const assessmentWithLots = await prisma.assessment.findMany({
            include: { lot: true }
        }).catch(() => []);

        const totalHectares = assessmentWithLots.reduce((acc, curr) => acc + (curr.lot?.hectares || 0), 0);
        const applyHectares = assessmentWithLots
            .filter(a => a.recommendation_result === "Aplicar")
            .reduce((acc, curr) => acc + (curr.lot?.hectares || 0), 0);

        const recommendationStats = await prisma.assessment.groupBy({
            by: ['recommendation_result'],
            _count: { id: true }
        }).catch(() => []);

        const totalProfiles = await prisma.profile.count().catch(() => 0);

        return {
            totalAssessments,
            totalLots,
            totalHectares,
            applyHectares,
            recommendationStats: recommendationStats || [],
            memberCount: totalProfiles
        };
    } catch (e) {
        console.error("Enterprise stats error:", e);
        return {
            totalAssessments: 0,
            totalLots: 0,
            totalHectares: 0,
            applyHectares: 0,
            recommendationStats: [],
            memberCount: 0
        };
    }
}

// --- Establishments ---

export async function getEstablishments() {
    const user = await getCurrentUser();
    if (!user.organization_id) return [];

    return await prisma.establishment.findMany({
        where: { organization_id: user.organization_id },
        include: { _count: { select: { lots: true } } },
        orderBy: { created_at: 'desc' }
    });
}

export async function createEstablishment(formData: FormData) {
    const user = await getCurrentUser();
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const orgId = user.organization_id;

    try {
        const crypto = require("crypto");
        const estId = crypto.randomUUID();

        await prisma.establishment.create({
            data: {
                id: estId,
                organization_id: orgId,
                user_id: user.id,
                name,
                location
            }
        });

        revalidatePath("/establishments");
    } catch (e) {
        console.error(e);
    }
    redirect("/establishments");
}

export async function deleteEstablishment(id: string) {
    await prisma.establishment.delete({ where: { id } });
    revalidatePath("/establishments");
}

export async function getEstablishmentDetails(id: string) {
    return await prisma.establishment.findUnique({
        where: { id },
        include: { lots: { orderBy: { created_at: 'desc' } } }
    });
}

export async function updateEstablishment(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;

    await prisma.establishment.update({
        where: { id },
        data: { name, location }
    });

    revalidatePath("/establishments");
    revalidatePath(`/establishments/${id}`);
}

// --- Lots ---

export async function createLot(establishmentId: string, formData: FormData) {
    const name = formData.get("name") as string;
    const hectares = parseFloat(formData.get("hectares") as string) || 0;

    try {
        const crypto = require("crypto");
        const lotId = crypto.randomUUID();

        await prisma.lot.create({
            data: {
                id: lotId,
                establishment_id: establishmentId,
                name,
                hectares,
            }
        });

        revalidatePath(`/establishments/${establishmentId}`);
    } catch (e) {
        console.error(e);
    }
    redirect(`/establishments/${establishmentId}?success=lot`);
}

export async function updateLot(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const hectares = parseFloat(formData.get("hectares") as string) || 0;

    const lot = await prisma.lot.update({
        where: { id },
        data: { name, hectares },
        include: { establishment: true }
    });

    revalidatePath(`/establishments/${lot.establishment_id}`);
}

export async function deleteLot(id: string) {
    const lot = await prisma.lot.findUnique({
        where: { id },
        select: { establishment_id: true }
    });
    await prisma.lot.delete({ where: { id } });
    if (lot) revalidatePath(`/establishments/${lot.establishment_id}`);
}

// --- Assessments ---

export async function getLotOptions() {
    const user = await getCurrentUser();
    if (!user.organization_id) return [];

    return await prisma.establishment.findMany({
        where: { organization_id: user.organization_id },
        include: { lots: true },
        orderBy: { name: 'asc' }
    });
}

export async function createAssessment(lotId: string, campaignId: string, score: number, result: string, inputData: any, soybeanVariety?: string) {
    try {
        const crypto = require("crypto");
        const assId = crypto.randomUUID();

        const assessment = await prisma.assessment.create({
            data: {
                id: assId,
                lot_id: lotId,
                campaign_id: campaignId,
                total_score: score,
                recommendation_result: result,
                soybean_variety: soybeanVariety,
                input_data: JSON.stringify(inputData)
            }
        });

        revalidatePath("/dashboard");
        return assessment.id;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function getAssessment(id: string) {
    return await prisma.assessment.findUnique({
        where: { id },
        include: { lot: { include: { establishment: true } } }
    });
}

export async function deleteAssessment(id: string) {
    await prisma.assessment.delete({ where: { id } });
    revalidatePath("/dashboard");
}
