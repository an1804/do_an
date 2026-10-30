import CategoryStrip from '@/components/product/CategoryStrip'
import Header from '@/components/site/Header'

export default function StickyHeader({ activeCategory }: { activeCategory?: string | null }) {
  return (
    <header className="sticky top-0 z-40 bg-primary font-header text-[14px] text-[#111827]">
      <Header />
      <CategoryStrip active={activeCategory} />
    </header>
  )
}
