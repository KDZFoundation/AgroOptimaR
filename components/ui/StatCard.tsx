import React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface StatCardProps {
    label: string
    value: string | number
    unit?: string
    icon: React.ReactNode
    trend?: 'up' | 'down' | 'neutral'
    trendValue?: string
    className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    unit,
    icon,
    trend,
    trendValue,
    className,
}) => {
    return (
        <div className={cn('bg-white p-6 rounded-3xl card-shadow border border-border-custom flex items-center gap-5', className)}>
            <div className="w-14 h-14 bg-green-100/50 rounded-2xl flex items-center justify-center text-green-700">
                {icon}
            </div>
            <div>
                <p className="text-sm font-semibold text-text-secondary">{label}</p>
                <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-text-primary">{value}</span>
                    {unit && <span className="text-xs font-medium text-text-muted">{unit}</span>}
                </div>

                {trend && (
                    <div className={cn(
                        'flex items-center gap-1 text-[10px] font-bold uppercase mt-1 tracking-wider',
                        trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-gray-400'
                    )}>
                        {trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                        {trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                        {trend === 'neutral' && <Minus className="w-3 h-3" />}
                        {trendValue || (trend === 'neutral' ? 'Bez zmian' : '')}
                    </div>
                )}
            </div>
        </div>
    )
}
