import DashboardLayout from "@/app/dashboard/layout";
import LotForm from "@/components/forms/LotForm";

export default function NewLotPage() {
    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Crear Lote</h1>
            </div>
            <LotForm />
        </DashboardLayout>
    );
}
