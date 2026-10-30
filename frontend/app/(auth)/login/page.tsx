'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AuthField, PhoneFieldIcon } from '@/components/auth/AuthField'
import AuthSplitLayout, { AUTH_ACCENT } from '@/components/auth/AuthSplitLayout'
import PasswordField from '@/components/auth/PasswordField'
import { useAuth } from '@/contexts/AuthContext'
import { getApiErrorMessage, getPostLoginPath, loginSession } from '@/lib/auth'

function getRedirectPath(role: Parameters<typeof getPostLoginPath>[0]) {
  if (typeof window === 'undefined') return getPostLoginPath(role)
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
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({})
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isSessionLoading && isAuthenticated && user) {
      router.replace(getRedirectPath(user.role))
    }
  }, [isAuthenticated, isSessionLoading, router, user])

  const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  const isPhone = (value: string) => /^(0|\+84)[0-9]{9}$/.test(value)

  const validate = () => {
    const nextErrors: { identifier?: string; password?: string } = {}
    const value = identifier.trim()
    if (!value) nextErrors.identifier = 'Vui lòng nhập email hoặc số điện thoại'
    else if (!isEmail(value) && !isPhone(value)) nextErrors.identifier = 'Email hoặc số điện thoại không hợp lệ'
    if (!password) nextErrors.password = 'Vui lòng nhập mật khẩu'
    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const sessionUser = await loginSession(identifier.trim(), password)
      login(sessionUser)
      router.replace(getRedirectPath(sessionUser.role))
    } catch (err) {
      setError(getApiErrorMessage(err, 'Đăng nhập thất bại, vui lòng kiểm tra lại tài khoản.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthSplitLayout>
      <h1 className="text-center font-header text-[22px] font-semibold text-[#252A31]">Đăng nhập</h1>

      {error ? (
        <p className="mt-4 rounded-md bg-error-container px-3 py-2 text-sm text-error">{error}</p>
      ) : null}

      <form className="mt-6 flex flex-col gap-3.5" onSubmit={handleSubmit} noValidate>
        <AuthField
          name="identifier"
          type="text"
          value={identifier}
          placeholder="Nhập email hoặc SĐT"
          autoComplete="username"
          error={fieldErrors.identifier}
          icon={<PhoneFieldIcon />}
          onChange={(value) => {
            setIdentifier(value)
            setFieldErrors((prev) => ({ ...prev, identifier: undefined }))
          }}
        />
        <PasswordField
          name="password"
          label="Mật khẩu"
          value={password}
          placeholder="Nhập mật khẩu"
          autoComplete="current-password"
          error={fieldErrors.password}
          onChange={(value) => {
            setPassword(value)
            setFieldErrors((prev) => ({ ...prev, password: undefined }))
          }}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-12 cursor-pointer rounded-xl font-header text-[15px] font-semibold tracking-wide text-white disabled:opacity-60"
          style={{ backgroundColor: AUTH_ACCENT }}
        >
          {isSubmitting ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-[#6B7280]">
        Chưa có tài khoản?{' '}
        <Link href="/register" className="font-medium hover:underline" style={{ color: AUTH_ACCENT }}>
          Đăng ký
        </Link>
      </p>
    </AuthSplitLayout>
  )
}
