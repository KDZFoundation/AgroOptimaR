import React from 'react'
import { cn } from '@/lib/utils'

export interface Tab { id: string; label: string; icon?: React.ReactNode }
export interface TabsProps { tabs: Tab[]; activeTab: string; onChange: (id: string) => void; className?: string }

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => (
    <div className={cn('flex flex-wrap gap-2 p-1 bg-green-50/50 rounded-2xl border border-green-100/50 w-fit', className)}>
        {tabs.map(tab => (
            <button key={tab.id} onClick={() => onChange(tab.id)}
                className={cn('flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all',
                    activeTab === tab.id ? 'bg-green-800 text-white shadow-lg shadow-green-900/20' : 'text-text-secondary hover:bg-green-100/50')}>
                {tab.icon && <span className="opacity-80">{tab.icon}</span>}
                {tab.label}
            </button>
        ))}
    </div>
)
