import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
                SoyFungiScore
            </h1>
            <p className="text-lg text-gray-600 max-w-md mb-8">
                Plataforma de decisión agronómica para el manejo de enfermedades de fin de ciclo en soja.
            </p>

            <div className="flex gap-4 flex-col sm:flex-row">
                <Link
                    href="/login"
                    className="bg-green-700 text-white hover:bg-green-800 px-8 py-3 rounded-lg font-medium transition-colors shadow-sm"
                >
                    Iniciar Sesión
                </Link>
                <Link
                    href="/signup"
                    className="bg-white text-green-700 border border-green-700 hover:bg-green-50 px-8 py-3 rounded-lg font-medium transition-colors shadow-sm"
                >
                    Crear Cuenta
                </Link>
                <Link
                    href="/dashboard"
                    className="text-gray-500 hover:text-green-700 px-4 py-3 text-sm font-medium transition-colors"
                >
                    (Demo Dashboard)
                </Link>
            </div>
        </main>
    );
}
