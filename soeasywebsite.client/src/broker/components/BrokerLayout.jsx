import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Header } from '../../components/Layout/Header'
import { AccountSidebar } from '../../components/Layout/AccountSidebar'
import './broker.css'

export function BrokerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="broker-app">
      <Header />
      <div className="broker-layout container">
        <AccountSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="broker-main">
          <button className="broker-mobile-menu" type="button" onClick={() => setSidebarOpen(true)}><Menu size={17} /> Menu</button>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
