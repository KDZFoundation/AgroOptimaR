/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'green-900': '#0d2018',
                'green-800': '#1a3a2a',
                'green-700': '#2d5c3e',
                'green-600': '#3d7a52',
                'green-500': '#4e9a68',
                'green-400': '#6cb87f',
                'green-300': '#94d4a0',
                'green-100': '#e8f5eb',
                'green-50': '#f4fbf5',
                'gold-600': '#8a6a1a',
                'gold-500': '#c9a84c',
                'gold-400': '#e0c068',
                'gold-100': '#fdf7e3',
                'gold-50': '#fefcf3',
                'text-primary': '#1a2e1a',
                'text-secondary': '#4a6741',
                'text-muted': '#8aad88',
                'bg-page': '#f7faf7',
                'bg-card': '#ffffff',
                'border-custom': '#d4e8d4',
                success: '#2d8a4e',
                warning: '#c9841c',
                error: '#c94040',
                info: '#2d6a8a',
            },
            fontFamily: {
                lora: ['Lora', 'serif'],
                'dm-sans': ['DM Sans', 'sans-serif'],
                'dm-mono': ['DM Mono', 'monospace'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },
        },
    },
    plugins: [],
}
