'use client'

import React, { useState } from 'react'
import { Card, Tabs, DataTable, Button, Badge, Modal } from '@/components/ui'
import { Plus, Settings, Map, Coins, Sprout, ShieldCheck } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function PanelRolnikaPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const activeTab = searchParams.get('tab') || 'dzialki'

    const tabs = [
        { id: 'dzialki', label: 'Działki', icon: <Map className="w-4 h-4" /> },
        { id: 'stawki', label: 'Stawki', icon: <Coins className="w-4 h-4" /> },
        { id: 'uprawy', label: 'Uprawy', icon: <Sprout className="w-4 h-4" /> },
        { id: 'zgodnosc', label: 'Zgodność (GAEC)', icon: <ShieldCheck className="w-4 h-4" /> },
    ]

    const handleTabChange = (id: string) => {
        router.push(`/panel-rolnika?tab=${id}`)
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Panel Rolnika</h2>
                    <p className="text-text-secondary mt-1">Zarządzaj słownikami i danymi swojego gospodarstwa.</p>
                </div>
                <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Dodaj wpis</Button>
            </div>

            <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

            <div className="animate-fade-in">
                {activeTab === 'dzialki' && <DzialkiTab />}
                {activeTab === 'stawki' && <StawkiTab />}
                {activeTab === 'uprawy' && <UprawyTab />}
                {activeTab === 'zgodnosc' && <ZgodnoscTab />}
            </div>
        </div>
    )
}

function DzialkiTab() {
    const data = [
        { id: '1', numer: '12/1', obreb: 'Lipowo', pow: '15.20', uprawa: 'Pszenica ozima' },
        { id: '2', numer: '12/2', obreb: 'Lipowo', pow: '10.50', uprawa: 'Kukurydza' },
        { id: '3', numer: '45/3', obreb: 'Dąbrowa', pow: '22.10', uprawa: 'Rzepak ozimy' },
    ]

    const columns = [
        { header: 'Numer działki', accessor: 'numer' },
        { header: 'Obręb', accessor: 'obreb' },
        { header: 'Powierzchnia (ha)', accessor: 'pow' },
        { header: 'Aktualna uprawa', accessor: (item: any) => <Badge variant="info">{item.uprawa}</Badge> },
    ]

    return (
        <Card title="Słownik Działek Rolnych" icon={<Map />}>
            <DataTable data={data} columns={columns} />
        </Card>
    )
}

function StawkiTab() {
    const data = [
        { kod: 'BWS', nazwa: 'Podstawowe wsparcie', stawka: '488.55', jedn: 'PLN/ha' },
        { kod: 'E_WSG', nazwa: 'Wymieszanie słomy', stawka: '1.00', jedn: 'PKT/ha' },
        { kod: 'E_MPW', nazwa: 'Międzyplony ozime', stawka: '5.00', jedn: 'PKT/ha' },
    ]

    const columns = [
        { header: 'Kod', accessor: 'kod' },
        { header: 'Nazwa płatności', accessor: 'nazwa' },
        { header: 'Stawka (2025)', accessor: 'stawka' },
        { header: 'Jednostka', accessor: (item: any) => <span className="font-mono text-[10px]">{item.jedn}</span> },
    ]

    return (
        <Card title="Słownik Stawek Płatności" icon={<Coins />}>
            <DataTable data={data} columns={columns} />
        </Card>
    )
}

function UprawyTab() {
    const data = [
        { kod: '101', nazwa: 'Pszenica ozima', kategoria: 'Zboża' },
        { kod: '202', nazwa: 'Rzepak ozimy', kategoria: 'Oleiste' },
        { kod: '303', nazwa: 'Burak cukrowy', kategoria: 'Korzeniowe' },
    ]

    const columns = [
        { header: 'Kod ARiMR', accessor: 'kod' },
        { header: 'Nazwa uprawy', accessor: 'nazwa' },
        { header: 'Kategoria', accessor: 'kategoria' },
    ]

    return (
        <Card title="Słownik Upraw" icon={<Sprout />}>
            <DataTable data={data} columns={columns} />
        </Card>
    )
}

function ZgodnoscTab() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Normy GAEC" icon={<ShieldCheck />}>
                <div className="space-y-4">
                    {[1, 2, 6, 7, 8].map(n => (
                        <div key={n} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="text-sm">
                                <p className="font-bold text-text-primary">GAEC {n}</p>
                                <p className="text-[10px] text-text-secondary truncate max-w-[200px]">Utrzymywanie trwałych użytków zielonych...</p>
                            </div>
                            <Badge variant="success">ZGODNE</Badge>
                        </div>
                    ))}
                </div>
            </Card>
            <Card title="Wymogi SMR" icon={<ShieldCheck />}>
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="text-sm">
                                <p className="font-bold text-text-primary">SMR {n}</p>
                                <p className="text-[10px] text-text-secondary">Ochrona wód przed zanieczyszczeniami...</p>
                            </div>
                            <Badge variant="success">ZGODNE</Badge>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
