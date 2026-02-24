import React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface CardProps {
    title?: React.ReactNode
    icon?: React.ReactNode
    badge?: React.ReactNode
    footer?: React.ReactNode
    children: React.ReactNode
    className?: string
    variant?: 'default' | 'highlighted' | 'alert'
}

export const Card: React.FC<CardProps> = ({
    title,
    icon,
    badge,
    footer,
    children,
    className,
    variant = 'default'
}) => {
    const variants = {
        default: 'bg-white border border-border-custom',
        highlighted: 'bg-white border-2 border-gold-400 shadow-xl shadow-gold-500/5',
        alert: 'bg-white border-2 border-error/20 shadow-lg shadow-error/5',
    }

    return (
        <div className={cn('rounded-3xl overflow-hidden card-shadow', variants[variant], className)}>
            {(title || icon || badge) && (
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50 bg-green-50/10">
                    <div className="flex items-center gap-3">
                        {icon && <div className="text-green-700">{icon}</div>}
                        {title && <h3 className="text-lg text-text-primary font-bold">{title}</h3>}
                    </div>
                    {badge && <div>{badge}</div>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
            {footer && (
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 italic text-sm text-text-secondary">
                    {footer}
                </div>
            )}
        </div>
    )
}
