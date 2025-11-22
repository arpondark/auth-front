import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { login, loginWithGoogle } from '@/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'

export function Login() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    // Check if user is already authenticated
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            console.log('User already authenticated, redirecting to dashboard')
            navigate('/dashboard')
        }
    }, [navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await login(formData.email, formData.password)
            if (res.token) {
                localStorage.setItem('token', res.token)
                window.dispatchEvent(new Event('auth-change'))
                toast.success('Logged in successfully')
                navigate('/dashboard')
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            if (errorMessage.includes('not verified')) {
                toast.error('Account not verified. Please check your email.')
                // Optionally offer to resend verification here
            } else {
                toast.error(errorMessage || 'Failed to login')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = () => {
        try {
            loginWithGoogle()
        } catch {
            toast.error('Failed to initiate Google login')
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="w-[350px] sm:w-[400px]">
                    <CardHeader>
                        <CardTitle>Welcome back</CardTitle>
                        <CardDescription>Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <Input
                                label="Email"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                                    <Link to="/request-password-reset" className="text-sm text-primary hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full" type="submit" isLoading={isLoading}>
                                <Mail className="w-4 h-4 mr-2" />
                                Sign In with Email
                            </Button>
                            
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>
                            
                            <Button 
                                type="button" 
                                variant="outline" 
                                className="w-full" 
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                            >
                                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                    <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Continue with Google
                            </Button>
                            <div className="text-center text-sm text-muted-foreground space-y-2">
                                <div>
                                    Don't have an account?{' '}
                                    <Link to="/register" className="text-primary hover:underline">
                                        Sign up
                                    </Link>
                                </div>
                                <div>
                                    Need to verify your email?{' '}
                                    <Link to="/resend-verification" className="text-primary hover:underline">
                                        Resend verification email
                                    </Link>
                                </div>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    )
}
