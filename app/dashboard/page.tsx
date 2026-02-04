import Link from "next/link";
import { Calculator } from "lucide-react";
import { getDashboardStats } from "@/app/actions";
import RecentAssessments from "@/components/dashboard/RecentAssessments";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const {
        activeCampaign,
        establishmentCount,
        lotCount,
        assessmentCount,
        applyCount,
        noApplyCount,
        recentAssessments
    } = await getDashboardStats();

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bienvenido</h1>
                    <p className="text-gray-500">Campaña Activa: <span className="font-semibold text-green-700">{activeCampaign?.name || "Ninguna"}</span></p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/assessments/new"
                        className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors shadow-sm"
                    >
                        <Calculator className="h-5 w-5" />
                        Nueva Evaluación
                    </Link>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Establecimientos</h3>
                    <div className="mt-2 text-3xl font-bold">{establishmentCount}</div>
                </div>
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Lotes Totales</h3>
                    <div className="mt-2 text-3xl font-bold">{lotCount}</div>
                </div>
                <div className="rounded-xl border bg-white p-6 shadow-sm border-l-4 border-l-red-500">
                    <h3 className="text-sm font-medium text-gray-500">Recomendados: Aplicar</h3>
                    <div className="mt-2 text-3xl font-bold text-red-600">{applyCount}</div>
                </div>
                <div className="rounded-xl border bg-white p-6 shadow-sm border-l-4 border-l-green-500">
                    <h3 className="text-sm font-medium text-gray-500">Recomendados: No Aplicar</h3>
                    <div className="mt-2 text-3xl font-bold text-green-600">{noApplyCount}</div>
                </div>
            </div>

            {/* Recent Activity */}
            <RecentAssessments assessments={recentAssessments as any} />
        </div>
    );
}
