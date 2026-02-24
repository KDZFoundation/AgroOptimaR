import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import Pulpit from './pages/Pulpit'
import Kampanie from './pages/Kampanie'
import RolnictwoWeglowe from './pages/RolnictwoWeglowe'
import WnioskiPdf from './pages/WnioskiPdf'
import Kalkulator from './pages/Kalkulator'
import Symulator from './pages/Symulator'
import Optymalizator from './pages/Optymalizator'
import Asystent from './pages/Asystent'
import PanelRolnika from './pages/PanelRolnika'

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/pulpit" replace />} />
            <Route element={<DashboardLayout />}>
                <Route path="/pulpit" element={<Pulpit />} />
                <Route path="/kampanie" element={<Kampanie />} />
                <Route path="/rolnictwo-weglowe" element={<RolnictwoWeglowe />} />
                <Route path="/wnioski-pdf" element={<WnioskiPdf />} />
                <Route path="/kalkulator" element={<Kalkulator />} />
                <Route path="/symulator" element={<Symulator />} />
                <Route path="/optymalizator" element={<Optymalizator />} />
                <Route path="/asystent" element={<Asystent />} />
                <Route path="/panel-rolnika" element={<PanelRolnika />} />
            </Route>
        </Routes>
    )
}
