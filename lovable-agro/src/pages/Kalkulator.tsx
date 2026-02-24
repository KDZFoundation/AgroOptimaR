import React, { useState } from 'react'
import { Card, StatCard, Button, Badge, ProgressBar } from '@/components/ui'
import { Calculator, Euro, TrendingUp, Plus, Trash2 } from 'lucide-react'
import { STAWKI_2025 } from '@/lib/constants'
import { obliczSubscydia } from '@/lib/calculations/kalkulator'

export default function Kalkulator() {
    const [ur, setUr] = useState(25)
    const [isMlody, setIsMlody] = useState(false)
    const [selectedEkoschematy, setSelectedEkoschematy] = useState<any[]>([])
    const result = obliczSubscydia({ ur_ha: ur, tuz_ha: 0, mlody_rolnik: isMlody, ekoschematy: selectedEkoschematy.map(e => ({ kod: e, ha: ur })), zwierzeta: [] })

    return (
        <div className="space-y-8">
            <div><h2 className="text-3xl font-bold text-text-primary">Kalkulator Dopłat 2026</h2><p className="text-text-secondary mt-1">Oblicz szacunkowe dopłaty na podstawie Twoich deklaracji.</p></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Twoje Dane" icon={<Calculator />}>
                        <div className="space-y-6">
                            <div className="space-y-2"><label className="text-sm font-bold text-text-secondary">Powierzchnia UR (ha)</label><input type="number" value={ur} onChange={(e) => setUr(Number(e.target.value))} className="w-full px-4 py-3 bg-green-50/50 border border-green-100 rounded-xl outline-none focus:border-green-500 font-bold" /></div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="text-sm"><p className="font-bold text-text-primary">Młody Rolnik</p><p className="text-xs text-text-secondary italic">Dodatkowe 248.16 PLN/ha</p></div>
                                <input type="checkbox" checked={isMlody} onChange={(e) => setIsMlody(e.target.checked)} className="w-5 h-5 accent-green-600" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center"><h4 className="text-sm font-bold text-text-primary">Wybrane Ekoschematy</h4><Button variant="ghost" size="sm" icon={<Plus className="w-4 h-4" />}>Dodaj</Button></div>
                                {selectedEkoschematy.length === 0 ? <p className="text-xs text-text-muted italic p-4 text-center border border-dashed rounded-xl">Brak wybranych ekoschematów.</p> : (
                                    <div className="space-y-2">{selectedEkoschematy.map(kod => (<div key={kod} className="flex justify-between items-center p-3 bg-green-50/30 rounded-lg border border-green-100/50"><span className="text-xs font-bold text-text-primary">{kod}</span><Button variant="ghost" size="sm" icon={<Trash2 className="w-3 h-3 text-error" />} /></div>))}</div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <StatCard label="Suma dopłat" value={result.suma_calkowita.toLocaleString()} unit="PLN" icon={<Euro />} className="bg-green-800 text-white" />
                        <StatCard label="Punkty RW" value={result.carbon_farming.punkty_suma} unit="PKT" icon={<TrendingUp />} trend={result.carbon_farming.spelniono ? 'up' : 'down'} />
                    </div>
                    <Card title="Szczegóły kalkulacji" icon={<TrendingUp />}>
                        <div className="space-y-6">
                            <div><h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Płatności Bezpośrednie</h4>
                                <div className="space-y-2">
                                    <Row label="Podstawowe wsparcie (BWS)" val={result.platnosci_bezposrednie.bws} />
                                    <Row label="Płatność redystrybucyjna" val={result.platnosci_bezposrednie.redystrybucyjna} />
                                    {isMlody && <Row label="Młody Rolnik" val={result.platnosci_bezposrednie.mlody_rolnik} />}
                                    <Row label="UPP" val={result.platnosci_bezposrednie.upp} />
                                    <hr className="border-gray-50 my-2" />
                                    <Row label="Suma bezpośrednie" val={result.platnosci_bezposrednie.suma} bold />
                                </div>
                            </div>
                            <div><h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Rolnictwo Węglowe</h4>
                                <div className="space-y-4">
                                    <ProgressBar label={`Próg minimalny (1.25x ${ur}ha = ${result.carbon_farming.prog_minimalny.toFixed(2)} pkt)`} value={result.carbon_farming.punkty_suma} max={result.carbon_farming.prog_minimalny} color={result.carbon_farming.spelniono ? "green" : "gold"} />
                                    <Row label="Wartość punktów RW" val={result.carbon_farming.wartosc_total} />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function Row({ label, val, bold = false }: { label: string, val: number, bold?: boolean }) {
    return (<div className={`flex justify-between text-sm ${bold ? 'font-bold text-text-primary' : 'text-text-secondary'}`}><span>{label}</span><span>{val.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} PLN</span></div>)
}
