import Link from 'next/link'
import Footer from '@/components/site/Footer'
import Header from '@/components/site/Header'

const categories = ['Điện thoại', 'Laptop', 'Tai nghe', 'Phụ kiện']

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-6 px-4 py-6">
        <section className="rounded-md bg-secondary p-8 text-on-secondary md:p-10">
          <p className="font-display text-sm font-semibold text-primary">Siêu thị điện máy trực tuyến</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            Điện thoại, laptop, phụ kiện — giá tốt mỗi ngày
          </h1>
          <p className="mt-3 max-w-2xl text-white/75">
            TechStore. Catalog và giỏ hàng sẽ nối khi backend catalog sẵn sàng.
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
            {categories.map((name) => (
              <Link
                key={name}
                href="/products"
                className="rounded-md border border-outline bg-surface-container-lowest p-5 hover:border-primary"
              >
                <p className="font-display font-semibold text-on-surface">{name}</p>
                <p className="mt-1 text-sm text-on-surface-variant">Xem tất cả</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
