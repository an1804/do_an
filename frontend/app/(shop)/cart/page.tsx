import Link from 'next/link'
import ShopShell from '@/components/site/ShopShell'

export default function CartPage() {
  return (
    <ShopShell>
      <main className="mx-auto w-full max-w-[1200px] px-4 py-10">
        <h1 className="font-display text-2xl font-extrabold text-on-surface">Giỏ hàng</h1>
        <p className="mt-3 text-on-surface-variant">Chưa có sản phẩm. Giỏ hàng sẽ nối khi có backend catalog.</p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-11 items-center rounded-md bg-sale px-5 font-display text-sm font-semibold text-on-sale"
        >
          Tiếp tục mua sắm
        </Link>
      </main>
    </ShopShell>
  )
}
