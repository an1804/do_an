'use client'

import Image from 'next/image'
import { useRef, useEffect, type PointerEvent, type ReactNode } from 'react'
import {
  CHARGING_OPTIONS,
  PHONE_BRANDS,
  PHONE_TYPES,
  PRICE_CHIPS,
  PRICE_MAX,
  PRICE_MIN,
  RAM_OPTIONS,
  REFRESH_OPTIONS,
  RESOLUTION_OPTIONS,
  STORAGE_OPTIONS,
  formatFilterPrice,
  toggleFilterValue,
  type PhoneFilterState,
} from '@/lib/phone-filters'

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 shrink-0 cursor-pointer rounded-full border px-3 font-header text-[13px] ${
        active ? 'border-buy-link bg-buy-link-bg text-buy-link' : 'border-outline bg-white text-[#333333]'
      }`}
    >
      {label}
    </button>
  )
}

function snapPrice(value: number) {
  const snapped = Math.round(value / 100000) * 100000
  return Math.min(PRICE_MAX, Math.max(PRICE_MIN, snapped))
}

function PriceRangeSlider({
  min,
  max,
  onChange,
}: {
  min: number
  max: number
  onChange: (next: { priceMin: number; priceMax: number }) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef<'min' | 'max' | null>(null)
  const minPercent = ((min - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
  const maxPercent = ((max - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100

  function valueAt(clientX: number) {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return min
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    return snapPrice(PRICE_MIN + ratio * (PRICE_MAX - PRICE_MIN))
  }

  function apply(kind: 'min' | 'max', clientX: number) {
    const value = valueAt(clientX)
    if (kind === 'min') onChange({ priceMin: Math.min(value, max), priceMax: max })
    else onChange({ priceMin: min, priceMax: Math.max(value, min) })
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const value = valueAt(event.clientX)
    const kind = Math.abs(value - min) <= Math.abs(value - max) ? 'min' : 'max'
    dragging.current = kind
    apply(kind, event.clientX)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return
    apply(dragging.current, event.clientX)
  }

  function handlePointerUp() {
    dragging.current = null
  }

  return (
    <div
      ref={trackRef}
      className="relative mt-6 h-6 cursor-pointer"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-slot-track" />
      <div
        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-buy-link"
        style={{ left: `${minPercent}%`, width: `${Math.max(maxPercent - minPercent, 0)}%` }}
      />
      <span
        className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-buy-link bg-white shadow-sm"
        style={{ left: `${minPercent}%` }}
      />
      <span
        className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-buy-link bg-white shadow-sm"
        style={{ left: `${maxPercent}%` }}
      />
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-6">
      <h3 className="mb-3 font-header text-[16px] font-semibold text-[#252A31]">{title}</h3>
      {children}
    </section>
  )
}

export default function PhoneFilterModal({
  open,
  draft,
  resultCount,
  onChange,
  onClose,
  onClear,
  onApply,
}: {
  open: boolean
  draft: PhoneFilterState
  resultCount: number
  onChange: (next: PhoneFilterState) => void
  onClose: () => void
  onClear: () => void
  onApply: () => void
}) {
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex cursor-pointer items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="phone-filter-title"
        className="flex max-h-[90vh] w-full max-w-[920px] cursor-default flex-col overflow-hidden rounded-2xl bg-white shadow-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative flex h-14 shrink-0 items-center justify-center border-b border-outline-variant px-5">
          <h2 id="phone-filter-title" className="font-header text-[18px] font-semibold text-[#252A31]">
            Tất cả bộ lọc
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-1/2 flex -translate-y-1/2 cursor-pointer items-center gap-1 font-header text-[14px] text-on-surface-variant hover:text-[#252A31]"
          >
            <span className="text-lg leading-none">×</span> Đóng
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <Section title="Thương hiệu">
            <div className="flex flex-wrap gap-2">
              {PHONE_BRANDS.map((item) => {
                const active = draft.brands.includes(item.slug)
                return (
                  <button
                    key={item.slug}
                    type="button"
                    aria-label={item.label}
                    onClick={() => onChange({ ...draft, brands: toggleFilterValue(draft.brands, item.slug) })}
                    className={`flex h-12 w-[120px] cursor-pointer items-center justify-center rounded-xl bg-slot-track px-2 ${
                      active ? 'ring-2 ring-buy-link' : ''
                    }`}
                  >
                    <Image src={item.src} alt={item.label} width={90} height={24} className="h-6 w-[90px] object-contain" unoptimized />
                  </button>
                )
              })}
            </div>
          </Section>

          <Section title="Khoảng giá">
            <div className="flex flex-wrap gap-2">
              {PRICE_CHIPS.map((item) => (
                <FilterChip
                  key={item.key}
                  label={item.label}
                  active={draft.priceKey === item.key}
                  onClick={() =>
                    onChange({
                      ...draft,
                      priceKey: item.key,
                      priceMin: Math.max(item.min, PRICE_MIN),
                      priceMax: Math.min(item.max, PRICE_MAX),
                    })
                  }
                />
              ))}
            </div>
            <p className="mt-4 font-header text-[13px] text-on-surface-variant">Hoặc chọn mức giá phù hợp với bạn</p>
            <PriceRangeSlider
              min={draft.priceMin}
              max={draft.priceMax}
              onChange={({ priceMin, priceMax }) => onChange({ ...draft, priceKey: '', priceMin, priceMax })}
            />
            <div className="mt-1 flex justify-between font-header text-[13px] text-on-surface-variant">
              <span>{formatFilterPrice(draft.priceMin)}</span>
              <span>{formatFilterPrice(draft.priceMax)}</span>
            </div>
          </Section>

          <Section title="Loại sản phẩm">
            <div className="flex flex-wrap gap-2">
              {PHONE_TYPES.map((item) => (
                <FilterChip
                  key={item.key}
                  label={item.label}
                  active={draft.types.includes(item.key)}
                  onClick={() => onChange({ ...draft, types: toggleFilterValue(draft.types, item.key) })}
                />
              ))}
            </div>
          </Section>

          <Section title="RAM">
            <div className="flex flex-wrap gap-2">
              {RAM_OPTIONS.map((item) => (
                <FilterChip
                  key={item}
                  label={item}
                  active={draft.rams.includes(item)}
                  onClick={() => onChange({ ...draft, rams: toggleFilterValue(draft.rams, item) })}
                />
              ))}
            </div>
          </Section>

          <Section title="Độ phân giải">
            <div className="flex flex-wrap gap-2">
              {RESOLUTION_OPTIONS.map((item) => (
                <FilterChip
                  key={item}
                  label={item}
                  active={draft.resolutions.includes(item)}
                  onClick={() => onChange({ ...draft, resolutions: toggleFilterValue(draft.resolutions, item) })}
                />
              ))}
            </div>
          </Section>

          <Section title="Tần số quét">
            <div className="flex flex-wrap gap-2">
              {REFRESH_OPTIONS.map((item) => (
                <FilterChip
                  key={item}
                  label={item}
                  active={draft.refresh.includes(item)}
                  onClick={() => onChange({ ...draft, refresh: toggleFilterValue(draft.refresh, item) })}
                />
              ))}
            </div>
          </Section>

          <Section title="Dung lượng lưu trữ">
            <div className="flex flex-wrap gap-2">
              {STORAGE_OPTIONS.map((item) => (
                <FilterChip
                  key={item}
                  label={item}
                  active={draft.storages.includes(item)}
                  onClick={() => onChange({ ...draft, storages: toggleFilterValue(draft.storages, item) })}
                />
              ))}
            </div>
          </Section>

          <Section title="Pin & sạc">
            <div className="flex flex-wrap gap-2">
              {CHARGING_OPTIONS.map((item) => (
                <FilterChip
                  key={item.key}
                  label={item.label}
                  active={draft.charging.includes(item.key)}
                  onClick={() => onChange({ ...draft, charging: toggleFilterValue(draft.charging, item.key) })}
                />
              ))}
            </div>
          </Section>
        </div>

        <div className="flex shrink-0 items-center justify-center gap-3 border-t border-outline-variant px-6 py-4">
          <button
            type="button"
            onClick={onClear}
            className="h-11 cursor-pointer rounded-full border border-sale px-6 font-header text-[14px] font-medium text-sale"
          >
            Bỏ chọn
          </button>
          <button
            type="button"
            onClick={onApply}
            className="h-11 cursor-pointer rounded-full bg-buy-link px-8 font-header text-[14px] font-medium text-white hover:bg-buy-link/90"
          >
            Xem {resultCount} kết quả
          </button>
        </div>
      </div>
    </div>
  )
}
