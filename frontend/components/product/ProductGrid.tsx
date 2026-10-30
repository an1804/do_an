import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/lib/products'

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="rounded-[16px] bg-white px-4 py-16 text-center font-header text-[14px] text-on-surface-variant">
        Không tìm thấy sản phẩm phù hợp.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
