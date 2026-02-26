'use client'

import React, { useState, useEffect } from 'react'
import { Card, Button, Badge, DataTable, Modal, Tabs, type Column } from '@/components/ui'
import { Sprout, Leaf, Plus, Trash2, Check, X } from 'lucide-react'
import { getUprawy, addUprawa, deleteUprawa, getEkoschematy, addEkoschemat, deleteEkoschemat } from '@/app/actions/admin-dictionaries'

export default function SlownikiPage() {
    const [activeTab, setActiveTab] = useState('uprawy')

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Słowniki systemowe</h2>

            <Tabs
                tabs={[
                    { id: 'uprawy', label: 'Uprawy', icon: <Sprout className="w-4 h-4" /> },
                    { id: 'ekoschematy', label: 'Ekoschematy', icon: <Leaf className="w-4 h-4" /> }
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            {activeTab === 'uprawy' ? <UprawyContent /> : <EkoschematyContent />}
        </div>
    )
}

function UprawyContent() {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchData = async () => {
        setLoading(true)
        const res = await getUprawy()
        setData(res)
        setLoading(false)
    }

    useEffect(() => { fetchData() }, [])

    const handleDelete = async (id: string) => {
        if (confirm('Czy na pewno usunąć tę uprawę?')) {
            await deleteUprawa(id)
            fetchData()
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)
        await addUprawa(formData)
        setIsSubmitting(false)
        setIsModalOpen(false)
        fetchData()
    }

    const columns: Column<any>[] = [
        { header: 'Kod', accessor: (row) => <Badge variant="neutral" className="font-mono">{row.kod}</Badge> },
        { header: 'Nazwa', accessor: 'nazwa' },
        { header: 'Grupa', accessor: 'grupa' },
        { header: 'Wspierana', accessor: (row) => row.czy_wspierana ? <Check className="text-green-600 w-4 h-4"/> : <X className="text-red-600 w-4 h-4"/> },
        {
            header: 'Akcje',
            accessor: (row) => (
                <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)} icon={<Trash2 className="w-4 h-4 text-red-600"/>} />
            )
        }
    ]

    return (
        <Card title="Lista zdefiniowanych upraw" icon={<Sprout/>}>
            <div className="mb-4 flex justify-end">
                <Button variant="primary" icon={<Plus className="w-4 h-4"/>} onClick={() => setIsModalOpen(true)}>Dodaj uprawę</Button>
            </div>

            {loading ? <p className="text-center py-8 text-gray-400">Ładowanie...</p> : <DataTable data={data} columns={columns} />}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Dodaj nową uprawę">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-bold text-gray-700">Kod (np. A, B, C)</label>
                        <input name="kod" required className="w-full p-2 border rounded-xl bg-gray-50 font-mono focus:ring-2 focus:ring-green-500 outline-none" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-700">Nazwa</label>
                        <input name="nazwa" required className="w-full p-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-700">Grupa</label>
                        <input name="grupa" className="w-full p-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" placeholder="np. zboża" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="czy_wspierana" defaultChecked id="sup" className="w-4 h-4 text-green-600 rounded" />
                        <label htmlFor="sup" className="text-sm text-gray-700">Czy wspierana?</label>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Anuluj</Button>
                        <Button type="submit" variant="primary" disabled={isSubmitting}>Zapisz</Button>
                    </div>
                </form>
            </Modal>
        </Card>
    )
}

function EkoschematyContent() {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchData = async () => {
        setLoading(true)
        const res = await getEkoschematy()
        setData(res)
        setLoading(false)
    }

    useEffect(() => { fetchData() }, [])

    const handleDelete = async (id: string) => {
        if (confirm('Czy na pewno usunąć ten ekoschemat?')) {
            await deleteEkoschemat(id)
            fetchData()
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)
        await addEkoschemat(formData)
        setIsSubmitting(false)
        setIsModalOpen(false)
        fetchData()
    }

    const columns: Column<any>[] = [
        { header: 'Kod', accessor: (row) => <Badge variant="neutral" className="font-mono">{row.kod}</Badge> },
        { header: 'Nazwa', accessor: 'nazwa' },
        { header: 'Punkty', accessor: (row) => <span className="font-bold text-green-700">{row.punkty} pkt</span> },
        { header: 'Stawka (PLN)', accessor: (row) => row.stawka_pln ? `${row.stawka_pln} zł` : '-' },
        {
            header: 'Akcje',
            accessor: (row) => (
                <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)} icon={<Trash2 className="w-4 h-4 text-red-600"/>} />
            )
        }
    ]

    return (
        <Card title="Lista ekoschematów" icon={<Leaf/>}>
            <div className="mb-4 flex justify-end">
                <Button variant="primary" icon={<Plus className="w-4 h-4"/>} onClick={() => setIsModalOpen(true)}>Dodaj ekoschemat</Button>
            </div>

            {loading ? <p className="text-center py-8 text-gray-400">Ładowanie...</p> : <DataTable data={data} columns={columns} />}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Dodaj nowy ekoschemat">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-bold text-gray-700">Kod (np. E_ROL_W)</label>
                        <input name="kod" required className="w-full p-2 border rounded-xl bg-gray-50 font-mono focus:ring-2 focus:ring-green-500 outline-none" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-700">Nazwa</label>
                        <input name="nazwa" required className="w-full p-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-sm font-bold text-gray-700">Punkty</label>
                            <input name="punkty" type="number" step="0.01" className="w-full p-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-700">Stawka (PLN)</label>
                            <input name="stawka_pln" type="number" step="0.01" className="w-full p-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                    </div>
                     <div>
                        <label className="text-sm font-bold text-gray-700">Opis</label>
                        <textarea name="opis" className="w-full p-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" rows={3}/>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Anuluj</Button>
                        <Button type="submit" variant="primary" disabled={isSubmitting}>Zapisz</Button>
                    </div>
                </form>
            </Modal>
        </Card>
    )
}
