import Footer from '@/components/site/Footer'
import Header from '@/components/site/Header'

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 py-6">
        <h1 className="font-display text-2xl font-extrabold text-on-surface">Sản phẩm</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Danh sách đang chờ API catalog từ backend.
        </p>
      </main>
      <Footer />
    </div>
  )
}
