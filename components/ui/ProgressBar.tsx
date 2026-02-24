import React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface ProgressBarProps {
    value: number
    max: number
    label?: string
    showPercentage?: boolean
    color?: 'green' | 'gold' | 'error' | 'info'
    animated?: boolean
    className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    max,
    label,
    showPercentage = true,
    color = 'green',
    animated = true,
    className,
}) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    const colors = {
        green: 'bg-green-600',
        gold: 'bg-gold-500',
        error: 'bg-error',
        info: 'bg-info',
    }

    return (
        <div className={cn('w-full space-y-2', className)}>
            {(label || showPercentage) && (
                <div className="flex justify-between items-end">
                    {label && <span className="text-sm font-semibold text-text-secondary">{label}</span>}
                    {showPercentage && (
                        <span className="text-xs font-bold font-mono text-text-primary bg-white px-2 py-0.5 rounded-full border border-border-custom px-2 ml-auto">
                            {Math.round(percentage)}%
                        </span>
                    )}
                </div>
            )}
            <div className="h-4 w-full bg-green-50 rounded-full border border-green-100/50 overflow-hidden p-0.5">
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-1000 ease-out',
                        colors[color],
                        animated && 'animate-pulse'
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}
