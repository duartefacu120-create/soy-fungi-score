"use client";

import { Trash2, CheckCircle2, Circle } from "lucide-react";
import { deleteCampaign, setActiveCampaign } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Campaign = {
    id: string;
    name: string;
    is_active: boolean;
};

export default function CampaignList({ campaigns: initialCampaigns }: { campaigns: Campaign[] }) {
    const router = useRouter();
    const [campaigns, setCampaigns] = useState(initialCampaigns);

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar esta campaña? Se eliminarán todos sus establecimientos, lotes y evaluaciones.")) {
            setCampaigns(prev => prev.filter(c => c.id !== id));
            await deleteCampaign(id);
            router.refresh();
        }
    };

    const handleSetActive = async (id: string) => {
        // Optimistic update
        setCampaigns(prev => prev.map(c => ({
            ...c,
            is_active: c.id === id
        })));

        await setActiveCampaign(id);
        router.refresh();
    };

    return (
        <div className="grid gap-4">
            {campaigns.map((c) => (
                <div key={c.id} className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm hover:border-green-500 transition-colors">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleSetActive(c.id)}
                            className="text-gray-400 hover:text-green-600 transition-colors"
                            title={c.is_active ? "Campaña activa" : "Activar campaña"}
                        >
                            {c.is_active ? (
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                            ) : (
                                <Circle className="h-6 w-6" />
                            )}
                        </button>
                        <div>
                            <h3 className="font-bold text-lg">{c.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${c.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                {c.is_active ? 'Activa' : 'Inactiva'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => handleDelete(c.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>
            ))}

            {campaigns.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border">
                    <p className="text-gray-500 mb-4">No hay campañas registradas.</p>
                    <p className="text-sm text-gray-400">Crea tu primera campaña para comenzar.</p>
                </div>
            )}
        </div>
    );
}
