import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  AccessoryIcon,
  LaptopIcon,
  MonitorIcon,
  PhoneIcon,
  TabletIcon,
  TvIcon,
  WatchIcon,
} from '@/components/product/CategoryIcons'
import { CATEGORIES, type ProductCategory } from '@/lib/products'

const ICONS: Record<ProductCategory, ReactNode> = {
  phone: <PhoneIcon />,
  laptop: <LaptopIcon />,
  accessory: <AccessoryIcon />,
  smartwatch: <WatchIcon />,
  tablet: <TabletIcon />,
  monitor: <MonitorIcon />,
  tv: <TvIcon />,
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
            className={`flex shrink-0 items-center rounded-md py-1.5 ${
              isActive ? 'bg-secondary px-2.5 text-on-secondary' : 'hover:opacity-70'
            }`}
          >
            {ICONS[category.slug]}
            <span className="overflow-hidden text-nowrap pl-2">{category.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}