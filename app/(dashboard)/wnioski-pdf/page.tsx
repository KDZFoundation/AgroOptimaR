'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Card, Button, Badge, DataTable, Modal, ProgressBar, type Column } from '@/components/ui'
import { FileUp, FileText, CheckCircle2, AlertCircle, Trash2, Eye, Cpu, X, AlertTriangle } from 'lucide-react'
import { uploadPdf, getWnioski } from '@/app/actions/upload-pdf'

interface ParsedDzialka {
    nr_dzialki: string
    pow_dzialki_ha: number
    uprawa: string
    kod_uprawy: string
    platnosci: string[]
}

interface ParsedData {
    podmiot?: {
        ep?: string
        nazwa?: string
        adres?: string
    }
    dzialki?: ParsedDzialka[]
    ekoschematy_ogolne?: string[]
    podsumowanie?: {
        liczba_dzialek?: number
        calkowita_powierzchnia_ha?: number
    }
    raw_content?: string
    warning?: string
    error?: string
}

interface Wniosek {
    id: string
    nazwa_pliku: string
    created_at: string
    status_parsowania: 'sukces' | 'blad' | 'przetwarzanie'
    kampania_rok: number
    dane_json: ParsedData
}

const REQUIRED_YEARS = [2021, 2022, 2023, 2024, 2025]

