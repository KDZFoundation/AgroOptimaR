'use client'

import React, { useState } from 'react'

export interface TooltipProps {
    content: string
    children: React.ReactNode
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <div className="relative inline-block" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
            {children}
            {isVisible && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-green-900 text-white text-[10px] font-bold rounded-lg whitespace-nowrap z-50 animate-fade-in shadow-xl">
                    {content}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-green-900" />
                </div>
            )}
        </div>
    )
}
