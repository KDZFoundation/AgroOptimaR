'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sprout, Lock, Mail, AlertCircle } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (loginError) {
            setError('Nieprawidłowy email lub hasło.')
            setLoading(false)
        } else {
            router.push('/pulpit')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center agri-gradient p-4">
            <div className="w-full max-w-md">
                {/* LOGO & TAGLINE */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Sprout className="w-10 h-10 text-gold-500" />
                        <h1 className="text-4xl text-gold-500">AgroOptimaR</h1>
                    </div>
                    <p className="text-green-300 font-medium">Inteligentna optymalizacja dopłat ARiMR</p>
                </div>

                {/* LOGIN CARD */}
                <div className="bg-bg-card rounded-2xl p-8 card-shadow">
                    <form theme-role="login-form" onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-error/10 border border-error/20 text-error p-3 rounded-lg flex items-center gap-2 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold text-text-secondary block">
                                Adres Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 bg-green-50/50 border border-green-100 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-text-primary"
                                    placeholder="jan@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="pass" className="text-sm font-semibold text-text-secondary block">
                                Hasło
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="pass"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-green-50/50 border border-green-100 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-text-primary"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 agri-gradient text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 card-shadow"
                        >
                            {loading ? 'Logowanie...' : 'Zaloguj się'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-text-secondary">
                            Nie masz konta?{' '}
                            <a href="/rejestracja" className="text-green-600 font-bold hover:underline">
                                Zarejestruj się
                            </a>
                        </p>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="mt-12 text-center">
                    <p className="text-xs text-green-300/60 uppercase tracking-widest font-mono">
                        Dane zgodne z ARiMR | PS WPR 2023-2027
                    </p>
                </div>
            </div>
        </div>
    )
}
