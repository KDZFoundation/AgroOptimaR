'use client'

import React from 'react'
import {
    StatCard,
    Card,
    Button,
    Badge,
    ProgressBar
} from '@/components/ui'
import {
    Maximize,
    Euro,
    Trophy,
    Clock,
    ArrowRight,
    FileUp,
    Cpu,
    MessageSquare,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    PieChart,
    Leaf,
    Sprout
} from 'lucide-react'
import Link from 'next/link'

export default function PulpitPage() {
    return (
        <div className="space-y-8">
            {/* ALERTS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gold-100/50 border border-gold-400/20 p-4 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-gold-600 mt-1 shrink-0" />
                    <div className="text-sm">
                        <p className="font-bold text-gold-800">Kampania 2026: Planowanie</p>
                        <p className="text-gold-700/80">Okno składania wniosków otwiera się 15 marca 2026. Rozpocznij symulację dopłat już dziś.</p>
                    </div>
                </div>
                <div className="bg-green-100/50 border border-green-400/20 p-4 rounded-2xl flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                    <div className="text-sm">
                        <p className="font-bold text-green-800">Kampania 2025: W toku</p>
                        <p className="text-green-700/80">Termin złożenia wniosku: 14 marca 2026. Pamiętaj o uzupełnieniu dokumentacji zdjęciowej.</p>
                    </div>
                </div>
            </div>

            {/* STATS SECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Łączna powierzchnia"
                    value="214,43"
                    unit="ha"
                    icon={<Maximize />}
                    trend="neutral"
                />
                <StatCard
                    label="Szacowane dopłaty 2026"
                    value="371 615"
                    unit="PLN"
                    icon={<Euro />}
                    trend="up"
                    trendValue="+12% VS 2025"
                />
                <StatCard
                    label="Punkty Roln. Węglowego"
                    value="847"
                    unit="pkt"
                    icon={<Trophy />}
                    trend="up"
                    trendValue="+140 PKT"
                />
                <StatCard
                    label="Twoja Kampania"
                    value="2025"
                    unit="W TOKU"
                    icon={<Clock />}
                    className="bg-green-800 text-white"
                />
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN: VISUALIZATIONS */}
                <div className="lg:col-span-2 space-y-8">
                    <Card title="Historia Płatności" icon={<TrendingUp />} badge={<Badge variant="gold">Szacowane 2026</Badge>}>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-text-muted italic">Wykres historii płatności (Recharts)</p>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card title="Struktura dopłat" icon={<PieChart />}>
                            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-text-muted text-xs italic">Podział: Podstawowe vs Ekoschematy</p>
                            </div>
                        </Card>
                        <Card title="Status Ekoschematów" icon={<Leaf />}>
                            <div className="space-y-6 pt-2">
                                <ProgressBar label="Rolnictwo Węglowe" value={847} max={1200} color="green" />
                                <ProgressBar label="Limit powierzchni (300ha)" value={214.43} max={300} color="gold" />
                            </div>
                        </Card>
                    </div>
                </div>

                {/* RIGHT COLUMN: QUICK ACTIONS */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-text-primary px-1">Szybkie akcje</h3>

                    <Link href="/wnioski-pdf" className="block p-5 bg-white rounded-3xl border border-border-custom hover:border-green-500 transition-all card-shadow group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-700 group-hover:bg-green-600 group-hover:text-white transition-all">
                                <FileUp className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-text-primary">Prześlij wniosek PDF</p>
                                <p className="text-xs text-text-secondary mt-0.5">Zautomatyzuj wprowadzanie danych</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    <Link href="/optymalizator" className="block p-5 bg-white rounded-3xl border border-border-custom hover:border-gold-500 transition-all card-shadow group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gold-50 rounded-2xl flex items-center justify-center text-gold-600 group-hover:bg-gold-500 group-hover:text-white transition-all">
                                <Cpu className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-text-primary">Optymalizator AI</p>
                                <p className="text-xs text-text-secondary mt-0.5">Znajdź najlepsze ekoschematy</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    <Link href="/asystent" className="block p-5 bg-white rounded-3xl border border-border-custom hover:border-green-500 transition-all card-shadow group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-700 group-hover:bg-green-600 group-hover:text-white transition-all">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-text-primary">Asystent AI</p>
                                <p className="text-xs text-text-secondary mt-0.5">Zadaj pytanie rolnicze</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    <div className="p-6 bg-green-900 rounded-3xl text-white mt-4 relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-2 font-mono">Status Onboarding</p>
                            <h4 className="text-lg font-bold mb-4 leading-tight">Uzupełnij profil, aby odblokować pełną analizę.</h4>
                            <Button variant="gold" size="sm" className="w-full">Dokończ konfigurację</Button>
                        </div>
                        <Sprout className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 rotate-12" />
                    </div>
                </div>
            </div>
        </div>
    )
}
