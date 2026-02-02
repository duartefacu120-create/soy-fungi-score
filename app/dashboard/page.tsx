import Link from "next/link";
import { PlusCircle, ArrowRight } from "lucide-react";

export default function DashboardPage() {
    // Mock data for display
    const recentAssessments = [
        { id: 1, lot: "Lote Sur", date: "2023-01-15", score: 35, result: "Aplicar", color: "green" },
        { id: 2, lot: "Lote Norte", date: "2023-01-10", score: 20, result: "No Aplicar", color: "red" },
    ];

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bienvenido, Usuario</h1>
                    <p className="text-gray-500">Campaña Activa: <span className="font-semibold text-green-700">Soja 2025/2026</span></p>
                </div>
                <Link
                    href="/establishments/new"
                    className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
                >
                    <PlusCircle className="h-5 w-5" />
                    Nuevo Establecimiento
                </Link>
            </header>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Establecimientos</h3>
                    <div className="mt-2 text-3xl font-bold">4</div>
                </div>
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Lotes Totales</h3>
                    <div className="mt-2 text-3xl font-bold">12</div>
                </div>
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Evaluaciones Realizadas</h3>
                    <div className="mt-2 text-3xl font-bold">28</div>
                </div>
            </div>

            {/* Recent Activity */}
            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Evaluaciones Recientes</h2>
                <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Lote</th>
                                <th className="px-6 py-3 font-medium">Fecha</th>
                                <th className="px-6 py-3 font-medium">Puntaje</th>
                                <th className="px-6 py-3 font-medium">Recomendación</th>
                                <th className="px-6 py-3 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentAssessments.map((a) => (
                                <tr key={a.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{a.lot}</td>
                                    <td className="px-6 py-4 text-gray-500">{a.date}</td>
                                    <td className="px-6 py-4 font-bold">{a.score}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${a.color === 'green' ? 'bg-green-100 text-green-800' :
                                                a.color === 'red' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {a.result}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/assessment/${a.id}`} className="text-gray-400 hover:text-green-700">
                                            <ArrowRight className="h-5 w-5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
