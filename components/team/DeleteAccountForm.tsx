"use client";

import { Trash2 } from "lucide-react";
import { deleteAccount } from "@/app/actions";

export default function DeleteAccountForm() {
    async function handleSubmit(e: React.FormEvent) {
        if (!confirm("¿Estás ABSOLUTAMENTE seguro? Esta acción no se puede deshacer y borrará TODO lo que creaste.")) {
            e.preventDefault();
            return;
        }
    }

    return (
        <form action={deleteAccount} onSubmit={handleSubmit}>
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-all shadow-md">
                Borrar Cuenta para Siempre
            </button>
        </form>
    );
}
