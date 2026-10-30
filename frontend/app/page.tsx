import DualPromoBanner from '@/components/home/DualPromoBanner'
import HomeHero from '@/components/home/HomeHero'
import PromoSection from '@/components/home/PromoSection'
import ShopShell from '@/components/site/ShopShell'

export default function HomePage() {
  return (
    <ShopShell>
      <main className="mx-auto flex w-full max-w-[1200px] flex-col pb-5 pt-3">
        <HomeHero />
        <PromoSection />
        <DualPromoBanner />
      </main>
    </ShopShell>
  )
}
