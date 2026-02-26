import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, BookOpen, LogOut, Shield } from 'lucide-react'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-gold-500">
                        <Shield className="w-6 h-6" />
                        <span className="text-xl font-bold">Admin Panel</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">AgroOptimaR</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/admin/uzytkownicy" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
                        <Users className="w-5 h-5" />
                        <span>Użytkownicy</span>
                    </Link>

                    <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Słowniki
                    </div>

                    <Link href="/admin/slowniki" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
                        <BookOpen className="w-5 h-5" />
                        <span>Słowniki systemowe</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Link href="/pulpit" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
                        <LogOut className="w-5 h-5" />
                        <span>Wróć do aplikacji</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="h-16 bg-white border-b flex items-center px-8 justify-between">
                    <h1 className="text-xl font-bold text-gray-800">Administracja</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Zalogowany jako Administrator</span>
                        <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-white font-bold">
                            A
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
