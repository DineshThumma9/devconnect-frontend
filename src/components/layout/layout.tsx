"use client"

import { useState } from "react"
import { Navbar } from "./navbar"
import { Sidebar } from "./sidebar"
import { Outlet } from "react-router-dom"

export function Layout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed)
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Navbar />
            <div className="flex h-[calc(100vh-4rem)]">
                <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
                <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
                        <Outlet /> {/* renders nested child route */}
                    </div>
                </main>
            </div>
        </div>
    )
}
