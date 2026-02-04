"use client";

import Link from "next/link";
import { ArrowRight, Trash2, FileSpreadsheet, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteAssessment } from "@/app/actions";
import { useState, useMemo } from "react";
import AssessmentFilters from "./AssessmentFilters";

import * as XLSX from "xlsx";

type Assessment = {
    id: string;
    date_performed: Date;
    total_score: number;
    recommendation_result: string;
    lot: {
        name: string;
        establishment: {
            name: string;
        };
    };
};

export default function RecentAssessments({ assessments: initialAssessments }: { assessments: Assessment[] }) {
    const router = useRouter();
    const [assessments, setAssessments] = useState(initialAssessments);

    // Filter and Sort State
    const [searchTerm, setSearchTerm] = useState("");
    const [recommendationFilter, setRecommendationFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const handleDelete = async (id: string) => {
        if (confirm("¿Eliminar esta evaluación?")) {
            setAssessments(prev => prev.filter(a => a.id !== id));
            await deleteAssessment(id);
            router.refresh();
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getBadgeStyles = (result: string) => {
        if (result === "Aplicar") {
            return "bg-red-100 text-red-800 border-red-200";
        } else if (result === "Monitorear / Revisar Pronóstico" || result.includes("Monitorear")) {
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        }
        return "bg-green-100 text-green-800 border-green-200";
    };

    // Filtered and Sorted Data
    const filteredAssessments = useMemo(() => {
        let result = [...assessments];

        // Search Term
        if (searchTerm) {
            result = result.filter(a =>
                a.lot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.lot.establishment.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Recommendation Filter
        if (recommendationFilter !== "all") {
            result = result.filter(a => a.recommendation_result.includes(recommendationFilter));
        }

        // Sorting
        result.sort((a, b) => {
            let valA: any = a[sortBy as keyof typeof a];
            let valB: any = b[sortBy as keyof typeof b];

            if (sortBy === "lot") {
                valA = a.lot.name;
                valB = b.lot.name;
            } else if (sortBy === "date") {
                valA = new Date(a.date_performed).getTime();
                valB = new Date(b.date_performed).getTime();
            } else if (sortBy === "score") {
                valA = a.total_score;
                valB = b.total_score;
            }

            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        return result;
    }, [assessments, searchTerm, recommendationFilter, sortBy, sortOrder]);

    const handleExportExcel = () => {
        const dataToExport = filteredAssessments.map(a => ({
            "Establecimiento": a.lot.establishment.name,
            "Lote": a.lot.name,
            "Fecha": formatDate(a.date_performed),
            "Puntaje": a.total_score,
            "Recomendación": a.recommendation_result
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Evaluaciones");

        // Generate filename with current date
        const dateStr = new Date().toISOString().split('T')[0];
        XLSX.writeFile(workbook, `SoyFungiScore_Reporte_${dateStr}.xlsx`);
    };

    return (
        <section>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900">Registros de Evaluaciones</h2>
                <button
                    onClick={handleExportExcel}
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                >
                    <FileSpreadsheet className="h-4 w-4" />
                    Exportar Excel
                </button>
            </div>

            <AssessmentFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                recommendationFilter={recommendationFilter}
                onRecommendationChange={setRecommendationFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                sortOrder={sortOrder}
                onToggleSortOrder={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
            />

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 border-b">
                            <tr>
                                <th className="px-6 py-4 font-medium">Establecimiento / Lote</th>
                                <th className="px-6 py-4 font-medium text-center">Fecha y Hora</th>
                                <th className="px-6 py-4 font-medium text-center">Puntaje</th>
                                <th className="px-6 py-4 font-medium text-center">Recomendación</th>
                                <th className="px-6 py-4 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAssessments.map((a) => (
                                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{a.lot.name}</div>
                                        <div className="text-xs text-gray-500">{a.lot.establishment.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-center">{formatDate(a.date_performed)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-bold text-lg">{a.total_score}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${getBadgeStyles(a.recommendation_result)}`}>
                                            {a.recommendation_result}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link href={`/assessments/${a.id}`} className="p-2 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors" title="Ver Detalles">
                                                <ArrowRight className="h-5 w-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(a.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredAssessments.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search className="h-8 w-8 text-gray-300" />
                                            <p>No se encontraron registros que coincidan con los filtros.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
