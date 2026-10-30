'use client'

import { useEffect, useMemo, useState } from 'react'
import PhoneFilters from '@/components/product/PhoneFilters'
import PhoneSortBar from '@/components/product/PhoneSortBar'
import ProductCard from '@/components/product/ProductCard'
import TabletFilterModal from '@/components/product/TabletFilterModal'
import {
  EMPTY_TABLET_FILTERS,
  TABLET_BRANDS,
  applyTabletFilters,
  type TabletFilterState,
} from '@/lib/tablet-filters'
import { sortProducts, type Product } from '@/lib/products'

const PAGE_SIZE = 5

function filtersFromBrand(brand: string): TabletFilterState {
  if (!brand) return EMPTY_TABLET_FILTERS
  return { ...EMPTY_TABLET_FILTERS, brands: [brand] }
}

function hasActiveFilters(filters: TabletFilterState) {
  return (
    filters.types.length + filters.rams.length + filters.screens.length + filters.storages.length + filters.networks.length >
      0 ||
    filters.priceKey !== '' ||
    filters.priceMin !== EMPTY_TABLET_FILTERS.priceMin ||
    filters.priceMax !== EMPTY_TABLET_FILTERS.priceMax
  )
}

export default function TabletCatalog({
  products,
  brand,
  sort: initialSort,
}: {
  products: Product[]
  brand: string
  sort: string
}) {
  const [sort, setSort] = useState(initialSort)
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [open, setOpen] = useState(false)
  const [applied, setApplied] = useState<TabletFilterState>(() => filtersFromBrand(brand))
  const [draft, setDraft] = useState<TabletFilterState>(() => filtersFromBrand(brand))

  const filtered = useMemo(() => applyTabletFilters(products, applied), [products, applied])
  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort])
  const shown = sorted.slice(0, visible)
  const remaining = Math.max(0, sorted.length - shown.length)
  const draftCount = useMemo(() => applyTabletFilters(products, draft).length, [products, draft])
  const selectedBrand = applied.brands.length === 1 ? applied.brands[0] : ''

  useEffect(() => {
    const next = filtersFromBrand(brand)
    setApplied(next)
    setDraft(next)
    setVisible(PAGE_SIZE)
  }, [brand, products])

  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [sort, applied])

  return (
    <>
      <PhoneFilters
        category="tablet"
        brands={TABLET_BRANDS}
        brand={selectedBrand}
        sort={sort}
        active={hasActiveFilters(applied)}
        onOpenFilter={() => {
          setDraft(applied)
          setOpen(true)
        }}
        onBrandClick={(slug) => {
          const next = filtersFromBrand(slug)
          setApplied(next)
          setDraft(next)
          setVisible(PAGE_SIZE)
        }}
      />
      <PhoneSortBar category="tablet" brand={selectedBrand} sort={sort} onSortChange={setSort} />
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
              Xem thêm {remaining} Tablet
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M2 4.5 6 8.5 10 4.5" />
              </svg>
            </button>
          ) : null}
        </>
      )}
      <TabletFilterModal
        open={open}
        draft={draft}
        resultCount={draftCount}
        onChange={setDraft}
        onClose={() => setOpen(false)}
        onClear={() => setDraft(EMPTY_TABLET_FILTERS)}
        onApply={() => {
          setApplied(draft)
          setOpen(false)
          const params = new URLSearchParams({ category: 'tablet' })
          if (draft.brands.length === 1) params.set('brand', draft.brands[0])
          if (sort && sort !== 'featured') params.set('sort', sort)
          window.history.replaceState(null, '', `/products?${params.toString()}`)
        }}
      />
    </>
  )
}
