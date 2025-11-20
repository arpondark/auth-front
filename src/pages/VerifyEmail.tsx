import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { verifyEmail, resendVerification } from '@/api'
import { CheckCircle2, XCircle, Loader2, Mail, AlertTriangle, RefreshCw } from 'lucide-react'

export function VerifyEmail() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')

    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid-token' | 'resending'>('loading')
    const [message, setMessage] = useState('Verifying your email...')
    const [details, setDetails] = useState('')
    const [userEmail, setUserEmail] = useState('')

    useEffect(() => {
        if (!token) {
            setStatus('invalid-token')
            setMessage('Invalid verification link')
            setDetails('No verification token found in the URL. Please check your email and click the verification link again.')
            return
        }

        const verify = async () => {
            try {
                setStatus('loading')
                setMessage('Verifying your email address...')
                setDetails('Please wait while we confirm your email verification.')
                
                const response = await verifyEmail(token)
                setStatus('success')
                setMessage('Email verified successfully!')
                setDetails(response.message || 'Your email has been verified. You can now sign in to your account.')
            } catch (error: any) {
                setStatus('error')
                setMessage('Verification failed')
                
                // Handle different error scenarios
                if (error.message.includes('expired')) {
                    setDetails('Your verification token has expired. Please request a new verification email.')
                } else if (error.message.includes('invalid')) {
                    setDetails('The verification token is invalid. Please check your email and try again.')
                } else if (error.message.includes('already verified')) {
                    setDetails('This email has already been verified. You can proceed to login.')
                } else {
                    setDetails(error.message || 'An unexpected error occurred during verification. Please try again or contact support.')
                }
            }
        }

        // Add a small delay for better UX (shows loading state)
        const timer = setTimeout(verify, 500)
        return () => clearTimeout(timer)
    }, [token])

    const handleResendVerification = async () => {
        const email = prompt('Please enter your email address to resend verification:')
        if (!email) return

        try {
            setStatus('resending')
            setMessage('Sending verification email...')
            setDetails('Please wait while we send a new verification email to your address.')
            
            await resendVerification(email)
            setMessage('Verification email sent!')
            setDetails(`A new verification email has been sent to ${email}. Please check your inbox and spam folder.`)
            setUserEmail(email)
        } catch (error: any) {
            setStatus('error')
            setMessage('Failed to send verification email')
            setDetails(error.message || 'Could not send verification email. Please try again later.')
        }
    }

    const handleRetryAction = () => {
        if (status === 'success' || (status === 'error' && message.includes('already verified'))) {
            navigate('/login')
        } else if (status === 'resending' && userEmail) {
            // Stay on this page, user will receive new verification email
            return
        } else {
            handleResendVerification()
        }
    }

    const getIcon = () => {
        switch (status) {
            case 'loading':
                return <Loader2 className="h-12 w-12 animate-spin text-primary" />
            case 'success':
                return <CheckCircle2 className="h-12 w-12 text-green-500" />
            case 'error':
                return <XCircle className="h-12 w-12 text-destructive" />
            case 'invalid-token':
                return <AlertTriangle className="h-12 w-12 text-yellow-500" />
            case 'resending':
                return <RefreshCw className="h-12 w-12 animate-spin text-blue-500" />
            default:
                return <Mail className="h-12 w-12 text-gray-400" />
        }
    }

    const getTitle = () => {
        switch (status) {
            case 'loading':
                return 'Verifying Email...'
            case 'success':
                return 'Email Verified!'
            case 'error':
                return 'Verification Failed'
            case 'invalid-token':
                return 'Invalid Link'
            case 'resending':
                return 'Sending Email...'
            default:
                return 'Email Verification'
        }
    }

    const getButtonText = () => {
        if (status === 'success' || (status === 'error' && message.includes('already verified'))) {
            return 'Continue to Login'
        } else if (status === 'resending' && userEmail) {
            return 'Check Your Email'
        } else if (status === 'error' || status === 'invalid-token') {
            return 'Resend Verification Email'
        }
        return 'Go to Login'
    }

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
            <Card className="w-full max-w-lg text-center shadow-lg">
                <CardHeader className="space-y-4">
                    <div className="flex justify-center">
                        {getIcon()}
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        {getTitle()}
                    </CardTitle>
                    <CardDescription className="text-base">
                        {message}
                    </CardDescription>
                    {details && (
                        <CardDescription className="text-sm text-muted-foreground mt-2 px-2">
                            {details}
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent className="space-y-4 pb-6">
                    {status !== 'loading' && status !== 'resending' && (
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                            <Button 
                                onClick={handleRetryAction}
                                className="min-w-[150px]"
                                variant={status === 'success' ? 'default' : 'secondary'}
                            >
                                {getButtonText()}
                            </Button>
                            {status !== 'success' && (
                                <Button 
                                    onClick={() => navigate('/')}
                                    variant="outline"
                                    className="min-w-[150px]"
                                >
                                    Back to Home
                                </Button>
                            )}
                        </div>
                    )}
                    
                    {/* Loading progress indicator */}
                    {(status === 'loading' || status === 'resending') && (
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-4">
                            <div className="bg-primary h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
