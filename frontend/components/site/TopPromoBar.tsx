import Image from 'next/image'
import Link from 'next/link'

export default function TopPromoBar() {
  return (
    <Link href="/products" className="block bg-primary" aria-label="Khuyến mãi tháng 10">
      <Image
        src="/banners/top-promo.png"
        alt="Khuyến mãi tháng 10"
        width={2400}
        height={88}
        className="h-auto w-full"
        unoptimized
        priority
      />
    </Link>
  )
}
