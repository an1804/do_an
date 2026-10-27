import Link from 'next/link'

const navItems = [
  { href: '/', label: 'Trang chủ' },
  { href: '/products', label: 'Sản phẩm' },
]

export default function Header() {
  return (
    <header className="border-b border-outline-variant bg-surface-container-lowest">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-on-surface">
          TechStore
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-on-surface-variant">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-primary">
              {item.label}
            </Link>
          ))}
          <Link href="/login" className="hover:text-primary">
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-primary px-3 py-2 text-on-primary hover:bg-primary-hover"
          >
            Đăng ký
          </Link>
        </nav>
      </div>
    </header>
  )
}
