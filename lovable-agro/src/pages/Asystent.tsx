import React, { useState, useRef, useEffect } from 'react'
import { Card, Button, Badge } from '@/components/ui'
import { Send, User, Sprout, Bot, Trash2 } from 'lucide-react'

interface Message { id: string; role: 'user' | 'assistant'; content: string }

export default function Asystent() {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'Witaj Janie! Jestem Twoim asystentem AgroOptimaR. W czym mogę Ci dzisiaj pomóc? Mogę odpowiedzieć na pytania dotyczące ekoschematów, norm GAEC/SMR lub pomóc w optymalizacji Twoich dopłat.' }
    ])
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    useEffect(() => { scrollToBottom() }, [messages])

    const handleSend = () => {
        if (!input.trim()) return
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: input }])
        setInput(''); setLoading(true)
        setTimeout(() => {
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: `To świetne pytanie dotyczące Twojego gospodarstwa. Analizując Twoje dane za 2025 rok, mogę potwierdzić, że Twoje działki w obrębie Lipowo spełniają wymogi dla ekoschematu 'Wymieszanie słomy z glebą'. Pamiętaj tylko o obowiązku prowadzenia rejestru zabiegów agrotechnicznych.` }])
            setLoading(false)
        }, 1500)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-160px)] space-y-4">
            <div className="flex justify-between items-center">
                <div><h2 className="text-3xl font-bold text-text-primary">Asystent AI</h2><p className="text-text-secondary mt-1">Chatbot przeszkolony w zakresie PS WPR 2023-2027.</p></div>
                <Button variant="ghost" className="text-error" icon={<Trash2 className="w-4 h-4" />} onClick={() => setMessages([messages[0]])}>Wyczyść historię</Button>
            </div>
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 flex flex-col bg-white rounded-3xl border border-border-custom card-shadow overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex gap-4 ${msg.role === 'assistant' ? '' : 'flex-row-reverse'}`}>
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-gold-100 text-gold-600' : 'bg-green-100 text-green-700'}`}>{msg.role === 'assistant' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}</div>
                                <div className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed ${msg.role === 'assistant' ? 'bg-gray-50 text-text-primary rounded-tl-none' : 'bg-green-800 text-white rounded-tr-none'}`}>{msg.content}</div>
                            </div>
                        ))}
                        {loading && (<div className="flex gap-4"><div className="w-10 h-10 rounded-2xl bg-gold-100 text-gold-600 flex items-center justify-center animate-pulse"><Bot className="w-6 h-6" /></div><div className="bg-gray-50 p-4 rounded-3xl rounded-tl-none flex gap-1 items-center"><span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" /><span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" /><span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" /></div></div>)}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                        <div className="relative">
                            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Zadaj pytanie asystentowi..." className="w-full pl-6 pr-14 py-4 bg-white border border-border-custom rounded-2xl outline-none focus:ring-2 focus:ring-green-500/10 focus:border-green-500 transition-all font-medium text-sm" />
                            <button onClick={handleSend} disabled={!input.trim() || loading} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-green-800 text-white rounded-xl flex items-center justify-center hover:bg-green-700 transition-all disabled:opacity-50"><Send className="w-5 h-5" /></button>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block space-y-6">
                    <Card title="Częste pytania" icon={<Sprout />}>
                        <div className="space-y-2">
                            {['Jakie są stawki na 2026 r.?', 'Ekoschematy na GO', 'Terminy w rolnictwie węglowym', 'Mój limit 300 ha'].map((q, idx) => (
                                <button key={idx} onClick={() => setInput(q)} className="w-full text-left p-3 text-xs font-bold text-text-secondary hover:bg-green-50 hover:text-green-700 rounded-xl transition-all border border-transparent hover:border-green-100">{q}</button>
                            ))}
                        </div>
                    </Card>
                    <div className="p-6 bg-gold-400 rounded-3xl text-gold-900"><h4 className="font-bold text-sm mb-2">Baza Wiedzy</h4><p className="text-[10px] leading-relaxed opacity-80">Moje odpowiedzi opierają się na Planie Strategicznym Wspólnej Polityki Rolnej na lata 2023-2027.</p></div>
                </div>
            </div>
        </div>
    )
}
