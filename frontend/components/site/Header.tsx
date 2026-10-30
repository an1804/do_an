'use client'

import Link from 'next/link'
import { CartIcon, UserIcon, VoucherIcon } from '@/components/product/CategoryIcons'
import SearchBox from '@/components/site/SearchBox'
import { useAuth } from '@/contexts/AuthContext'
import { getAccountPath } from '@/lib/auth'

export default function Header() {
  const { user, isLoading, logout } = useAuth()
  const accountPath = user ? getAccountPath(user.role) : '/login'

  return (
    <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-4 px-4">
      <Link href="/" className="shrink-0 whitespace-nowrap font-header text-2xl font-extrabold leading-none tracking-tight">
        thegioicongnghe
      </Link>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SearchBox />
        <div className="flex shrink-0 items-center gap-6 font-medium">
        {user ? (
          <>
            <Link href={accountPath} className="flex max-w-[140px] items-center gap-1 truncate hover:underline">
              <UserIcon />
              <span className="hidden lg:inline">{user.fullName || user.email}</span>
            </Link>
            <button type="button" onClick={() => void logout('/')} className="hidden hover:underline lg:inline">
              Đăng xuất
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className={`flex items-center gap-1 ${isLoading ? 'pointer-events-none opacity-60' : 'hover:underline'}`}
          >
            <UserIcon />
            <span className="hidden lg:inline">Đăng nhập</span>
          </Link>
        )}
        <Link href="/vouchers" className="flex items-center gap-1 hover:underline">
          <VoucherIcon />
          <span className="hidden lg:inline">Voucher</span>
        </Link>
        <Link href="/cart" className="relative flex items-center gap-1 hover:underline">
          <CartIcon />
          <span className="hidden lg:inline">Giỏ hàng</span>
        </Link>
        </div>
      </div>
    </div>
  )
}