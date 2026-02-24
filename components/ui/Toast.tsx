'use client'

import React from 'react'
import { Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react'

export type ToastType = 'success' | 'warning' | 'error' | 'info'

export interface ToastProps {
    message: string
    type?: ToastType
    onClose?: () => void
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
    const icons = {
        info: <Info className="w-5 h-5 text-info" />,
        success: <CheckCircle className="w-5 h-5 text-success" />,
        warning: <AlertTriangle className="w-5 h-5 text-warning" />,
        error: <AlertCircle className="w-5 h-5 text-error" />,
    }

    const bgColors = {
        info: 'bg-blue-50 border-blue-100',
        success: 'bg-green-50 border-green-100',
        warning: 'bg-yellow-50 border-yellow-100',
        error: 'bg-red-50 border-red-100',
    }

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${bgColors[type]} shadow-lg animate-slide-in-right`}>
            {icons[type]}
            <p className="text-sm font-bold text-text-primary">{message}</p>
        </div>
    )
}
