"use client";

import Link from "next/link";
import { createEstablishment } from "@/app/actions";

export default function EstablishmentForm() {
    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">Nuevo Establecimiento</h2>
            <form action={createEstablishment} className="space-y-6">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Campaña</label>
                    <select
                        name="campaignId"
                        className="w-full p-2 border rounded-md bg-gray-50"
                        disabled
                    >
                        <option value="mock-id">Soja 2025/2026</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Establecimiento</label>
                    <input
                        name="name"
                        required
                        placeholder="Ej: La Estancia"
                        className="w-full p-2 border rounded-md focus:border-green-500 focus:ring-green-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación (Localidad)</label>
                    <input
                        name="location"
                        placeholder="Ej: Pergamino, Buenos Aires"
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
