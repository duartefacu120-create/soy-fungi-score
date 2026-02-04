import DashboardLayout from "@/app/dashboard/layout";
import { getLotOptions, getCampaigns } from "@/app/actions";
import NewAssessmentFlow from "@/components/assessments/NewAssessmentFlow";

export const dynamic = 'force-dynamic';

export default async function NewAssessmentPage() {
    const establishments = await getLotOptions();
    const campaigns = await getCampaigns();

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Nueva Evaluación</h1>
            </div>

            <NewAssessmentFlow establishments={establishments as any} campaigns={campaigns as any} />
        </DashboardLayout>
    );
}
