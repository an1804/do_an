'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { StarIcon } from '@/components/product/CategoryIcons'
import {
  discountPercent,
  formatSold,
  listingMeta,
  listingName,
  listingPrice,
  promoMeta,
  type Product,
} from '@/lib/products'

function formatPromoPrice(amount: number) {
  return `${new Intl.NumberFormat('vi-VN').format(amount)}đ`
}

export default function ProductCard({ product, listing = false }: { product: Product; listing?: boolean }) {
  const discount = discountPercent(product)
  const meta = promoMeta(product)
  const extras = listingMeta(product)
  const [storage, setStorage] = useState(extras.defaultStorage || extras.storages[0]?.label || '')
  const displayName = listing ? listingName(product, storage) : product.name
  const displayPrice = listing ? listingPrice(product, storage) : product.price

  if (!listing) {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group flex flex-col gap-[11px] rounded-[6px] bg-white p-[10px] transition-shadow duration-200 hover:shadow-card"
      >
        <div className="relative mx-auto aspect-square w-full overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            sizes="224px"
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
        <div className="flex h-[12px] w-full items-center font-header text-[12px] leading-[12px] text-on-surface-variant">
          <span className="text-star">
            <StarIcon />
          </span>
          <span>
            {meta.rating} • {formatSold(meta.sold)}
          </span>
        </div>
        <span className="mt-1 flex h-[32px] w-full items-center justify-center rounded-lg bg-buy-link-bg font-header text-[14px] font-medium text-buy-link transition-colors duration-200 group-hover:bg-buy-link group-hover:text-white">
          Mua ngay
        </span>
      </Link>
    )
  }

  return (
    <div className="relative flex h-full w-full flex-col text-start !font-normal">
      <Link href={`/products/${product.slug}`} className="absolute inset-0 z-0" aria-label={displayName} />
      <div className="pointer-events-none relative z-10 flex h-full flex-col">
        <div className="relative -mx-[10px] -mt-[10px] size-[223.6px] shrink-0 overflow-hidden rounded-none">
          <Image
            src={product.image}
            alt={displayName}
            fill
            className="size-full overflow-hidden rounded-none object-contain p-2"
            sizes="224px"
            unoptimized
          />
        </div>
        <span className="mt-2 flex h-[26px] w-fit items-center truncate rounded bg-slot-track p-1 font-header text-[12px] leading-[18px] text-[#667085]">
          Trả chậm 0%
        </span>
        <div className="mt-2 line-clamp-2 min-h-10 font-header text-[14px] font-medium leading-5 text-[#1D2939]">
          {displayName}
        </div>
        {extras.specChips.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {extras.specChips.map((chip) => (
              <span
                key={chip}
                className="relative flex h-[26px] w-fit items-center rounded-[2px] bg-slot-track px-[5px] py-1 font-header text-[12px] leading-[18px] text-[#667085]"
              >
                {chip}
              </span>
            ))}
          </div>
        ) : null}
        {extras.storages.length > 0 ? (
          <div className="pointer-events-auto relative z-10 mt-2 flex flex-wrap gap-1">
            {extras.storages.map((item) => {
              const active = item.label === storage
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setStorage(item.label)}
                  className={`relative box-border flex h-[30px] shrink-0 cursor-pointer items-center rounded-lg border px-2 py-[5px] font-header text-[12px] leading-[18px] ${
                    active ? 'border-buy-link text-buy-link' : 'border-outline text-[#333333]'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        ) : null}
        <div className="mt-2 flex items-center gap-1.5">
          {extras.colors.map((color) => (
            <span
              key={color}
              className="size-3 rounded-full ring-1 ring-black/10"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="mt-2 h-5 w-fit font-header text-[16px] font-medium leading-5 text-[#DD2F2C]">
          {formatPromoPrice(displayPrice)}
        </span>
        <div className="mt-auto flex h-3 w-full items-center font-header text-[12px] leading-3 text-on-surface-variant">
          <span className="text-star">
            <StarIcon />
          </span>
          <span>
            {meta.rating} • {formatSold(meta.sold)}
          </span>
        </div>
      </div>
    </div>
  )
}
