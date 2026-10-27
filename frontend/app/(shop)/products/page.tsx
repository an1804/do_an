import ProductGrid from '@/components/product/ProductGrid'
import ShopShell from '@/components/site/ShopShell'
import { CATEGORIES, filterProducts } from '@/lib/products'

type ProductsPageProps = {
  searchParams: Promise<{ q?: string; category?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const query = params.q?.trim() ?? ''
  const category = params.category?.trim() ?? ''
  const products = filterProducts(query, category)
  const categoryName = CATEGORIES.find((item) => item.slug === category)?.label

  return (
    <ShopShell activeCategory={category || 'all'}>
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 py-6">
        <h1 className="font-display text-2xl font-extrabold text-on-surface">
          {categoryName || (query ? `Kết quả cho “${query}”` : 'Sản phẩm')}
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          {products.length} sản phẩm
          {query ? ` · từ khóa “${query}”` : ''}
          {' · dữ liệu mẫu, chưa nối API'}
        </p>
        <div className="mt-6">
          <ProductGrid products={products} />
        </div>
      </main>
    </ShopShell>
  )
}
