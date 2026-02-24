'use client'

import React, { useState } from 'react'
import { Card, Badge, Button } from '@/components/ui'
import { Calendar, ChevronRight, Info, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { KAMPANIE } from '@/lib/constants'

export default function KampaniePage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Moje Kampanie</h2>
                    <p className="text-text-secondary mt-1">Zarządzaj wnioskami z lat 2021 - 2026.</p>
                </div>
            </div>

            <div className="bg-white border border-border-custom p-6 rounded-3xl card-shadow flex items-start gap-4">
                <div className="w-12 h-12 bg-info/10 rounded-2xl flex items-center justify-center text-info shrink-0">
                    <Info className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-bold text-text-primary">Analiza Ekoschematów 2026</h4>
                    <p className="text-sm text-text-secondary mt-1 max-w-2xl">
                        System analizuje dane historyczne z ostatnich 5 lat (2021-2025), aby zasugerować optymalne ekoschematy dla kampanii 2026.
                        Twoja historia deklaracji jest kluczowym elementem Optymalizatora AI.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {KAMPANIE.map((kampania) => (
                    <KampaniaKarta key={kampania.rok} kampania={kampania} />
                ))}
            </div>
        </div>
    )
}

function KampaniaKarta({ kampania }: { kampania: any }) {
    const [expanded, setExpanded] = useState(false)

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'zakonczona': return { label: 'ZAKOŃCZONA', variant: 'error' as any, icon: <CheckCircle2 className="w-4 h-4" /> }
            case 'w_toku': return { label: 'W TOKU', variant: 'warning' as any, icon: <Clock className="w-4 h-4" /> }
            case 'robocza': return { label: 'ROBOCZA', variant: 'info' as any, icon: <AlertCircle className="w-4 h-4" /> }
            default: return { label: status, variant: 'neutral' as any, icon: null }
        }
    }

    const { label, variant, icon } = getStatusConfig(kampania.status)

    return (
        <Card className="hover:border-green-500/50 transition-all group overflow-visible">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-4xl font-black text-green-900/10 group-hover:text-green-900/20 transition-colors uppercase leading-none block">
                        {kampania.rok}
                    </span>
                    <h3 className="text-xl font-bold text-text-primary mt-1">Kampania {kampania.rok}</h3>
                </div>
                <Badge variant={variant} className="flex items-center gap-1.5 py-1 px-3">
                    {icon}
                    {label}
                </Badge>
            </div>

            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-text-secondary">
                    <Calendar className="w-4 h-4" />
                    {kampania.data_od} — {kampania.data_do}
                </div>

                <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-text-muted">Zadeklarowane działki:</span>
                        <span className="font-bold text-text-primary">0 działek</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-text-muted">Szacowana wartość:</span>
                        <span className="font-bold text-green-700">0,00 PLN</span>
                    </div>
                </div>
            </div>

            <Button
                variant="ghost"
                className="w-full mt-6 flex items-center justify-between group/btn"
                onClick={() => setExpanded(!expanded)}
            >
                Szczegóły kampanii
                <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''} group-hover/btn:translate-x-1`} />
            </Button>

            {expanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in space-y-4">
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Ekoschematy</p>
                        <p className="text-xs text-text-secondary italic">Brak zadeklarowanych ekoschematów.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Wnioski PDF</p>
                        <Badge variant="neutral">Brak plików</Badge>
                    </div>
                    <Button variant="secondary" size="sm" className="w-full">Otwórz Kalkulator</Button>
                </div>
            )}
        </Card>
    )
}
