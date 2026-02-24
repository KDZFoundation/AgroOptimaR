import React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gold'
    size?: 'sm' | 'md' | 'lg'
    icon?: React.ReactNode
    loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', icon, loading, children, ...props }, ref) => {
        const variants = {
            primary: 'agri-gradient text-white hover:opacity-90 shadow-lg shadow-green-900/10',
            secondary: 'bg-white border-2 border-green-600 text-green-700 hover:bg-green-50',
            danger: 'bg-error text-white hover:bg-error/90',
            ghost: 'bg-transparent text-green-700 hover:bg-green-50',
            gold: 'gold-gradient text-white hover:opacity-90 shadow-lg shadow-gold-900/10',
        }

        const sizes = {
            sm: 'px-3 py-1.5 text-xs rounded-lg',
            md: 'px-5 py-2.5 text-sm rounded-xl',
            lg: 'px-8 py-4 text-base rounded-2xl',
        }

        return (
            <button
                ref={ref}
                disabled={loading || props.disabled}
                className={cn(
                    'inline-flex items-center justify-center font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {!loading && icon && <span className="mr-2">{icon}</span>}
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'
