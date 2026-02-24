'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sprout, Lock, User, Mail, AlertCircle, CheckCircle } from 'lucide-react'

export default function RejestracjaPage() {
    const [formData, setFormData] = useState({
        imie: '',
        nazwisko: '',
        email: '',
        ep: '',
        pass: '',
        confirm: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (formData.ep.length !== 9) {
            setError('Numer producenta EP musi mieć dokładnie 9 cyfr.')
            setLoading(false)
            return
        }

        if (formData.pass !== formData.confirm) {
            setError('Hasła nie są identyczne.')
            setLoading(false)
            return
        }

        // Dla potrzeb Demo logujemy się email/hasło
        // W rzeczywistości EP byłoby sprawdzane pod kątem unikalności w bazie
        const { data: { user }, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.pass,
            options: {
                data: {
                    imie: formData.imie,
                    nazwisko: formData.nazwisko,
                    numer_producenta: formData.ep,
                },
            },
        })

        if (authError) {
            setError(authError.message)
            setLoading(false)
        } else if (user) {
            // Zapis do tabeli publicznej rolnicy
            const { error: dbError } = await supabase
                .from('rolnicy')
                .insert({
                    id: user.id,
                    numer_producenta: formData.ep,
                    imie: formData.imie,
                    nazwisko: formData.nazwisko,
                    email: formData.email,
                })

            if (dbError && dbError.code !== '23505') { // Ignoruj jeśli już istnieje
                setError('Błąd podczas zapisywania profilu rolnika.')
                setLoading(false)
            } else {
                setSuccess(true)
                setTimeout(() => router.push('/login'), 3000)
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === 'ep') {
            setFormData({ ...formData, [name]: value.replace(/\D/g, '').slice(0, 9) })
        } else {
            setFormData({ ...formData, [name]: value })
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center agri-gradient p-4">
                <div className="bg-bg-card rounded-2xl p-8 card-shadow w-full max-w-md text-center">
                    <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Rejestracja pomyślna!</h2>
                    <p className="text-text-secondary">Udało Ci się stworzyć konto. Zaraz zostaniesz przekierowany do strony logowania...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center agri-gradient p-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Sprout className="w-8 h-8 text-gold-500" />
                        <h1 className="text-3xl text-gold-500">Dołącz do AgroOptimaR</h1>
                    </div>
                </div>

                <div className="bg-bg-card rounded-2xl p-8 card-shadow">
                    <form onSubmit={handleRegister} className="space-y-4">
                        {error && (
                            <div className="bg-error/10 border border-error/20 text-error p-3 rounded-lg flex items-center gap-2 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-text-secondary">Imię</label>
                                <input name="imie" required onChange={handleChange} className="w-full px-4 py-2 bg-green-50/50 border border-green-100 rounded-lg outline-none focus:border-green-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-text-secondary">Nazwisko</label>
                                <input name="nazwisko" required onChange={handleChange} className="w-full px-4 py-2 bg-green-50/50 border border-green-100 rounded-lg outline-none focus:border-green-500" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-text-secondary">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input name="email" type="email" required onChange={handleChange} className="w-full pl-10 pr-4 py-2 bg-green-50/50 border border-green-100 rounded-lg outline-none focus:border-green-500" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-text-secondary">Numer producenta EP (9 cyfr)</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    name="ep"
                                    value={formData.ep}
                                    required
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-2 bg-green-50/50 border border-green-100 rounded-lg outline-none focus:border-green-500"
                                    placeholder="000000000"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-gray-400">{formData.ep.length}/9</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-text-secondary">Hasło</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input name="pass" type="password" required onChange={handleChange} className="w-full pl-10 pr-4 py-2 bg-green-50/50 border border-green-100 rounded-lg outline-none focus:border-green-500" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-text-secondary">Potwierdź hasło</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input name="confirm" type="password" required onChange={handleChange} className="w-full pl-10 pr-4 py-2 bg-green-50/50 border border-green-100 rounded-lg outline-none focus:border-green-500" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-4 agri-gradient text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Tworzenie konta...' : 'Zarejestruj się'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-text-secondary">
                            Masz już konto?{' '}
                            <a href="/login" className="text-green-600 font-bold hover:underline">Zaloguj się</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
