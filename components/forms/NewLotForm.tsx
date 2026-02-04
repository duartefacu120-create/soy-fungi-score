"use client";

import { createLot } from "@/app/actions";
import { useState } from "react";
import { PlusCircle } from "lucide-react";

export default function NewLotForm({ establishmentId }: { establishmentId: string }) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
            >
                <PlusCircle className="h-5 w-5" />
                Nuevo Lote
            </button>
        );
    }

    return (
        <div className="bg-gray-50 border rounded-xl p-6 mt-4 animate-in fade-in slide-in-from-top-2">
            <h3 className="font-bold text-lg mb-4">Agregar Nuevo Lote</h3>
            <form action={createLot.bind(null, establishmentId)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Lote</label>
                        <input name="name" type="text" required className="w-full p-2 border rounded-md" placeholder="Ej: Lote Norte" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hectáreas</label>
                        <input name="hectares" type="number" step="0.1" required className="w-full p-2 border rounded-md" />
                    </div>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                    <button
                        type="button"
                        onClick={() => setIsExpanded(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
                    >
                        Guardar Lote
                    </button>
                </div>
            </form>
        </div>
    );
}