export default function WnioskiPdfPage() {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentResult, setCurrentResult] = useState<ParsedData | null>(null)
    const [wnioski, setWnioski] = useState<Wniosek[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [progress, setProgress] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchWnioski()
    }, [])

    const fetchWnioski = async () => {
        setIsLoading(true)
        try {
            const data = await getWnioski()
            setWnioski(data as Wniosek[] || [])
        } catch (err) {
            console.error('Błąd pobierania wniosków:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileUpload = useCallback(async (file: File) => {
        setIsUploading(true)
        setUploadError(null)
        setProgress(20)

        const formData = new FormData()
        formData.append('file', file)

        try {
            setProgress(50)
            const result = await uploadPdf(formData)
            setProgress(90)

            if (result.error) {
                setUploadError(result.error)
            } else {
                setCurrentResult(result.dane || null)
                setIsModalOpen(true)
                fetchWnioski()
            }
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Nieznany błąd')
        } finally {
            setIsUploading(false)
            setProgress(100)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }, [])

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFileUpload(file)
    }

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFileUpload(file)
    }, [handleFileUpload])

    const uploadedYears = new Set(wnioski.map(w => w.kampania_rok))
    const missingYears = REQUIRED_YEARS.filter(year => !uploadedYears.has(year))
    const hasRequired2025 = uploadedYears.has(2025)

    const columns: Column<Wniosek>[] = [
        {
            header: 'Nazwa pliku',
            accessor: (item: Wniosek) => (
                <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="font-bold text-text-primary">{item.nazwa_pliku}</span>
                </div>
            )
        },
        {
            header: 'Data przesłania',
            accessor: (item: Wniosek) => new Date(item.created_at).toLocaleDateString('pl-PL')
        },
        { header: 'Kampania', accessor: (item: Wniosek) => <Badge variant="neutral">{item.kampania_rok}</Badge> },
        {
            header: 'Status',
            accessor: (item: Wniosek) => (
                <Badge variant={item.status_parsowania === 'sukces' ? 'success' : 'error'}>
                    {(item.status_parsowania || 'błąd').toUpperCase()}
                </Badge>
            )
        },
        {
            header: 'Akcje',
            accessor: (item: Wniosek) => (
                <div className="flex items-center gap-2">
                    {item.status_parsowania === 'sukces' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={<Eye className="w-4 h-4" />}
                            onClick={() => {
                                setCurrentResult(item.dane_json)
                                setIsModalOpen(true)
                            }}
                        />
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-error hover:bg-error/10"
                        icon={<Trash2 className="w-4 h-4" />}
                        onClick={() => {/* TODO: Implement delete */ }}
                    />
                </div>
            )
        },
    ]

    const dzialki = currentResult?.dzialki || []
    const podmiot = currentResult?.podmiot
    const ekoschematy = currentResult?.ekoschematy_ogolne || []
    const podsumowanie = currentResult?.podsumowanie

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Wnioski PDF (RAG)</h2>
                    <p className="text-text-secondary mt-1">Prześlij wniosek z eWniosekPlus, aby automatycznie uzupełnić dane.</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {hasRequired2025 ? (
                        <Button variant="gold" icon={<Cpu className="w-4 h-4" />}>Uruchom Symulację i Optymalizację</Button>
                    ) : (
                        <div className="text-sm text-error font-bold flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Wymagany wniosek 2025
                        </div>
                    )}
                    {hasRequired2025 && missingYears.length > 0 && (
                        <div className="flex items-center gap-2 text-warning text-xs">
                            <AlertTriangle className="w-3 h-3" />
                            Zalecane uzupełnienie lat: {missingYears.join(', ')}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {REQUIRED_YEARS.map(year => {
                    const isDone = uploadedYears.has(year)
                    return (
                        <div key={year} className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-colors ${isDone ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-dashed border-gray-300'
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
                <div className="lg:col-span-1">
                    <Card title="Prześlij plik" icon={<FileUp />}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={onFileSelect}
                            id="pdf-file-input"
                        />
                        <div
                            onDrop={onDrop}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                            onDragLeave={() => setIsDragging(false)}
                            className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${isDragging
                                ? 'border-green-500 bg-green-50 scale-[1.02]'
                                : isUploading
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-border-custom hover:border-green-500 hover:bg-green-50/10'
                                }`}
                            onClick={() => !isUploading && fileInputRef.current?.click()}
                        >
                            {isUploading ? (
                                <div className="space-y-4">
                                    <div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full mx-auto" />
                                    <p className="text-sm font-bold text-green-700">Analizowanie dokumentu...</p>
                                    <ProgressBar value={progress} max={100} color="green" animated />
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mx-auto mb-4">
                                        <FileUp className="w-8 h-8" />
                                    </div>
                                    <h4 className="font-bold text-text-primary">Upuść plik tutaj</h4>
                                    <p className="text-xs text-text-secondary mt-2 mb-6">Obsługiwane formaty: PDF (eWniosekPlus), max 10MB</p>
                                    <Button variant="primary" className="w-full">Wybierz z komputera</Button>
                                </>
                            )}
                        </div>

                        {uploadError && (
                            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                {uploadError}
                            </div>
                        )}

                        <div className="mt-6 p-4 bg-gray-50 rounded-2xl space-y-3">
                            <h5 className="text-xs font-bold text-text-muted uppercase tracking-widest">Wymagane dane</h5>
                            <div className="space-y-2">
                                {['Dane producenta (EP, adres)', 'Wykaz działek rolnych', 'Deklarowane ekoschematy'].map(item => (
                                    <div key={item} className="flex items-center gap-2 text-xs text-text-secondary">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card title="Historia przesłanych plików" icon={<FileText />}>
                        {isLoading ? (
                            <div className="p-8 text-center text-gray-400">Ładowanie historii...</div>
                        ) : wnioski.length === 0 ? (
                            <div className="text-center py-12 text-text-muted">
                                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="text-sm">Brak przesłanych plików.</p>
                            </div>
                        ) : (
                            <DataTable data={wnioski} columns={columns} />
                        )}
                    </Card>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Wyniki analizy dokumentu"
                footer={<Button variant="primary" onClick={() => setIsModalOpen(false)}>Zamknij</Button>}
            >
                <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                    {currentResult?.warning && (
                        <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-yellow-800">{currentResult.warning}</p>
                        </div>
                    )}

                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                        <CheckCircle2 className="w-6 h-6 text-success" />
                        <div>
                            <p className="font-bold text-text-primary">Analiza zakończona sukcesem</p>
                            <p className="text-xs text-text-secondary">
                                Wykryto {dzialki.length} działek i {ekoschematy.length} ekoschematów.
                            </p>
                        </div>
                    </div>

                    {podmiot && (
                        <div className="space-y-2">
                            <p className="text-sm font-bold text-text-primary">Dane producenta:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-[10px] text-text-muted uppercase font-bold">Numer EP</p>
                                    <p className="text-sm font-bold text-text-primary font-mono">{podmiot.ep || '—'}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-[10px] text-text-muted uppercase font-bold">Nazwa</p>
                                    <p className="text-sm font-bold text-text-primary">{podmiot.nazwa || '—'}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-[10px] text-text-muted uppercase font-bold">Adres</p>
                                    <p className="text-sm text-text-primary">{podmiot.adres || '—'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {podsumowanie && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-[10px] text-text-muted uppercase font-bold">Liczba działek</p>
                                <p className="text-lg font-bold text-text-primary">{podsumowanie.liczba_dzialek ?? dzialki.length}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-[10px] text-text-muted uppercase font-bold">Łączna pow.</p>
                                <p className="text-lg font-bold text-text-primary">
                                    {podsumowanie.calkowita_powierzchnia_ha?.toFixed(2) ?? '—'} ha
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl col-span-2">
                                <p className="text-[10px] text-text-muted uppercase font-bold">Ekoschematy</p>
                                <div className="mt-1 flex flex-wrap gap-1">
                                    {ekoschematy.length > 0 ? ekoschematy.map(e => (
                                        <Badge key={e} variant="success">{e}</Badge>
                                    )) : <span className="text-xs text-text-muted">Brak</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {dzialki.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm font-bold text-text-primary">Wykaz działek ({dzialki.length}):</p>
                            <div className="overflow-x-auto rounded-xl border border-border-custom">
                                <table className="w-full text-xs">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left p-2 font-bold text-text-muted">Kod</th>
                                            <th className="text-left p-2 font-bold text-text-muted">Nr działki</th>
                                            <th className="text-left p-2 font-bold text-text-muted">Uprawa</th>
                                            <th className="text-right p-2 font-bold text-text-muted">Pow. (ha)</th>
                                            <th className="text-left p-2 font-bold text-text-muted">Płatności</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dzialki.map((d, i) => (
                                            <tr key={i} className="border-t border-border-custom hover:bg-gray-50/50">
                                                <td className="p-2 font-mono font-bold">{d.kod_uprawy || '—'}</td>
                                                <td className="p-2 font-mono">{d.nr_dzialki}</td>
                                                <td className="p-2">{d.uprawa || '—'}</td>
                                                <td className="p-2 text-right font-mono">{typeof d.pow_dzialki_ha === 'number' ? d.pow_dzialki_ha.toFixed(2) : d.pow_dzialki_ha}</td>
                                                <td className="p-2">
                                                    <div className="flex flex-wrap gap-1">
                                                        {(d.platnosci || []).map(p => (
                                                            <Badge key={p} variant="neutral">{p}</Badge>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Raw content fallback */}
                    {currentResult?.raw_content && !dzialki.length && (
                        <div className="space-y-2">
                            <p className="text-sm font-bold text-text-primary">Surowy tekst z PDF:</p>
                            <pre className="text-xs bg-gray-50 p-4 rounded-xl overflow-auto max-h-60 whitespace-pre-wrap font-mono border border-border-custom">
                                {currentResult?.raw_content}
                            </pre>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    )
}
