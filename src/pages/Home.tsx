import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { ShieldCheck, Zap, Lock } from 'lucide-react'

export function Home() {
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
                    A complete authentication system with JWT, email verification, password reset, and a beautiful dark-mode UI.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/register">
                        <Button size="lg" className="h-12 px-8 text-lg">
                            Get Started
                        </Button>
                    </Link>
                    <Link to="/login">
                        <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                            Sign In
                        </Button>
                    </Link>
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
