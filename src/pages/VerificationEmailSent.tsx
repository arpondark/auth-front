import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { resendVerification } from '@/api'
import { Mail, CheckCircle2, RefreshCw, Send } from 'lucide-react'
import { motion } from 'framer-motion'

export function VerificationEmailSent() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const emailFromUrl = searchParams.get('email') || ''
    
    const [isResending, setIsResending] = useState(false)
    const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [resendMessage, setResendMessage] = useState('')

    const handleResendVerification = async () => {
        if (!emailFromUrl) {
            setResendStatus('error')
            setResendMessage('Email address not found. Please go back and try again.')
            return
        }

        try {
            setIsResending(true)
            setResendStatus('idle')
            setResendMessage('')
            
            await resendVerification(emailFromUrl)
            setResendStatus('success')
            setResendMessage('Verification email has been resent successfully!')
        } catch (error: unknown) {
            setResendStatus('error')
            const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification email. Please try again.'
            setResendMessage(errorMessage)
        } finally {
            setIsResending(false)
        }
    }

    const getResendButtonIcon = () => {
        if (isResending) {
            return <RefreshCw className="w-4 h-4 animate-spin" />
        }
        return <Send className="w-4 h-4" />
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
                            <div className="relative">
                                <Mail className="h-16 w-16 text-primary" />
                                <CheckCircle2 className="h-6 w-6 text-green-500 absolute -top-1 -right-1 bg-white rounded-full" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-green-700">
                            Verification Email Sent!
                        </CardTitle>
                        <CardDescription className="text-base">
                            We've sent a verification email to your address. Please check your inbox and click the verification link to activate your account.
                        </CardDescription>
                        {emailFromUrl && (
                            <CardDescription className="text-sm font-medium text-primary">
                                Email sent to: {emailFromUrl}
                            </CardDescription>
                        )}
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Resend Section */}
                        <div className="border-t pt-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">
                                Didn't receive the email?
                            </h3>
                            <div className="space-y-3">
                                {emailFromUrl && (
                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">Sending to:</span> {emailFromUrl}
                                        </p>
                                    </div>
                                )}
                                <Button
                                    onClick={handleResendVerification}
                                    disabled={isResending || !emailFromUrl}
                                    variant="outline"
                                    className="w-full"
                                >
                                    {getResendButtonIcon()}
                                    {isResending ? 'Sending...' : 'Resend Verification Email'}
                                </Button>
                            </div>

                            {/* Resend Status Messages */}
                            {resendStatus === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md"
                                >
                                    <div className="flex items-center">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                                        <p className="text-sm text-green-800">{resendMessage}</p>
                                    </div>
                                </motion.div>
                            )}

                            {resendStatus === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md"
                                >
                                    <p className="text-sm text-red-800">{resendMessage}</p>
                                </motion.div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <Button
                                onClick={() => navigate('/login')}
                                variant="default"
                                className="flex-1"
                            >
                                Go to Login
                            </Button>
                            <Button
                                onClick={() => navigate('/')}
                                variant="outline"
                                className="flex-1"
                            >
                                Back to Home
                            </Button>
                        </div>

                        {/* Additional Instructions */}
                        <div className="text-center text-xs text-gray-500 space-y-1 pt-2">
                            <p>Check your spam/junk folder if you don't see the email.</p>
                            <p>The verification link will expire in 24 hours.</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}