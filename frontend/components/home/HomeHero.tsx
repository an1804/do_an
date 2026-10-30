'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const SLIDES = [
  {
    title: 'OPPO Find X10 Series',
    href: '/products?category=phone',
    image: '/banners/hero-oppo.png',
  },
  {
    title: 'Galaxy Z Fold8 Ultra Fold8 Flip8',
    href: '/products?category=phone',
    image: '/banners/hero-galaxy.png',
  },
  {
    title: 'Tháng 10 Deal đúng ý cổ say meee',
    href: '/products',
    image: '/banners/hero-deal.jpg',
  },
]

export default function HomeHero() {
  const [index, setIndex] = useState(0)
  const slide = SLIDES[index]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length)
    }, 4000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="relative w-full overflow-hidden rounded-[8px] bg-surface-container-low">
      <Link
        key={slide.image}
        href={slide.href}
        className="relative block aspect-[5/1] w-full"
        aria-label={slide.title}
      >
        <Image
          src={slide.image}
          alt={slide.title}
          width={1800}
          height={360}
          className="h-full w-full rounded-[8px] object-contain"
          unoptimized
          priority
        />
      </Link>
    </section>
  )
}
