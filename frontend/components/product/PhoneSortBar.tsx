'use client'

import type { MouseEvent } from 'react'

const SORTS = [
  { slug: 'featured', label: 'Nổi bật' },
  { slug: 'new', label: 'Mới' },
  { slug: 'sold', label: 'Bán chạy' },
  { slug: 'discount', label: '% giảm giá' },
  { slug: 'price', label: 'Giá ↑↓' },
]

function hrefFor(category: string, brand: string, extra: string, sort: string, size = '') {
  const params = new URLSearchParams({ category })
  if (brand) params.set('brand', brand)
  if (extra) params.set('type', extra)
  if (size) params.set('size', size)
  if (sort && sort !== 'featured') params.set('sort', sort)
  return `/products?${params.toString()}`
}

function priceMeta(sort: string) {
  if (sort === 'price-desc') {
    return { next: 'price-asc', label: 'Giá ↓', active: true }
  }
  if (sort === 'price-asc' || sort === 'price') {
    return { next: 'price-desc', label: 'Giá ↑', active: true }
  }
  return { next: 'price-desc', label: 'Giá ↑↓', active: false }
}

export default function PhoneSortBar({
  category = 'phone',
  brand,
  extra = '',
  size = '',
  sort,
  onSortChange,
}: {
  category?: string
  brand: string
  extra?: string
  size?: string
  sort: string
  onSortChange: (sort: string) => void
}) {
  const current = sort || 'featured'
  const price = priceMeta(sort)

  function applySort(event: MouseEvent<HTMLAnchorElement>, next: string, href: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    window.history.replaceState(null, '', href)
    onSortChange(next)
  }

  return (
    <div className="z-10 flex h-[53px] w-full items-center bg-white font-header text-[14px]">
      <span className="text-on-surface-variant">Sắp xếp theo:</span>
      <div className="ml-2 flex items-center">
        {SORTS.map((item, index) => {
          const isPrice = item.slug === 'price'
          const next = isPrice ? price.next : item.slug
          const active = isPrice ? price.active : item.slug === current
          const href = hrefFor(category, brand, extra, next, size)
          const label = isPrice ? price.label : item.label

          return (
            <span key={item.slug} className="flex items-center">
              {index > 0 ? <span className="px-2 text-outline">•</span> : null}
              <a
                href={href}
                onClick={(event) => applySort(event, next, href)}
                className={active ? 'cursor-pointer font-medium text-buy-link' : 'cursor-pointer text-on-surface-variant hover:text-[#252A31]'}
              >
                {label}
              </a>
            </span>
          )
        })}
      </div>
    </div>
  )
}
