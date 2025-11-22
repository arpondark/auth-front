import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { ShieldCheck, Zap, Lock } from 'lucide-react'
import { loginWithGoogle } from '@/api'
import toast from 'react-hot-toast'

export function Home() {
    const handleGoogleLogin = () => {
        try {
            loginWithGoogle()
        } catch (error: any) {
            toast.error('Failed to initiate Google login')
        }
    }

    return (
        <div className="flex flex-col items-center justify-center py-12 md:py-24 lg:py-32 space-y-12 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 max-w-3xl"
            >
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                    Secure Authentication for Modern Apps
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                    A complete authentication system with JWT, email verification, password reset, Google OAuth2, and a beautiful dark-mode UI.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/register">
                        <Button size="lg" className="h-12 px-8 text-lg w-full sm:w-auto">
                            Get Started
                        </Button>
                    </Link>
                    <Link to="/login">
                        <Button size="lg" variant="outline" className="h-12 px-8 text-lg w-full sm:w-auto">
                            Sign In
                        </Button>
                    </Link>
                    <Button 
                        size="lg" 
                        variant="secondary" 
                        className="h-12 px-6 text-lg w-full sm:w-auto"
                        onClick={handleGoogleLogin}
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                    </Button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-4">
                <FeatureCard
                    icon={<ShieldCheck className="h-10 w-10 text-primary" />}
                    title="Secure by Default"
                    description="Industry standard JWT authentication with HTTP-only cookies and secure storage."
                />
                <FeatureCard
                    icon={<Zap className="h-10 w-10 text-primary" />}
                    title="Lightning Fast"
                    description="Built with React, Vite, and Spring Boot for optimal performance."
                />
                <FeatureCard
                    icon={<Lock className="h-10 w-10 text-primary" />}
                    title="Complete Flow"
                    description="Includes email verification, password reset, and profile management out of the box."
                />
            </div>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="flex flex-col items-center space-y-4 p-6 rounded-xl border bg-card text-card-foreground shadow-sm"
        >
            <div className="p-3 rounded-full bg-primary/10">
                {icon}
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </motion.div>
    )
}
