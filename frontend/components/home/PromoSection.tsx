'use client'

import { useMemo, useState } from 'react'
import FlashSaleSlots from '@/components/home/FlashSaleSlots'
import PromoProductCard from '@/components/home/PromoProductCard'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/product/CategoryIcons'
import { CATEGORIES, PRODUCTS, filterProducts, saleProducts, type ProductCategory } from '@/lib/products'

type Tab = 'sale' | ProductCategory

const PAGE_SIZE = 12

export default function PromoSection() {
  const [tab, setTab] = useState<Tab>('sale')
  const [page, setPage] = useState(0)

  const products = useMemo(() => {
    if (tab === 'sale') {
      const onSale = saleProducts()
      const rest = PRODUCTS.filter((product) => !onSale.some((item) => item.id === product.id))
      return [...onSale, ...rest]
    }
    return filterProducts(undefined, tab)
  }, [tab])

  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount - 1)
  const visible = products.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE)

  const selectTab = (next: Tab) => {
    setTab(next)
    setPage(0)
  }

  return (
    <section>
      <div className="py-5">
        <h2 className="font-header text-[24px] font-bold leading-9 text-[#252A31]">Khuyến mãi online</h2>
      </div>
      <div className="flex h-auto w-full flex-col overflow-hidden rounded-[16px] bg-white lg:h-[994px]">
        <div className="flex h-[59px] w-full shrink-0 items-center">
          <button
            type="button"
            onClick={() => selectTab('sale')}
            className="flex h-full shrink-0 cursor-pointer items-center justify-center px-3"
          >
            <span
              className={`block whitespace-nowrap rounded-md px-3 py-1 text-left ${
                tab === 'sale' ? 'bg-primary-container' : 'bg-surface'
              }`}
            >
              <span className="block text-[10px] font-extrabold tracking-wide text-sale">FLASH SALE</span>
              <span className="block font-header text-[14px] font-extrabold leading-5 text-sale">GIÁ SỐC</span>
            </span>
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => selectTab(category.slug)}
              className={`flex h-full flex-1 cursor-pointer items-center justify-center font-header text-[14px] ${
                tab === category.slug ? 'font-semibold text-sale' : 'font-medium text-on-surface-variant hover:text-[#252A31]'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {tab === 'sale' ? <FlashSaleSlots /> : null}

        <div className="relative min-h-0 flex-1 px-2 pb-3">
          <button
            type="button"
            aria-label="Sản phẩm trước"
            disabled={currentPage === 0}
            onClick={() => setPage((value) => Math.max(0, value - 1))}
            className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#252A31] shadow-card disabled:opacity-30"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            aria-label="Sản phẩm sau"
            disabled={currentPage >= pageCount - 1}
            onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))}
            className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#252A31] shadow-card disabled:opacity-30"
          >
            <ChevronRightIcon />
          </button>
          {visible.length ? (
            <div className="grid h-full grid-cols-2 justify-items-center sm:grid-cols-3 lg:grid-cols-6 lg:grid-rows-2">
              {visible.map((product) => (
                <PromoProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="px-4 py-10 text-center text-on-surface-variant">Không tìm thấy sản phẩm phù hợp.</p>
          )}
        </div>
      </div>
    </section>
  )
}
