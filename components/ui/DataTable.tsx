'use client'

import React, { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, FileDown } from 'lucide-react'

export interface Column<T> {
    header: string
    accessor: keyof T | ((item: T) => React.ReactNode)
    sortable?: boolean
}

export interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    searchPlaceholder?: string
    exportLabel?: string
}

export function DataTable<T>({
    data,
    columns,
    searchPlaceholder = 'Szukaj...',
    exportLabel = 'Eksportuj'
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const filteredData = data.filter(item => {
        return Object.values(item as any).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    })

    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    return (
        <div className="space-y-4">
            {/* SEARCH & ACTIONS */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-border-custom rounded-xl outline-none focus:ring-2 focus:ring-green-500/10 focus:border-green-500 transition-all font-medium"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-green-700 bg-white border border-border-custom rounded-xl hover:bg-green-50 transition-all">
                    <FileDown className="w-4 h-4" />
                    {exportLabel}
                </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto rounded-2xl border border-border-custom bg-white">
                <table className="w-full text-sm text-left">
                    <thead className="bg-green-800 text-white text-[11px] font-bold uppercase tracking-wider">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-6 py-4">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedData.map((item, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-green-50/30 transition-colors">
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className="px-6 py-4 text-text-primary whitespace-nowrap">
                                        {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as React.ReactNode)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {paginatedData.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-text-muted italic">
                                    Brak wyników do wyświetlenia.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <p className="text-xs text-text-secondary">
                        Pokazano {Math.min(filteredData.length, (currentPage - 1) * itemsPerPage + 1)} - {Math.min(filteredData.length, currentPage * itemsPerPage)} z {filteredData.length} pozycji
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 border border-border-custom rounded-lg hover:bg-white transition-all disabled:opacity-30"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1 px-3 py-1 font-bold text-xs">
                            {currentPage} / {totalPages}
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-border-custom rounded-lg hover:bg-white transition-all disabled:opacity-30"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
