"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/app/actions";
import Link from "next/link";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg text-center">
                    <h2 className="text-2xl font-bold text-red-600">Enlace inválido</h2>
                    <p className="mt-2 text-gray-600">Este enlace de recuperación no es válido o ha expirado.</p>
                    <Link href="/forgot-password" title="Volver" className="mt-4 inline-block text-green-700 font-medium">
                        Solicitar uno nuevo
                    </Link>
                </div>
            </div>
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: "Las contraseñas no coinciden." });
            return;
        }

        if (password.length < 6) {
            setMessage({ type: 'error', text: "La contraseña debe tener al menos 6 caracteres." });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const formData = new FormData();
            formData.append("token", token!);
            formData.append("password", password);

            const result = await resetPassword(formData);

            if (result && result.error) {
                setMessage({ type: 'error', text: result.error });
            } else {
                setMessage({ type: 'success', text: "Tu contraseña ha sido restablecida correctamente. Serás redirigido al inicio de sesión..." });
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            }
        } catch (error) {
            setMessage({ type: 'error', text: "Ocurrió un error inesperado." });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Nueva Contraseña</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Ingresa tu nueva contraseña para acceder a tu cuenta.
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
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="password" title="Contraseña" className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" title="Confirmar Contraseña" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full justify-center rounded-md border border-transparent bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Cambiando..." : "Cambiar contraseña"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando...</p>
                </div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
