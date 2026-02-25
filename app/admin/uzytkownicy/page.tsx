'use client'

import React, { useState, useEffect } from 'react'
import { Card, Button, Badge, DataTable, type Column } from '@/components/ui'
import { Users, UserCog, Check } from 'lucide-react'
import { getUsers, updateUserRole } from '@/app/actions/admin-users'

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        const data = await getUsers()
        setUsers(data || [])
        setLoading(false)
    }

    const handleRoleChange = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'rolnik' ? 'doradca' : currentRole === 'doradca' ? 'admin' : 'rolnik'
        if (confirm(`Czy zmienić rolę użytkownika na ${newRole}?`)) {
            await updateUserRole(userId, newRole as any)
            loadUsers()
        }
    }

    const columns: Column<any>[] = [
        { header: 'ID', accessor: (item) => <span className="text-xs text-gray-400 font-mono">{item.id.slice(0, 8)}...</span> },
        {
            header: 'Imię i Nazwisko',
            accessor: (item) => (
                <div className="font-bold text-gray-700">
                    {item.imie} {item.nazwisko}
                </div>
            )
        },
        {
            header: 'Rola',
            accessor: (item) => {
                const colors = {
                    admin: 'purple',
                    doradca: 'blue',
                    rolnik: 'green'
                }
                // @ts-ignore
                const variant = colors[item.role] || 'neutral'
                return (
                    <Badge variant={variant as any}>{item.role.toUpperCase()}</Badge>
                )
            }
        },
        {
            header: 'Data dołączenia',
            accessor: (item) => new Date(item.created_at).toLocaleDateString('pl-PL')
        },
        {
            header: 'Akcje',
            accessor: (item) => (
                <Button variant="ghost" size="sm" onClick={() => handleRoleChange(item.id, item.role)}>
                    <UserCog className="w-4 h-4 text-gray-500" />
                    <span className="ml-2 text-xs">Zmień rolę</span>
                </Button>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Zarządzanie Użytkownikami</h2>
            <Card title="Wszyscy użytkownicy" icon={<Users />}>
                 {loading ? <p>Ładowanie...</p> : <DataTable data={users} columns={columns} />}
            </Card>
        </div>
    )
}
