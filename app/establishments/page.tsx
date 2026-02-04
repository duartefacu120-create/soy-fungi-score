import Link from "next/link";
import { PlusCircle } from "lucide-react";
import DashboardLayout from "@/app/dashboard/layout";
import { getEstablishments } from "@/app/actions";
import EstablishmentList from "@/components/establishments/EstablishmentList";

export const dynamic = 'force-dynamic';

export default async function EstablishmentsPage() {
    const establishments = await getEstablishments();

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Establecimientos</h1>
                <div className="flex gap-2">
                    <Link href="/establishments/new" className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800">
                        <PlusCircle className="h-5 w-5" />
                        Nuevo Establecimiento
                    </Link>
                </div>
            </div>

            <EstablishmentList establishments={establishments} />
        </DashboardLayout>
    );
}
