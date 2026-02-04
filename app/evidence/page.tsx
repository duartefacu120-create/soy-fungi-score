import DashboardLayout from "@/app/dashboard/layout";
import { Info, CheckCircle2, AlertTriangle, XCircle, Leaf } from "lucide-react";

export default function EvidencePage() {
    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-10 pb-20">
                <header className="border-b pb-8">
                    <h1 className="text-4xl font-extrabold text-green-900 mb-4 flex items-center gap-3">
                        <Leaf className="h-10 w-10 text-green-600" />
                        Evidencia Científica
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Protocolo de decisión para la aplicación de fungicidas foliares en el cultivo de soja, basado en parámetros epidemiológicos y ambientales.
                    </p>
                </header>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <div className="h-8 w-1 bg-green-600 rounded"></div>
                        ¿Cómo funciona la calculadora?
                    </h2>
                    <div className="bg-white rounded-2xl border p-8 shadow-sm space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                            La calculadora utiliza un sistema de <strong>puntuación ponderada</strong> que evalúa el riesgo de incidencia de Enfermedades de Fin de Ciclo (EFC).
                            Cada parámetro seleccionado por el usuario aporta un valor específico al puntaje total, el cual determina la recomendación final.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 pt-4">
                            <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                                <div className="text-green-800 font-bold mb-1">0 - 22 PUNTOS</div>
                                <div className="text-green-600 font-medium text-sm flex items-center gap-1">
                                    <CheckCircle2 className="h-4 w-4" /> No Aplicar
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Nivel de riesgo bajo. Las condiciones actuales no justifican la inversión en fungicida.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-100">
                                <div className="text-yellow-800 font-bold mb-1">23 - 32 PUNTOS</div>
                                <div className="text-yellow-600 font-medium text-sm flex items-center gap-1">
                                    <AlertTriangle className="h-4 w-4" /> Monitorear y decidir con pronóstico
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Punto crítico. Se recomienda revisar pronósticos climáticos y evolución de síntomas.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                                <div className="text-red-800 font-bold mb-1">33+ PUNTOS</div>
                                <div className="text-red-600 font-medium text-sm flex items-center gap-1">
                                    <XCircle className="h-4 w-4" /> Aplicar
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Riesgo epidemiológico alto. Alta probabilidad de retorno económico positivo por aplicación.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <div className="h-8 w-1 bg-green-600 rounded"></div>
                        Atributos y su Influencia
                    </h2>
                    <div className="grid gap-4">
                        <AttributeCard
                            title="Precipitaciones (R3-R5)"
                            impact="Muy Alto (Hasta 10 pts)"
                            desc="El agua libre sobre el canopeo es el factor determinante para la germinación de esporas y progresión de enfermedades como Mancha Púrpura y Septoria."
                        />
                        <AttributeCard
                            title="Síntomas en Lote"
                            impact="Alto (6 pts)"
                            desc="La presencia de síntomas visibles indica que el inóculo ya está activo y colonizando el tejido foliar."
                        />
                        <AttributeCard
                            title="Inóculo en Rastrojo"
                            impact="Medio (6 pts)"
                            desc="El rastrojo de soja infectado es la fuente primaria de esporas. Su presencia aumenta significativamente la presión inicial."
                        />
                        <AttributeCard
                            title="Intensidad de Lluvias"
                            impact="Medio (5 pts)"
                            desc="Lluvias intensas (&ge; 7mm) favorecen el salpicado de esporas desde el rastrojo hacia el canopeo superior."
                        />
                        <AttributeCard
                            title="Rotación de Cultivos"
                            impact="Variable (Hasta 5 pts)"
                            desc="La alternancia con gramíneas interrumpe el ciclo de vida de los patógenos específicos de la soja."
                        />
                        <AttributeCard
                            title="Labranza y Sanidad"
                            impact="Bajo (3-4 pts)"
                            desc="La siembra directa mantiene el inóculo en superficie, mientras que el tratamiento de semilla reduce la carga patogénica inicial."
                        />
                    </div>
                </section>

                <section className="bg-gray-50 rounded-2xl p-8 border border-dashed border-gray-300">
                    <div className="flex gap-4">
                        <Info className="h-6 w-6 text-blue-500 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-gray-900 mb-2">Nota Metodológica</h3>
                            <p className="text-sm text-gray-600">
                                Este protocolo ha sido adaptado de escalas epidemiológicas validadas en la región pampeana, considerando los umbrales de respuesta económica más frecuentes. La calculadora es una herramienta de apoyo y no reemplaza el criterio técnico del profesional a campo.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}

function AttributeCard({ title, impact, desc }: { title: string, impact: string, desc: string }) {
    return (
        <div className="bg-white p-5 rounded-xl border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-900">{title}</h4>
                <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">{impact}</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
        </div>
    );
}
