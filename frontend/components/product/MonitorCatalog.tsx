'use client'

import { useEffect, useMemo, useState } from 'react'
import MonitorFilterModal from '@/components/product/MonitorFilterModal'
import PhoneFilters from '@/components/product/PhoneFilters'
import PhoneSortBar from '@/components/product/PhoneSortBar'
import ProductCard from '@/components/product/ProductCard'
import {
  EMPTY_MONITOR_FILTERS,
  MONITOR_BRANDS,
  MONITOR_EXTRAS,
  MONITOR_SIZES,
  applyMonitorFilters,
  type MonitorFilterState,
} from '@/lib/monitor-filters'
import { sortProducts, type Product } from '@/lib/products'

const PAGE_SIZE = 5

function filtersFromQuery(brand: string, type: string, size: string): MonitorFilterState {
  if (brand) return { ...EMPTY_MONITOR_FILTERS, brands: [brand] }
  if (type === '2k') return { ...EMPTY_MONITOR_FILTERS, resolutions: ['2k'] }
  if (type) return { ...EMPTY_MONITOR_FILTERS, types: [type] }
  if (size === '27') return { ...EMPTY_MONITOR_FILTERS, screens: ['27 inch'] }
  return EMPTY_MONITOR_FILTERS
}

function hasActiveFilters(filters: MonitorFilterState) {
  const extraTypes = filters.types.filter((item) => MONITOR_EXTRAS.some((extra) => extra.slug === item))
  const extraOnly = filters.types.length > 0 && extraTypes.length === filters.types.length
  const resOnly = filters.resolutions.length === 1 && filters.resolutions[0] === '2k'
  const sizeOnly = filters.screens.length === 1 && filters.screens[0] === '27 inch'
  return (
    (!extraOnly && filters.types.length > 0) ||
    (!resOnly && filters.resolutions.length > 0) ||
    (!sizeOnly && filters.screens.length > 0) ||
    filters.refresh.length + filters.panels.length > 0 ||
    filters.priceKey !== '' ||
    filters.priceMin !== EMPTY_MONITOR_FILTERS.priceMin ||
    filters.priceMax !== EMPTY_MONITOR_FILTERS.priceMax
  )
}

export default function MonitorCatalog({
  products,
  brand,
  type,
  size,
  sort: initialSort,
}: {
  products: Product[]
  brand: string
  type: string
  size: string
  sort: string
}) {
  const [sort, setSort] = useState(initialSort)
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [open, setOpen] = useState(false)
  const [applied, setApplied] = useState<MonitorFilterState>(() => filtersFromQuery(brand, type, size))
  const [draft, setDraft] = useState<MonitorFilterState>(() => filtersFromQuery(brand, type, size))

  const filtered = useMemo(() => applyMonitorFilters(products, applied), [products, applied])
  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort])
  const shown = sorted.slice(0, visible)
  const remaining = Math.max(0, sorted.length - shown.length)
  const draftCount = useMemo(() => applyMonitorFilters(products, draft).length, [products, draft])
  const selectedBrand = applied.brands.length === 1 ? applied.brands[0] : ''
  const selectedPrefix = applied.screens.length === 1 && applied.screens[0] === '27 inch' ? '27' : ''
  const selectedExtra =
    applied.resolutions.length === 1 && applied.resolutions[0] === '2k'
      ? '2k'
      : applied.types.length === 1 && MONITOR_EXTRAS.some((item) => item.slug === applied.types[0])
        ? applied.types[0]
        : ''

  useEffect(() => {
    const next = filtersFromQuery(brand, type, size)
    setApplied(next)
    setDraft(next)
    setVisible(PAGE_SIZE)
  }, [brand, type, size, products])

  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [sort, applied])

  function writeUrl(next: MonitorFilterState) {
    const params = new URLSearchParams({ category: 'monitor' })
    if (next.brands.length === 1) params.set('brand', next.brands[0])
    else if (next.types.length === 1 && MONITOR_EXTRAS.some((item) => item.slug === next.types[0])) params.set('type', next.types[0])
    else if (next.resolutions.length === 1 && next.resolutions[0] === '2k') params.set('type', '2k')
    else if (next.screens.length === 1 && next.screens[0] === '27 inch') params.set('size', '27')
    if (sort && sort !== 'featured') params.set('sort', sort)
    window.history.replaceState(null, '', `/products?${params.toString()}`)
  }

  function applyQuick(next: MonitorFilterState) {
    setApplied(next)
    setDraft(next)
    setVisible(PAGE_SIZE)
  }

  return (
    <>
      <PhoneFilters
        category="monitor"
        brands={MONITOR_BRANDS}
        prefixes={MONITOR_SIZES}
        extras={MONITOR_EXTRAS}
        brand={selectedBrand}
        prefix={selectedPrefix}
        extra={selectedExtra}
        sort={sort}
        active={hasActiveFilters(applied)}
        onOpenFilter={() => {
          setDraft(applied)
          setOpen(true)
        }}
        onBrandClick={(slug) => applyQuick(filtersFromQuery(slug, '', ''))}
        onPrefixClick={(slug) => applyQuick(filtersFromQuery('', '', slug))}
        onExtraClick={(slug) => applyQuick(filtersFromQuery('', slug, ''))}
      />
      <PhoneSortBar
        category="monitor"
        brand={selectedBrand}
        extra={selectedExtra}
        size={selectedPrefix}
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
              Xem thêm {remaining} Màn hình
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M2 4.5 6 8.5 10 4.5" />
              </svg>
            </button>
          ) : null}
        </>
      )}
      <MonitorFilterModal
        open={open}
        draft={draft}
        resultCount={draftCount}
        onChange={setDraft}
        onClose={() => setOpen(false)}
        onClear={() => setDraft(EMPTY_MONITOR_FILTERS)}
        onApply={() => {
          setApplied(draft)
          setOpen(false)
          writeUrl(draft)
        }}
      />
    </>
  )
}
