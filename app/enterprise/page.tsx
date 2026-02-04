export const dynamic = "force-dynamic";
import DashboardLayout from "@/app/dashboard/layout";
import { getEnterpriseStats } from "@/app/actions";
import { PieChart, TrendingUp, BarChart, Users, Sprout, Globe, Activity, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function EnterpriseDashboard() {
    const stats = await getEnterpriseStats();

    if (!stats) return null;

    const {
        totalAssessments,
        totalLots,
        totalHectares,
        applyHectares,
        recommendationStats,
        memberCount
    } = stats;

    const findCount = (type: string) => recommendationStats.find(s => s.recommendation_result.includes(type))?._count.id || 0;

    const applyCount = findCount("Aplicar");
    const monitorCount = findCount("Monitorear");
    const noApplyCount = findCount("No Aplicar");

    const surfaceApplyPercent = totalHectares > 0 ? (applyHectares / totalHectares) * 100 : 0;

    return (
        <DashboardLayout>
            <div className="space-y-8 pb-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                            <Globe className="h-8 w-8 text-blue-600" />
                            Registro General de Situación
                        </h1>
                        <p className="text-gray-500 font-medium">Información agregada y anonimizada de todos los usuarios del sistema.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                        <Activity className="h-4 w-4 text-blue-600 animate-pulse" />
                        <span className="text-sm font-bold text-blue-800">Datos en Tiempo Real</span>
                    </div>
                </header>

                {/* Global Metrics Grid */}
                <div className="grid gap-6 md:grid-cols-4">
                    <MetricCard
                        icon={Users}
                        label="Usuarios Activos"
                        value={memberCount.toString()}
                        subLabel="Total registrados"
                        color="blue"
                    />
                    <MetricCard
                        icon={Sprout}
                        label="Lotes Analizados"
                        value={totalLots.toString()}
                        subLabel="Volumen de datos"
                        color="amber"
                    />
                    <MetricCard
                        icon={MapPin}
                        label="Superficie Total"
                        value={`${totalHectares.toLocaleString()} ha`}
                        subLabel="Área bajo monitoreo"
                        color="purple"
                    />
                    <MetricCard
                        icon={TrendingUp}
                        label="Evaluaciones"
                        value={totalAssessments.toLocaleString()}
                        subLabel="Impacto acumulado"
                        color="green"
                    />
                </div>

                <div className="grid gap-8 lg:grid-cols-12">
                    {/* Surface Analysis (New) */}
                    <section className="lg:col-span-12 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm overflow-hidden relative">
                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="space-y-4 max-w-xl">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <BarChart className="h-6 w-6 text-green-600" />
                                    Impacto por Superficie
                                </h2>
                                <p className="text-gray-500 leading-relaxed">
                                    Este indicador es el más crítico para la logística de insumos a gran escala.
                                    Muestra qué porcentaje real del territorio productivo requiere intervención inmediata.
                                </p>
                                <div className="flex gap-10 pt-2">
                                    <div>
                                        <div className="text-3xl font-black text-gray-900">{applyHectares.toLocaleString()} <span className="text-sm font-normal text-gray-500">ha</span></div>
                                        <div className="text-xs font-bold text-red-500 uppercase tracking-widest mt-1">Superficie a Aplicar</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-gray-900">{surfaceApplyPercent.toFixed(1)}%</div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">De la superficie total</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 w-full bg-gray-50 rounded-2xl p-6 flex items-center justify-center">
                                <div className="w-full space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-gray-600 uppercase">Proporción de Intervención</span>
                                        <span className="text-2xl font-black text-green-600">{surfaceApplyPercent.toFixed(1)}%</span>
                                    </div>
                                    <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden flex">
                                        <div
                                            className="h-full bg-red-500 transition-all duration-1000"
                                            style={{ width: `${surfaceApplyPercent}%` }}
                                        ></div>
                                        <div
                                            className="h-full bg-green-500/30 transition-all duration-1000"
                                            style={{ width: `${100 - surfaceApplyPercent}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <span>Riesgo Sanitario: Aplicar</span>
                                        <span>Otros Estados</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Abstract Background Design */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-green-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
                    </section>

                    {/* Left: Distribution by Evaluations */}
                    <div className="lg:col-span-5 space-y-8">
                        <section className="bg-white rounded-3xl border p-8 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <PieChart className="h-5 w-5 text-gray-400" />
                                Tendencias de Evaluación (Nivel Global)
                            </h2>

                            <div className="space-y-6">
                                <StatBar
                                    label="Aplicar (Riesgo Alto)"
                                    count={applyCount}
                                    total={totalAssessments}
                                    color="bg-red-500"
                                />
                                <StatBar
                                    label="Monitorear / Punto Crítico"
                                    count={monitorCount}
                                    total={totalAssessments}
                                    color="bg-yellow-400"
                                />
                                <StatBar
                                    label="No Aplicar (Riesgo Bajo)"
                                    count={noApplyCount}
                                    total={totalAssessments}
                                    color="bg-green-500"
                                />
                            </div>
                        </section>
                    </div>

                    {/* Right: Insights */}
                    <div className="lg:col-span-7">
                        <section className="bg-gray-900 text-white rounded-3xl p-8 shadow-xl h-full flex flex-col justify-center overflow-hidden relative">
                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <Activity className="h-6 w-6 text-blue-400" />
                                    Insights Regionales
                                </h2>
                                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                    A medida que más usuarios utilizan la herramienta, el sistema construye un mapa epidemiológico
                                    más preciso. Esto permite a la comunidad adelantarse a focos de infección regional.
                                </p>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                        <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Confianza de Datos</div>
                                        <div className="text-2xl font-black text-blue-400">Moderada</div>
                                        <div className="text-[10px] text-gray-500 mt-2">Basado en {memberCount} perfiles</div>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                        <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Carga de Evaluación</div>
                                        <div className="text-2xl font-black text-green-400">
                                            {(totalAssessments / Math.max(memberCount, 1)).toFixed(1)}
                                        </div>
                                        <div className="text-[10px] text-gray-500 mt-2">Promedio por usuario</div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-20 -mb-20 blur-3xl"></div>
                        </section>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function MetricCard({ icon: Icon, label, value, subLabel, color }: any) {
    const colors: any = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100",
        purple: "text-purple-600 bg-purple-50 border-purple-100",
        green: "text-green-600 bg-green-50 border-green-100",
    };
    return (
        <div className="bg-white rounded-2xl border p-6 shadow-sm hover:translate-y-[-2px] transition-all group">
            <div className={cn("inline-flex p-3 rounded-xl border mb-4 group-hover:scale-110 transition-transform", colors[color])}>
                <Icon className="h-6 w-6" />
            </div>
            <div className="text-3xl font-black text-gray-900">{value}</div>
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">{label}</div>
            <div className="text-[10px] text-gray-400 mt-3 italic border-t pt-2">{subLabel}</div>
        </div>
    );
}

function StatBar({ label, count, total, color }: any) {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between text-sm mb-2 group cursor-default">
                <span className="font-bold text-gray-700">{label}</span>
                <span className="font-black text-gray-900">{count} <span className="text-gray-400 font-normal">({percentage.toFixed(1)}%)</span></span>
            </div>
            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden p-0.5">
                <div
                    className={cn("h-full rounded-full transition-all duration-1000 shadow-inner", color)}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}
