import { productBrand, type Product } from '@/lib/products'

export type LaptopFilterState = {
  brands: string[]
  priceKey: string
  priceMin: number
  priceMax: number
  types: string[]
  rams: string[]
  cpus: string[]
  screens: string[]
  storages: string[]
  gpus: string[]
}

export const PRICE_MIN = 8_000_000
export const PRICE_MAX = 80_000_000

export const EMPTY_LAPTOP_FILTERS: LaptopFilterState = {
  brands: [],
  priceKey: '',
  priceMin: PRICE_MIN,
  priceMax: PRICE_MAX,
  types: [],
  rams: [],
  cpus: [],
  screens: [],
  storages: [],
  gpus: [],
}

export const LAPTOP_BRANDS = [
  { slug: 'asus', label: 'ASUS', src: '/brands/asus.png' },
  { slug: 'hp', label: 'HP', src: '/brands/hp.png' },
  { slug: 'dell', label: 'Dell', src: '/brands/dell.png' },
  { slug: 'macbook', label: 'MacBook', src: '/brands/macbook.png' },
  { slug: 'lenovo', label: 'Lenovo', src: '/brands/lenovo.png' },
  { slug: 'acer', label: 'Acer', src: '/brands/acer.png' },
  { slug: 'msi', label: 'MSI', src: '/brands/msi.png' },
  { slug: 'gigabyte', label: 'Gigabyte', src: '/brands/gigabyte.png' },
]

export const LAPTOP_EXTRAS = [
  { slug: 'ai', label: 'Laptop AI' },
  { slug: 'gaming', label: 'Laptop Gaming' },
]

export const PRICE_CHIPS = [
  { key: 'u10', label: 'Dưới 10 triệu', min: 0, max: 10_000_000 },
  { key: '10-15', label: 'Từ 10 - 15 triệu', min: 10_000_000, max: 15_000_000 },
  { key: '15-20', label: 'Từ 15 - 20 triệu', min: 15_000_000, max: 20_000_000 },
  { key: '20-25', label: 'Từ 20 - 25 triệu', min: 20_000_000, max: 25_000_000 },
  { key: '25-30', label: 'Từ 25 - 30 triệu', min: 25_000_000, max: 30_000_000 },
  { key: 'o30', label: 'Trên 30 triệu', min: 30_000_000, max: PRICE_MAX },
]

export const LAPTOP_TYPES = [
  { key: 'office', label: 'Laptop văn phòng' },
  { key: 'ai', label: 'Laptop AI' },
  { key: 'gaming', label: 'Laptop Gaming' },
  { key: 'macbook', label: 'MacBook' },
]

export const RAM_OPTIONS = ['8 GB', '16 GB', '24 GB', '32 GB']
export const CPU_OPTIONS = [
  { key: 'i5', label: 'Intel Core i5' },
  { key: 'i7', label: 'Intel Core i7' },
  { key: 'ultra', label: 'Intel Core Ultra' },
  { key: 'r5', label: 'AMD Ryzen 5' },
  { key: 'r7', label: 'AMD Ryzen 7' },
  { key: 'apple-m', label: 'Apple M' },
]
export const SCREEN_OPTIONS = ['13 inch', '14 inch', '15.6 inch', '16 inch']
export const STORAGE_OPTIONS = ['256 GB', '512 GB', '1 TB']
export const GPU_OPTIONS = [
  { key: 'onboard', label: 'Onboard / Intel Arc' },
  { key: '4050', label: 'RTX 4050' },
  { key: '4060', label: 'RTX 4060' },
  { key: '4070', label: 'RTX 4070' },
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

function laptopRam(product: Product) {
  const match = specValue(product, 'RAM / SSD').match(/^(\d+)\s*GB/i)
  return match ? `${match[1]} GB` : ''
}

function laptopStorage(product: Product) {
  const match = specValue(product, 'RAM / SSD').match(/\/\s*(\d+)\s*(GB|TB)/i)
  if (!match) return ''
  return `${match[1]} ${match[2].toUpperCase()}`
}

function laptopCpu(product: Product) {
  const value = `${specValue(product, 'CPU')} ${specValue(product, 'Chip')}`.toLowerCase()
  if (value.includes('ultra')) return 'ultra'
  if (value.includes('apple') || /\bm[1-4]\b/.test(value)) return 'apple-m'
  if (value.includes('ryzen 7')) return 'r7'
  if (value.includes('ryzen 5')) return 'r5'
  if (value.includes('i7')) return 'i7'
  if (value.includes('i5')) return 'i5'
  return ''
}

function laptopScreen(product: Product) {
  const match = specValue(product, 'Màn hình').match(/(\d+(?:\.\d+)?)\s*inch/i)
  if (!match) return ''
  const size = Number(match[1])
  if (size <= 13.6) return '13 inch'
  if (size <= 14.5) return '14 inch'
  if (size <= 15.6) return '15.6 inch'
  return '16 inch'
}

function laptopGpu(product: Product) {
  const value = specValue(product, 'GPU').toLowerCase()
  if (value.includes('4070')) return '4070'
  if (value.includes('4060')) return '4060'
  if (value.includes('4050')) return '4050'
  return 'onboard'
}

export function laptopTypes(product: Product) {
  const name = product.name.toLowerCase()
  const gpu = specValue(product, 'GPU').toLowerCase()
  const cpu = `${specValue(product, 'CPU')} ${specValue(product, 'Chip')}`.toLowerCase()
  const types: string[] = []
  if (productBrand(product) === 'macbook' || name.includes('macbook')) types.push('macbook')
  if (
    name.includes('rog') ||
    name.includes('legion') ||
    name.includes('victus') ||
    name.includes('thin') ||
    name.includes('nitro') ||
    name.includes('gaming') ||
    gpu.includes('rtx')
  ) {
    types.push('gaming')
  }
  if (cpu.includes('ultra') || cpu.includes('apple') || /\bm[1-4]\b/.test(cpu) || name.includes('ai') || name.includes('zenbook')) {
    types.push('ai')
  }
  if (types.length === 0) types.push('office')
  return types
}

export function applyLaptopFilters(products: Product[], filters: LaptopFilterState) {
  return products.filter((product) => {
    if (filters.brands.length > 0 && !filters.brands.includes(productBrand(product))) return false
    if (product.price < filters.priceMin || product.price > filters.priceMax) return false
    if (filters.types.length > 0 && !filters.types.some((item) => laptopTypes(product).includes(item))) return false
    if (filters.rams.length > 0 && !filters.rams.includes(laptopRam(product))) return false
    if (filters.storages.length > 0 && !filters.storages.includes(laptopStorage(product))) return false
    if (filters.cpus.length > 0 && !filters.cpus.includes(laptopCpu(product))) return false
    if (filters.screens.length > 0 && !filters.screens.includes(laptopScreen(product))) return false
    if (filters.gpus.length > 0 && !filters.gpus.includes(laptopGpu(product))) return false
    return true
  })
}
