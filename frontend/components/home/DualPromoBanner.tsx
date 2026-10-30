'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type TransitionEvent } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/product/CategoryIcons'

const BANNERS = [
  { title: 'Tháng 10 Deal đúng ý cổ say meee', href: '/products', image: '/banners/dual-deal.jpg' },
  { title: 'moto g37 5G giảm đến 600K', href: '/products?category=phone', image: '/banners/dual-moto.png' },
  { title: 'OPPO Find X10 Series', href: '/products?category=phone', image: '/banners/dual-oppo.png' },
  { title: 'Nâng cấp lên iPhone Duo', href: '/products?category=phone', image: '/banners/dual-iphone-duo.png' },
  { title: 'iPhone 18 Pro', href: '/products?category=phone', image: '/banners/dual-iphone-18.png' },
  { title: 'Tựu trường Deal thơmmm', href: '/products?category=laptop', image: '/banners/dual-student.png' },
]

const PAIRS = [
  [BANNERS[0], BANNERS[1]],
  [BANNERS[2], BANNERS[3]],
  [BANNERS[4], BANNERS[5]],
] as const

const SLIDES = [PAIRS[PAIRS.length - 1], ...PAIRS, PAIRS[0]]

export default function DualPromoBanner() {
  const [index, setIndex] = useState(1)
  const [animate, setAnimate] = useState(true)
  const animatingRef = useRef(false)
  const indexRef = useRef(1)

  const go = (direction: number) => {
    if (animatingRef.current) return
    animatingRef.current = true
    setAnimate(true)
    setIndex((current) => {
      const next = current + direction
      indexRef.current = next
      return next
    })
  }

  useEffect(() => {
    const timer = window.setInterval(() => go(1), 4000)
    return () => window.clearInterval(timer)
  }, [])

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return

    const lastClone = SLIDES.length - 1
    if (indexRef.current === lastClone || indexRef.current === 0) {
      const realIndex = indexRef.current === 0 ? PAIRS.length : 1
      setAnimate(false)
      indexRef.current = realIndex
      setIndex(realIndex)
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setAnimate(true)
          animatingRef.current = false
        })
      })
      return
    }

    animatingRef.current = false
  }

  return (
    <section className="relative mt-5 w-full">
      <div className="overflow-hidden">
        <div
          className={`flex w-full will-change-transform ${
            animate ? 'transition-transform duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)]' : ''
          }`}
          style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {SLIDES.map((pair, slideIndex) => (
            <div key={slideIndex} className="flex w-full min-w-full shrink-0 gap-3">
              {pair.map((banner) => (
                <div key={banner.image} className="relative min-w-0 flex-1 overflow-hidden rounded-[12px]">
                  <Link href={banner.href} className="relative block aspect-[3/1] w-full" aria-label={banner.title}>
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1200px) 594px, 50vw"
                      unoptimized
                    />
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        aria-label="Banner trước"
        onClick={() => go(-1)}
        className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#252A31] shadow-card"
      >
        <ChevronLeftIcon />
      </button>
      <button
        type="button"
        aria-label="Banner sau"
        onClick={() => go(1)}
        className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#252A31] shadow-card"
      >
        <ChevronRightIcon />
      </button>
    </section>
  )
}
