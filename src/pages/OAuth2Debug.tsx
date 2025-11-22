import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { getGoogleOAuth2URL } from '@/config'

export function OAuth2Debug() {
  const [urlInfo, setUrlInfo] = useState<any>({})
  const [authStatus, setAuthStatus] = useState<string>('')

  useEffect(() => {
    // Check current authentication status
    const token = localStorage.getItem('token')
    setAuthStatus(token ? 'Authenticated' : 'Not Authenticated')

    // Get current URL information
    const currentUrl = window.location.href
    const urlParams = new URLSearchParams(window.location.search)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    
    setUrlInfo({
      currentUrl,
      search: window.location.search,
      hash: window.location.hash,
      searchParams: Object.fromEntries(urlParams),
      hashParams: Object.fromEntries(hashParams),
      googleOAuth2URL: getGoogleOAuth2URL()
    })
  }, [])

  const handleTestGoogleLogin = () => {
    const googleUrl = getGoogleOAuth2URL()
    console.log('Redirecting to:', googleUrl)
    window.location.href = googleUrl
  }

  const clearAuth = () => {
    localStorage.removeItem('token')
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    window.dispatchEvent(new Event('auth-change'))
    setAuthStatus('Not Authenticated')
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>OAuth2 Debug Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Authentication Status:</strong> {authStatus}
          </div>
          
          <div className="space-y-2">
            <Button onClick={handleTestGoogleLogin} className="mr-2">
              Test Google Login
            </Button>
            <Button onClick={clearAuth} variant="destructive">
              Clear Authentication
            </Button>
          </div>
          
          <details>
            <summary className="cursor-pointer font-medium">URL Information</summary>
            <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto">
              {JSON.stringify(urlInfo, null, 2)}
            </pre>
          </details>
        </CardContent>
      </Card>
    </div>
  )
}