import React, { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import {
    Sprout, Home, Calendar, Leaf, FileText, Settings,
    Calculator, Zap, Cpu, MessageSquare, LogOut,
    ChevronDown, User as UserIcon, Search
} from 'lucide-react'
import { cn } from '@/lib/utils'

const MENU_ITEMS = [
    { id: 'pulpit', label: 'Pulpit', icon: <Home className="w-5 h-5" />, path: '/pulpit' },
    { id: 'kampanie', label: 'Kampanie', icon: <Calendar className="w-5 h-5" />, path: '/kampanie' },
    { id: 'rolnictwo-weglowe', label: 'Rolnictwo Węglowe', icon: <Leaf className="w-5 h-5" />, path: '/rolnictwo-weglowe' },
    { id: 'wnioski-pdf', label: 'Wnioski PDF', icon: <FileText className="w-5 h-5" />, path: '/wnioski-pdf' },
    {
        id: 'panel', label: 'Panel Rolnika', icon: <Settings className="w-5 h-5" />, subItems: [
            { label: 'Słownik działek', path: '/panel-rolnika?tab=dzialki' },
            { label: 'Stawki płatności', path: '/panel-rolnika?tab=stawki' },
            { label: 'Słownik upraw', path: '/panel-rolnika?tab=uprawy' },
        ]
    },
    { id: 'kalkulator', label: 'Kalkulator 2026', icon: <Calculator className="w-5 h-5" />, path: '/kalkulator' },
    { id: 'symulator', label: 'Symulator', icon: <Zap className="w-5 h-5" />, path: '/symulator' },
    { id: 'optymalizator', label: 'Optymalizator AI', icon: <Cpu className="w-5 h-5" />, path: '/optymalizator' },
    { id: 'asystent', label: 'Asystent AI', icon: <MessageSquare className="w-5 h-5" />, path: '/asystent' },
]

export default function DashboardLayout() {
    const location = useLocation()
    const pathname = location.pathname
    const [panelOpen, setPanelOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-bg-page">
            {/* SIDEBAR */}
            <aside className="w-64 bg-green-900 text-white flex flex-col fixed inset-y-0 left-0 z-40">
                {/* LOGO & USER */}
                <div className="p-6 border-b border-green-800/50">
                    <div className="flex items-center gap-2 mb-6 text-gold-500">
                        <Sprout className="w-8 h-8" />
                        <h1 className="text-xl font-bold tracking-tight">AgroOptimaR</h1>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-800/40 rounded-2xl border border-green-700/30">
                        <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500">
                            <UserIcon className="w-6 h-6" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">Jan Kowalski</p>
                            <p className="text-[10px] text-green-300 font-mono italic opacity-70">••••••123</p>
                        </div>
                    </div>
                </div>

                {/* NAVIGATION */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    <div className="px-3 mb-2">
                        <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                            Kampania 2025 - W TOKU
                        </div>
                    </div>

                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname === item.path || (item.subItems?.some(si => pathname + location.search === si.path))

                        if (item.subItems) {
                            return (
                                <div key={item.id} className="space-y-1">
                                    <button
                                        onClick={() => setPanelOpen(!panelOpen)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all font-bold text-sm",
                                            isActive ? "bg-gold-500 text-white" : "text-white/70 hover:bg-green-800 hover:text-white"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            {item.label}
                                        </div>
                                        <ChevronDown className={cn("w-4 h-4 transition-transform", panelOpen && "rotate-180")} />
                                    </button>
                                    {panelOpen && (
                                        <div className="pl-11 space-y-1 py-1">
                                            {item.subItems.map((sub, idx) => (
                                                <Link
                                                    key={idx}
                                                    to={sub.path}
                                                    className="block py-2 text-xs font-medium text-white/60 hover:text-gold-400 transition-colors"
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        }

                        return (
                            <Link
                                key={item.id}
                                to={item.path || '#'}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-bold text-sm",
                                    isActive ? "bg-gold-500 text-white shadow-lg shadow-gold-900/40" : "text-white/70 hover:bg-green-800 hover:text-white"
                                )}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                {/* LOGOUT */}
                <div className="p-4 border-t border-green-800/50">
                    <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/70 hover:bg-error/10 hover:text-error transition-all font-bold text-sm">
                        <LogOut className="w-5 h-5" />
                        Wyloguj
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-64 p-8 min-h-screen">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Witaj, Janie! 👋</h2>
                        <p className="text-text-secondary mt-1">Oto podsumowanie Twojego gospodarstwa na dziś.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Szukaj działki, stawki..." className="bg-white border border-border-custom pl-10 pr-4 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/10" />
                        </div>
                    </div>
                </header>

                <div className="animate-fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
