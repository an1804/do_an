import Image from 'next/image'
import Link from 'next/link'
import { discountPercent, formatVnd, type Product } from '@/lib/products'

export default function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product)

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col rounded-md border-2 border-outline bg-surface-container-lowest p-3 hover:border-primary"
    >
      <div className="relative aspect-square overflow-hidden rounded-sm bg-surface-container-low">
        {discount > 0 ? (
          <span className="absolute left-2 top-2 z-10 rounded-sm bg-sale px-1.5 py-0.5 font-display text-xs font-semibold text-on-sale">
            -{discount}%
          </span>
        ) : null}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          unoptimized
        />
      </div>
      <h3 className="mt-3 line-clamp-2 min-h-12 font-display text-lg font-bold leading-6 text-on-surface">
        {product.name}
      </h3>
      <p className="mt-2 min-h-5 text-sm text-on-surface-variant line-through">
        {product.originalPrice ? formatVnd(product.originalPrice) : '\u00a0'}
      </p>
      <p className="font-display text-lg font-bold text-sale">{formatVnd(product.price)}</p>
      <span className="mt-3 inline-flex h-11 items-center justify-center rounded-md bg-sale font-display text-sm font-semibold text-on-sale group-hover:opacity-90">
        Mua ngay
      </span>
    </Link>
  )
}
