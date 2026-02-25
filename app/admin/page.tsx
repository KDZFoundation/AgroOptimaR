import React from 'react'
import { Card } from '@/components/ui'
import { Users, BookOpen, Database, AlertCircle } from 'lucide-react'

export default function AdminPage() {
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Panel Administratora</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase">Użytkownicy</p>
                        <p className="text-2xl font-black text-gray-800">142</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase">Uprawy</p>
                        <p className="text-2xl font-black text-gray-800">24</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                        <Database className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase">Ekoschematy</p>
                        <p className="text-2xl font-black text-gray-800">8</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Ostatnie logowania" icon={<Users />}>
                    <div className="p-4 text-center text-gray-400 italic">Brak danych historycznych</div>
                </Card>
                <Card title="Status systemu" icon={<AlertCircle />}>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg text-green-800 text-sm">
                            <span>Baza danych (Supabase)</span>
                            <span className="font-bold">Dostępna</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg text-green-800 text-sm">
                            <span>API (Next.js)</span>
                            <span className="font-bold">Dostępne</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
