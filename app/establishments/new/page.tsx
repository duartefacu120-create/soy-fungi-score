import DashboardLayout from "@/app/dashboard/layout";
import EstablishmentForm from "@/components/forms/EstablishmentForm";

export default function NewEstablishmentPage() {
    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Crear Establecimiento</h1>
            </div>
            <EstablishmentForm />
        </DashboardLayout>
    );
}
