import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/lib/products'

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="rounded-md border border-outline bg-surface-container-lowest px-4 py-10 text-center text-on-surface-variant">
        Không tìm thấy sản phẩm phù hợp.
      </p>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
