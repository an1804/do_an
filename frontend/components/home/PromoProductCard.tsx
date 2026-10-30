import Image from 'next/image'
import Link from 'next/link'
import { FireIcon, StarIcon } from '@/components/product/CategoryIcons'
import { discountPercent, formatSold, promoMeta, type Product } from '@/lib/products'

function formatPromoPrice(amount: number) {
  return `${new Intl.NumberFormat('vi-VN').format(amount)}đ`
}

export default function PromoProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product)
  const meta = promoMeta(product)

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-[416px] w-[182px] flex-col gap-[11px] rounded-[6px] bg-white p-[10px] transition-shadow duration-200 hover:shadow-card lg:gap-2"
    >
      <div className="relative mx-auto size-[180px] shrink-0 overflow-hidden rounded-none p-2">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          sizes="180px"
          unoptimized
        />
      </div>
      <div className="line-clamp-2 h-[40px] w-full font-header text-[14px] font-medium leading-5 text-[#1D2939]">
        {product.name}
      </div>
      <span className="h-[20px] w-fit font-header text-[16px] font-medium leading-5 text-[#DD2F2C]">
        {formatPromoPrice(product.price)}
      </span>
      <p className="min-h-4 text-[12px] text-on-surface-variant">
        {product.originalPrice ? (
          <>
            <span className="line-through">{formatPromoPrice(product.originalPrice)}</span>
            {discount > 0 ? <span className="ml-1 text-[#DD2F2C]">-{discount}%</span> : null}
          </>
        ) : (
          '\u00a0'
        )}
      </p>
      <div className="flex h-[12px] w-full shrink-0 flex-wrap items-center gap-y-1 font-header text-[12px] leading-[12px] text-on-surface-variant">
        <span className="text-star">
          <StarIcon />
        </span>
        <span>
          {meta.rating} • {formatSold(meta.sold)}
        </span>
      </div>
      <div className="relative flex h-4 w-full shrink-0 items-center overflow-hidden rounded-full bg-gradient-to-r from-primary to-[#ffe566]">
        <span className="absolute left-1 z-[1] text-flash">
          <FireIcon />
        </span>
        <p className="relative z-[2] w-full line-clamp-1 text-center font-header text-[12px] font-medium leading-4 text-[#252A31]">
          {meta.quotaUsed}/{meta.quotaTotal} Suất
        </p>
      </div>
      <span className="relative mt-[10px] flex h-[32px] w-[160px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-buy-link-bg px-3 py-[7px] font-header text-[14px] font-medium text-buy-link transition-colors duration-200 group-hover:bg-buy-link group-hover:text-white">
        Mua ngay
      </span>
    </Link>
  )
}
