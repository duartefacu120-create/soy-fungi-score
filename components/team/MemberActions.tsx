"use client";

import { Trash2, Crown } from "lucide-react";
import { removeMemberFromOrganization, handleTransferOwnershipAction } from "@/app/actions";
import { useState } from "react";

export default function MemberActions({ memberId, memberEmail }: { memberId: string, memberEmail: string }) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleRemove() {
        if (!confirm(`¿Seguro que quieres eliminar a ${memberEmail} de la empresa?`)) {
            return;
        }
        setIsLoading(true);
        try {
            await removeMemberFromOrganization(memberId);
            window.location.href = "/team?message=Miembro eliminado";
        } catch (e: any) {
            alert(e.message);
            setIsLoading(false);
        }
    }

    async function handleTransfer() {
        const confirmTransfer = confirm(
            `¿ESTÁS SEGURO? Estás a punto de transferir la propiedad de la empresa a ${memberEmail}.\n\n` +
            `DEJARÁS DE SER EL DUEÑO y no podrás revertir esta acción a menos que el nuevo dueño te la devuelva.`
        );

        if (confirmTransfer) {
            setIsLoading(true);
            try {
                // We call the action directly or via form
                await handleTransferOwnershipAction(memberId);
            } catch (e: any) {
                // If it's a redirect error (standard in Next.js actions), we don't treat it as error
                if (!e.message.includes('NEXT_REDIRECT')) {
                    alert(e.message);
                }
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleTransfer}
                disabled={isLoading}
                className="p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all disabled:opacity-50"
                title="Ceder Propiedad (Hacer Dueño)"
            >
                <Crown className="h-5 w-5" />
            </button>
            <button
                onClick={handleRemove}
                disabled={isLoading}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                title="Eliminar de la empresa"
            >
                <Trash2 className="h-5 w-5" />
            </button>
        </div>
    );
}
