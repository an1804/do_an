import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BuyButton from '@/components/product/BuyButton'
import ShopShell from '@/components/site/ShopShell'
import {
  PRODUCTS,
  categoryLabel,
  discountPercent,
  formatVnd,
  getProductBySlug,
} from '@/lib/products'

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }))
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const discount = discountPercent(product)

  return (
    <ShopShell activeCategory={product.category}>
      <main className="mx-auto grid w-full max-w-[1200px] gap-8 px-4 py-6 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-md border border-outline bg-surface-container-low">
          {discount > 0 ? (
            <span className="absolute left-3 top-3 z-10 rounded-sm bg-sale px-2 py-1 font-display text-xs font-semibold text-on-sale">
              -{discount}%
            </span>
          ) : null}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            unoptimized
          />
        </div>

        <div>
          <Link
            href={`/products?category=${product.category}`}
            className="text-sm font-medium text-on-surface-variant hover:text-on-surface"
          >
            {categoryLabel(product.category)}
          </Link>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-on-surface">{product.name}</h1>
          {product.originalPrice ? (
            <p className="mt-4 text-sm text-on-surface-variant line-through">{formatVnd(product.originalPrice)}</p>
          ) : null}
          <p className="font-display text-3xl font-bold text-sale">{formatVnd(product.price)}</p>
          <p className="mt-4 text-on-surface-variant">{product.shortDescription}</p>

          <dl className="mt-6 divide-y divide-outline overflow-hidden rounded-md border border-outline bg-surface-container-lowest">
            {product.specs.map((spec) => (
              <div key={spec.label} className="grid grid-cols-2 gap-4 px-4 py-3 text-sm">
                <dt className="text-on-surface-variant">{spec.label}</dt>
                <dd className="font-medium text-on-surface">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 max-w-sm">
            <BuyButton />
          </div>
        </div>
      </main>
    </ShopShell>
  )
}
