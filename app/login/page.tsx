import Link from "next/link";
import { login } from "@/app/actions";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Iniciar Sesión</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Ingresa a tu cuenta de SoyFungiScore
                    </p>
                </div>

                <form action={login} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">Demo: cualquier contraseña funciona</p>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md border border-transparent bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Ingresar
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    <span className="text-gray-500">¿No tienes cuenta? </span>
                    <Link href="/signup" className="font-medium text-green-700 hover:text-green-600">
                        Regístrate aquí
                    </Link>
                </div>
            </div>
        </div>
    );
}
