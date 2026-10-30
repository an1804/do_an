import DualPromoBanner from '@/components/home/DualPromoBanner'
import LaptopCatalog from '@/components/product/LaptopCatalog'
import MonitorCatalog from '@/components/product/MonitorCatalog'
import PausedNotice from '@/components/product/PausedNotice'
import PhoneCatalog from '@/components/product/PhoneCatalog'
import ProductGrid from '@/components/product/ProductGrid'
import TabletCatalog from '@/components/product/TabletCatalog'
import ShopShell from '@/components/site/ShopShell'
import { fetchProducts } from '@/lib/catalog'
import { CATEGORIES, filterProducts, sortProducts } from '@/lib/products'

export const dynamic = 'force-dynamic'

type ProductsPageProps = {
  searchParams: Promise<{ q?: string; category?: string; brand?: string; sort?: string; type?: string; size?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const query = params.q?.trim() ?? ''
  const category = params.category?.trim() ?? ''
  const brand = params.brand?.trim() ?? ''
  const sort = params.sort?.trim() ?? ''
  const type = params.type?.trim() ?? ''
  const size = params.size?.trim() ?? ''
  const catalog = category === 'phone' || category === 'laptop' || category === 'tablet' || category === 'monitor'
  const loaded = await fetchProducts({ category: category || undefined, q: query || undefined })
  const filtered = catalog ? loaded : filterProducts(loaded, undefined, undefined, brand)
  const products = sortProducts(filtered, sort)
  const categoryName = CATEGORIES.find((item) => item.slug === category)?.label
  const catalogTitle =
    category === 'phone' ? 'Điện thoại' : category === 'laptop' ? 'Laptop' : category === 'tablet' ? 'Tablet' : 'Màn hình'

  return (
    <ShopShell activeCategory={category || 'all'}>
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col pb-5 pt-3">
        <DualPromoBanner />
        {category === 'tv' ? (
          <PausedNotice title="TV" />
        ) : catalog ? (
          <div className="mt-5 flex w-full flex-col gap-4 rounded-lg bg-white p-4">
            <h1 className="w-fit font-header text-[24px] font-bold leading-9 text-[#252A31]">{catalogTitle}</h1>
            {category === 'phone' ? (
              <PhoneCatalog products={filtered} brand={brand} sort={sort} />
            ) : category === 'laptop' ? (
              <LaptopCatalog products={filtered} brand={brand} type={type} sort={sort} />
            ) : category === 'tablet' ? (
              <TabletCatalog products={filtered} brand={brand} sort={sort} />
            ) : (
              <MonitorCatalog products={filtered} brand={brand} type={type} size={size} sort={sort} />
            )}
          </div>
        ) : (
          <>
            <div className="py-5">
              <h1 className="w-fit font-header text-[24px] font-bold leading-9 text-[#252A31]">
                {categoryName || (query ? `Kết quả cho “${query}”` : 'Sản phẩm')}
              </h1>
              <p className="mt-1 font-header text-[14px] text-on-surface-variant">
                {products.length} sản phẩm
                {query ? ` · từ khóa “${query}”` : ''}
              </p>
            </div>
            <ProductGrid products={products} />
          </>
        )}
      </main>
    </ShopShell>
  )
}
