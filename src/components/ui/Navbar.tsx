import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useEffect, useState } from 'react'
import { Moon, Sun, LogOut, User } from 'lucide-react'

export function Navbar() {
    const navigate = useNavigate()
    const [isAuth, setIsAuth] = useState(false)
    const [isDark, setIsDark] = useState(true)

    useEffect(() => {
        checkAuth()
        // Initialize dark mode
        if (document.documentElement.classList.contains('dark')) {
            setIsDark(true)
        } else {
            setIsDark(false)
            document.documentElement.classList.add('dark') // Default to dark
            setIsDark(true)
        }
    }, [])

    // Listen for storage events to update auth state across tabs/windows
    useEffect(() => {
        const handleStorageChange = () => {
            checkAuth()
        }
        window.addEventListener('storage', handleStorageChange)
        // Custom event for local updates
        window.addEventListener('auth-change', handleStorageChange)
        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('auth-change', handleStorageChange)
        }
    }, [])

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token')
            if (token) {
                // Ideally we verify with backend, but for navbar speed we check token presence first
                // and let the protected route handle deep verification.
                // However, let's do a quick check if we can.
                // For now, simple token check is enough for UI state.
                setIsAuth(true)
            } else {
                setIsAuth(false)
            }
        } catch (error) {
            setIsAuth(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        window.dispatchEvent(new Event('auth-change'))
        navigate('/login')
    }

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark')
            setIsDark(false)
        } else {
            document.documentElement.classList.add('dark')
            setIsDark(true)
        }
    }

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                            A
                        </div>
                        <span>FullStackAuth</span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>

                    {isAuth ? (
                        <>
                            <Link to="/dashboard">
                                <Button variant="ghost" size="sm">
                                    <User className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                            <Button variant="destructive" size="sm" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" size="sm">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button size="sm">Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
