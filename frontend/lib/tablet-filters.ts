import { productBrand, type Product } from '@/lib/products'

export type TabletFilterState = {
  brands: string[]
  priceKey: string
  priceMin: number
  priceMax: number
  types: string[]
  rams: string[]
  screens: string[]
  storages: string[]
  networks: string[]
}

export const PRICE_MIN = 1_990_000
export const PRICE_MAX = 45_000_000

export const EMPTY_TABLET_FILTERS: TabletFilterState = {
  brands: [],
  priceKey: '',
  priceMin: PRICE_MIN,
  priceMax: PRICE_MAX,
  types: [],
  rams: [],
  screens: [],
  storages: [],
  networks: [],
}

export const TABLET_BRANDS = [
  { slug: 'samsung', label: 'Samsung', src: '/brands/samsung.png' },
  { slug: 'ipad', label: 'iPad', src: '/brands/ipad.png' },
  { slug: 'xiaomi', label: 'Xiaomi', src: '/brands/xiaomi.png' },
  { slug: 'oppo', label: 'OPPO', src: '/brands/oppo.png' },
  { slug: 'motorola', label: 'Motorola', src: '/brands/motorola.png' },
  { slug: 'lenovo', label: 'Lenovo', src: '/brands/lenovo.png' },
  { slug: 'honor', label: 'HONOR', src: '/brands/honor.png' },
]

export const PRICE_CHIPS = [
  { key: 'u5', label: 'Dưới 5 triệu', min: 0, max: 5_000_000 },
  { key: '5-8', label: 'Từ 5 - 8 triệu', min: 5_000_000, max: 8_000_000 },
  { key: '8-12', label: 'Từ 8 - 12 triệu', min: 8_000_000, max: 12_000_000 },
  { key: '12-18', label: 'Từ 12 - 18 triệu', min: 12_000_000, max: 18_000_000 },
  { key: '18-25', label: 'Từ 18 - 25 triệu', min: 18_000_000, max: 25_000_000 },
  { key: 'o25', label: 'Trên 25 triệu', min: 25_000_000, max: PRICE_MAX },
]

export const TABLET_TYPES = [
  { key: 'ipad', label: 'iPad' },
  { key: 'android', label: 'Android' },
  { key: 'study', label: 'Máy tính bảng học tập' },
]

export const RAM_OPTIONS = ['4 GB', '6 GB', '8 GB', '12 GB', '16 GB']
export const SCREEN_OPTIONS = ['8.7 inch', '11 inch', '12.4 inch', '14.6 inch']
export const STORAGE_OPTIONS = ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB']
export const NETWORK_OPTIONS = [
  { key: 'wifi', label: 'WiFi' },
  { key: '5g', label: '5G' },
]

export function formatFilterPrice(amount: number) {
  return `${new Intl.NumberFormat('vi-VN').format(amount)}đ`
}

export function toggleFilterValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

function specValue(product: Product, label: string) {
  return product.specs.find((item) => item.label === label)?.value ?? ''
}

function tabletRam(product: Product) {
  const match = specValue(product, 'RAM / ROM').match(/^(\d+)\s*GB/i)
  return match ? `${match[1]} GB` : ''
}

function tabletStorage(product: Product) {
  const rom = specValue(product, 'RAM / ROM').match(/\/\s*(\d+)\s*(GB|TB)/i)
  if (rom) return `${rom[1]} ${rom[2].toUpperCase()}`
  const stored = specValue(product, 'Lưu trữ').match(/(\d+)\s*(GB|TB)/i)
  return stored ? `${stored[1]} ${stored[2].toUpperCase()}` : ''
}

function tabletScreen(product: Product) {
  const match = specValue(product, 'Màn hình').match(/(\d+(?:\.\d+)?)\s*inch/i)
  if (!match) return ''
  const size = Number(match[1])
  if (size <= 9) return '8.7 inch'
  if (size <= 11.2) return '11 inch'
  if (size <= 13) return '12.4 inch'
  return '14.6 inch'
}

function tabletType(product: Product) {
  if (productBrand(product) === 'ipad') return 'ipad'
  const name = product.name.toLowerCase()
  if (name.includes('học') || name.includes('kid') || name.includes('tab a')) return 'study'
  return 'android'
}

function tabletNetwork(product: Product) {
  const value = `${specValue(product, 'Kết nối')} ${product.name}`.toLowerCase()
  if (value.includes('5g')) return '5g'
  return 'wifi'
}

export function applyTabletFilters(products: Product[], filters: TabletFilterState) {
  return products.filter((product) => {
    if (filters.brands.length > 0 && !filters.brands.includes(productBrand(product))) return false
    if (product.price < filters.priceMin || product.price > filters.priceMax) return false
    if (filters.types.length > 0 && !filters.types.includes(tabletType(product))) return false
    if (filters.rams.length > 0 && !filters.rams.includes(tabletRam(product))) return false
    if (filters.storages.length > 0 && !filters.storages.includes(tabletStorage(product))) return false
    if (filters.screens.length > 0 && !filters.screens.includes(tabletScreen(product))) return false
    if (filters.networks.length > 0 && !filters.networks.includes(tabletNetwork(product))) return false
    return true
  })
}
