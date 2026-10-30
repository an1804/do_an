'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getApiErrorMessage, getPostLoginPath, loginSession } from '@/lib/auth'

function getRedirectPath(role: Parameters<typeof getPostLoginPath>[0]) {
  if (typeof window === 'undefined') {
    return getPostLoginPath(role)
  }

  const searchParams = new URLSearchParams(window.location.search)
  const returnUrl = searchParams.get('returnUrl') || searchParams.get('redirect')
  if (returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//') && returnUrl !== '/login') {
    return returnUrl
  }

  return getPostLoginPath(role)
}

export default function LoginPage() {
  const router = useRouter()
  const { login, user, isAuthenticated, isLoading: isSessionLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isSessionLoading && isAuthenticated && user) {
      router.replace(getPostLoginPath(user.role))
    }
  }, [isAuthenticated, isSessionLoading, router, user])

  const validate = () => {
    const nextErrors: { email?: string; password?: string } = {}
    if (!email.trim()) nextErrors.email = 'Email không được để trống.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = 'Email không hợp lệ.'
    if (!password) nextErrors.password = 'Mật khẩu không được để trống.'
    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const sessionUser = await loginSession(email.trim(), password)
      login(sessionUser)
      router.replace(getRedirectPath(sessionUser.role))
    } catch (err) {
      setError(getApiErrorMessage(err, 'Đăng nhập thất bại, vui lòng kiểm tra lại tài khoản.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-surface">
      <div className="bg-primary py-4 text-center font-display text-xl font-extrabold text-on-primary">
        thegioicongnghe
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-md border border-outline bg-surface-container-lowest p-8">
          <h1 className="font-display text-2xl font-extrabold text-on-surface">Đăng nhập</h1>
          <p className="mt-2 text-sm text-on-surface-variant">Dùng email và mật khẩu tài khoản thegioicongnghe.</p>

          {error ? (
            <p className="mt-4 rounded-md bg-error-container px-3 py-2 text-sm text-error">{error}</p>
          ) : null}

          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <label className="text-sm font-medium text-on-surface">
              Email
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setFieldErrors((prev) => ({ ...prev, email: undefined }))
                }}
                className="mt-1 w-full rounded-md border border-outline px-3 py-2 outline-none focus:border-primary"
                placeholder="ban@email.com"
                autoComplete="email"
              />
              {fieldErrors.email ? <span className="mt-1 block text-xs text-error">{fieldErrors.email}</span> : null}
            </label>
            <label className="text-sm font-medium text-on-surface">
              Mật khẩu
              <input
                type="password"
                name="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setFieldErrors((prev) => ({ ...prev, password: undefined }))
                }}
                className="mt-1 w-full rounded-md border border-outline px-3 py-2 outline-none focus:border-primary"
                autoComplete="current-password"
              />
              {fieldErrors.password ? (
                <span className="mt-1 block text-xs text-error">{fieldErrors.password}</span>
              ) : null}
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-primary py-3 font-display font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-60"
            >
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
          <p className="mt-4 text-sm text-on-surface-variant">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="font-medium text-sale hover:underline">
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
