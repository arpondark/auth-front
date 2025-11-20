import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { resendVerification } from '@/api'
import { Mail, Send, RefreshCw, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

export function ResendVerification() {
    const navigate = useNavigate()
    
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!email.trim()) {
            setStatus('error')
            setMessage('Please enter your email address.')
            return
        }

        try {
            setIsLoading(true)
            setStatus('idle')
            setMessage('')
            
            await resendVerification(email)
            setStatus('success')
            setMessage('Verification email has been sent successfully! Please check your inbox.')
        } catch (error: unknown) {
            setStatus('error')
            const errorMessage = error instanceof Error ? error.message : 'Failed to send verification email. Please try again.'
            setMessage(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-lg">
                    <CardHeader className="text-center space-y-4">
                        <div className="flex justify-center">
                            <Mail className="h-12 w-12 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            Resend Verification Email
                        </CardTitle>
                        <CardDescription>
                            Enter your email address to receive a new verification email
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                            />

                            <Button
                                type="submit"
                                disabled={isLoading || !email.trim()}
                                className="w-full"
                            >
                                {isLoading ? (
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4 mr-2" />
                                )}
                                {isLoading ? 'Sending...' : 'Send Verification Email'}
                            </Button>

                            {/* Status Messages */}
                            {status === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-green-50 border border-green-200 rounded-md"
                                >
                                    <div className="flex items-start">
                                        <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-green-800">
                                            <p className="font-medium">{message}</p>
                                            <p className="mt-1">Check your spam folder if you don't see it.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-red-50 border border-red-200 rounded-md"
                                >
                                    <p className="text-sm text-red-800">{message}</p>
                                </motion.div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex flex-col sm:flex-row gap-2 pt-4">
                                <Button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Back to Login
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Home
                                </Button>
                            </div>

                            {/* Additional Info */}
                            <div className="text-center text-xs text-gray-500 pt-2">
                                <p>Verification links expire in 24 hours.</p>
                            </div>
                        </CardContent>
                    </form>
                </Card>
            </motion.div>
        </div>
    )
}