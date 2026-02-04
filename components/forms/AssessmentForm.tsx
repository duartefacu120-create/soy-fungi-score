"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { calculateScore, type AssessmentInputs, type AssessmentResult } from "@/lib/grading-logic";
import { cn } from "@/lib/utils";
import { createAssessment } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AssessmentForm({ lotId, campaignId }: { lotId: string; campaignId: string }) {
    const { register, handleSubmit, formState: { errors } } = useForm<AssessmentInputs & { soybeanVariety: string }>();
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
            const id = await createAssessment(lotId, campaignId, calculation.score, calculation.recommendation, numericData, data.soybeanVariety);
            router.push(`/assessments/${id}`);
        } catch (error) {
            console.error("Error saving assessment:", error);
            setIsSaving(false);
            alert("Hubo un error al guardar la evaluación.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-green-900 border-b pb-2">Nueva Evaluación de Fungicida</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Variety selection */}
                <div className="form-group pb-4 border-b">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Variedad de Soja</label>
                    <input
                        {...register("soybeanVariety")}
                        className="w-full p-2 border rounded-md"
                        placeholder="Ej: Nidera 4611"
                    />
                    <p className="text-xs text-gray-400 mt-1">La variedad puede variar en el mismo lote según la campaña.</p>
                </div>

                {/* 1. Rainfall */}
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precipitaciones (R3-R5)</label>
                    <select {...register("rainfall")} className="w-full p-2 border rounded-md">
                        <option value="3">&gt; 80 mm</option>
                        <option value="2">65 - 80 mm</option>
                        <option value="1">50 - 65 mm</option>
                        <option value="0">&lt; 50 mm</option>
                    </select>
                </div>

                {/* 2. Intensity */}
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Intensidad Lluvias (eventos &gt;7mm de los de &gt;2mm)</label>
                    <select {...register("rainIntensity")} className="w-full p-2 border rounded-md">
                        <option value="1">Alta (&ge; 75%)</option>
                        <option value="0">Baja (&lt; 75%)</option>
                    </select>
                </div>

                {/* 3. Crop Rotation */}
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rotación de Cultivos</label>
                    <select {...register("cropRotation")} className="w-full p-2 border rounded-md">
                        <option value="3">Monocultivo (&gt; 2 años)</option>
                        <option value="2">Monocultivo (1 año)</option>
                        <option value="1">Antecesor no hospedante (Maíz/Sorgo)</option>
                        <option value="0">Sin soja &gt; 2 años</option>
                    </select>
                </div>

                {/* 4. Tillage */}
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Labranza</label>
                    <select {...register("tillage")} className="w-full p-2 border rounded-md">
                        <option value="1">Siembra Directa</option>
                        <option value="0">Convencional</option>
                    </select>
                </div>

                {/* 5. Inoculum */}
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Inóculo en Rastrojo</label>
                    <select {...register("inoculum")} className="w-full p-2 border rounded-md">
                        <option value="1">Presente</option>
                        <option value="0">Ausente</option>
                    </select>
                </div>

                {/* 6. Seed Health */}
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sanidad de Semilla</label>
                    <select {...register("seedHealth")} className="w-full p-2 border rounded-md">
                        <option value="1">Sin Tratamiento</option>
                        <option value="0">Tratada con Fungicidas</option>
                    </select>
                </div>

                {/* 7. Cycle Length */}
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ciclo del Cultivo</label>
                    <select {...register("cycleLength")} className="w-full p-2 border rounded-md">
                        <option value="2">Largo (&gt; 145 días)</option>
                        <option value="1">Intermedio (134 - 145 días)</option>
                        <option value="0">Corto (&lt; 134 días)</option>
                    </select>
                </div>

                {/* 8. Destination */}
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destino de la Producción</label>
                    <select {...register("destination")} className="w-full p-2 border rounded-md">
                        <option value="1">Semilla</option>
                        <option value="0">Grano</option>
                    </select>
                </div>

                {/* 9. Yield Potential */}
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rendimiento Potencial</label>
                    <select {...register("yieldPotential")} className="w-full p-2 border rounded-md">
                        <option value="2">&gt; 3000 kg/ha</option>
                        <option value="1">2500 - 2999 kg/ha</option>
                        <option value="0">2000 - 2499 kg/ha</option>
                    </select>
                </div>

                {/* 10. Symptoms */}
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Síntomas en el Lote</label>
                    <select {...register("symptoms")} className="w-full p-2 border rounded-md">
                        <option value="1">Presentes</option>
                        <option value="0">Ausentes</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg flex justify-center items-center gap-2"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Calculando y Guardando...
                        </>
                    ) : (
                        "Calcular Riesgo"
                    )}
                </button>
            </form>
        </div>
    );
}
