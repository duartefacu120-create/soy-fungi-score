export const dynamic = "force-dynamic";
import DashboardLayout from "@/app/dashboard/layout";
import { getCurrentUser, getOrgMembers, getInvitations, getSentInvitations, inviteUser, acceptInvitation, updateOrganizationName, leaveOrganization, removeMemberFromOrganization, deleteAccount } from "@/app/actions";
import { Users, Mail, UserPlus, CheckCircle2, Building, Clock, Check, Send, LogOut, Trash2 } from "lucide-react";
import DeleteAccountForm from "@/components/team/DeleteAccountForm";
import RemoveMemberButton from "@/components/team/RemoveMemberButton";
import { redirect } from "next/navigation";

export default async function TeamPage({ searchParams }: { searchParams: { message?: string } }) {
    try {
        const user = (await getCurrentUser()) as any;
        const members = (await getOrgMembers()) as any[];
        const pendingInvitations = (await getInvitations()) as any[];
        const sentInvitations = (await getSentInvitations()) as any[];

        const handleInvite = async (formData: FormData) => {
            "use server";
            const email = formData.get("email") as string;
            const result = await inviteUser(email);
            redirect(`/team?message=${encodeURIComponent(result.message)}`);
        }

        const handleAccept = async (formData: FormData) => {
            "use server";
            const id = formData.get("invitationId") as string;
            await acceptInvitation(id);
        }

        const handleUpdateName = async (formData: FormData) => {
            "use server";
            const newName = formData.get("companyName") as string;
            if (newName) {
                await updateOrganizationName(newName);
                redirect(`/team?message=Nombre de la empresa actualizado.`);
            }
        }

        const handleLeave = async () => {
            "use server";
            try {
                await leaveOrganization();
            } catch (e: any) {
                redirect(`/team?message=${encodeURIComponent(e.message)}`);
            }
        }

        const isOwner = user.organization?.owner_id === user.id;

        return (
            <DashboardLayout>
                <div className="max-w-5xl mx-auto space-y-8 pb-10">
                    {searchParams.message && (
                        <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                            <CheckCircle2 className="h-5 w-5" />
                            {searchParams.message}
                        </div>
                    )}

                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <Users className="h-8 w-8 text-green-600" />
                                Mi Empresa
                            </h1>
                            <p className="text-gray-500">Gestiona los miembros de tu equipo y la identidad corporativa.</p>
                        </div>

                        <form action={handleUpdateName} className="flex items-center gap-2 bg-white p-1 pr-3 rounded-xl border shadow-sm group focus-within:ring-2 focus-within:ring-green-500 transition-all">
                            <div className="bg-green-50 p-2 rounded-lg ml-1">
                                <Building className="h-5 w-5 text-green-700" />
                            </div>
                            <input
                                name="companyName"
                                defaultValue={user.organization?.name}
                                placeholder="Nombre de la empresa"
                                className="bg-transparent font-bold text-gray-800 outline-none px-2 py-1 w-48 md:w-64"
                            />
                            <button type="submit" title="Guardar nombre" className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-green-600 transition-colors">
                                <Check className="h-4 w-4" />
                            </button>
                        </form>
                    </header>

                    <div className="grid gap-8 lg:grid-cols-12">
                        {/* Left Column: Management */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Invite Form */}
                            <section className="bg-white rounded-2xl border p-6 shadow-sm">
                                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Invitar Miembro
                                </h2>
                                <form action={handleInvite} className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Email del colaborador</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="ejemplo@empresa.com"
                                            className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                        />
                                    </div>
                                    <button className="w-full bg-gray-900 text-white rounded-xl py-3 font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                                        <Send className="h-4 w-4" />
                                        Enviar Invitación
                                    </button>
                                </form>
                            </section>

                            {/* Sent Invitations */}
                            <section className="bg-gray-50 rounded-2xl border border-dashed p-6">
                                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Invitaciones Enviadas
                                </h2>
                                <div className="space-y-3">
                                    {sentInvitations.length === 0 ? (
                                        <p className="text-sm text-gray-400 italic text-center py-4">No hay invitaciones enviadas en espera.</p>
                                    ) : (
                                        sentInvitations.map((inv: any) => (
                                            <div key={inv.id} className="p-3 rounded-xl bg-white border border-gray-100 flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">{inv.email}</span>
                                                    <span className="text-[10px] text-gray-400 uppercase font-bold">Pendiente</span>
                                                </div>
                                                <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>

                            {/* Leave Organization */}
                            {!isOwner && user.organization_id && (
                                <section className="bg-red-50 rounded-2xl border border-red-100 p-6">
                                    <h2 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-2">Peligro</h2>
                                    <p className="text-xs text-red-600 mb-4 font-medium">Si abandonas la empresa perderás el acceso a todos los datos compartidos.</p>
                                    <form action={handleLeave}>
                                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                            <LogOut className="h-4 w-4" />
                                            Abandonar Empresa
                                        </button>
                                    </form>
                                </section>
                            )}

                            {/* Delete Account */}
                            <section className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm">
                                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                    Borrar Mi Cuenta
                                </h2>
                                <p className="text-[10px] text-gray-500 mb-4 leading-relaxed font-medium">
                                    Esta acción es **permanente**. Se eliminará tu perfil y **todos tus datos**.
                                </p>
                                <DeleteAccountForm />
                            </section>

                            {isOwner && (
                                <section className="bg-gray-100 rounded-2xl p-6 border border-gray-200">
                                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Rol: Dueño</h2>
                                    <p className="text-[10px] text-gray-500 font-medium italic leading-relaxed">Como creador puedes gestionar miembros. No puedes abandonar sin transferir la propiedad.</p>
                                </section>
                            )}
                        </div>

                        {/* Right Column: Members & Incoming */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Incoming Invitations */}
                            {pendingInvitations.length > 0 && (
                                <section className="bg-green-600 rounded-2xl p-6 shadow-lg text-white">
                                    <h2 className="text-sm font-bold text-green-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Invitaciones Recibidas ({pendingInvitations.length})
                                    </h2>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {pendingInvitations.map((inv: any) => (
                                            <div key={inv.id} className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                                                <p className="text-sm mb-3">
                                                    Te han invitado a <span className="font-bold underline">{inv.organization?.name}</span>
                                                </p>
                                                <form action={handleAccept}>
                                                    <input type="hidden" name="invitationId" value={inv.id} />
                                                    <button className="w-full bg-white text-green-700 font-bold rounded-lg py-2 hover:bg-green-50 transition-colors">
                                                        Aceptar y Cambiar
                                                    </button>
                                                </form>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Members List */}
                            <section className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                                <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                                            <Users className="h-5 w-5 text-green-700" />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-gray-900">Miembros del Equipo</h2>
                                            <p className="text-xs text-gray-500">Colaboradores de la empresa</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full uppercase tracking-wider">
                                        {members.length} usuarios
                                    </span>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {members.length === 0 ? (
                                        <div className="p-12 text-center text-gray-500 italic">No hay otros miembros en esta empresa.</div>
                                    ) : (
                                        members.map((member: any) => (
                                            <div key={member.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-full border-2 border-gray-100 bg-white flex items-center justify-center text-green-700 font-bold text-lg shadow-sm">
                                                        {member.email?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{member.email}</p>
                                                        <p className="text-xs text-gray-500">Miembro desde {new Date(member.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {member.id === user.organization?.owner_id && (
                                                        <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                                                            Dueño
                                                        </span>
                                                    )}
                                                    {member.id === user.id && (
                                                        <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
                                                            Tú
                                                        </span>
                                                    )}
                                                    <div className="flex items-center gap-4">
                                                        {isOwner && member.id !== user.id && member.id !== user.organization?.owner_id && (
                                                            <RemoveMemberButton memberId={member.id} />
                                                        )}
                                                        <div className="flex items-center gap-2 text-green-600">
                                                            <span className="text-xs font-bold uppercase">Activo</span>
                                                            <CheckCircle2 className="h-5 w-5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    } catch (e: any) {
        if (e.message?.includes('NEXT_REDIRECT')) throw e;
        return (
            <DashboardLayout>
                <div className="p-8 text-red-600 bg-red-50 rounded-xl border border-red-200">
                    <h2 className="font-bold text-xl mb-2">Error cargando Mi Empresa:</h2>
                    <pre className="text-sm whitespace-pre-wrap">{e.message}</pre>
                </div>
            </DashboardLayout>
        );
    }
}
