'use client'

import React, { useState, useEffect } from 'react'
import { Card, Button, DataTable, type Column } from '@/components/ui'
import { Sprout, Trash2, Plus } from 'lucide-react'
import { getUprawy, addUprawa, deleteUprawa } from '@/app/actions/admin-dictionaries'
import { Badge } from '@/components/ui/Badge' // Import Badge from correct location

export default function UprawyDictionaryPage() {
    const [uprawy, setUprawy] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const data = await getUprawy()
        setUprawy(data || [])
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Czy na pewno chcesz usunąć tę uprawę?')) return
        await deleteUprawa(id)
        loadData()
    }

    const handleAdd = async (formData: FormData) => {
        await addUprawa(formData)
        loadData()
    }

    const columns: Column<any>[] = [
        { header: 'Kod', accessor: 'kod' },
        { header: 'Nazwa', accessor: 'nazwa' },
        { header: 'Grupa', accessor: 'grupa' },
        {
            header: 'Wspierana',
            accessor: (item) => <Badge variant={item.czy_wspierana ? 'success' : 'error'}>{item.czy_wspierana ? 'TAK' : 'NIE'}</Badge>
        },
        {
            header: 'Akcje',
            accessor: (item) => (
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50" icon={<Trash2 className="w-4 h-4" />}>
                   Usuń
                </Button>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Słownik Upraw</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Lista upraw" icon={<Sprout />}>
                        {loading ? <p>Ładowanie...</p> : <DataTable data={uprawy} columns={columns} />}
                    </Card>
                </div>

                <div>
                    <Card title="Dodaj nową uprawę" icon={<Plus />}>
                        <form action={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Kod (np. PSZ)</label>
                                <input name="kod" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nazwa</label>
                                <input name="nazwa" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Grupa</label>
                                <select name="grupa" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border">
                                    <option value="zboża">Zboża</option>
                                    <option value="okopowe">Okopowe</option>
                                    <option value="motylkowe">Motylkowe</option>
                                    <option value="inne">Inne</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input name="czy_wspierana" type="checkbox" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" defaultChecked />
                                <label className="block text-sm text-gray-900">Czy wspierana?</label>
                            </div>
                            <Button variant="primary" type="submit" className="w-full">Dodaj</Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}
