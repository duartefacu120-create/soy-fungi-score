import DashboardLayout from "@/app/dashboard/layout";
import { getAssessment } from "@/app/actions";
import { notFound } from "next/navigation";
import AssessmentForm from "@/components/forms/AssessmentForm";
import { Edit3 } from "lucide-react";

export default async function EditAssessmentPage({ params }: { params: { id: string } }) {
    const assessment = await getAssessment(params.id);

    if (!assessment) {
        return notFound();
    }

    const inputData = JSON.parse(assessment.input_data as string);

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        <Edit3 className="h-8 w-8 text-blue-600" />
                        Editar Evaluación
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Ajusta los parámetros para recalcular el riesgo en el lote: <br />
                        <span className="text-gray-900 font-bold">{assessment.lot.establishment.name} - {assessment.lot.name}</span>
                    </p>
                </header>

                <AssessmentForm
                    lotId={assessment.lot_id}
                    campaignId={assessment.campaign_id}
                    initialData={{
                        id: assessment.id,
                        soybeanVariety: assessment.soybean_variety || "",
                        inputs: inputData
                    }}
                />
            </div>
        </DashboardLayout>
    );
}
