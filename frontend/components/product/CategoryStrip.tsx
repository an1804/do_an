import Image from 'next/image'
import Link from 'next/link'
import { CATEGORIES, type ProductCategory } from '@/lib/products'

const ICONS: Record<ProductCategory, string> = {
  phone: '/icons/phone.png',
  laptop: '/icons/laptop.png',
  accessory: '/icons/accessory.png',
  smartwatch: '/icons/smartwatch.png',
  tablet: '/icons/tablet.png',
  monitor: '/icons/monitor.png',
  tv: '/icons/tv.png',
}

export default function CategoryStrip({ active }: { active?: string | null }) {
  const highlightSlug = active && active !== 'all' ? active : null

  return (
    <nav className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-2 overflow-x-auto px-4 pb-2.5 font-header text-[14px] font-medium [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {CATEGORIES.map((category) => {
        const isActive = highlightSlug === category.slug
        return (
          <Link
            key={category.slug}
            href={`/products?category=${category.slug}`}
            className={`flex shrink-0 items-center rounded-md px-2.5 py-1.5 ${
              isActive ? 'bg-black/20' : 'hover:opacity-70'
            }`}
          >
            <Image
              src={ICONS[category.slug]}
              alt=""
              width={24}
              height={24}
              className="h-5 w-5 object-contain"
              unoptimized
            />
            <span className="overflow-hidden text-nowrap pl-2">{category.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
