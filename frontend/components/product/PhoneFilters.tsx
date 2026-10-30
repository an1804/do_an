'use client'

import Image from 'next/image'
import type { MouseEvent } from 'react'

export type CatalogBrand = { slug: string; label: string; src: string }
export type CatalogExtra = { slug: string; label: string }

export default function PhoneFilters({
  category = 'phone',
  brands,
  prefixes = [],
  extras = [],
  brand,
  prefix = '',
  extra = '',
  sort,
  active,
  onOpenFilter,
  onBrandClick,
  onPrefixClick,
  onExtraClick,
}: {
  category?: string
  brands: CatalogBrand[]
  prefixes?: CatalogExtra[]
  extras?: CatalogExtra[]
  brand: string
  prefix?: string
  extra?: string
  sort?: string
  active?: boolean
  onOpenFilter: () => void
  onBrandClick: (slug: string) => void
  onPrefixClick?: (slug: string) => void
  onExtraClick?: (slug: string) => void
}) {
  function hrefFor(kind: 'brand' | 'extra' | 'prefix', slug: string) {
    const params = new URLSearchParams({ category })
    if (kind === 'brand') params.set('brand', slug)
    else if (kind === 'prefix') params.set('size', slug)
    else params.set('type', slug)
    if (sort && sort !== 'featured') params.set('sort', sort)
    return `/products?${params.toString()}`
  }

  function select(
    event: MouseEvent<HTMLAnchorElement>,
    kind: 'brand' | 'extra' | 'prefix',
    slug: string,
    href: string,
  ) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    window.history.replaceState(null, '', href)
    if (kind === 'brand') onBrandClick(slug)
    else if (kind === 'prefix') onPrefixClick?.(slug)
    else onExtraClick?.(slug)
  }

  return (
    <div className="-mx-0.5 flex w-full items-center gap-[10px] overflow-x-auto px-0.5 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        type="button"
        onClick={onOpenFilter}
        className={`flex h-9 shrink-0 cursor-pointer items-center gap-1 rounded-[8px] bg-slot-track px-[6px] font-header text-[13px] font-medium text-[#252A31] ${
          active ? 'ring-1 ring-buy-link text-buy-link' : ''
        }`}
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M2.5 4.5h11M4.5 8h7M6.5 11.5h3" />
        </svg>
        Lọc
      </button>
      {prefixes.map((item) => {
        const selected = item.slug === prefix
        const href = hrefFor('prefix', item.slug)
        return (
          <a
            key={item.slug}
            href={href}
            onClick={(event) => select(event, 'prefix', item.slug, href)}
            className={`flex h-9 shrink-0 cursor-pointer items-center gap-1 rounded-[8px] bg-slot-track px-3 font-header text-[13px] font-medium text-[#252A31] ${
              selected ? 'ring-1 ring-[#252A31]/20' : ''
            }`}
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4 text-buy-link" fill="currentColor" aria-hidden="true">
              <path d="M8 1.2 9.1 5l3.9.3-3 2.5 1 3.8L8 9.4 5 11.6l1-3.8-3-2.5L7 5z" />
            </svg>
            {item.label}
          </a>
        )
      })}
      {brands.map((item) => {
        const selected = item.slug === brand
        const href = hrefFor('brand', item.slug)
        return (
          <a
            key={item.slug}
            href={href}
            aria-label={item.label}
            onClick={(event) => select(event, 'brand', item.slug, href)}
            className={`flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-[8px] bg-slot-track px-[6px] ${
              selected ? 'ring-1 ring-[#252A31]/20' : ''
            }`}
          >
            <Image
              src={item.src}
              alt={item.label}
              width={63}
              height={20}
              className="h-5 w-[62.5px] object-contain"
              unoptimized
            />
          </a>
        )
      })}
      {extras.map((item) => {
        const selected = item.slug === extra
        const href = hrefFor('extra', item.slug)
        return (
          <a
            key={item.slug}
            href={href}
            onClick={(event) => select(event, 'extra', item.slug, href)}
            className={`flex h-9 shrink-0 cursor-pointer items-center gap-1 rounded-[8px] bg-slot-track px-3 font-header text-[13px] font-medium text-[#252A31] ${
              selected ? 'ring-1 ring-[#252A31]/20' : ''
            }`}
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4 text-buy-link" fill="currentColor" aria-hidden="true">
              <path d="M8 1.2 9.1 5l3.9.3-3 2.5 1 3.8L8 9.4 5 11.6l1-3.8-3-2.5L7 5z" />
            </svg>
            {item.label}
          </a>
        )
      })}
    </div>
  )
}
