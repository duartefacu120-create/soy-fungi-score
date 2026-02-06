import Link from "next/link";
import { Calculator, MapPin, Layers, AlertCircle, CheckCircle2, LayoutDashboard } from "lucide-react";
import { getDashboardStats } from "@/app/actions";
import RecentAssessments from "@/components/dashboard/RecentAssessments";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const {
        activeCampaign,
        establishmentCount,
        lotCount,
        applyCount,
        hectaresApply,
        noApplyCount,
        hectaresNoApply,
        monitorCount,
        hectaresMonitor,
        recentAssessments
    } = await getDashboardStats();

    return (
        <div className="space-y-6 lg:space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-black text-gray-900 flex items-center gap-2">
                        <LayoutDashboard className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
                        Panel de Control
                    </h1>
                    <p className="text-sm lg:text-base text-gray-500 font-medium">
                        Campaña: <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-bold border border-green-100">{activeCampaign?.name || "Sin definir"}</span>
                    </p>
                </div>
                <Link
                    href="/assessments/new"
                    className="flex items-center justify-center gap-2 bg-green-700 text-white px-5 py-3 rounded-2xl hover:bg-green-800 transition-all shadow-lg shadow-green-200 active:scale-95 text-sm lg:text-base font-bold"
                >
                    <Calculator className="h-5 w-5" />
                    Nueva Evaluación
                </Link>
            </header>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    label="Alerta: Aplicar"
                    value={applyCount}
                    hectares={hectaresApply}
                    icon={AlertCircle}
                    color="red"
                    highlight
                />
                <StatCard
                    label="Monitorear"
                    value={monitorCount}
                    hectares={hectaresMonitor}
                    icon={Layers}
                    color="yellow"
                />
                <StatCard
                    label="Riesgo Bajo / No Aplicar"
                    value={noApplyCount}
                    hectares={hectaresNoApply}
                    icon={CheckCircle2}
                    color="emerald"
                />
            </div>

            <div className="grid gap-4 grid-cols-2">
                <StatCard
                    label="Establecimientos"
                    value={establishmentCount}
                    icon={MapPin}
                    color="blue"
                />
                <StatCard
                    label="Lotes Totales"
                    value={lotCount}
                    icon={Layers}
                    color="green"
                />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 lg:p-6 border-b border-gray-50 bg-gray-50/30">
                    <h2 className="font-bold text-gray-900 font-bold">Actividad Reciente</h2>
                </div>
                <div className="p-0 lg:p-6">
                    <RecentAssessments assessments={recentAssessments as any} />
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, hectares, icon: Icon, color, highlight }: any) {
    const colors: any = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        green: "text-green-600 bg-green-50 border-green-100",
        red: "text-red-700 bg-red-50 border-red-200",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        yellow: "text-yellow-700 bg-yellow-50 border-yellow-200",
    };

    return (
        <div className={cn(
            "rounded-3xl border p-5 lg:p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md",
            highlight ? "bg-white border-2 border-red-100" : "bg-white border-gray-100"
        )}>
            <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", colors[color])}>
                <Icon className="h-6 w-6 lg:h-7 lg:w-7" />
            </div>
            <div>
                <div className="flex items-baseline gap-2">
                    <div className="text-2xl lg:text-3xl font-black text-gray-900 leading-none">{value}</div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lotes</div>
                </div>
                {hectares !== undefined && (
                    <div className="text-sm font-bold text-gray-600 mt-0.5">
                        {hectares.toLocaleString()} <span className="text-[10px] uppercase opacity-60">Ha Totales</span>
                    </div>
                )}
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</h3>
            </div>
        </div>
    );
}
