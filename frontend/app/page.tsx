import Link from 'next/link'
import ProductGrid from '@/components/product/ProductGrid'
import ShopShell from '@/components/site/ShopShell'
import { CATEGORIES, featuredProducts } from '@/lib/products'

export default function HomePage() {
  const products = featuredProducts()

  return (
    <ShopShell>
      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-6">
        <section className="rounded-md bg-secondary p-8 text-on-secondary md:p-10">
          <p className="font-display text-sm font-semibold text-primary">Siêu thị điện máy trực tuyến</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            Điện thoại, laptop, phụ kiện — giá tốt mỗi ngày
          </h1>
          <p className="mt-3 max-w-2xl text-white/75">
            Catalog đang dùng dữ liệu mẫu. Giỏ hàng và API sản phẩm sẽ nối ở bước backend.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-md bg-sale px-5 py-3 font-display font-semibold text-on-sale hover:opacity-90"
          >
            Xem sản phẩm
          </Link>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-on-surface">Danh mục nổi bật</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="rounded-md border-2 border-outline bg-surface-container-lowest p-5 hover:border-primary"
              >
                <p className="font-display font-semibold text-on-surface">{category.label}</p>
                <p className="mt-1 text-sm text-on-surface-variant">Xem tất cả</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-xl font-bold text-on-surface">Sản phẩm nổi bật</h2>
            <Link href="/products" className="text-sm font-medium text-sale hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="mt-4">
            <ProductGrid products={products} />
          </div>
        </section>
      </main>
    </ShopShell>
  )
}
