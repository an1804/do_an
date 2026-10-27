'use client'

import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg bg-surface-container-lowest p-8 shadow-[var(--shadow-card)]">
        <h1 className="font-display text-2xl font-bold text-on-surface">Đăng nhập</h1>
        <p className="mt-2 text-sm text-on-surface-variant">Form sẽ nối API auth khi backend sẵn sàng.</p>
        <form className="mt-6 flex flex-col gap-4" onSubmit={(event) => event.preventDefault()}>
          <label className="text-sm font-medium text-on-surface">
            Email
            <input
              type="email"
              className="mt-1 w-full rounded-md border border-outline px-3 py-2 outline-none focus:border-primary"
              placeholder="ban@email.com"
            />
          </label>
          <label className="text-sm font-medium text-on-surface">
            Mật khẩu
            <input
              type="password"
              className="mt-1 w-full rounded-md border border-outline px-3 py-2 outline-none focus:border-primary"
            />
          </label>
          <button
            type="submit"
            className="rounded-md bg-primary py-3 font-medium text-on-primary hover:bg-primary-hover"
          >
            Đăng nhập
          </button>
        </form>
        <p className="mt-4 text-sm text-on-surface-variant">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </main>
  )
}
