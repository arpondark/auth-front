import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { verifyEmail } from '@/api'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export function VerifyEmail() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('Verifying your email...')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage('No verification token found.')
            return
        }

        const verify = async () => {
            try {
                await verifyEmail(token)
                setStatus('success')
                setMessage('Email verified successfully! You can now login.')
            } catch (error: any) {
                setStatus('error')
                setMessage(error.message || 'Failed to verify email. The token may be invalid or expired.')
            }
        }

        verify()
    }, [token])

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-[350px] sm:w-[450px] text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        {status === 'loading' && <Loader2 className="h-12 w-12 animate-spin text-primary" />}
                        {status === 'success' && <CheckCircle2 className="h-12 w-12 text-green-500" />}
                        {status === 'error' && <XCircle className="h-12 w-12 text-destructive" />}
                    </div>
                    <CardTitle>
                        {status === 'loading' && 'Verifying...'}
                        {status === 'success' && 'Verified!'}
                        {status === 'error' && 'Verification Failed'}
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                        {message}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-6">
                    {status !== 'loading' && (
                        <Button onClick={() => navigate('/login')}>
                            Go to Login
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
