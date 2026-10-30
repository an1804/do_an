'use client'

import { useEffect, useMemo, useState } from 'react'

const SLOT_HOURS = [9, 12, 15, 18]
const PLACEHOLDER_CLOCKS = ['09:00', '12:00', '15:00', '18:00']

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function nextOccurrences(now: Date) {
  return SLOT_HOURS.map((hour) => {
    const date = new Date(now)
    date.setHours(hour, 0, 0, 0)
    if (date <= now) date.setDate(date.getDate() + 1)
    return date
  }).sort((a, b) => a.getTime() - b.getTime())
}

function formatClock(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function formatRemaining(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

export default function FlashSaleSlots() {
  const [now, setNow] = useState<Date | null>(null)
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const slots = useMemo(() => (now ? nextOccurrences(now) : []), [now])
  const remaining = now && slots[0] ? formatRemaining(slots[0].getTime() - now.getTime()) : '--:--:--'
  const upcoming = now ? slots.map(formatClock) : PLACEHOLDER_CLOCKS

  const items = [
    { id: 'live', label: 'Chỉ còn', value: remaining },
    ...upcoming.map((clock) => ({ id: clock, label: 'Sắp diễn ra', value: clock })),
  ]

  return (
    <div className="mx-auto mt-[10px] flex h-[60px] w-[624px] max-w-full shrink-0 items-center justify-center overflow-x-auto rounded-[13px] bg-slot-track p-[4px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item, index) => {
        const isSelected = selected === index
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelected(index)}
            className={`flex h-full w-[120px] cursor-pointer flex-col items-center justify-center rounded-[9px] text-[12px] ${
              isSelected ? 'bg-flash text-on-flash' : 'bg-transparent text-on-surface-variant'
            }`}
          >
            <span className="leading-none">{item.label}</span>
            <span
              className={`mt-1 font-header text-[16px] font-bold leading-none tabular-nums ${
                isSelected ? 'text-on-flash' : 'text-[#252A31]'
              }`}
            >
              {item.value}
            </span>
          </button>
        )
      })}
    </div>
  )
}
