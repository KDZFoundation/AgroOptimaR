'use client'

import React, { useState, useEffect } from 'react'
import { Card, Button, Badge, DataTable, Modal, type Column } from '@/components/ui'
import { FileUp, FileText, CheckCircle2, Trash2, Download, Eye, Cpu, AlertTriangle } from 'lucide-react'
import { uploadPdf, getWnioski } from '@/app/actions/upload-pdf'

// Typy zdefiniowane w akcjach lub types/index.ts (uproszczone tutaj dla klienta)
interface Wniosek {
    id: string
    nazwa_pliku: string
    created_at: string
    status_parsowania: string
    kampania_rok: number
    dane_json: any
}

const REQUIRED_YEARS = [2021, 2022, 2023, 2024, 2025]

export default function WnioskiPdfPage() {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [lastUploadResult, setLastUploadResult] = useState<any>(null)
    const [wnioski, setWnioski] = useState<Wniosek[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchWnioski()
    }, [])

    const fetchWnioski = async () => {
        setIsLoading(true)
        const data = await getWnioski()
        // @ts-ignore
        setWnioski(data || [])
        setIsLoading(false)
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        setUploadError(null)

        const formData = new FormData()
        formData.append('file', file)

        const result = await uploadPdf(formData)

        if (result.error) {
            setUploadError(result.error)
        } else {
            setLastUploadResult(result)
            setIsModalOpen(true)
            fetchWnioski() // Odśwież listę
        }
        setIsUploading(false)
        // Reset input
        e.target.value = ''
    }

    // Helper to check missing years
    const uploadedYears = new Set(wnioski.map(w => w.kampania_rok))
    const missingYears = REQUIRED_YEARS.filter(year => !uploadedYears.has(year))

    const columns: Column<Wniosek>[] = [
        {
            header: 'Nazwa pliku', accessor: (item) => (
                <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="font-bold text-text-primary">{item.nazwa_pliku}</span>
                </div>
            )
        },
        {
            header: 'Data przesłania',
            accessor: (item) => new Date(item.created_at).toLocaleDateString('pl-PL')
        },
        { header: 'Kampania', accessor: (item) => <Badge variant="neutral">{item.kampania_rok}</Badge> },
        {
            header: 'Status', accessor: (item) => (
                <Badge variant={item.status_parsowania === 'sukces' ? 'success' : 'error'}>
                    {item.status_parsowania.toUpperCase()}
                </Badge>
            )
        },
        {
            header: 'Akcje', accessor: (item) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />} />
                    <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />} />
                    <Button variant="ghost" size="sm" className="text-error hover:bg-error/10" icon={<Trash2 className="w-4 h-4" />} />
                </div>
            )
        },
    ]

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Wnioski PDF (RAG)</h2>
                    <p className="text-text-secondary mt-1">Prześlij wniosek z eWniosekPlus, aby automatycznie uzupełnić dane.</p>
                </div>
                {missingYears.length === 0 ? (
                    <Button variant="gold" icon={<Cpu className="w-4 h-4" />}>Uruchom Symulację i Optymalizację</Button>
                ) : (
                    <div className="flex items-center gap-2 text-text-secondary text-sm">
                        <AlertTriangle className="w-4 h-4 text-warning" />
                        Uzupełnij brakujące lata, aby uruchomić symulację.
                    </div>
                )}
            </div>

            {/* STATUS YEARS */}
            <div className="grid grid-cols-5 gap-4">
                {REQUIRED_YEARS.map(year => {
                    const isDone = uploadedYears.has(year)
                    return (
                        <div key={year} className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-colors ${
                            isDone ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-dashed border-gray-300'
                        }`}>
                            <span className={`text-xl font-bold ${isDone ? 'text-green-700' : 'text-gray-400'}`}>{year}</span>
                            <span className="text-xs mt-1">
                                {isDone ? <Badge variant="success">OK</Badge> : <Badge variant="neutral">BRAK</Badge>}
                            </span>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* UPLOAD AREA */}
                <div className="lg:col-span-1">
                    <Card title="Prześlij plik" icon={<FileUp />}>
                        <div className="relative">
                             <input
                                type="file"
                                accept=".pdf"
                                onChange={handleUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                disabled={isUploading}
                            />
                            <div
                                className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all ${isUploading ? 'border-green-500 bg-green-50' : 'border-border-custom hover:border-green-500 hover:bg-green-50/10'
                                    }`}
                            >
                                {isUploading ? (
                                    <div className="space-y-4">
                                        <div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full mx-auto" />
                                        <p className="text-sm font-bold text-green-700">Analizowanie dokumentu...</p>
                                        <p className="text-xs text-text-secondary">Wyodrębnianie działek i roku kampanii...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mx-auto mb-4">
                                            <FileUp className="w-8 h-8" />
                                        </div>
                                        <h4 className="font-bold text-text-primary">Kliknij lub upuść plik</h4>
                                        <p className="text-xs text-text-secondary mt-2 mb-6">Obsługiwane formaty: PDF (eWniosekPlus)</p>
                                        <Button variant="primary" className="w-full pointer-events-none">Wybierz z komputera</Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {uploadError && (
                            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                {uploadError}
                            </div>
                        )}

                        <div className="mt-6 p-4 bg-gray-50 rounded-2xl space-y-3">
                            <h5 className="text-xs font-bold text-text-muted uppercase tracking-widest">Wymagane lata</h5>
                            <div className="space-y-2">
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    Aby algorytm mógł poprawnie wyliczyć średnią historyczną i zaproponować optymalne ekoschematy (np. wymieszanie słomy, międzyplony), system potrzebuje danych z 5 ostatnich kampanii.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* HISTORY TABLE */}
                <div className="lg:col-span-2">
                    <Card title="Historia przesłanych plików" icon={<FileText />}>
                        {isLoading ? (
                            <div className="p-8 text-center text-gray-400">Ładowanie historii...</div>
                        ) : (
                            <DataTable data={wnioski} columns={columns} />
                        )}
                    </Card>
                </div>
            </div>

            {/* SUCCESS MODAL */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Dokument pomyślnie dodany"
                footer={<Button variant="primary" onClick={() => setIsModalOpen(false)}>Zamknij</Button>}
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                        <CheckCircle2 className="w-6 h-6 text-success" />
                        <div>
                            <p className="font-bold text-text-primary">Kampania {lastUploadResult?.year}</p>
                            <p className="text-xs text-text-secondary">Plik został poprawnie przetworzony i przypisany do Twojego konta.</p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
