'use client'

import Link from 'next/link'
import AuthGate from '@/components/auth/AuthGate'
import { useAuth } from '@/contexts/AuthContext'

export default function CustomerDashboardPage() {
  return (
    <AuthGate roles={['CUSTOMER']}>
      <AccountPanel />
    </AuthGate>
  )
}

function AccountPanel() {
  const { user, logout } = useAuth()

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-8">
      <div className="max-w-xl rounded-lg bg-white p-8">
        <h1 className="font-header text-2xl font-bold text-[#252A31]">Tài khoản của tôi</h1>
        <dl className="mt-6 divide-y divide-outline rounded-md border border-outline">
          <div className="grid grid-cols-3 gap-4 px-4 py-3 text-sm">
            <dt className="text-on-surface-variant">Họ tên</dt>
            <dd className="col-span-2 font-medium text-on-surface">{user?.fullName || '—'}</dd>
          </div>
          <div className="grid grid-cols-3 gap-4 px-4 py-3 text-sm">
            <dt className="text-on-surface-variant">Email</dt>
            <dd className="col-span-2 font-medium text-on-surface">{user?.email || '—'}</dd>
          </div>
          <div className="grid grid-cols-3 gap-4 px-4 py-3 text-sm">
            <dt className="text-on-surface-variant">Số điện thoại</dt>
            <dd className="col-span-2 font-medium text-on-surface">{user?.phone || '—'}</dd>
          </div>
          <div className="grid grid-cols-3 gap-4 px-4 py-3 text-sm">
            <dt className="text-on-surface-variant">Vai trò</dt>
            <dd className="col-span-2 font-medium text-on-surface">Khách hàng</dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-md bg-primary px-5 font-header text-sm font-semibold text-on-primary"
          >
            Tiếp tục mua sắm
          </Link>
          <button
            type="button"
            onClick={() => void logout('/')}
            className="inline-flex h-11 cursor-pointer items-center rounded-md border border-outline px-5 font-header text-sm font-semibold text-on-surface"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </main>
  )
}
