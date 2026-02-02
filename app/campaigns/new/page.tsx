import DashboardLayout from "@/app/dashboard/layout";
import CampaignForm from "@/components/forms/CampaignForm";

export default function NewCampaignPage() {
    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Crear Campaña</h1>
            </div>
            <CampaignForm />
        </DashboardLayout>
    );
}
