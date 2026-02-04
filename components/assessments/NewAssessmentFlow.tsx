"use client";

import { useState } from "react";
import AssessmentForm from "@/components/forms/AssessmentForm";

type Lot = {
    id: string;
    name: string;
}

type Establishment = {
    id: string;
    name: string;
    lots: Lot[];
}

type Campaign = {
    id: string;
    name: string;
    is_active: boolean;
}

export default function NewAssessmentFlow({
    establishments,
    campaigns
}: {
    establishments: Establishment[];
    campaigns: Campaign[];
}) {
    const [step, setStep] = useState<"select-lot" | "evaluate">("select-lot");
    const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns.find(c => c.is_active)?.id || "");
    const [selectedEstablishmentId, setSelectedEstablishmentId] = useState("");
    const [selectedLotId, setSelectedLotId] = useState("");

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedLotId && selectedCampaignId) {
            setStep("evaluate");
        }
    };

    const activeEstablishment = establishments.find(e => e.id === selectedEstablishmentId);
    const lots = activeEstablishment ? activeEstablishment.lots : [];

    return (
        <div>
            {step === "select-lot" ? (
                <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-4">Seleccionar Lote</h2>
                    <form onSubmit={handleContinue} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Campaña</label>
                            <select
                                className="w-full p-2 border rounded-md"
                                value={selectedCampaignId}
                                onChange={(e) => setSelectedCampaignId(e.target.value)}
                                required
                            >
                                <option value="">-- Seleccionar Campaña --</option>
                                {campaigns.map(campaign => (
                                    <option key={campaign.id} value={campaign.id}>
                                        {campaign.name} {campaign.is_active && "(Activa)"}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Establecimiento</label>
                            <select
                                className="w-full p-2 border rounded-md"
                                value={selectedEstablishmentId}
                                onChange={(e) => {
                                    setSelectedEstablishmentId(e.target.value);
                                    setSelectedLotId(""); // Reset lot when establishment changes
                                }}
                                required
                            >
                                <option value="">-- Seleccionar Establecimiento --</option>
                                {establishments.map(est => (
                                    <option key={est.id} value={est.id}>{est.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lote</label>
                            <select
                                className="w-full p-2 border rounded-md"
                                value={selectedLotId}
                                onChange={(e) => setSelectedLotId(e.target.value)}
                                required
                                disabled={!selectedEstablishmentId}
                            >
                                <option value="">-- Seleccionar Lote --</option>
                                {lots.map(lot => (
                                    <option key={lot.id} value={lot.id}>{lot.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={!selectedLotId || !selectedCampaignId}
                                className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
                            >
                                Continuar a Calculadora
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <AssessmentForm lotId={selectedLotId} campaignId={selectedCampaignId} />
            )}
        </div>
    );
}
