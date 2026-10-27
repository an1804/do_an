'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { hasStoredAuthSession } from '@/lib/api'
import { logoutSession, restoreSession, type AuthUser } from '@/lib/auth'

interface AuthContextType {
  user: AuthUser | null
  login: (user: AuthUser) => void
  logout: (redirectTo?: string) => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

function getSameOriginRedirectUrl(redirectTo: string) {
  if (typeof window === 'undefined') return redirectTo

  try {
    const url = new URL(redirectTo, window.location.origin)
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return '/'
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refreshCurrentSession = useCallback(async () => {
    if (!hasStoredAuthSession()) {
      setUser(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const sessionUser = await Promise.race([
        restoreSession(),
        new Promise<never>((_, reject) => {
          window.setTimeout(() => reject(new Error('Session restore timeout')), 2500)
        }),
      ])
      setUser(sessionUser)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshCurrentSession()
  }, [refreshCurrentSession])

  const login = (sessionUser: AuthUser) => {
    setUser(sessionUser)
    setIsLoading(false)
  }

  const logout = async (redirectTo?: string) => {
    try {
      await logoutSession()
    } finally {
      setUser(null)
      setIsLoading(false)
      if (typeof window !== 'undefined') {
        window.location.assign(getSameOriginRedirectUrl(redirectTo || '/'))
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
