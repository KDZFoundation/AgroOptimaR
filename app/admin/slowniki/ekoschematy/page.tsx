import React from 'react'
import { Card } from '@/components/ui'
import { AlertTriangle } from 'lucide-react'

export default function EkoschematyDictionaryPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Słownik Ekoschematów</h2>
            <Card title="W budowie" icon={<AlertTriangle />}>
                <p className="text-gray-500">Moduł zarządzania ekoschematami zostanie wdrożony w kolejnym kroku.</p>
            </Card>
        </div>
    )
}
