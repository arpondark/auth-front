import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { login } from '@/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export function Login() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

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
        } catch (error: any) {
            if (error.message.includes('not verified')) {
                toast.error('Account not verified. Please check your email.')
                // Optionally offer to resend verification here
            } else {
                toast.error(error.message || 'Failed to login')
            }
        } finally {
            setIsLoading(false)
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
                                Sign In
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
