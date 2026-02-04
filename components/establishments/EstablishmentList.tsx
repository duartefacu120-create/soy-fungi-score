"use client";

import Link from "next/link";
import { MapPin, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteEstablishment } from "@/app/actions";
import { useState } from "react";

type Establishment = {
    id: string;
    name: string;
    location: string | null;
    _count: {
        lots: number;
    }
};

export default function EstablishmentList({ establishments: initialEst }: { establishments: Establishment[] }) {
    const router = useRouter();
    const [establishments, setEstablishments] = useState(initialEst);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (confirm("¿Eliminar establecimiento?")) {
            setEstablishments(prev => prev.filter(est => est.id !== id));
            await deleteEstablishment(id);
            router.refresh();
        }
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {establishments.map((est) => (
                <div key={est.id} className="bg-white rounded-xl shadow-sm border p-6 hover:border-green-500 transition-colors group relative cursor-pointer" onClick={() => router.push(`/establishments/${est.id}`)}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            {/* Link for accessibility, but the whole card is clickable via onClick for better UX area */}
                            <h3 className="font-bold text-xl text-gray-800 group-hover:text-green-700">{est.name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <div
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent card click
                                    handleDelete(est.id, e);
                                }}
                                className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-gray-100 z-10"
                                title="Eliminar"
                            >
                                <Trash2 className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">{est.location || "Sin ubicación"}</p>
                    <div className="border-t pt-4">
                        <span className="text-sm font-medium text-gray-600">{est._count.lots} Lotes Activos</span>
                    </div>
                </div>
            ))}
            {establishments.length === 0 && (
                <p className="text-gray-500 col-span-3 text-center py-8">No hay establecimientos registrados.</p>
            )}
        </div>
    );
}
