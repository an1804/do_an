import Footer from '@/components/site/Footer'
import Header from '@/components/site/Header'

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-on-surface">Sản phẩm</h1>
        <p className="mt-3 text-on-surface-variant">
          Trang danh sách đang chờ API catalog từ backend.
        </p>
      </main>
      <Footer />
    </div>
  )
}
