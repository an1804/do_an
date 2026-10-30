'use client'

import AuthGate from '@/components/auth/AuthGate'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminDashboardPage() {
  return (
    <AuthGate roles={['ADMIN']}>
      <AdminPanel />
    </AuthGate>
  )
}

function AdminPanel() {
  const { user, logout } = useAuth()

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-8">
      <div className="max-w-xl rounded-lg bg-white p-8">
        <h1 className="font-header text-2xl font-bold text-[#252A31]">Tài khoản admin</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          {user?.fullName} · {user?.email}
        </p>
        <p className="mt-4 text-sm text-on-surface-variant">Quản lý người dùng và thống kê sẽ làm sau.</p>
        <button
          type="button"
          onClick={() => void logout('/')}
          className="mt-6 inline-flex h-11 cursor-pointer items-center rounded-md border border-outline px-5 font-header text-sm font-semibold text-on-surface"
        >
          Đăng xuất
        </button>
      </div>
    </main>
  )
}
