import { productBrand, type Product } from '@/lib/products'

export type MonitorFilterState = {
  brands: string[]
  priceKey: string
  priceMin: number
  priceMax: number
  types: string[]
  screens: string[]
  resolutions: string[]
  refresh: string[]
  panels: string[]
}

export const PRICE_MIN = 1_500_000
export const PRICE_MAX = 25_000_000

export const EMPTY_MONITOR_FILTERS: MonitorFilterState = {
  brands: [],
  priceKey: '',
  priceMin: PRICE_MIN,
  priceMax: PRICE_MAX,
  types: [],
  screens: [],
  resolutions: [],
  refresh: [],
  panels: [],
}

export const MONITOR_BRANDS = [
  { slug: 'samsung', label: 'Samsung', src: '/brands/samsung.png' },
  { slug: 'msi', label: 'MSI', src: '/brands/msi.png' },
  { slug: 'asus', label: 'ASUS', src: '/brands/asus.png' },
  { slug: 'dell', label: 'Dell', src: '/brands/dell.png' },
  { slug: 'xiaomi', label: 'Xiaomi', src: '/brands/xiaomi.png' },
]

export const MONITOR_SIZES = [{ slug: '27', label: '27 inch' }]

export const MONITOR_EXTRAS = [
  { slug: 'gaming', label: 'Gaming' },
  { slug: 'office', label: 'Văn phòng' },
  { slug: '2k', label: '2K' },
  { slug: 'design', label: 'Đồ họa' },
]

export const PRICE_CHIPS = [
  { key: 'u3', label: 'Dưới 3 triệu', min: 0, max: 3_000_000 },
  { key: '3-5', label: 'Từ 3 - 5 triệu', min: 3_000_000, max: 5_000_000 },
  { key: '5-8', label: 'Từ 5 - 8 triệu', min: 5_000_000, max: 8_000_000 },
  { key: '8-12', label: 'Từ 8 - 12 triệu', min: 8_000_000, max: 12_000_000 },
  { key: 'o12', label: 'Trên 12 triệu', min: 12_000_000, max: PRICE_MAX },
]

export const MONITOR_TYPES = [
  { key: 'gaming', label: 'Gaming' },
  { key: 'office', label: 'Văn phòng' },
  { key: 'design', label: 'Đồ họa' },
]

export const SCREEN_OPTIONS = ['24 inch', '27 inch', '32 inch']
export const RESOLUTION_OPTIONS = [
  { key: 'fhd', label: 'Full HD' },
  { key: '2k', label: '2K' },
  { key: '4k', label: '4K' },
]
export const REFRESH_OPTIONS = ['60 Hz', '75 Hz', '100 Hz', '144 Hz', '160 Hz', '165 Hz', '180 Hz']
export const PANEL_OPTIONS = ['IPS', 'VA', 'OLED']

export function formatFilterPrice(amount: number) {
  return `${new Intl.NumberFormat('vi-VN').format(amount)}đ`
}

export function toggleFilterValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

function specValue(product: Product, label: string) {
  return product.specs.find((item) => item.label === label)?.value ?? ''
}

function monitorScreen(product: Product) {
  const match = specValue(product, 'Kích thước').match(/(\d+(?:\.\d+)?)\s*inch/i)
  if (!match) return ''
  const size = Number(match[1])
  if (size <= 24.5) return '24 inch'
  if (size <= 28) return '27 inch'
  return '32 inch'
}

function monitorRefresh(product: Product) {
  const match = specValue(product, 'Tần số quét').match(/(\d+)\s*Hz/i)
  return match ? `${match[1]} Hz` : ''
}

function monitorPanel(product: Product) {
  const value = specValue(product, 'Tấm nền').toUpperCase()
  if (value.includes('OLED')) return 'OLED'
  if (value.includes('VA')) return 'VA'
  if (value.includes('IPS')) return 'IPS'
  return ''
}

function monitorResolution(product: Product) {
  const value = `${specValue(product, 'Tấm nền')} ${product.name}`.toLowerCase()
  if (value.includes('3840') || value.includes('4k') || value.includes('uhd')) return '4k'
  if (value.includes('2560') || value.includes('2k') || value.includes('qhd')) return '2k'
  return 'fhd'
}

export function monitorTypes(product: Product) {
  const name = product.name.toLowerCase()
  const hz = Number((specValue(product, 'Tần số quét').match(/(\d+)/) || [])[1] || 0)
  const types: string[] = []
  if (
    name.includes('odyssey') ||
    name.includes('tuf') ||
    name.includes('mag') ||
    name.includes('gaming') ||
    hz >= 144
  ) {
    types.push('gaming')
  }
  if (name.includes('proart') || name.includes('viewfinity') || name.includes('đồ họa') || monitorResolution(product) === '4k') {
    types.push('design')
  }
  if (name.includes('essential') || name.includes('modern') || name.includes('va27') || hz <= 100) {
    types.push('office')
  }
  if (types.length === 0) types.push('office')
  return types
}

export function applyMonitorFilters(products: Product[], filters: MonitorFilterState) {
  return products.filter((product) => {
    if (filters.brands.length > 0 && !filters.brands.includes(productBrand(product))) return false
    if (product.price < filters.priceMin || product.price > filters.priceMax) return false
    if (filters.types.length > 0 && !filters.types.some((item) => monitorTypes(product).includes(item))) return false
    if (filters.screens.length > 0 && !filters.screens.includes(monitorScreen(product))) return false
    if (filters.resolutions.length > 0 && !filters.resolutions.includes(monitorResolution(product))) return false
    if (filters.refresh.length > 0 && !filters.refresh.includes(monitorRefresh(product))) return false
    if (filters.panels.length > 0 && !filters.panels.includes(monitorPanel(product))) return false
    return true
  })
}
