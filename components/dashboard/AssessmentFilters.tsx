"use client";

import { Search, Filter, SortAsc, SortDesc } from "lucide-react";

type FiltersProps = {
    searchTerm: string;
    onSearchChange: (val: string) => void;
    recommendationFilter: string;
    onRecommendationChange: (val: string) => void;
    sortBy: string;
    onSortChange: (val: string) => void;
    sortOrder: "asc" | "desc";
    onToggleSortOrder: () => void;
};

export default function AssessmentFilters({
    searchTerm,
    onSearchChange,
    recommendationFilter,
    onRecommendationChange,
    sortBy,
    onSortChange,
    sortOrder,
    onToggleSortOrder
}: FiltersProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-xl border shadow-sm">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Filtrar por lote..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                        value={recommendationFilter}
                        onChange={(e) => onRecommendationChange(e.target.value)}
                    >
                        <option value="all">Todas las recomendaciones</option>
                        <option value="Aplicar">Aplicar</option>
                        <option value="Monitorear">Monitorear</option>
                        <option value="No Aplicar">No Aplicar</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Ordenar por:</span>
                    <select
                        className="border rounded-lg px-3 py-2 border-r-0 rounded-r-none focus:ring-2 focus:ring-green-500 outline-none"
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                    >
                        <option value="date">Fecha</option>
                        <option value="lot">Lote</option>
                        <option value="score">Puntaje</option>
                    </select>
                    <button
                        onClick={onToggleSortOrder}
                        className="border border-l-0 rounded-l-none rounded-lg px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                        title={sortOrder === "asc" ? "Orden Ascendente" : "Orden Descendente"}
                    >
                        {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
