import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/ui/Layout'
import { ProtectedRoute } from '@/components/ui/ProtectedRoute'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { VerifyEmail } from '@/pages/VerifyEmail'
import { RequestPasswordReset } from '@/pages/RequestPasswordReset'
import { ResetPassword } from '@/pages/ResetPassword'
import { Dashboard } from '@/pages/Dashboard'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/api/auth/verify" element={<VerifyEmail />} /> {/* Handle backend redirect if any, or direct link */}
        {/* Note: The backend sends links like /api/auth/verify?token=... 
            If the backend serves the frontend, this path is fine. 
            If they are separate, the email link should point to the frontend URL.
            Assuming the user will configure the backend to point to frontend URL or 
            we handle the path matching the backend's link structure if we are serving from same domain.
            For now, I'll add a route that matches the backend's link structure just in case, 
            but ideally it should be /verify-email. 
            Let's stick to what the backend likely generates or redirect.
            Actually, the user request says: "Use env to set the url of backend".
            And the backend sends: ${app.url}/api/auth/verify?token=<token>
            If app.url is the frontend URL, then we need to handle /api/auth/verify.
        */}
        <Route path="/request-password-reset" element={<RequestPasswordReset />} />
        <Route path="/api/auth/reset-password" element={<ResetPassword />} /> {/* Same logic as verify */}
        
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
