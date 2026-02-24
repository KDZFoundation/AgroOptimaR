import React, { useState } from 'react'
import { Card, StatCard, Badge, Button, ProgressBar, Tooltip } from '@/components/ui'
import { Leaf, Trophy, AlertTriangle, CheckCircle2, Info, ArrowRight } from 'lucide-react'
import { STAWKI_2025, ZASADY_2025 } from '@/lib/constants'

const PRAKTYKI = [
    { kod: 'E_EKSTUZ', nazwa: 'Ekstensywne TUZ z obsadą zwierząt', punkty: 5, opis: 'Wypas zwierząt na trwałych użytkach zielonych (0,3-2 DJP/ha).' },
    { kod: 'E_MPW', nazwa: 'Międzyplony ozime / wsiewki', punkty: 5, opis: 'Wysiew mieszanek roślin w poplonie ozimym lub wsiewek śródplonowych.' },
    { kod: 'E_OPN_P', nazwa: 'Plan nawożenia - podstawowy', punkty: 1, opis: 'Opracowanie i realizacja planu nawożenia opartego na badaniach gleby.' },
    { kod: 'E_ZSU', nazwa: 'Zróżnicowana struktura upraw', punkty: 3, opis: 'Uprawa co najmniej 3 różnych grup roślin w gospodarstwie.' },
    { kod: 'E_OBR', nazwa: 'Wymieszanie obornika (12h)', punkty: 2, opis: 'Przyoranie lub wymieszanie obornika z glebą w ciągu 12h od wywozu.' },
    { kod: 'E_PN', nazwa: 'Nawozy płynne (nie rozbryzgowo)', punkty: 3, opis: 'Aplikacja gnojowicy/gnojówki doglebowo lub wężami rozlewanymi.' },
    { kod: 'E_USU', nazwa: 'Uproszczone systemy uprawy', punkty: 3, opis: 'Uprawa bezorkowa lub siew bezpośredni.' },
    { kod: 'E_WSG', nazwa: 'Wymieszanie słowy z glebą', punkty: 1, opis: 'Rozdrobnienie i wymieszanie słomy z glebą po zbiorze plonu głównego.' },
]

export default function RolnictwoWeglowe() {
    const [selectedPraktics, setSelectedPraktics] = useState<string[]>([])
    const [powierzchnia] = useState(214.43)
    const totalPoints = selectedPraktics.reduce((acc, kod) => { const p = PRAKTYKI.find(item => item.kod === kod); return acc + (p ? p.punkty : 0) }, 0)
    const totalValue = totalPoints * STAWKI_2025.pkt_wartosc * Math.min(powierzchnia, 300)
    const threshold = powierzchnia * ZASADY_2025.CARBON_FARMING_THRESHOLD_MULTIPLIER
    const togglePraktyka = (kod: string) => setSelectedPraktics(prev => prev.includes(kod) ? prev.filter(k => k !== kod) : [...prev, kod])

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div><h2 className="text-3xl font-bold text-text-primary">Rolnictwo Węglowe</h2><p className="text-text-secondary mt-1">Zarządzaj praktykami i symuluj punkty dla swojego gospodarstwa.</p></div>
                <Button variant="gold" icon={<Trophy className="w-4 h-4" />}>Ranking Gospodarstw</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Suma punktów" value={totalPoints} unit="PKT/ha" icon={<Trophy />} trend="up" trendValue="SZACUNKOWO" />
                <StatCard label="Wartość dopłaty" value={totalValue.toLocaleString('pl-PL', { maximumFractionDigits: 2 })} unit="PLN" icon={<Leaf />} className="bg-green-800 text-white" />
                <Card className="flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-2"><span className="text-sm font-semibold text-text-secondary">Próg wejścia (1.25x)</span><Tooltip content="Minimalna liczba punktów wymagana dla Twojej powierzchni UR."><Info className="w-4 h-4 text-gray-300" /></Tooltip></div>
                    <p className="text-2xl font-bold text-text-primary">{threshold.toFixed(2)} PKT</p>
                    <div className="mt-2 text-[10px] font-bold text-success uppercase">Spełniono</div>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-text-primary">Dostępne praktyki 2025</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {PRAKTYKI.map(p => (
                            <div key={p.kod} onClick={() => togglePraktyka(p.kod)} className={`p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${selectedPraktics.includes(p.kod) ? 'border-green-600 bg-green-50/50 shadow-md' : 'border-border-custom bg-white hover:border-green-500/50'}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`p-2 rounded-xl transition-colors ${selectedPraktics.includes(p.kod) ? 'bg-green-600 text-white' : 'bg-gray-100 text-text-muted group-hover:bg-green-100 group-hover:text-green-700'}`}><Leaf className="w-5 h-5" /></div>
                                    <Badge variant={selectedPraktics.includes(p.kod) ? 'success' : 'neutral'}>+{p.punkty} PKT</Badge>
                                </div>
                                <h4 className="font-bold text-text-primary group-hover:text-green-700 transition-colors">{p.nazwa}</h4>
                                <p className="text-xs text-text-secondary mt-2 line-clamp-2">{p.opis}</p>
                                {selectedPraktics.includes(p.kod) && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-green-600" />}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-6">
                    <Card title="Twój Postęp" icon={<Trophy />}>
                        <div className="space-y-6">
                            <ProgressBar label="Realizacja progu (1.25x)" value={totalPoints * powierzchnia} max={threshold} color="gold" />
                            <ProgressBar label="Wykorzystanie limitu (300ha)" value={powierzchnia} max={300} color="green" />
                            <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
                                <p className="text-xs text-text-secondary leading-relaxed">Pamiętaj, że praktyki <b>'{PRAKTYKI[6].nazwa}'</b> i <b>'{PRAKTYKI[4].nazwa}'</b> mają specjalne wymogi dotyczące terminów realizacji.</p>
                            </div>
                            <Button variant="primary" className="w-full py-4 mt-2">Zapisz symulację<ArrowRight className="w-4 h-4 ml-2" /></Button>
                        </div>
                    </Card>
                    <div className="p-6 bg-green-900 rounded-3xl text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="font-bold mb-2">Wskazówka AI</h4>
                            <p className="text-xs text-green-100/80 leading-relaxed mb-4">Dodanie praktyki 'Plan nawożenia' zwiększy Twoje dopłaty o ok. 2 400 PLN i pomoże w spełnieniu normy GAEC 7.</p>
                            <Button variant="gold" size="sm" className="w-full">Zastosuj rekomendację</Button>
                        </div>
                        <Info className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 -rotate-12" />
                    </div>
                </div>
            </div>
        </div>
    )
}
