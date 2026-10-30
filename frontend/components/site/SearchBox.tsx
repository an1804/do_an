'use client'

import { useEffect, useState } from 'react'
import { SearchIcon } from '@/components/product/CategoryIcons'

const PLACEHOLDERS = ['iPhone 16 Pro', 'Laptop học tập', 'Apple Watch', 'Smart TV 55 inch']

export default function SearchBox() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % PLACEHOLDERS.length)
    }, 2800)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <form className="min-w-0 flex-1" action="/products">
      <label className="sr-only" htmlFor="site-search">
        Tìm sản phẩm
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-on-surface-variant">
          <SearchIcon />
        </span>
        <input
          id="site-search"
          name="q"
          type="search"
          placeholder={PLACEHOLDERS[index]}
          className="h-10 w-full rounded-full border-0 bg-white py-2 pl-10 pr-4 font-header text-[14px] text-[#111827] outline-none placeholder:text-on-surface-variant"
        />
      </div>
    </form>
  )
}