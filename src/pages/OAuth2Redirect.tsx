import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function OAuth2Redirect() {
  const navigate = useNavigate()
  const [debugInfo, setDebugInfo] = useState<string>('')

  useEffect(() => {
    const handleOAuth2Redirect = () => {
      // Get the current URL for debugging
      const currentUrl = window.location.href
      console.log('OAuth2Redirect - Current URL:', currentUrl)
      
      // Check multiple possible token locations
      const urlParams = new URLSearchParams(window.location.search)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      
      // Try different parameter names and locations
      let token = urlParams.get('token') || 
                  urlParams.get('access_token') || 
                  hashParams.get('token') || 
                  hashParams.get('access_token')
      
      const error = urlParams.get('error') || hashParams.get('error')
      
      // Debug information
      const debugData = {
        url: currentUrl,
        search: window.location.search,
        hash: window.location.hash,
        searchParams: Object.fromEntries(urlParams),
        hashParams: Object.fromEntries(hashParams),
        token: token ? 'Found' : 'Not found',
        error: error || 'None'
      }
      
      console.log('OAuth2Redirect - Debug Info:', debugData)
      setDebugInfo(JSON.stringify(debugData, null, 2))
      
      if (error) {
        toast.error(`OAuth2 login failed: ${error}`)
        console.error('OAuth2 Error:', error)
        navigate('/login')
        return
      }

      if (token) {
        console.log('OAuth2 - Token found, storing and redirecting')
        
        // Store the token
        localStorage.setItem('token', token)
        
        // Set the token in a cookie as well for API requests
        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`
        
        // Trigger auth state update
        window.dispatchEvent(new Event('auth-change'))
        
        toast.success('Successfully logged in with Google!')
        
        // Small delay to ensure state updates
        setTimeout(() => {
          navigate('/dashboard')
        }, 100)
      } else {
        console.error('OAuth2 - No token found in URL')
        toast.error('No authentication token received. Please try again.')
        
        // Show debug info in development
        if (import.meta.env.DEV) {
          console.error('Debug Info:', debugData)
          toast.error(`Debug: URL was ${currentUrl}`, { duration: 10000 })
        }
        
        // Redirect after a delay to show error
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    }

    handleOAuth2Redirect()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 max-w-md">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <h2 className="text-xl font-semibold">Completing Google Sign-in...</h2>
        <p className="text-muted-foreground">Please wait while we log you in.</p>
        
        {/* Debug info in development */}
        {import.meta.env.DEV && debugInfo && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground">Debug Info (Dev Only)</summary>
            <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto max-h-40">
              {debugInfo}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}