import Link from 'next/link'
import Footer from '@/components/site/Footer'
import Header from '@/components/site/Header'

const categories = ['Điện thoại', 'Laptop', 'Tai nghe', 'Phụ kiện']

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 py-12">
        <section className="rounded-lg bg-surface-container-lowest p-10 shadow-[var(--shadow-card)]">
          <p className="font-display text-sm font-semibold tracking-wide text-primary uppercase">
            Cửa hàng đồ công nghệ
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-on-surface">
            Mua sắm điện thoại, laptop và phụ kiện
          </h1>
          <p className="mt-4 max-w-2xl text-on-surface-variant">
            Frontend đang được khởi tạo. Catalog, giỏ hàng và thanh toán sẽ nối sau khi backend sẵn sàng.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex rounded-md bg-primary px-5 py-3 font-medium text-on-primary hover:bg-primary-hover"
          >
            Xem sản phẩm
          </Link>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-on-surface">Danh mục</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((name) => (
              <div
                key={name}
                className="rounded-md border border-outline-variant bg-surface-container-lowest p-6 shadow-[var(--shadow-card)]"
              >
                <p className="font-medium text-on-surface">{name}</p>
                <p className="mt-1 text-sm text-on-surface-variant">Sẽ cập nhật khi có dữ liệu</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
