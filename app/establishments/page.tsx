import Link from "next/link";
import { PlusCircle, MapPin } from "lucide-react";
import DashboardLayout from "@/app/dashboard/layout";

export default function EstablishmentsPage() {
    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Establecimientos</h1>
                <div className="flex gap-2">
                    <Link href="/establishments/new" className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800">
                        <PlusCircle className="h-5 w-5" />
                        Nuevo Establecimiento
                    </Link>
                    <Link href="/lots/new" className="flex items-center gap-2 bg-white border border-green-700 text-green-700 px-4 py-2 rounded-lg hover:bg-green-50">
                        <PlusCircle className="h-5 w-5" />
                        Nuevo Lote
                    </Link>
                </div>
            </div>

            {/* Mock List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white rounded-xl shadow-sm border p-6 hover:border-green-500 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-xl text-gray-800 group-hover:text-green-700">La Estancia</h3>
                        <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm mb-4">Pergamino, Buenos Aires</p>
                    <div className="border-t pt-4">
                        <span className="text-sm font-medium text-gray-600">3 Lotes Activos</span>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
