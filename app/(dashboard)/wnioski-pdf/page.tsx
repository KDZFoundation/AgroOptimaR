'use client'

import React, { useState } from 'react'
import { Card, Button, Badge, DataTable, Modal } from '@/components/ui'
import { FileUp, FileText, CheckCircle2, AlertCircle, Clock, Trash2, Download, Eye, Cpu } from 'lucide-react'

const MOCK_FILES = [
    { id: '1', nazwa: 'wniosek_2025_001.pdf', data: '2026-02-18 10:15', status: 'sukces', kampania: 2025 },
    { id: '2', nazwa: 'wniosek_2024_poprawa.pdf', data: '2026-02-15 14:30', status: 'sukces', kampania: 2024 },
    { id: '3', nazwa: 'bledny_plik.pdf', data: '2026-02-10 09:00', status: 'blad', kampania: 2025 },
]

export default function WnioskiPdfPage() {
    const [isUploading, setIsUploading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const columns = [
        {
            header: 'Nazwa pliku', accessor: (item: any) => (
                <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="font-bold text-text-primary">{item.nazwa}</span>
                </div>
            )
        },
        { header: 'Data przesłania', accessor: 'data' },
        { header: 'Kampania', accessor: (item: any) => <Badge variant="neutral">{item.kampania}</Badge> },
        {
            header: 'Status', accessor: (item: any) => (
                <Badge variant={item.status === 'sukces' ? 'success' : 'error'}>
                    {item.status.toUpperCase()}
                </Badge>
            )
        },
        {
            header: 'Akcje', accessor: (item: any) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />} />
                    <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />} />
                    <Button variant="ghost" size="sm" className="text-error hover:bg-error/10" icon={<Trash2 className="w-4 h-4" />} />
                </div>
            )
        },
    ]

    const handleUpload = () => {
        setIsUploading(true)
        setTimeout(() => {
            setIsUploading(false)
            setIsModalOpen(true)
        }, 2000)
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Wnioski PDF (RAG)</h2>
                    <p className="text-text-secondary mt-1">Prześlij wniosek z eWniosekPlus, aby automatycznie uzupełnić dane.</p>
                </div>
                <Button variant="gold" icon={<Cpu className="w-4 h-4" />}>Uruchom Analizę AI</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* UPLOAD AREA */}
                <div className="lg:col-span-1">
                    <Card title="Prześlij plik" icon={<FileUp />}>
                        <div
                            className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all ${isUploading ? 'border-green-500 bg-green-50' : 'border-border-custom hover:border-green-500 hover:bg-green-50/10'
                                }`}
                        >
                            {isUploading ? (
                                <div className="space-y-4">
                                    <div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full mx-auto" />
                                    <p className="text-sm font-bold text-green-700">Analizowanie dokumentu...</p>
                                    <p className="text-xs text-text-secondary">Wyodrębnianie działek i ekoschematów przy użyciu Claude AI</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mx-auto mb-4">
                                        <FileUp className="w-8 h-8" />
                                    </div>
                                    <h4 className="font-bold text-text-primary">Upuść plik tutaj</h4>
                                    <p className="text-xs text-text-secondary mt-2 mb-6">Obsługiwane formaty: PDF (eWniosekPlus)</p>
                                    <Button variant="primary" onClick={handleUpload} className="w-full">Wybierz z komputera</Button>
                                </>
                            )}
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 rounded-2xl space-y-3">
                            <h5 className="text-xs font-bold text-text-muted uppercase tracking-widest">Co wyodrębniamy?</h5>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-text-secondary">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                                    Dane producenta (EP, adres)
                                </div>
                                <div className="flex items-center gap-2 text-xs text-text-secondary">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                                    Wykaz działek rolnych
                                </div>
                                <div className="flex items-center gap-2 text-xs text-text-secondary">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                                    Deklarowane ekoschematy
                                </div>
                                <div className="flex items-center gap-2 text-xs text-text-secondary">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                                    Liczba zwierząt (bydło, owce, kozy)
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* HISTORY TABLE */}
                <div className="lg:col-span-2">
                    <Card title="Historia przesłanych plików" icon={<FileText />}>
                        <DataTable data={MOCK_FILES} columns={columns} />
                    </Card>
                </div>
            </div>

            {/* SUCCESS MODAL */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Dokument przeanalizowany"
                footer={<Button variant="primary" onClick={() => setIsModalOpen(false)}>Zapisz dane w systemie</Button>}
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                        <CheckCircle2 className="w-6 h-6 text-success" />
                        <div>
                            <p className="font-bold text-text-primary">Analiza zakończona sukcesem</p>
                            <p className="text-xs text-text-secondary">Claude 3.5 Sonnet wykrył 12 działek i 3 ekoschematy.</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm font-bold text-text-primary">Wykryte dane:</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-[10px] text-text-muted uppercase font-bold">Liczba działek</p>
                                <p className="text-lg font-bold text-text-primary">12 szt.</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-[10px] text-text-muted uppercase font-bold">Łączna pow.</p>
                                <p className="text-lg font-bold text-text-primary">45.20 ha</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-[10px] text-text-muted uppercase font-bold">Ekoschematy</p>
                                <div className="mt-1 flex flex-wrap gap-1">
                                    <Badge variant="success">E_WSG</Badge>
                                    <Badge variant="success">E_MPW</Badge>
                                </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-[10px] text-text-muted uppercase font-bold">Zwierzęta</p>
                                <p className="text-lg font-bold text-text-primary">14 DJP</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
