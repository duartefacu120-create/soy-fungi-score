"use client";

import { Trash2 } from "lucide-react";
import { removeMemberFromOrganization } from "@/app/actions";
import { redirect } from "next/navigation";

export default function RemoveMemberButton({ memberId }: { memberId: string }) {
    async function handleRemove(formData: FormData) {
        if (!confirm("¿Seguro que quieres eliminar a este miembro de la empresa?")) {
            return;
        }
        try {
            await removeMemberFromOrganization(memberId);
            // The action redirects or revalidates, but we can add a local reload if needed
            window.location.href = "/team?message=Miembro eliminado";
        } catch (e: any) {
            alert(e.message);
        }
    }

    return (
        <form action={handleRemove}>
            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Eliminar de la empresa">
                <Trash2 className="h-4 w-4" />
            </button>
        </form>
    );
}
