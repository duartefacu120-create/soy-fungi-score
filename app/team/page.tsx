export const dynamic = "force-dynamic";
import DashboardLayout from "@/app/dashboard/layout";
import {
    getCurrentUser,
    getOrgMembers,
    getInvitations,
    getSentInvitations,
    handleInviteAction,
    handleAcceptAction,
    handleUpdateNameAction,
    handleLeaveAction
} from "@/app/actions";
import { Users, Mail, UserPlus, CheckCircle2, Building, Clock, Check, Send, LogOut, Trash2, AlertTriangle } from "lucide-react";
import DeleteAccountForm from "@/components/team/DeleteAccountForm";
import MemberActions from "@/components/team/MemberActions";
import CancelInvitationButton from "@/components/team/CancelInvitationButton";
import { cn } from "@/lib/utils";

export default async function TeamPage({ searchParams }: { searchParams: { message?: string } }) {
    try {
        const user = (await getCurrentUser()) as any;
        const members = (await getOrgMembers()) as any[];
        const pendingInvitations = (await getInvitations()) as any[];
        const sentInvitations = (await getSentInvitations()) as any[];

        const isOwner = user.organization?.owner_id === user.id;

        return (
            <DashboardLayout>
                <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8 pb-10">
                    {searchParams.message && (
                        <div className={cn(
                            "border px-4 py-3 rounded-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 shadow-sm",
                            searchParams.message.toLowerCase().includes("error")
                                ? "bg-red-50 border-red-200 text-red-800"
                                : "bg-green-100 border-green-200 text-green-800"
                        )}>
                            {searchParams.message.toLowerCase().includes("error") ? (
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                            ) : (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                            )}
                            <span className="text-sm font-medium">{decodeURIComponent(searchParams.message)}</span>
                        </div>
                    )}

                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                                <Users className="h-8 w-8 text-green-600" />
                                Mi Empresa
                            </h1>
                            <p className="text-gray-500 font-medium">Gestión de equipo e identidad corporativa.</p>
                        </div>

                        <form action={handleUpdateNameAction} className="flex items-center gap-2 bg-white p-1.5 pr-4 rounded-2xl border shadow-sm group focus-within:ring-2 focus-within:ring-green-500 transition-all bg-white">
                            <div className="bg-green-50 p-2.5 rounded-xl ml-1">
                                <Building className="h-5 w-5 text-green-700" />
                            </div>
                            <input
                                name="companyName"
                                defaultValue={user.organization?.name}
                                placeholder="Nombre de la empresa"
                                className="bg-transparent font-bold text-gray-800 outline-none px-2 py-1 w-48 md:w-64"
                            />
                            <button type="submit" title="Guardar nombre" className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-green-600 transition-colors">
                                <Check className="h-5 w-5" />
                            </button>
                        </form>
                    </header>

                    <div className="grid gap-8 lg:grid-cols-12">
                        {/* Left Column: Management */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Invite Form */}
                            <section className="bg-white rounded-3xl border p-6 shadow-sm">
                                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Invitar Miembro
                                </h2>
                                <form action={handleInviteAction} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Email del colaborador</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="ejemplo@empresa.com"
                                            className="w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm"
                                        />
                                    </div>
                                    <button className="w-full bg-gray-900 text-white rounded-2xl py-3.5 font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-gray-200">
                                        <Send className="h-4 w-4" />
                                        Enviar Invitación
                                    </button>
                                </form>
                            </section>

                            {/* Sent Invitations */}
                            <section className="bg-gray-50 rounded-3xl border border-dashed border-gray-200 p-6 min-h-[160px]">
                                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Pendientes de Aceptación
                                </h2>
                                <div className="space-y-3">
                                    {sentInvitations.length === 0 ? (
                                        <p className="text-sm text-gray-400 italic text-center py-6">No hay invitaciones esperando.</p>
                                    ) : (
                                        sentInvitations.map((inv: any) => (
                                            <div key={inv.id} className="p-3.5 rounded-2xl bg-white border border-gray-100 flex items-center justify-between shadow-sm">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{inv.email}</span>
                                                    <span className="text-[10px] text-amber-500 uppercase font-bold flex items-center gap-1">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                                                        Esperando respuesta
                                                    </span>
                                                </div>
                                                {isOwner && (
                                                    <CancelInvitationButton invitationId={inv.id} />
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>

                            {/* Leave Organization */}
                            {!isOwner && user.organization_id && (
                                <section className="bg-red-50 rounded-3xl border border-red-100 p-6">
                                    <h2 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-2">Zona de Peligro</h2>
                                    <p className="text-xs text-red-600/70 mb-4 font-medium leading-relaxed">Si abandonas la empresa perderás el acceso inmediato a todos los datos compartidos.</p>
                                    <form action={handleLeaveAction}>
                                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-red-200 text-red-600 rounded-2xl text-sm font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95">
                                            <LogOut className="h-4 w-4" />
                                            Abandonar Empresa
                                        </button>
                                    </form>
                                </section>
                            )}

                            {/* Delete Account */}
                            <section className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Trash2 className="h-4 w-4 text-red-400" />
                                    Cuenta de Usuario
                                </h2>
                                <p className="text-[10px] text-gray-400 mb-4 leading-relaxed font-medium">
                                    Eliminar tu cuenta borrará permanentemente tu perfil y acceso.
                                </p>
                                <DeleteAccountForm />
                            </section>

                            {isOwner && (
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-100 shadow-sm">
                                    <h2 className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Building className="h-4 w-4" />
                                        Rol Administrador
                                    </h2>
                                    <p className="text-[10px] text-amber-600/80 font-medium italic leading-relaxed">
                                        Como dueño tienes control total del equipo. Puedes invitar, eliminar y **ceder el mando** a otros miembros.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Members & Incoming */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Incoming Invitations */}
                            {pendingInvitations.length > 0 && (
                                <section className="bg-green-700 rounded-3xl p-6 shadow-xl text-white overflow-hidden relative">
                                    <div className="relative z-10">
                                        <h2 className="text-sm font-bold text-green-100 uppercase tracking-wider mb-5 flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Nuevas Invitaciones ({pendingInvitations.length})
                                        </h2>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            {pendingInvitations.map((inv: any) => (
                                                <div key={inv.id} className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                                                    <p className="text-sm mb-4">
                                                        Invitación para unirte a: <br />
                                                        <span className="text-lg font-black">{inv.organization?.name}</span>
                                                    </p>
                                                    <form action={handleAcceptAction}>
                                                        <input type="hidden" name="invitationId" value={inv.id} />
                                                        <button className="w-full bg-white text-green-700 font-bold rounded-xl py-2.5 hover:bg-green-50 transition-all active:scale-95 shadow-lg">
                                                            Aceptar y Unirme
                                                        </button>
                                                    </form>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                                </section>
                            )}

                            {/* Members List */}
                            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="p-6 border-b bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center shadow-sm">
                                            <Users className="h-6 w-6 text-green-700" />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-gray-900">Equipo de Trabajo</h2>
                                            <p className="text-xs text-gray-500 font-medium">Miembros con acceso a datos</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-black uppercase tracking-widest border border-green-200 self-start sm:self-center">
                                        {members.length} usuarios
                                    </span>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {members.length === 0 ? (
                                        <div className="p-16 text-center text-gray-400 italic">No hay otros miembros en esta empresa.</div>
                                    ) : (
                                        members.map((member: any) => (
                                            <div key={member.id} className="p-5 lg:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                                                <div className="flex items-center gap-5">
                                                    <div className="h-14 w-14 rounded-2xl border-2 border-white bg-white flex items-center justify-center text-green-700 font-black text-xl shadow-md">
                                                        {member.email?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-base">{member.email}</p>
                                                        <p className="text-xs text-gray-400 font-medium">Activo desde {new Date(member.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                                                    <div className="flex items-center gap-2">
                                                        {member.id === user.organization?.owner_id && (
                                                            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 px-3 py-1 rounded-lg border border-amber-200 flex items-center gap-1 shadow-sm">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Dueño
                                                            </span>
                                                        )}
                                                        {member.id === user.id && (
                                                            <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-3 py-1 rounded-lg border border-blue-100 shadow-sm">
                                                                Tú
                                                            </span>
                                                        )}
                                                    </div>

                                                    {isOwner && member.id !== user.id && (
                                                        <MemberActions memberId={member.id} memberEmail={member.email} />
                                                    )}

                                                    {!isOwner && member.id !== user.organization?.owner_id && member.id !== user.id && (
                                                        <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-100">
                                                            <span className="text-[10px] font-bold uppercase">Activo</span>
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        </div>
                                                    )}
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
                <div className="p-8 text-red-600 bg-red-50 rounded-2xl border border-red-200">
                    <h2 className="font-bold text-xl mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-6 w-6" />
                        Error de Carga
                    </h2>
                    <pre className="text-sm whitespace-pre-wrap opacity-80">{e.message}</pre>
                </div>
            </DashboardLayout>
        );
    }
}
