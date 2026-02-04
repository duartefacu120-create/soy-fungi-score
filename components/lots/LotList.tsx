"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { updateLot, deleteLot } from "@/app/actions";
import { useRouter } from "next/navigation";

type Lot = {
    id: string;
    name: string;
    hectares: number;
    created_at: Date;
};

export default function LotList({ lots: initialLots }: { lots: Lot[] }) {
    const router = useRouter();
    const [lots, setLots] = useState(initialLots);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editHectares, setEditHectares] = useState("");

    const handleEdit = (lot: Lot) => {
        setEditingId(lot.id);
        setEditName(lot.name);
        setEditHectares(lot.hectares.toString());
    };

    const handleSave = async (id: string) => {
        const formData = new FormData();
        formData.append("name", editName);
        formData.append("hectares", editHectares);

        await updateLot(id, formData);
        setEditingId(null);
        router.refresh();
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditName("");
        setEditHectares("");
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`¿Eliminar el lote "${name}"? Se eliminarán todas sus evaluaciones.`)) {
            setLots(prev => prev.filter(l => l.id !== id));
            await deleteLot(id);
            router.refresh();
        }
    };

    if (lots.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                No hay lotes registrados en este establecimiento.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {lots.map((lot) => (
                <div key={lot.id} className="bg-white border rounded-lg p-4 hover:border-green-500 transition-colors">
                    {editingId === lot.id ? (
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="flex-1 p-2 border rounded-md"
                                placeholder="Nombre del lote"
                            />
                            <input
                                type="number"
                                step="0.1"
                                value={editHectares}
                                onChange={(e) => setEditHectares(e.target.value)}
                                className="w-32 p-2 border rounded-md"
                                placeholder="Hectáreas"
                            />
                            <button
                                onClick={() => handleSave(lot.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                                title="Guardar"
                            >
                                <Check className="h-5 w-5" />
                            </button>
                            <button
                                onClick={handleCancel}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                                title="Cancelar"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-lg">{lot.name}</h4>
                                <p className="text-sm text-gray-500">{lot.hectares} hectáreas</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(lot)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                    title="Editar"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(lot.id, lot.name)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    title="Eliminar"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
