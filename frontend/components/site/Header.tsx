'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { getAccountPath } from '@/lib/auth'

const navItems = [
  { href: '/', label: 'Trang chủ' },
  { href: '/products', label: 'Sản phẩm' },
]

export default function Header() {
  const { user, isLoading, logout } = useAuth()
  const accountPath = user ? getAccountPath(user.role) : '/login'

  return (
    <header className="bg-primary text-on-primary">
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center gap-4 px-4">
        <Link href="/" className="shrink-0 font-display text-xl font-extrabold tracking-tight">
          TechStore
        </Link>
        <form className="hidden flex-1 md:block" action="/products">
          <label className="sr-only" htmlFor="site-search">
            Tìm sản phẩm
          </label>
          <input
            id="site-search"
            name="q"
            type="search"
            placeholder="Bạn tìm gì..."
            className="h-10 w-full rounded-full border-0 bg-white px-4 text-sm text-on-surface outline-none"
          />
        </form>
        <nav className="ml-auto flex items-center gap-4 font-display text-sm font-semibold">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ))}
          {isLoading ? (
            <span className="h-9 w-36" aria-hidden />
          ) : user ? (
            <>
              <Link href={accountPath} className="max-w-[140px] truncate hover:underline">
                {user.fullName || user.email}
              </Link>
              <button
                type="button"
                onClick={() => void logout('/')}
                className="rounded-md bg-secondary px-3 py-2 text-on-secondary hover:bg-secondary-container"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-secondary px-3 py-2 text-on-secondary hover:bg-secondary-container"
              >
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
