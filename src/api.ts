import { API_BASE_URL } from './config'

export interface AuthResponse {
  email: string
  token: string
}

export interface ApiError {
  error?: boolean
  message?: string
  details?: string
  [key: string]: unknown
}

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}`

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  })

  const text = await res.text()
  const data = text ? (JSON.parse(text) as T | ApiError) : ({} as T)

  if (!res.ok) {
    const err = data as ApiError
    throw new Error(err.message || err.details || `Request failed with ${res.status}`)
  }

  return data as T
}

export function login(email: string, password: string) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function register(name: string, email: string, password: string) {
  return request<{ userId: string; name: string; email: string; isAccountVerified: boolean }>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    },
  )
}

export function isAuthenticated() {
  return request<{ authenticated: boolean; email?: string }>('/auth/isAuthenticated', {
    method: 'GET',
  })
}

export function resendVerification(email: string) {
  return request<{ success: boolean; message: string; email: string }>(
    '/auth/resend-verification',
    {
      method: 'POST',
      body: JSON.stringify({ email }),
    },
  )
}

export function verifyEmail(token: string) {
  return request<{ success: boolean; message: string }>(`/auth/verify?token=${token}`, {
    method: 'GET',
  })
}

export function requestPasswordReset(email: string) {
  return request<{ success: boolean; message: string }>('/auth/request-password-reset', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function resetPassword(token: string, newPassword: string) {
  return request<{ success: boolean; message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  })
}

export function getProfile() {
  return request<{ userId: string; name: string; email: string; isAccountVerified: boolean }>(
    '/profile',
    {
      method: 'GET',
    },
  )
}

export function updateProfile(payload: {
  name?: string
  email?: string
  password?: string
}) {
  return request<{ userId: string; name: string; email: string; isAccountVerified: boolean }>(
    '/profile',
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
  )
}


