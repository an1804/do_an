export type ProductCategory = 'phone' | 'laptop' | 'accessory' | 'smartwatch' | 'tablet' | 'monitor' | 'tv'

export type Product = {
  id: string
  slug: string
  name: string
  category: ProductCategory
  price: number
  originalPrice?: number
  image: string
  shortDescription: string
  specs: { label: string; value: string }[]
}

export const CATEGORIES: { slug: ProductCategory; label: string }[] = [
  { slug: 'phone', label: 'Điện thoại' },
  { slug: 'laptop', label: 'Laptop' },
  { slug: 'accessory', label: 'Phụ kiện' },
  { slug: 'smartwatch', label: 'Smartwatch' },
  { slug: 'tablet', label: 'Tablet' },
  { slug: 'monitor', label: 'Màn hình' },
  { slug: 'tv', label: 'TV' },
]

export function formatVnd(amount: number) {
  return `${new Intl.NumberFormat('vi-VN').format(amount)}₫`
}

export function discountPercent(product: Product) {
  if (!product.originalPrice || product.originalPrice <= product.price) return 0
  return Math.round((1 - product.price / product.originalPrice) * 100)
}

export function categoryLabel(slug: ProductCategory) {
  return CATEGORIES.find((item) => item.slug === slug)?.label ?? slug
}

export function getProductBySlug(products: Product[], slug: string) {
  return products.find((product) => product.slug === slug)
}

export function productBrand(product: Product) {
  const name = product.name.toLowerCase()
  if (product.category === 'monitor') {
    if (name.includes('samsung') || name.includes('odyssey') || name.includes('viewfinity')) return 'samsung'
    if (name.includes('msi')) return 'msi'
    if (name.includes('asus') || name.includes('tuf') || name.includes('proart')) return 'asus'
    if (name.includes('dell')) return 'dell'
    if (name.includes('xiaomi')) return 'xiaomi'
    return 'other'
  }
  if (product.category === 'tablet') {
    if (name.includes('ipad') || name.includes('apple')) return 'ipad'
    if (name.includes('samsung') || name.includes('galaxy')) return 'samsung'
    if (name.includes('xiaomi') || name.includes('redmi')) return 'xiaomi'
    if (name.includes('oppo')) return 'oppo'
    if (name.includes('motorola') || name.includes('moto')) return 'motorola'
    if (name.includes('lenovo')) return 'lenovo'
    if (name.includes('honor')) return 'honor'
    return 'other'
  }
  if (product.category === 'laptop') {
    if (name.includes('macbook') || name.includes('apple')) return 'macbook'
    if (name.includes('asus') || name.includes('vivobook') || name.includes('zenbook') || name.includes('rog')) return 'asus'
    if (name.includes('hp') || name.includes('pavilion') || name.includes('victus')) return 'hp'
    if (name.includes('dell') || name.includes('xps') || name.includes('inspiron')) return 'dell'
    if (name.includes('lenovo') || name.includes('ideapad') || name.includes('legion')) return 'lenovo'
    if (name.includes('acer') || name.includes('aspire') || name.includes('nitro')) return 'acer'
    if (name.includes('msi')) return 'msi'
    if (name.includes('gigabyte')) return 'gigabyte'
    return 'other'
  }
  if (name.includes('iphone') || name.includes('apple')) return 'apple'
  if (name.includes('samsung') || name.includes('galaxy')) return 'samsung'
  if (name.includes('xiaomi')) return 'xiaomi'
  if (name.includes('oppo')) return 'oppo'
  if (name.includes('vivo')) return 'vivo'
  if (name.includes('realme')) return 'realme'
  if (name.includes('nokia')) return 'nokia'
  return 'other'
}

export function filterProducts(products: Product[], query?: string, category?: string, brand?: string) {
  const normalizedQuery = query?.trim().toLowerCase() ?? ''
  const normalizedCategory = category?.trim() as ProductCategory | undefined
  const normalizedBrand = brand?.trim().toLowerCase() ?? ''

  return products.filter((product) => {
    const matchCategory = !normalizedCategory || product.category === normalizedCategory
    const matchQuery =
      !normalizedQuery ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      categoryLabel(product.category).toLowerCase().includes(normalizedQuery)
    const matchBrand = !normalizedBrand || productBrand(product) === normalizedBrand
    return matchCategory && matchQuery && matchBrand
  })
}

export function sortProducts(products: Product[], sort: string) {
  const list = [...products]
  if (sort === 'new') {
    return list.sort((a, b) => Number(b.id.replace(/\D/g, '')) - Number(a.id.replace(/\D/g, '')))
  }
  if (sort === 'sold') {
    return list.sort((a, b) => promoMeta(b).sold - promoMeta(a).sold)
  }
  if (sort === 'discount') {
    return list.sort((a, b) => discountPercent(b) - discountPercent(a))
  }
  if (sort === 'price' || sort === 'price-asc') {
    return list.sort((a, b) => a.price - b.price)
  }
  if (sort === 'price-desc') {
    return list.sort((a, b) => b.price - a.price)
  }
  return list
}

export function featuredProducts(products: Product[]) {
  return products.filter((product) => Boolean(product.originalPrice)).concat(
    products.filter((product) => !product.originalPrice).slice(0, 2),
  )
}

export function saleProducts(products: Product[]) {
  return products.filter((product) => Boolean(product.originalPrice))
}

