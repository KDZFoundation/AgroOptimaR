import React from 'react'

export interface BadgeProps {
    children: React.ReactNode
    variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'gold'
    className?: string
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className }) => {
    const variants = {
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        error: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
        neutral: 'bg-gray-100 text-gray-700',
        gold: 'bg-gold-100 text-gold-600 border border-gold-400/20',
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${variants[variant]} ${className}`}>
            {children}
        </span>
    )
}
