'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AuthField, MailIcon, PhoneFieldIcon, UserFieldIcon } from '@/components/auth/AuthField'
import AuthSplitLayout, { AUTH_ACCENT } from '@/components/auth/AuthSplitLayout'
import PasswordField from '@/components/auth/PasswordField'
import { useAuth } from '@/contexts/AuthContext'
import { getApiErrorMessage, requestRegisterOtp, resendRegisterOtp, verifyRegisterOtp } from '@/lib/auth'

const OTP_TTL_MS = 120_000
const REGISTER_FLOW_KEY = 'techstore_register_flow_v2'

type RegisterFormData = {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

type PersistedRegisterFlow = {
  step: 'form' | 'otp'
  formData: RegisterFormData
  code: string
  expiresAt: number | null
}

const EMPTY_FORM: RegisterFormData = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

function formatCountdown(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function readPersistedFlow(): PersistedRegisterFlow | null {
  try {
    const raw = sessionStorage.getItem(REGISTER_FLOW_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as PersistedRegisterFlow
    if (data.step !== 'form' && data.step !== 'otp') return null
    if (!data.formData || typeof data.formData.email !== 'string') return null
    return data
  } catch {
    return null
  }
}

function writePersistedFlow(data: PersistedRegisterFlow) {
  sessionStorage.setItem(REGISTER_FLOW_KEY, JSON.stringify(data))
}

function clearPersistedFlow() {
  sessionStorage.removeItem(REGISTER_FLOW_KEY)
}

export default function RegisterPage() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading: isSessionLoading } = useAuth()
  const [formData, setFormData] = useState<RegisterFormData>(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState<Partial<RegisterFormData> & { code?: string }>({})
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [code, setCode] = useState('')
  const [expiresAt, setExpiresAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isSessionLoading && isAuthenticated) {
      clearPersistedFlow()
      router.replace('/')
    }
  }, [isAuthenticated, isSessionLoading, router])

  useEffect(() => {
    const saved = readPersistedFlow()
    if (saved) {
      setFormData(saved.formData)
      setStep(saved.step)
      setCode(saved.code)
      setExpiresAt(saved.expiresAt)
    }
    setNow(Date.now())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    writePersistedFlow({ step, formData, code, expiresAt })
  }, [ready, step, formData, code, expiresAt])

  useEffect(() => {
    const syncNow = () => setNow(Date.now())
    const onVisible = () => {
      if (document.visibilityState === 'visible') syncNow()
    }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', syncNow)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', syncNow)
    }
  }, [])

  useEffect(() => {
    if (!ready || step !== 'otp' || expiresAt == null) return
    setNow(Date.now())
    const timer = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(timer)
  }, [ready, step, expiresAt])

  const remainingMs = expiresAt == null ? 0 : expiresAt - now
  const expired = step === 'otp' && remainingMs <= 0

  const startOtpTimer = () => setExpiresAt(Date.now() + OTP_TTL_MS)

  const handleChange = (name: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validate = () => {
    const nextErrors: Partial<RegisterFormData> = {}
    const fullName = formData.fullName.trim()
    const email = formData.email.trim()
    const phone = formData.phone.trim()
    const password = formData.password

    if (!fullName) nextErrors.fullName = 'Vui lòng nhập họ tên'
    if (!email) nextErrors.email = 'Vui lòng nhập email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Email không hợp lệ'
    if (!phone) nextErrors.phone = 'Vui lòng nhập số điện thoại'
    else if (!/^(0|\+84)[0-9]{9}$/.test(phone)) nextErrors.phone = 'Số điện thoại không hợp lệ'
    if (!password) nextErrors.password = 'Vui lòng nhập mật khẩu'
    else if (password.length < 6) nextErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    if (!formData.confirmPassword) nextErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu'
    else if (formData.confirmPassword !== password) nextErrors.confirmPassword = 'Mật khẩu nhập lại không khớp'

    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await requestRegisterOtp({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      })
      setCode('')
      startOtpTimer()
      setStep('otp')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Không gửi được mã xác nhận. Vui lòng thử lại.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    const otp = code.trim()
    if (!/^[0-9]{6}$/.test(otp)) {
      setFieldErrors((prev) => ({ ...prev, code: 'Mã xác nhận phải gồm 6 số' }))
      return
    }

    setIsSubmitting(true)
    try {
      const sessionUser = await verifyRegisterOtp(formData.email.trim(), otp)
      clearPersistedFlow()
      login(sessionUser)
      router.replace('/')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Mã xác nhận không đúng. Vui lòng thử lại.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setIsSubmitting(true)
    try {
      await resendRegisterOtp(formData.email.trim())
      startOtpTimer()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Không gửi lại được mã. Vui lòng thử lại.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!ready) {
    return (
      <AuthSplitLayout>
        <h1 className="text-center font-header text-[22px] font-semibold text-[#252A31]">Đăng ký</h1>
      </AuthSplitLayout>
    )
  }

  return (
    <AuthSplitLayout>
      <h1 className="text-center font-header text-[22px] font-semibold text-[#252A31]">Đăng ký</h1>

      {error ? (
        <p className="mt-4 rounded-md bg-error-container px-3 py-2 text-sm text-error">{error}</p>
      ) : null}

      {step === 'form' ? (
        <form className="mt-6 flex flex-col gap-3.5" onSubmit={handleSubmit} noValidate>
          <AuthField
            name="fullName"
            value={formData.fullName}
            placeholder="Họ tên"
            autoComplete="name"
            error={fieldErrors.fullName}
            icon={<UserFieldIcon />}
            onChange={(value) => handleChange('fullName', value)}
          />
          <AuthField
            name="email"
            type="email"
            value={formData.email}
            placeholder="Nhập email"
            autoComplete="email"
            error={fieldErrors.email}
            icon={<MailIcon />}
            onChange={(value) => handleChange('email', value)}
          />
          <AuthField
            name="phone"
            type="tel"
            value={formData.phone}
            placeholder="Số điện thoại"
            autoComplete="tel"
            error={fieldErrors.phone}
            icon={<PhoneFieldIcon />}
            onChange={(value) => handleChange('phone', value)}
          />
          <PasswordField
            name="password"
            label="Mật khẩu"
            value={formData.password}
            placeholder="Mật khẩu"
            autoComplete="new-password"
            error={fieldErrors.password}
            onChange={(value) => handleChange('password', value)}
          />
          <PasswordField
            name="confirmPassword"
            label="Nhập lại mật khẩu"
            value={formData.confirmPassword}
            placeholder="Nhập lại mật khẩu"
            autoComplete="new-password"
            error={fieldErrors.confirmPassword}
            onChange={(value) => handleChange('confirmPassword', value)}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-12 cursor-pointer rounded-xl font-header text-[15px] font-semibold tracking-wide text-white disabled:opacity-60"
            style={{ backgroundColor: AUTH_ACCENT }}
          >
            {isSubmitting ? 'Đang gửi mã...' : 'TIẾP TỤC'}
          </button>
        </form>
      ) : (
        <form className="mt-6 flex flex-col gap-3.5" onSubmit={handleVerify} noValidate>
          <p className="text-center text-sm text-[#6B7280]">
            Mã gồm 6 số đã gửi tới <span className="font-medium text-[#252A31]">{formData.email.trim()}</span>
          </p>
          <p className={`text-center text-sm ${expired ? 'text-[#E31C25]' : 'text-[#6B7280]'}`}>
            {expired ? 'Mã đã hết hạn. Hãy gửi lại mã.' : 'Hết hạn sau'}
          </p>
          <p
            className={`text-center font-header text-[32px] font-semibold tabular-nums leading-none ${
              expired ? 'text-[#E31C25]' : ''
            }`}
            style={expired ? undefined : { color: AUTH_ACCENT }}
            aria-live="polite"
          >
            {formatCountdown(remainingMs)}
          </p>
          <AuthField
            name="code"
            value={code}
            placeholder="Nhập mã 6 số"
            autoComplete="one-time-code"
            maxLength={6}
            inputMode="numeric"
            error={fieldErrors.code}
            icon={<MailIcon />}
            onChange={(value) => {
              setCode(value.replace(/\D/g, '').slice(0, 6))
              setFieldErrors((prev) => ({ ...prev, code: undefined }))
            }}
          />
          <button
            type="submit"
            disabled={isSubmitting || expired}
            className="mt-2 h-12 cursor-pointer rounded-xl font-header text-[15px] font-semibold tracking-wide text-white disabled:opacity-60"
            style={{ backgroundColor: AUTH_ACCENT }}
          >
            {isSubmitting ? 'Đang xác nhận...' : 'XÁC NHẬN'}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleResend()}
            className="cursor-pointer text-sm font-medium disabled:opacity-60"
            style={{ color: AUTH_ACCENT }}
          >
            Gửi lại mã
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              setStep('form')
              setCode('')
              setError('')
              setExpiresAt(null)
            }}
            className="cursor-pointer text-sm text-[#6B7280] hover:underline"
          >
            Đổi email
          </button>
        </form>
      )}
      <p className="mt-5 text-center text-sm text-[#6B7280]">
        Đã có tài khoản?{' '}
        <Link href="/login" className="font-medium hover:underline" style={{ color: AUTH_ACCENT }}>
          Đăng nhập
        </Link>
      </p>
    </AuthSplitLayout>
  )
}
