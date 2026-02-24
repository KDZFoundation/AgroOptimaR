import React, { useState } from 'react'
import { Card, Button, Badge } from '@/components/ui'
import { Zap, AlertTriangle, CheckCircle2, Info, Plus, Info as InfoIcon } from 'lucide-react'

const KOMPATYBILNOSC: Record<string, string[]> = {
    E_EKSTUZ: ['E_OPN_P', 'E_PN', 'E_RET'], E_MPW: ['E_OPN_P', 'E_OBR', 'E_PN'],
    E_USU: ['E_WSG', 'E_OPN_P'], E_WSG: ['E_USU', 'E_OPN_P', 'E_PN'],
}
const EKOSCHEMATY_LISTA = [
    { id: 'E_EKSTUZ', nazwa: 'Ekstensywne TUZ', punkty: 5 }, { id: 'E_MPW', nazwa: 'Międzyplony', punkty: 5 },
    { id: 'E_OPN_P', nazwa: 'Plan nawożenia', punkty: 1 }, { id: 'E_USU', nazwa: 'Uproszczone systemy', punkty: 3 },
    { id: 'E_WSG', nazwa: 'Wymieszanie słomy', punkty: 1 },
]

export default function Symulator() {
    const [selected, setSelected] = useState<string[]>([])
    const [conflicts, setConflicts] = useState<{ a: string, b: string }[]>([])
    const checkConflicts = (newSelected: string[]) => {
        const newConflicts: { a: string, b: string }[] = []
        for (let i = 0; i < newSelected.length; i++) {
            for (let j = i + 1; j < newSelected.length; j++) {
                const a = newSelected[i], b = newSelected[j]
                if (!KOMPATYBILNOSC[a]?.includes(b) && !KOMPATYBILNOSC[b]?.includes(a)) newConflicts.push({ a, b })
            }
        }
        setConflicts(newConflicts)
    }
    const toggleEko = (id: string) => { const next = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]; setSelected(next); checkConflicts(next) }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div><h2 className="text-3xl font-bold text-text-primary">Symulator Ekoschematów</h2><p className="text-text-secondary mt-1">Planuj deklaracje i sprawdzaj kompatybilność praktyk rolniczych.</p></div>
                <Button variant="gold" icon={<Zap className="w-4 h-4" />}>Automatyczna Optymalizacja</Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Wybierz ekoschematy do symulacji" icon={<Plus />}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {EKOSCHEMATY_LISTA.map(eko => (
                                <div key={eko.id} onClick={() => toggleEko(eko.id)} className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${selected.includes(eko.id) ? 'border-green-600 bg-green-50 shadow-sm' : 'border-border-custom bg-white hover:border-green-500/50'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${selected.includes(eko.id) ? 'bg-green-600 text-white' : 'bg-gray-100 text-text-muted'}`}><Zap className="w-4 h-4" /></div>
                                        <div><p className="text-sm font-bold text-text-primary">{eko.nazwa}</p><p className="text-[10px] text-text-secondary uppercase font-mono tracking-tighter">{eko.id}</p></div>
                                    </div>
                                    <Badge variant={selected.includes(eko.id) ? 'success' : 'neutral'}>+{eko.punkty} PKT</Badge>
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card title="Analiza zgodności" icon={<InfoIcon />}>
                        {selected.length < 2 ? <div className="p-12 text-center"><p className="text-text-muted italic">Wybierz co najmniej 2 ekoschematy, aby sprawdzić ich kompatybilność.</p></div> : (
                            <div className="space-y-6">
                                {conflicts.length === 0 ? (
                                    <div className="p-6 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-success"><CheckCircle2 className="w-6 h-6" /></div>
                                        <div><p className="font-bold text-green-800">Brak konfliktów!</p><p className="text-sm text-green-700/80">Wszystkie wybrane ekoschematy mogą być realizowane jednocześnie na tej samej powierzchni.</p></div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-sm font-bold text-error flex items-center gap-2"><AlertTriangle className="w-4 h-4" />Wykryto {conflicts.length} konflikty kompatybilności:</p>
                                        {conflicts.map((c, i) => (
                                            <div key={i} className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between">
                                                <div className="text-sm flex items-center gap-2"><Badge variant="error">{c.a}</Badge><span className="text-text-muted font-bold px-2">VS</span><Badge variant="error">{c.b}</Badge></div>
                                                <Button variant="ghost" size="sm" className="text-xs text-error underline">Jak to naprawić?</Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card title="Podsumowanie symulacji" icon={<Zap />}>
                        <div className="space-y-6">
                            <div className="flex justify-between items-baseline"><p className="text-xs font-bold text-text-muted uppercase">Suma punktów</p><p className="text-3xl font-black text-green-800">{selected.reduce((acc, id) => acc + (EKOSCHEMATY_LISTA.find(x => x.id === id)?.punkty || 0), 0)}</p></div>
                            <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                                <h5 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Zasady 2025</h5>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs"><span className="text-text-secondary">Max ekoschematów na działkę:</span><span className="font-bold text-text-primary">2</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-text-secondary">Limit łączny powierzchni:</span><span className="font-bold text-text-primary">300 ha</span></div>
                                </div>
                            </div>
                            <Button variant="gold" className="w-full py-4 text-white">Generuj raport PDF</Button>
                        </div>
                    </Card>
                    <div className="p-6 bg-gold-400 rounded-3xl text-gold-900 shadow-xl shadow-gold-500/10">
                        <h4 className="font-bold mb-2 flex items-center gap-2"><Info className="w-4 h-4" />Dobra praktyka</h4>
                        <p className="text-xs font-medium leading-relaxed opacity-80">Pamiętaj o synergiach! Niektóre ekoschematy (np. Międzyplony + Plan nawożenia) dają dodatkowe korzyści w ramach normy GAEC 7.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
