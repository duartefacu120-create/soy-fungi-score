"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { updateEstablishment } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function EstablishmentHeader({
    establishment
}: {
    establishment: { id: string; name: string; location: string | null }
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(establishment.name);
    const [location, setLocation] = useState(establishment.location || "");
    const router = useRouter();

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("location", location);

        await updateEstablishment(establishment.id, formData);
        setIsEditing(false);
        router.refresh();
    };

    if (isEditing) {
        return (
            <div className="mb-6 bg-white p-4 rounded-xl border-2 border-green-500 shadow-sm">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 caps text-xs uppercase tracking-wider">Nombre del Establecimiento</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full text-2xl font-bold p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="Nombre del establecimiento"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 text-xs uppercase tracking-wider">Ubicación</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="Ubicación (opcional)"
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-bold transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-all font-bold"
                        >
                            <Check className="h-5 w-5" />
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-6 group">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 leading-tight">{establishment.name}</h1>
                    {establishment.location && (
                        <p className="text-gray-500 mt-1 font-medium">{establishment.location}</p>
                    )}
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                    title="Editar nombre y ubicación"
                >
                    <Pencil className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
