'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getPostLoginPath, type UserRole } from '@/lib/auth'

export default function AuthGate({
  children,
  roles,
}: {
  children: React.ReactNode
  roles?: UserRole[]
}) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      const returnUrl = `${window.location.pathname}${window.location.search}`
      router.replace(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
      return
    }
    if (roles && user && !roles.includes(user.role)) {
      router.replace(getPostLoginPath(user.role))
    }
  }, [isAuthenticated, isLoading, roles, router, user])

  if (isLoading || !isAuthenticated) {
    return <p className="px-4 py-16 text-center text-sm text-on-surface-variant">Đang kiểm tra phiên đăng nhập...</p>
  }
  if (roles && user && !roles.includes(user.role)) {
    return null
  }
  return children
}
