"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";

type LotInputs = {
    name: string;
    establishmentId: string;
    hectares: number;
    soybeanVariety: string;
    plantingDate: string;
};

export default function LotForm() {
    const { register, handleSubmit } = useForm<LotInputs>();

    const onSubmit = (data: LotInputs) => {
        console.log("Creating Lot:", data);
        alert("Lote creado (Mock): " + data.name);
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">Nuevo Lote</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Mock Establishment Select */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Establecimiento</label>
                    <select
                        {...register("establishmentId")}
                        className="w-full p-2 border rounded-md bg-gray-50"
                    >
                        <option value="mock-est-id">La Estancia</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre / Identificador del Lote</label>
                    <input
                        {...register("name", { required: true })}
                        placeholder="Ej: Lote 14B"
                        className="w-full p-2 border rounded-md focus:border-green-500 focus:ring-green-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hectáreas</label>
                        <input
                            type="number"
                            step="0.1"
                            {...register("hectares", { required: true })}
                            className="w-full p-2 border rounded-md focus:border-green-500 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Siembra</label>
                        <input
                            type="date"
                            {...register("plantingDate")}
                            className="w-full p-2 border rounded-md focus:border-green-500 focus:ring-green-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Variedad de Soja</label>
                    <input
                        {...register("soybeanVariety")}
                        placeholder="Ej: DM 46i20"
                        className="w-full p-2 border rounded-md focus:border-green-500 focus:ring-green-500"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <Link href="/establishments" className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50">
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
