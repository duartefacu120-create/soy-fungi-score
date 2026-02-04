import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, FileCheck } from "lucide-react";
import DashboardLayout from "@/app/dashboard/layout";
import { getAssessment } from "@/app/actions";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function AssessmentDetailsPage({ params }: { params: { id: string } }) {
    const assessment = await getAssessment(params.id);

    if (!assessment) {
        return notFound();
    }

    const inputData = JSON.parse(assessment.input_data as string);

    const isApply = assessment.recommendation_result === "Aplicar";
    const isMonitor = assessment.recommendation_result.includes("Monitorear");

    const statusColor = isApply
        ? "bg-red-100 text-red-800"
        : isMonitor
            ? "bg-yellow-100 text-yellow-800"
            : "bg-green-100 text-green-800";

    const borderColor = isApply
        ? "border-red-500"
        : isMonitor
            ? "border-yellow-500"
            : "border-green-500";

    const bgHeader = isApply
        ? "bg-red-50"
        : isMonitor
            ? "bg-yellow-50"
            : "bg-green-50";

    return (
        <DashboardLayout>
            <div className="mb-6">
                <Link href="/dashboard" className="flex items-center text-gray-500 hover:text-green-700 mb-4 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Volver al Dashboard
                </Link>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Detalle de Evaluación</h1>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-gray-500 mt-2">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{assessment.lot.establishment.name} - {assessment.lot.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(assessment.date_performed).toLocaleDateString("es-AR")}</span>
                            </div>
                            {assessment.soybean_variety && (
                                <div className="flex items-center gap-2 bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                                    <span className="text-xs font-semibold">Variedad:</span>
                                    <span>{assessment.soybean_variety}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={cn("px-4 py-2 rounded-full font-bold text-lg border", statusColor, borderColor)}>
                        {assessment.recommendation_result}
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Score Card */}
                <div className={cn("md:col-span-1 rounded-xl border p-6 text-center flex flex-col justify-center", bgHeader, borderColor)}>
                    <div className="text-sm uppercase tracking-wider font-semibold opacity-70 mb-2">Puntaje de Riesgo</div>
                    <div className="text-6xl font-extrabold mb-2">{assessment.total_score}</div>
                    <p className="text-sm opacity-80">Puntos Totales</p>
                </div>

                {/* Input Details */}
                <div className="md:col-span-2 rounded-xl border bg-white shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-gray-50 font-medium flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-gray-500" />
                        Variables Registradas
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        <DetailItem label="Precipitaciones (R3-R5)" value={getLabelForValue("rainfall", inputData.rainfall)} />
                        <DetailItem label="Intensidad Lluvias" value={getLabelForValue("rainIntensity", inputData.rainIntensity)} />
                        <DetailItem label="Rotación de Cultivos" value={getLabelForValue("cropRotation", inputData.cropRotation)} />
                        <DetailItem label="Labranza" value={getLabelForValue("tillage", inputData.tillage)} />
                        <DetailItem label="Inóculo en Rastrojo" value={getLabelForValue("inoculum", inputData.inoculum)} />
                        <DetailItem label="Sanidad de Semilla" value={getLabelForValue("seedHealth", inputData.seedHealth)} />
                        <DetailItem label="Ciclo del Cultivo" value={getLabelForValue("cycleLength", inputData.cycleLength)} />
                        <DetailItem label="Destino de Producción" value={getLabelForValue("destination", inputData.destination)} />
                        <DetailItem label="Rendimiento Potencial" value={getLabelForValue("yieldPotential", inputData.yieldPotential)} />
                        <DetailItem label="Síntomas en Lote" value={getLabelForValue("symptoms", inputData.symptoms)} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function DetailItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-900 text-right">{value}</span>
        </div>
    );
}

// Helper to reconstruct labels from values (simplified mapping, ideally shared with form)
function getLabelForValue(key: string, value: number): string {
    const mappings: any = {
        rainfall: { 3: "> 80 mm", 2: "65-80 mm", 1: "50-65 mm", 0: "< 50 mm" },
        rainIntensity: { 1: "Alta", 0: "Baja" },
        cropRotation: { 3: "Monocultivo >2a", 2: "Monocultivo 1a", 1: "Maíz/Sorgo", 0: "Sin soja >2a" },
        tillage: { 1: "Siembra Directa", 0: "Convencional" },
        inoculum: { 1: "Presente", 0: "Ausente" },
        seedHealth: { 1: "Sin Tratamiento", 0: "Tratada" },
        cycleLength: { 2: "Largo", 1: "Intermedio", 0: "Corto" },
        destination: { 1: "Semilla", 0: "Grano" },
        yieldPotential: { 2: "> 3000 kg", 1: "2500-3000 kg", 0: "2000-2500 kg" },
        symptoms: { 1: "Presentes", 0: "Ausentes" }
    };
    return mappings[key]?.[value] ?? value.toString();
}
