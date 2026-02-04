"use client";

import Link from "next/link";
import { createCampaign } from "@/app/actions";

export default function CampaignForm() {
    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">Nueva Campaña</h2>
            <form action={createCampaign} className="space-y-6">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Campaña</label>
                    <input
                        name="name"
                        required
                        placeholder="Ej: Soja 2025/2026"
                        className="w-full p-2 border rounded-md focus:border-green-500 focus:ring-green-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">Esta campaña se marcará como activa automáticamente</p>
                </div>

                <div className="flex gap-4 pt-4">
                    <Link href="/campaigns" className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50">
                        Cancelar
                    </Link>
                    <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800">
                        Crear Campaña
                    </button>
                </div>
            </form>
        </div>
    );
}
