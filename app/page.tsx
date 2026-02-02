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

            <div className="flex gap-4">
                <Link
                    href="/dashboard"
                    className="bg-primary text-white hover:bg-green-800 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                    Ingresar al Dashboard
                </Link>
                {/* Placeholder for Auth */}
            </div>
        </main>
    );
}