export function listingMeta(product: Product) {
  if (product.category === 'monitor') {
    const size = product.specs.find((item) => item.label === 'Kích thước')?.value ?? ''
    const panel = (product.specs.find((item) => item.label === 'Tấm nền')?.value ?? '').split(',')[0].trim()
    const hz = product.specs.find((item) => item.label === 'Tần số quét')?.value ?? ''
    const specChips = [panel, hz, size.replace(/inch/i, '"').replace(/\s+"/,'"')].filter(Boolean)
    return {
      specChips,
      storages: [],
      defaultStorage: '',
      colors: { samsung: ['#1C1C1C', '#C5A46E', '#4B7BBE'], msi: ['#C8102E', '#1A1A1A', '#C0C0C0'], asus: ['#1A1A1A', '#00A3E0', '#C0C0C0'], dell: ['#007DB8', '#1A1A1A', '#C0C0C0'], xiaomi: ['#1A1A1A', '#2F6FED', '#C0C0C0'] }[
        productBrand(product)
      ] ?? ['#1A1A1A', '#C0C0C0', '#4A90D9'],
    }
  }

  const screen = product.specs.find((item) => item.label === 'Màn hình')?.value ?? ''
  const screenMatch = screen.match(/^(\d+(?:\.\d+)?)\s*inch\s+(.+)$/i)
  const specChips = screenMatch ? [screenMatch[2], `${screenMatch[1]}"`] : []

  const romSpec =
    product.specs.find((item) => item.label === 'RAM / ROM')?.value ??
    product.specs.find((item) => item.label === 'RAM / SSD')?.value ??
    ''
  const romMatch = romSpec.match(/\/\s*(\d+)\s*(GB|TB)/i)
  const selected = romMatch ? `${romMatch[1]} ${romMatch[2].toUpperCase()}` : ''
  const brand = productBrand(product)
  const pool =
    product.category === 'laptop'
      ? ['256 GB', '512 GB', '1 TB']
      : product.category === 'tablet'
        ? brand === 'ipad'
          ? ['128 GB', '256 GB', '512 GB', '1 TB']
          : ['128 GB', '256 GB', '512 GB']
        : brand === 'apple'
          ? ['128 GB', '256 GB', '512 GB', '1 TB']
          : ['128 GB', '256 GB', '512 GB']
  const labels = selected && !pool.includes(selected) ? [selected, ...pool] : pool
  const storages = labels.slice(0, 4).map((label) => ({ label, active: label === selected }))

  const palettes: Record<string, string[]> = {
    apple: ['#6B1C2A', '#B8C9D4', '#2C2C2C', '#D9D4CE'],
    samsung: ['#1C1C1C', '#C5A46E', '#4B7BBE', '#E8E4DC'],
    xiaomi: ['#1A1A1A', '#2F6FED', '#C0C0C0', '#E6E6E6'],
    oppo: ['#F5F5F0', '#1A1A1A', '#5B8DEF', '#C4A574'],
    vivo: ['#E8B4B8', '#2D2D2D', '#9BB7D4', '#F2F2F2'],
    realme: ['#FFCC00', '#1A1A1A', '#3D7EAA', '#E8E8E8'],
    nokia: ['#124191', '#1A1A1A', '#C0C0C0'],
    asus: ['#1A1A1A', '#00A3E0', '#C0C0C0', '#E8E8E8'],
    hp: ['#0096D6', '#1A1A1A', '#C0C0C0', '#F2F2F2'],
    dell: ['#007DB8', '#1A1A1A', '#C0C0C0'],
    macbook: ['#2C2C2C', '#B8C9D4', '#D9D4CE', '#6B1C2A'],
    lenovo: ['#E2231A', '#1A1A1A', '#C0C0C0'],
    acer: ['#83B81A', '#1A1A1A', '#C0C0C0'],
    msi: ['#C8102E', '#1A1A1A', '#C0C0C0'],
    gigabyte: ['#E31E24', '#1A1A1A', '#C0C0C0'],
    ipad: ['#2C2C2C', '#B8C9D4', '#D9D4CE', '#6B1C2A'],
    motorola: ['#5C5C5C', '#1A1A1A', '#C0C0C0'],
    honor: ['#111111', '#C0C0C0', '#4A90D9'],
  }

  return {
    specChips,
    storages,
    defaultStorage: selected,
    colors: palettes[productBrand(product)] ?? ['#1A1A1A', '#C0C0C0', '#4A90D9'],
  }
}

const STORAGE_PRICE: Record<string, number> = {
  '128 GB': 0,
  '256 GB': 3_000_000,
  '512 GB': 7_000_000,
  '1 TB': 15_000_000,
  '2 TB': 23_000_000,
}

export function listingPrice(product: Product, storage: string) {
  const base = listingMeta(product).defaultStorage
  const delta = (STORAGE_PRICE[storage] ?? 0) - (STORAGE_PRICE[base] ?? 0)
  return Math.max(product.price + delta, 990_000)
}

export function listingName(product: Product, storage: string) {
  const compact = storage.replace(' ', '')
  if (/(\d+\s*GB|\d+\s*TB)/i.test(product.name)) {
    return product.name.replace(/(\d+\s*GB|\d+\s*TB)(?!.*\d+\s*(GB|TB))/i, compact)
  }
  return `${product.name} ${compact}`
}

export function promoMeta(product: Product) {
  const n = Number(product.id.replace(/\D/g, '')) || 1
  const rating = Math.round((4.6 + ((n * 7) % 5) / 10) * 10) / 10
  const sold = 80 + n * 137
  const quotaTotal = [5, 10, 3][n % 3]
  const quotaUsed = Math.min(quotaTotal, 1 + (n % quotaTotal))
  return { rating, sold, quotaUsed, quotaTotal }
}

export function formatSold(count: number) {
  if (count >= 1000) {
    const compact = (count / 1000).toFixed(1).replace(/\.0$/, '').replace('.', ',')
    return `Đã bán ${compact}k`
  }
  return `Đã bán ${count}`
}
