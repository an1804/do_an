import Image from 'next/image'
import Link from 'next/link'
import DualPromoBanner from '@/components/home/DualPromoBanner'
import HomeHero from '@/components/home/HomeHero'
import PromoSection from '@/components/home/PromoSection'
import ShopShell from '@/components/site/ShopShell'
import { fetchProducts } from '@/lib/catalog'

export const dynamic = 'force-dynamic'

const SHOP_BANNERS = [
  { src: '/banners/shop-online.png', alt: 'Mua online chuẩn gu thời đại' },
  { src: '/banners/shop-deal.png', alt: 'Deal đúng ý cổ say mê' },
  { src: '/banners/shop-halloween.png', alt: 'Ngày ma quái giảm hú hồn' },
  { src: '/banners/shop-gaming.png', alt: 'Chiến game laptop gaming' },
]

export default async function HomePage() {
  const products = await fetchProducts()

  return (
    <ShopShell>
      <main className="mx-auto flex w-full max-w-[1200px] flex-col pb-5 pt-3">
        <HomeHero />
        <PromoSection products={products} />
        <DualPromoBanner />
        <div className="mt-5 flex w-full flex-col gap-5">
          <div className="w-fit font-header text-[24px] font-bold leading-9 text-[#252A31]">Khuyến mãi Thiết bị văn phòng</div>
          <Link
            href="/products?category=laptop"
            aria-label="Khuyến mãi thiết bị văn phòng, xem laptop"
            className="relative block aspect-[1200/380] w-full overflow-hidden rounded-[12px]"
          >
            <Image
              src="/banners/office-promo.jpg"
              alt=""
              fill
              className="object-cover"
              sizes="1200px"
              unoptimized
            />
          </Link>
        </div>
        <div className="mt-5 flex w-full flex-col gap-5">
          <div className="w-fit font-header text-[24px] font-bold leading-9 text-[#252A31]">Gian hàng ưu đãi</div>
          <div className="flex h-[467.12px] w-full justify-between">
            {SHOP_BANNERS.map((banner) => (
              <div key={banner.src} className="relative h-[467.12px] w-[288px] overflow-hidden rounded-[8px]">
                <Image src={banner.src} alt={banner.alt} fill className="object-cover" sizes="288px" unoptimized />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 rounded-[16px] bg-white px-10 py-10">
          <div className="text-center font-header text-[28px] font-bold leading-9 text-primary">
            Trải nghiệm mua sắm 5T tại thegioicongnghe
          </div>
          <div className="mt-8 grid grid-cols-5 gap-6">
            <div className="flex flex-col items-center text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-[#1A1A1A]">
                <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 7v10M15.2 9.2c-.4-1.2-1.6-1.8-3.2-1.8-1.8 0-3 .8-3 2s1.2 1.8 3 2.2 3 .8 3 2-.1 2.2-3 2.2-2.8-.7-3.2-1.8" />
                </svg>
              </span>
              <p className="mt-4 font-header text-[16px] font-bold leading-6 text-[#252A31]">Tốt hơn về giá</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-[#1A1A1A]">
                <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <circle cx="12" cy="8" r="3" />
                  <path d="M6.5 18.5c.8-2.6 2.8-4 5.5-4s4.7 1.4 5.5 4" />
                </svg>
              </span>
              <p className="mt-4 font-header text-[16px] font-bold leading-6 text-[#252A31]">Thành viên - HSSV</p>
              <p className="mt-1 font-header text-[14px] leading-5 text-[#4A4A4A]">Ưu đãi riêng tới 5%</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-[#1A1A1A]">
                <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M7 8H4.5A6.5 6.5 0 0 1 16 6.2" />
                  <path d="M5 5.5 7.2 8 4.8 10" />
                  <path d="M17 16h2.5A6.5 6.5 0 0 1 8 17.8" />
                  <path d="M19 18.5 16.8 16l2.4-2" />
                </svg>
              </span>
              <p className="mt-4 font-header text-[16px] font-bold leading-6 text-[#252A31]">Thu cũ đổi mới</p>
              <p className="mt-1 font-header text-[14px] leading-5 text-[#4A4A4A]">Thu cũ giá cao, trợ giá lên đời</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-[#1A1A1A]">
                <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3.5" y="6.5" width="17" height="11" rx="2" />
                  <path d="M3.5 10.5h17" />
                </svg>
              </span>
              <p className="mt-4 font-header text-[16px] font-bold leading-6 text-[#252A31]">Thanh toán - Trả góp</p>
              <p className="mt-1 font-header text-[14px] leading-5 text-[#4A4A4A]">Dễ dàng</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-[#1A1A1A]">
                <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="8" y="3.5" width="8" height="14" rx="1.5" />
                  <path d="M11 17.5h2" />
                  <path d="M5 13.5 3.5 12 5 10.5" />
                  <path d="M3.8 12H7" />
                </svg>
              </span>
              <p className="mt-4 font-header text-[16px] font-bold leading-6 text-[#252A31]">Trả máy lỗi</p>
              <p className="mt-1 font-header text-[14px] leading-5 text-[#4A4A4A]">Đổi máy liền</p>
            </div>
          </div>
        </div>
      </main>
    </ShopShell>
  )
}
