"use client";

import { X } from "lucide-react";
import { handleCancelInvitationAction } from "@/app/actions";
import { useState } from "react";

export default function CancelInvitationButton({ invitationId }: { invitationId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleCancel() {
        if (!confirm("¿Seguro que quieres cancelar esta invitación?")) {
            return;
        }
        setIsLoading(true);
        try {
            await handleCancelInvitationAction(invitationId);
        } catch (e: any) {
            if (!e.message.includes('NEXT_REDIRECT')) {
                alert(e.message);
                setIsLoading(false);
            }
        }
    }

    return (
        <button
            onClick={handleCancel}
            disabled={isLoading}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
            title="Cancelar Invitación"
        >
            <X className="h-4 w-4" />
        </button>
    );
}
