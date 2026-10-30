'use client'

import { useEffect, useMemo, useState } from 'react'
import LaptopFilterModal from '@/components/product/LaptopFilterModal'
import PhoneFilters from '@/components/product/PhoneFilters'
import PhoneSortBar from '@/components/product/PhoneSortBar'
import ProductCard from '@/components/product/ProductCard'
import {
  EMPTY_LAPTOP_FILTERS,
  LAPTOP_BRANDS,
  LAPTOP_EXTRAS,
  applyLaptopFilters,
  type LaptopFilterState,
} from '@/lib/laptop-filters'
import { sortProducts, type Product } from '@/lib/products'

const PAGE_SIZE = 5

function filtersFromQuery(brand: string, type: string): LaptopFilterState {
  if (brand) return { ...EMPTY_LAPTOP_FILTERS, brands: [brand] }
  if (type) return { ...EMPTY_LAPTOP_FILTERS, types: [type] }
  return EMPTY_LAPTOP_FILTERS
}

function hasActiveFilters(filters: LaptopFilterState) {
  const extraOnly =
    filters.types.length > 0 && filters.types.every((item) => LAPTOP_EXTRAS.some((extra) => extra.slug === item))
  return (
    (!extraOnly && filters.types.length > 0) ||
    filters.rams.length + filters.cpus.length + filters.screens.length + filters.storages.length + filters.gpus.length >
      0 ||
    filters.priceKey !== '' ||
    filters.priceMin !== EMPTY_LAPTOP_FILTERS.priceMin ||
    filters.priceMax !== EMPTY_LAPTOP_FILTERS.priceMax
  )
}

export default function LaptopCatalog({
  products,
  brand,
  type,
  sort: initialSort,
}: {
  products: Product[]
  brand: string
  type: string
  sort: string
}) {
  const [sort, setSort] = useState(initialSort)
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [open, setOpen] = useState(false)
  const [applied, setApplied] = useState<LaptopFilterState>(() => filtersFromQuery(brand, type))
  const [draft, setDraft] = useState<LaptopFilterState>(() => filtersFromQuery(brand, type))

  const filtered = useMemo(() => applyLaptopFilters(products, applied), [products, applied])
  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort])
  const shown = sorted.slice(0, visible)
  const remaining = Math.max(0, sorted.length - shown.length)
  const draftCount = useMemo(() => applyLaptopFilters(products, draft).length, [products, draft])
  const selectedBrand = applied.brands.length === 1 ? applied.brands[0] : ''
  const selectedExtra = applied.types.length === 1 && LAPTOP_EXTRAS.some((item) => item.slug === applied.types[0]) ? applied.types[0] : ''

  useEffect(() => {
    const next = filtersFromQuery(brand, type)
    setApplied(next)
    setDraft(next)
    setVisible(PAGE_SIZE)
  }, [brand, type, products])

  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [sort, applied])

  function writeUrl(next: LaptopFilterState) {
    const params = new URLSearchParams({ category: 'laptop' })
    if (next.brands.length === 1) params.set('brand', next.brands[0])
    else if (next.types.length === 1 && LAPTOP_EXTRAS.some((item) => item.slug === next.types[0])) params.set('type', next.types[0])
    if (sort && sort !== 'featured') params.set('sort', sort)
    window.history.replaceState(null, '', `/products?${params.toString()}`)
  }

  return (
    <>
      <PhoneFilters
        category="laptop"
        brands={LAPTOP_BRANDS}
        extras={LAPTOP_EXTRAS}
        brand={selectedBrand}
        extra={selectedExtra}
        sort={sort}
        active={hasActiveFilters(applied)}
        onOpenFilter={() => {
          setDraft(applied)
          setOpen(true)
        }}
        onBrandClick={(slug) => {
          const next = filtersFromQuery(slug, '')
          setApplied(next)
          setDraft(next)
          setVisible(PAGE_SIZE)
        }}
        onExtraClick={(slug) => {
          const next = filtersFromQuery('', slug)
          setApplied(next)
          setDraft(next)
          setVisible(PAGE_SIZE)
        }}
      />
      <PhoneSortBar
        category="laptop"
        brand={selectedBrand}
        extra={selectedExtra}
        sort={sort}
        onSortChange={setSort}
      />
      {sorted.length === 0 ? (
        <p className="px-4 py-16 text-center font-header text-[14px] text-on-surface-variant">
          Không tìm thấy sản phẩm phù hợp.
        </p>
      ) : (
        <>
          <div className="grid w-full auto-rows-[560.6px] grid-cols-5 content-start gap-[10px]">
            {shown.map((product) => (
              <div
                key={product.id}
                className="flex h-full w-full flex-col overflow-hidden rounded-[6px] border border-outline bg-white p-[10px] text-start !font-normal transition-shadow duration-200 hover:shadow-card"
              >
                <ProductCard product={product} listing />
              </div>
            ))}
          </div>
          {remaining > 0 ? (
            <button
              type="button"
              onClick={() => setVisible((count) => count + PAGE_SIZE)}
              className="relative mx-auto mt-4 flex h-[47px] cursor-pointer items-center justify-center gap-1 overflow-hidden rounded-lg bg-buy-link px-10 py-3 font-header text-[14px] font-medium text-white transition hover:bg-buy-link/90"
            >
              Xem thêm {remaining} Laptop
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M2 4.5 6 8.5 10 4.5" />
              </svg>
            </button>
          ) : null}
        </>
      )}
      <LaptopFilterModal
        open={open}
        draft={draft}
        resultCount={draftCount}
        onChange={setDraft}
        onClose={() => setOpen(false)}
        onClear={() => setDraft(EMPTY_LAPTOP_FILTERS)}
        onApply={() => {
          setApplied(draft)
          setOpen(false)
          writeUrl(draft)
        }}
      />
    </>
  )
}
