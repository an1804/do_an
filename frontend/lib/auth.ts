import axios from 'axios'
import api, {
  clearStoredAuthSession,
  hasStoredAuthSession,
  refreshSession,
  rememberAuthSession,
} from '@/lib/api'

export type UserRole = 'ADMIN' | 'SELLER' | 'CUSTOMER'

export type AuthUser = {
  role: UserRole
  email?: string
  fullName?: string
  phone?: string
}

type AuthApiUser = {
  role?: string
  email?: string
  fullName?: string
  phone?: string
}

const AUTH_MESSAGE_MAP: Record<string, string> = {
  'Email hoac mat khau khong chinh xac': 'Email hoặc mật khẩu không chính xác.',
  'Email nay da duoc dang ky': 'Email này đã được đăng ký.',
  'So dien thoai nay da duoc dang ky': 'Số điện thoại này đã được đăng ký.',
  'So dien thoai khong hop le': 'Số điện thoại không hợp lệ.',
  'Ho ten khong duoc de trong': 'Họ tên không được để trống.',
  'Email khong duoc de trong': 'Email không được để trống.',
  'Email khong hop le': 'Email không hợp lệ.',
  'Mat khau khong duoc de trong': 'Mật khẩu không được để trống.',
  'Mat khau phai co it nhat 6 ky tu': 'Mật khẩu phải có ít nhất 6 ký tự.',
  'Tai khoan da bi vo hieu hoa': 'Tài khoản đã bị vô hiệu hóa.',
  'Phien dang nhap khong hop le': 'Phiên đăng nhập không hợp lệ.',
  'Du lieu khong hop le': 'Dữ liệu không hợp lệ.',
  'Da gui ma xac nhan toi email': 'Đã gửi mã xác nhận tới email.',
  'Ma xac nhan khong duoc de trong': 'Vui lòng nhập mã xác nhận.',
  'Ma xac nhan phai gom 6 so': 'Mã xác nhận phải gồm 6 số.',
  'Ma xac nhan khong dung': 'Mã xác nhận không đúng.',
  'Ma xac nhan khong hop le hoac da het han': 'Mã xác nhận không hợp lệ hoặc đã hết hạn.',
  'Ma xac nhan da het luot thu. Hay gui lai ma': 'Mã xác nhận đã hết lượt thử. Hãy gửi lại mã.',
  'Vui long doi truoc khi gui lai ma': 'Vui lòng đợi trước khi gửi lại mã.',
  'Khong tim thay yeu cau dang ky. Hay dien lai form.': 'Không tìm thấy yêu cầu đăng ký. Hãy điền lại form.',
  'Chua cau hinh email. Dat MAIL_USERNAME va MAIL_PASSWORD.':
    'Chưa cấu hình email. Đặt MAIL_USERNAME và MAIL_PASSWORD trên server.',
  'Khong gui duoc email xac nhan. Vui long thu lai.': 'Không gửi được email xác nhận. Vui lòng thử lại.',
  'So dien thoai nay dang cho xac nhan': 'Số điện thoại này đang chờ xác nhận.',
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback

  const payload = error.response?.data as { message?: string; data?: unknown } | undefined
  if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    const first = Object.values(payload.data as Record<string, unknown>).find(
      (value) => typeof value === 'string' && value.trim(),
    )
    if (typeof first === 'string') {
      return AUTH_MESSAGE_MAP[first] ?? first
    }
  }

  if (typeof payload?.message === 'string' && payload.message.trim()) {
    return AUTH_MESSAGE_MAP[payload.message] ?? payload.message
  }

  return fallback
}

export function normalizeUserRole(role?: string | null): UserRole {
  const normalizedRole = role?.trim().toUpperCase()
  if (normalizedRole === 'ADMIN' || normalizedRole === 'SELLER' || normalizedRole === 'CUSTOMER') {
    return normalizedRole
  }
  return 'CUSTOMER'
}

export function normalizeAuthUser(data: AuthApiUser, fallback?: AuthUser | null): AuthUser {
  return {
    ...fallback,
    ...data,
    role: normalizeUserRole(data.role ?? fallback?.role),
  }
}

export function getPostLoginPath(role: UserRole) {
  if (role === 'ADMIN') return '/admin/dashboard'
  if (role === 'SELLER') return '/seller/dashboard'
  return '/'
}

export function getAccountPath(role: UserRole) {
  if (role === 'ADMIN') return '/admin/dashboard'
  if (role === 'SELLER') return '/seller/dashboard'
  return '/customer/dashboard'
}

export const requestRegisterOtp = async (payload: {
  fullName: string
  email: string
  phone: string
  password: string
}) => {
  await api.post('/api/auth/register', payload)
}

export const resendRegisterOtp = async (email: string) => {
  await api.post('/api/auth/register/resend', { email })
}

export const verifyRegisterOtp = async (email: string, code: string) => {
  const response = await api.post<AuthApiUser>('/api/auth/register/verify', { email, code })
  rememberAuthSession()
  return normalizeAuthUser(response.data)
}

export const loginSession = async (email: string, password: string) => {
  const response = await api.post<AuthApiUser>('/api/auth/login', { email, password })
  rememberAuthSession()
  return normalizeAuthUser(response.data)
}

export const getSessionRole = async () => {
  const response = await api.get<AuthApiUser>('/api/auth/session')
  return normalizeAuthUser(response.data)
}

export const restoreSession = async () => {
  if (!hasStoredAuthSession()) {
    throw new Error('No stored auth session')
  }

  try {
    return await getSessionRole()
  } catch (error) {
    try {
      await refreshSession()
      return await getSessionRole()
    } catch {
      clearStoredAuthSession()
      throw error
    }
  }
}

export const logoutSession = async () => {
  try {
    await api.post('/api/auth/logout')
  } catch {
    // UI vẫn xóa session local nếu API tạm thời lỗi.
  } finally {
    clearStoredAuthSession()
  }
}
