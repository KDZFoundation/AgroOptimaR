import { Lora, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import { Metadata } from 'next'

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const dmMono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
})

export const metadata: Metadata = {
  title: 'AgroOptimaR — Optymalizacja Dopłat ARiMR',
  description: 'Inteligentne narzędzie dla rolników do maksymalizacji dopłat bezpośrednich i ekoschematów PS WPR 2023-2027',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className={`${lora.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
