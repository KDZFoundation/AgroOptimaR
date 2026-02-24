'use client'

import React, { useState } from 'react'
import { Card, Button, Badge, ProgressBar, StatCard } from '@/components/ui'
import { Cpu, Zap, TrendingUp, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

export default function OptymalizatorPage() {
    const [isOptimizing, setIsOptimizing] = useState(false)
    const [showResults, setShowResults] = useState(false)

    const handleOptimize = () => {
        setIsOptimizing(true)
        setTimeout(() => {
            setIsOptimizing(false)
            setShowResults(true)
        }, 3000)
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Optymalizator AI</h2>
                    <p className="text-text-secondary mt-1">Maksymalizuj swoje dopłaty dzięki inteligentnej analizie Claude 3.5.</p>
                </div>
            </div>

            {!showResults ? (
                <div className="max-w-2xl mx-auto py-12 text-center space-y-8">
                    <div className="w-24 h-24 bg-gold-100 rounded-3xl flex items-center justify-center text-gold-500 mx-auto animate-pulse">
                        <Cpu className="w-12 h-12" />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-text-primary">Gotowy na optymalizację?</h3>
                        <p className="text-text-secondary">
                            Nasz algorytm AI przeanalizuje Twoje działki, historię upraw oraz matrycę kompatybilności,
                            aby zaproponować zestaw ekoschematów dający najwyższą kwotę dopłaty.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                        <div className="p-4 bg-white rounded-2xl border border-border-custom flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-success" />
                            <p className="text-xs text-text-secondary">Zgodność z aktualnymi wymogami ARiMR (PS WPR 2023-2027).</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-border-custom flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-gold-500" />
                            <p className="text-xs text-text-secondary">Wykrywanie synergii między ekoschematami.</p>
                        </div>
                    </div>

                    <Button
                        variant="gold"
                        size="lg"
                        className="w-full sm:w-auto px-12"
                        onClick={handleOptimize}
                        loading={isOptimizing}
                    >
                        {isOptimizing ? 'Analizowanie danych...' : 'Uruchom Optymalizację'}
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                    {/* RESULTS SUMMARY */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card title="Rekomendowany Zestaw Ekoschematów" icon={<Sparkles />} badge={<Badge variant="gold">OPTYMALNIE</Badge>}>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 border border-green-600 bg-green-50 rounded-2xl relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-bold text-green-800">Uproszczone systemy uprawy</h5>
                                            <Badge variant="success">+3 PKT</Badge>
                                        </div>
                                        <p className="text-xs text-green-700/70">Najwyższa rentowność dla Twoich GO.</p>
                                        <CheckCircle2 className="absolute -bottom-2 -right-2 w-12 h-12 text-green-600/10" />
                                    </div>
                                    <div className="p-4 border border-green-600 bg-green-50 rounded-2xl relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-bold text-green-800">Międzyplony ozime</h5>
                                            <Badge variant="success">+5 PKT</Badge>
                                        </div>
                                        <p className="text-xs text-green-700/70">Synergia z Planem Nawożenia.</p>
                                        <CheckCircle2 className="absolute -bottom-2 -right-2 w-12 h-12 text-green-600/10" />
                                    </div>
                                    <div className="p-4 border border-green-600 bg-green-50 rounded-2xl relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-bold text-green-800">Plan nawożenia (wapnowanie)</h5>
                                            <Badge variant="success">+3 PKT</Badge>
                                        </div>
                                        <p className="text-xs text-green-700/70">Wymagane próbki gleby z 2024r.</p>
                                        <CheckCircle2 className="absolute -bottom-2 -right-2 w-12 h-12 text-green-600/10" />
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                    <h5 className="text-sm font-bold text-text-primary mb-4">Analiza Twoich korzyści:</h5>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-text-secondary">Suma punktów (ha):</span>
                                            <span className="font-bold text-green-700">11 PKT</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-text-secondary">Zysk vs Twoja obecna symulacja:</span>
                                            <span className="font-bold text-success">+ 12 450 PLN</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-text-secondary">Ryzyko kontroli (zgodność):</span>
                                            <Badge variant="success">BARDZO NISKIE</Badge>
                                        </div>
                                    </div>
                                </div>

                                <Button variant="primary" className="w-full">Zastosuj tę konfigurację</Button>
                            </div>
                        </Card>

                        <Card title="Uzasadnienie AI" icon={<Cpu />}>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                Rekomendacja opiera się na dużej powierzchni gruntów ornych (GO) w Twoim gospodarstwie.
                                Połączenie <b>Uproszczonych systemów uprawy</b> z <b>Międzyplonami</b> pozwala na maksymalizację dopłat przy minimalnym nakładzie pracy dodatkowej.
                                Sugerujemy wybór wariantu 'Wapnowanie' w Planie Nawożenia, gdyż historia Twoich badań gleby wskazuje na niskie pH na działkach 12/1 i 12/2.
                            </p>
                        </Card>
                    </div>

                    {/* SIDEBAR STATS */}
                    <div className="lg:col-span-1 space-y-6">
                        <StatCard label="Docelowa kwota" value="412 800" unit="PLN" icon={<TrendingUp />} className="bg-green-800 text-white" />
                        <Card title="Twój Onboarding AI" icon={<Zap />}>
                            <div className="space-y-6">
                                <ProgressBar label="Analiza danych historycznych" value={100} max={100} color="green" />
                                <ProgressBar label="Analiza warunkowości (GAEC)" value={100} max={100} color="green" />
                                <ProgressBar label="Badanie synergii" value={100} max={100} color="green" />
                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-xs text-text-muted italic">Dane zaktualizowane: dzisiaj, 12:45</p>
                                </div>
                            </div>
                        </Card>
                        <Button variant="secondary" className="w-full" onClick={() => setShowResults(false)}>Zmień dane wejściowe</Button>
                    </div>
                </div>
            )}
        </div>
    )
}
