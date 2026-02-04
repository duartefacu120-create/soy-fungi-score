"use client";

import Link from "next/link";
import { useState } from "react";
import { forgotPassword } from "@/app/actions";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const formData = new FormData();
            formData.append("email", email);
            const result = await forgotPassword(formData);

            if (result && result.error) {
                setMessage({ type: 'error', text: result.error });
            } else {
                setMessage({ type: 'success', text: "Si el correo existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña en unos momentos." });
            }
        } catch (error) {
            setMessage({ type: 'error', text: "Ocurrió un error inesperado. Intente más tarde." });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Recuperar Contraseña</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                    </p>
                </div>

                {message && (
                    <div className={`rounded-md p-4 text-sm border ${message.type === 'success'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                        {message.text}
                    </div>
                )}

                {!(message?.type === 'success') && (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full justify-center rounded-md border border-transparent bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
                            </button>
                        </div>
                    </form>
                )}

                <div className="text-center text-sm">
                    <Link href="/login" className="font-medium text-green-700 hover:text-green-600">
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}
