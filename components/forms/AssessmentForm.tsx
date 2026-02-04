"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { calculateScore, type AssessmentInputs, type AssessmentResult } from "@/lib/grading-logic";
import { cn } from "@/lib/utils";
import { createAssessment, updateAssessment } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Loader2, Save, Calculator } from "lucide-react";

interface AssessmentFormProps {
    lotId: string;
    campaignId: string;
    initialData?: {
        id: string;
        soybeanVariety: string;
        inputs: AssessmentInputs;
    };
}

export default function AssessmentForm({ lotId, campaignId, initialData }: AssessmentFormProps) {
    const isEditing = !!initialData;
    const { register, handleSubmit, formState: { errors } } = useForm<AssessmentInputs & { soybeanVariety: string }>({
        defaultValues: initialData ? {
            soybeanVariety: initialData.soybeanVariety,
            ...initialData.inputs
        } : {}
    });

    const [result, setResult] = useState<AssessmentResult | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: AssessmentInputs & { soybeanVariety: string }) => {
        setIsSaving(true);
        // Convert string inputs to numbers
        const numericData: AssessmentInputs = {
            rainfall: Number(data.rainfall),
            rainIntensity: Number(data.rainIntensity),
            cropRotation: Number(data.cropRotation),
            tillage: Number(data.tillage),
            inoculum: Number(data.inoculum),
            seedHealth: Number(data.seedHealth),
            cycleLength: Number(data.cycleLength),
            destination: Number(data.destination),
            yieldPotential: Number(data.yieldPotential),
            symptoms: Number(data.symptoms),
        };

        const calculation = calculateScore(numericData);
        setResult(calculation);

        try {
            if (isEditing && initialData) {
                await updateAssessment(initialData.id, calculation.score, calculation.recommendation, numericData, data.soybeanVariety);
                router.push(`/assessments/${initialData.id}`);
            } else {
                const id = await createAssessment(lotId, campaignId, calculation.score, calculation.recommendation, numericData, data.soybeanVariety);
                router.push(`/assessments/${id}`);
            }
        } catch (error) {
            console.error("Error saving assessment:", error);
            setIsSaving(false);
            alert("Hubo un error al guardar la evaluación.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-black mb-6 text-gray-900 border-b border-gray-50 pb-4 flex items-center gap-3">
                {isEditing ? (
                    <Save className="h-7 w-7 text-blue-600" />
                ) : (
                    <Calculator className="h-7 w-7 text-green-600" />
                )}
                {isEditing ? "Editar Registro de Evaluación" : "Nueva Evaluación de Fungicida"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Variety selection */}
                <div className="form-group pb-4 border-b border-gray-50">
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Variedad de Soja</label>
                    <input
                        {...register("soybeanVariety")}
                        className="w-full p-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all shadow-sm"
                        placeholder="Ej: Nidera 4611"
                    />
                    <p className="text-[10px] text-gray-400 mt-2 font-medium italic">La genética influye en la respuesta final del cultivo.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* 1. Rainfall */}
                    <div className="form-group">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Precipitaciones (R3-R5)</label>
                        <select {...register("rainfall")} className="w-full p-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none bg-white font-medium shadow-sm transition-all text-sm">
                            <option value="3">&gt; 80 mm (Muy Alto)</option>
                            <option value="2">65 - 80 mm (Alto)</option>
                            <option value="1">50 - 65 mm (Medio)</option>
                            <option value="0">&lt; 50 mm (Bajo)</option>
                        </select>
                    </div>

                    {/* 2. Intensity */}
                    <div className="form-group">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Intensidad Lluvias</label>
                        <select {...register("rainIntensity")} className="w-full p-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none bg-white font-medium shadow-sm transition-all text-sm">
                            <option value="1">Alta (&ge; 75% eventos &gt;7mm)</option>
                            <option value="0">Baja (&lt; 75%)</option>
                        </select>
                    </div>

                    {/* 3. Crop Rotation */}
                    <div className="form-group">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Rotación de Cultivos</label>
                        <select {...register("cropRotation")} className="w-full p-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none bg-white font-medium shadow-sm transition-all text-sm">
                            <option value="3">Monocultivo (&gt; 2 años)</option>
                            <option value="2">Monocultivo (1 año)</option>
                            <option value="1">Maíz / Sorgo / Trigo</option>
                            <option value="0">Sin soja &gt; 2 años</option>
                        </select>
                    </div>

                    {/* 4. Tillage */}
                    <div className="form-group">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Sistema de Labranza</label>
                        <select {...register("tillage")} className="w-full p-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none bg-white font-medium shadow-sm transition-all text-sm">
                            <option value="1">Siembra Directa</option>
                            <option value="0">Labranza Convencional</option>
                        </select>
                    </div>

                    {/* 5. Inoculum */}
                    <div className="form-group">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Inóculo en Rastrojo</label>
                        <select {...register("inoculum")} className="w-full p-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none bg-white font-medium shadow-sm transition-all text-sm">
                            <option value="1">Presencia Visible</option>
                            <option value="0">Ausencia</option>
                        </select>
                    </div>

                    {/* 6. Seed Health */}
                    <div className="form-group">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Sanidad de Semilla</label>
                        <select {...register("seedHealth")} className="w-full p-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none bg-white font-medium shadow-sm transition-all text-sm">
                            <option value="1">Sin Tratamiento Profesional</option>
                            <option value="0">Tratada con Fungicidas</option>
                        </select>
                    </div>

                    {/* 7. Cycle Length */}
                    <div className="form-group">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Largo del Ciclo</label>
                        <select {...register("cycleLength")} className="w-full p-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none bg-white font-medium shadow-sm transition-all text-sm">
                            <option value="2">Largo (&gt; 145 días)</option>
                            <option value="1">Intermedio (134-145 días)</option>
                            <option value="0">Corto (&lt; 134 días)</option>
                        </select>
                    </div>

                    {/* 8. Destination */}
                    <div className="form-group">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Destino de Producción</label>
                        <select {...register("destination")} className="w-full p-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none bg-white font-medium shadow-sm transition-all text-sm">
                            <option value="1">Producción de Semilla</option>
                            <option value="0">Producción de Grano</option>
                        </select>
                    </div>

                    {/* 9. Yield Potential */}
                    <div className="form-group">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Rendimiento Potencial</label>
                        <select {...register("yieldPotential")} className="w-full p-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none bg-white font-medium shadow-sm transition-all text-sm">
                            <option value="2">&gt; 3500 kg/ha</option>
                            <option value="1">2500 - 3500 kg/ha</option>
                            <option value="0">&lt; 2500 kg/ha</option>
                        </select>
                    </div>

                    {/* 10. Symptoms */}
                    <div className="form-group">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Presencia de Síntomas</label>
                        <select {...register("symptoms")} className="w-full p-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none bg-white font-medium shadow-sm transition-all text-sm">
                            <option value="1">Síntomas Visibles en Lote</option>
                            <option value="0">Lote Limpio / Sin Síntomas</option>
                        </select>
                    </div>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={cn(
                            "w-full text-white font-bold py-4 px-6 rounded-2xl transition-all text-lg flex justify-center items-center gap-2 shadow-lg active:scale-95 disabled:grayscale disabled:cursor-not-allowed",
                            isEditing ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200" : "bg-green-700 hover:bg-green-800 shadow-green-200"
                        )}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-6 w-6 animate-spin" />
                                {isEditing ? "Guardando Cambios..." : "Calculando y Guardando..."}
                            </>
                        ) : (
                            <>
                                {isEditing ? <Save className="h-6 w-6" /> : <Calculator className="h-6 w-6" />}
                                {isEditing ? "Actualizar Evaluación" : "Registrar Evaluación"}
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-full mt-3 text-gray-400 font-bold py-2 px-6 rounded-2xl hover:bg-gray-50 transition-all text-sm"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
