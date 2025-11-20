import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { requestPasswordReset } from '@/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export function RequestPasswordReset() {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [isSent, setIsSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await requestPasswordReset(email)
            setIsSent(true)
            toast.success('Reset link sent to your email')
        } catch (error: any) {
            toast.error(error.message || 'Failed to send reset link')
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
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>
                            Enter your email address and we'll send you a link to reset your password.
                        </CardDescription>
                    </CardHeader>
                    {!isSent ? (
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4">
                                <Button className="w-full" type="submit" isLoading={isLoading}>
                                    Send Reset Link
                                </Button>
                                <Link to="/login" className="flex items-center text-sm text-muted-foreground hover:text-primary">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Login
                                </Link>
                            </CardFooter>
                        </form>
                    ) : (
                        <CardContent className="space-y-4 pt-4">
                            <div className="bg-secondary/50 p-4 rounded-md text-sm text-center">
                                Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                            </div>
                            <Button variant="outline" className="w-full" onClick={() => setIsSent(false)}>
                                Try another email
                            </Button>
                            <div className="flex justify-center">
                                <Link to="/login" className="flex items-center text-sm text-muted-foreground hover:text-primary">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Login
                                </Link>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </motion.div>
        </div>
    )
}
