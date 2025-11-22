import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/ui/Layout'
import { ProtectedRoute } from '@/components/ui/ProtectedRoute'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { VerifyEmail } from '@/pages/VerifyEmail'
import { VerificationEmailSent } from '@/pages/VerificationEmailSent'
import { RequestPasswordReset } from '@/pages/RequestPasswordReset'
import { ResetPassword } from '@/pages/ResetPassword'
import { ResendVerification } from '@/pages/ResendVerification'
import { Dashboard } from '@/pages/Dashboard'
import { OAuth2Redirect } from '@/pages/OAuth2Redirect'
import { OAuth2Debug } from '@/pages/OAuth2Debug'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/verify-email" element={<VerifyEmail />} /> {/* Alternative route for manual navigation */}
        <Route path="/verification-sent" element={<VerificationEmailSent />} />
        <Route path="/resend-verification" element={<ResendVerification />} />
        <Route path="/request-password-reset" element={<RequestPasswordReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
        <Route path="/oauth2/debug" element={<OAuth2Debug />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
