import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/app/dashboard/layout";
import { getEstablishmentDetails } from "@/app/actions";
import { notFound } from "next/navigation";
import NewLotForm from "@/components/forms/NewLotForm";
import LotList from "@/components/lots/LotList";

export default async function EstablishmentDetailsPage({ params }: { params: { id: string } }) {
    const establishment = await getEstablishmentDetails(params.id);

    if (!establishment) {
        return notFound();
    }

    return (
        <DashboardLayout>
            <div className="mb-6">
                <Link href="/establishments" className="flex items-center text-gray-500 hover:text-green-700 mb-4 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Volver a Establecimientos
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">{establishment.name}</h1>
                {establishment.location && (
                    <p className="text-gray-500 mt-1">{establishment.location}</p>
                )}
            </div>

            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Lotes ({establishment.lots.length})</h2>
                    <LotList lots={establishment.lots} />
                </div>

                <NewLotForm establishmentId={params.id} />
            </div>
        </DashboardLayout>
    );
}
