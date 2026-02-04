"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";

export default function SuccessAlert() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const success = searchParams.get("success");
        if (success === "campaign") {
            setMessage("¡Campaña creada con éxito!");
            setIsVisible(true);
        } else if (success === "lot") {
            setMessage("¡Lote creado con éxito!");
            setIsVisible(true);
        }

        if (success) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                // Clear the query param
                const newUrl = window.location.pathname;
                window.history.replaceState({}, '', newUrl);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    if (!isVisible || !message) return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-bold">{message}</span>
                <button
                    onClick={() => setIsVisible(false)}
                    className="ml-2 hover:bg-green-100 p-1 rounded-full transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
