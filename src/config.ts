export const BACKEND_BASE_URL = 
  import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, '') || 'http://localhost:8080'

export const API_BASE_URL = `${BACKEND_BASE_URL}/api/v1`

export const FRONTEND_URL = 
  import.meta.env.VITE_FRONTEND_URL?.replace(/\/+$/, '') || 'http://localhost:5173'

export const getGoogleOAuth2URL = () => {
  return `${BACKEND_BASE_URL}/api/v1/oauth2/authorization/google`
}


