import Footer from '@/components/site/Footer'
import StickyHeader from '@/components/site/StickyHeader'
import TopPromoBar from '@/components/site/TopPromoBar'

export default function ShopShell({
  children,
  activeCategory,
}: {
  children: React.ReactNode
  activeCategory?: string | null
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopPromoBar />
      <StickyHeader activeCategory={activeCategory} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}
