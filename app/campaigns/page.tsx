import Link from "next/link";
import { PlusCircle } from "lucide-react";
import DashboardLayout from "@/app/dashboard/layout";

export default function CampaignsPage() {
    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Campañas</h1>
                <Link href="/campaigns/new" className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800">
                    <PlusCircle className="h-5 w-5" />
                    Nueva Campaña
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 text-center text-gray-500">
                <p>No hay campañas registradas (Mock).</p>
            </div>
        </DashboardLayout>
    );
}
