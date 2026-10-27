import Link from 'next/link'
import { CATEGORIES } from '@/lib/products'

export default function CategoryStrip({ active }: { active?: string | null }) {
  const highlightAll = active === 'all'
  const highlightSlug = active && active !== 'all' ? active : null

  return (
    <div className="border-b border-outline bg-surface-container-lowest">
      <nav className="mx-auto flex max-w-[1200px] gap-1 overflow-x-auto px-4 py-2 text-sm font-display font-semibold">
        <Link
          href="/products"
          className={`shrink-0 rounded-md px-3 py-2 ${highlightAll ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface'}`}
        >
          Tất cả
        </Link>
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${category.slug}`}
            className={`shrink-0 rounded-md px-3 py-2 ${
              highlightSlug === category.slug ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface'
            }`}
          >
            {category.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
