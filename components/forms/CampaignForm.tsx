"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";

type CampaignInputs = {
    name: string; // e.g. "Soja 2025/2026"
    isActive: boolean;
};

export default function CampaignForm() {
    const { register, handleSubmit } = useForm<CampaignInputs>();

    const onSubmit = (data: CampaignInputs) => {
        console.log("Creating Campaign:", data);
        alert("Campaña creada (Mock): " + data.name);
        // TODO: Server action
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">Nueva Campaña</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Campaña</label>
                    <input
                        {...register("name", { required: true })}
                        placeholder="Ej: Soja 2025/2026"
                        className="w-full p-2 border rounded-md focus:border-green-500 focus:ring-green-500"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        {...register("isActive")}
                        id="isActive"
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        defaultChecked
                    />
                    <label htmlFor="isActive" className="text-sm text-gray-700">Marcar como activa</label>
                </div>

                <div className="flex gap-4 pt-4">
                    <Link href="/campaigns" className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50">
                        Cancelar
                    </Link>
                    <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
}
