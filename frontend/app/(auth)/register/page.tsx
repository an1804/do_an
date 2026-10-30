'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getApiErrorMessage, loginSession, registerCustomer } from '@/lib/auth'

export default function RegisterPage() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading: isSessionLoading } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  })
  const [fieldErrors, setFieldErrors] = useState<Partial<typeof formData>>({})
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isSessionLoading && isAuthenticated) {
      router.replace('/')
    }
  }, [isAuthenticated, isSessionLoading, router])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validate = () => {
    const nextErrors: Partial<typeof formData> = {}
    const fullName = formData.fullName.trim()
    const email = formData.email.trim()
    const phone = formData.phone.trim()
    const password = formData.password

    if (!fullName) nextErrors.fullName = 'Họ tên không được để trống.'
    if (!email) nextErrors.email = 'Email không được để trống.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Email không hợp lệ.'
    if (!phone) nextErrors.phone = 'Số điện thoại không được để trống.'
    else if (!/^(0|\+84)[0-9]{9}$/.test(phone)) nextErrors.phone = 'Số điện thoại không hợp lệ.'
    if (!password) nextErrors.password = 'Mật khẩu không được để trống.'
    else if (password.length < 6) nextErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.'

    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      }
      await registerCustomer(payload)
      const sessionUser = await loginSession(payload.email, payload.password)
      login(sessionUser)
      router.replace('/')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Không thể tạo tài khoản. Vui lòng thử lại.'))
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
          <h1 className="font-display text-2xl font-extrabold text-on-surface">Đăng ký</h1>
          <p className="mt-2 text-sm text-on-surface-variant">Tạo tài khoản khách hàng thegioicongnghe.</p>

          {error ? (
            <p className="mt-4 rounded-md bg-error-container px-3 py-2 text-sm text-error">{error}</p>
          ) : null}

          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <label className="text-sm font-medium text-on-surface">
              Họ tên
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-outline px-3 py-2 outline-none focus:border-primary"
                autoComplete="name"
              />
              {fieldErrors.fullName ? (
                <span className="mt-1 block text-xs text-error">{fieldErrors.fullName}</span>
              ) : null}
            </label>
            <label className="text-sm font-medium text-on-surface">
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-outline px-3 py-2 outline-none focus:border-primary"
                autoComplete="email"
              />
              {fieldErrors.email ? <span className="mt-1 block text-xs text-error">{fieldErrors.email}</span> : null}
            </label>
            <label className="text-sm font-medium text-on-surface">
              Số điện thoại
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-outline px-3 py-2 outline-none focus:border-primary"
                placeholder="0912345678"
                autoComplete="tel"
              />
              {fieldErrors.phone ? <span className="mt-1 block text-xs text-error">{fieldErrors.phone}</span> : null}
            </label>
            <label className="text-sm font-medium text-on-surface">
              Mật khẩu
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-outline px-3 py-2 outline-none focus:border-primary"
                autoComplete="new-password"
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
              {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </form>
          <p className="mt-4 text-sm text-on-surface-variant">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-medium text-sale hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
