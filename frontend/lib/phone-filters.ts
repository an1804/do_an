import { productBrand, type Product } from '@/lib/products'

export type PhoneFilterState = {
  brands: string[]
  priceKey: string
  priceMin: number
  priceMax: number
  types: string[]
  rams: string[]
  resolutions: string[]
  refresh: string[]
  storages: string[]
  charging: string[]
}

export const PRICE_MIN = 400_000
export const PRICE_MAX = 104_000_000

export const EMPTY_PHONE_FILTERS: PhoneFilterState = {
  brands: [],
  priceKey: '',
  priceMin: PRICE_MIN,
  priceMax: PRICE_MAX,
  types: [],
  rams: [],
  resolutions: [],
  refresh: [],
  storages: [],
  charging: [],
}

export const PHONE_BRANDS = [
  { slug: 'apple', label: 'iPhone', src: '/brands/iphone.png' },
  { slug: 'samsung', label: 'Samsung', src: '/brands/samsung.png' },
  { slug: 'xiaomi', label: 'Xiaomi', src: '/brands/xiaomi.png' },
  { slug: 'oppo', label: 'OPPO', src: '/brands/oppo.png' },
  { slug: 'vivo', label: 'vivo', src: '/brands/vivo.png' },
  { slug: 'realme', label: 'realme', src: '/brands/realme.png' },
  { slug: 'nokia', label: 'Nokia', src: '/brands/nokia.png' },
]

export const PRICE_CHIPS = [
  { key: 'u2', label: 'Dưới 2 triệu', min: 0, max: 2_000_000 },
  { key: '2-4', label: 'Từ 2 - 4 triệu', min: 2_000_000, max: 4_000_000 },
  { key: '4-7', label: 'Từ 4 - 7 triệu', min: 4_000_000, max: 7_000_000 },
  { key: '7-13', label: 'Từ 7 - 13 triệu', min: 7_000_000, max: 13_000_000 },
  { key: '13-20', label: 'Từ 13 - 20 triệu', min: 13_000_000, max: 20_000_000 },
  { key: 'o20', label: 'Trên 20 triệu', min: 20_000_000, max: PRICE_MAX },
]

export const PHONE_TYPES = [
  { key: 'android', label: 'Android' },
  { key: 'ios', label: 'iPhone (iOS)' },
  { key: 'ai', label: 'Điện thoại AI' },
  { key: 'fold', label: 'Điện thoại gập' },
  { key: 'feature', label: 'Điện thoại phổ thông' },
]

export const RAM_OPTIONS = ['3 GB', '4 GB', '6 GB', '8 GB', '12 GB', '16 GB']
export const RESOLUTION_OPTIONS = ['QQVGA', 'QVGA', 'HD+', 'Full HD+', '1.5K', '1.5K+', '2K+', 'QXGA+', 'Retina (iPhone)']
export const REFRESH_OPTIONS = ['60 Hz', '90 Hz', '120 Hz', '144 Hz', '165 Hz', '185 Hz']
export const STORAGE_OPTIONS = ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB']
export const CHARGING_OPTIONS = [
  { key: 'fast', label: 'Sạc nhanh (từ 20W)' },
  { key: 'super', label: 'Sạc siêu nhanh (từ 60W)' },
  { key: 'wireless', label: 'Sạc không dây' },
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

function phoneRam(product: Product) {
  const match = specValue(product, 'RAM / ROM').match(/^(\d+)\s*GB/i)
  return match ? `${match[1]} GB` : ''
}

function phoneStorage(product: Product) {
  const match = specValue(product, 'RAM / ROM').match(/\/\s*(\d+)\s*(GB|TB)/i)
  if (!match) return ''
  return `${match[1]} ${match[2].toUpperCase()}`
}

function phoneRefresh(product: Product) {
  const match = specValue(product, 'Màn hình').match(/(\d+)\s*Hz/i)
  return match ? `${match[1]} Hz` : ''
}

function phoneType(product: Product) {
  const brand = productBrand(product)
  if (brand === 'apple') return 'ios'
  if (brand === 'nokia') return 'feature'
  return 'android'
}

function phoneCharge(product: Product) {
  const watt = Number((specValue(product, 'Sạc').match(/(\d+)\s*W/i) || [])[1] || 0)
  if (watt >= 60) return 'super'
  if (watt >= 20) return 'fast'
  return ''
}

function phoneResolution(product: Product) {
  if (productBrand(product) === 'apple') return 'Retina (iPhone)'
  const screen = specValue(product, 'Màn hình').toLowerCase()
  if (screen.includes('2k')) return '2K+'
  if (screen.includes('1.5')) return '1.5K'
  return 'Full HD+'
}

export function applyPhoneFilters(products: Product[], filters: PhoneFilterState) {
  return products.filter((product) => {
    if (filters.brands.length > 0 && !filters.brands.includes(productBrand(product))) return false
    if (product.price < filters.priceMin || product.price > filters.priceMax) return false
    if (filters.types.length > 0 && !filters.types.includes(phoneType(product))) return false
    if (filters.rams.length > 0 && !filters.rams.includes(phoneRam(product))) return false
    if (filters.storages.length > 0 && !filters.storages.includes(phoneStorage(product))) return false
    if (filters.refresh.length > 0 && !filters.refresh.includes(phoneRefresh(product))) return false
    if (filters.charging.length > 0 && !filters.charging.includes(phoneCharge(product))) return false
    if (filters.resolutions.length > 0 && !filters.resolutions.includes(phoneResolution(product))) return false
    return true
  })
}
