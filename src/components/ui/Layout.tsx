import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Toaster } from 'react-hot-toast'

export function Layout() {
    return (
        <div className="min-h-screen bg-background font-sans antialiased">
            <Navbar />
            <main className="container max-w-screen-2xl mx-auto px-4 md:px-8 py-6">
                <Outlet />
            </main>
            <Toaster position="top-right" />
        </div>
    )
}
