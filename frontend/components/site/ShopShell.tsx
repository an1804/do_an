import CategoryStrip from '@/components/product/CategoryStrip'
import Footer from '@/components/site/Footer'
import Header from '@/components/site/Header'

export default function ShopShell({
  children,
  activeCategory,
}: {
  children: React.ReactNode
  activeCategory?: string | null
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <CategoryStrip active={activeCategory} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}
