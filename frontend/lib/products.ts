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

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    slug: 'iphone-16-pro-256gb',
    name: 'iPhone 16 Pro 256GB',
    category: 'phone',
    price: 31_990_000,
    originalPrice: 34_990_000,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Titan, camera 48MP, chip A18 Pro. Phù hợp người dùng cần máy mạnh và chụp ảnh đẹp.',
    specs: [
      { label: 'Màn hình', value: '6.3 inch Super Retina XDR' },
      { label: 'Chip', value: 'A18 Pro' },
      { label: 'RAM / ROM', value: '8GB / 256GB' },
      { label: 'Pin', value: 'Sạc nhanh USB-C' },
    ],
  },
  {
    id: 'p2',
    slug: 'samsung-galaxy-s25-ultra',
    name: 'Samsung Galaxy S25 Ultra 256GB',
    category: 'phone',
    price: 29_490_000,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Màn lớn, bút S Pen, zoom xa. Dành cho người làm việc và quay video.',
    specs: [
      { label: 'Màn hình', value: '6.9 inch Dynamic AMOLED 2X' },
      { label: 'Chip', value: 'Snapdragon 8 Elite' },
      { label: 'RAM / ROM', value: '12GB / 256GB' },
      { label: 'Camera', value: '200MP' },
    ],
  },
  {
    id: 'p3',
    slug: 'xiaomi-15',
    name: 'Xiaomi 15 256GB',
    category: 'phone',
    price: 18_990_000,
    originalPrice: 21_990_000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Flagship gọn, giá dễ chịu hơn. Camera Leica, sạc nhanh.',
    specs: [
      { label: 'Màn hình', value: '6.36 inch AMOLED 120Hz' },
      { label: 'Chip', value: 'Snapdragon 8 Elite' },
      { label: 'RAM / ROM', value: '12GB / 256GB' },
      { label: 'Sạc', value: '90W' },
    ],
  },
  {
    id: 'p4',
    slug: 'macbook-air-m3-13',
    name: 'MacBook Air M3 13 inch 16GB/256GB',
    category: 'laptop',
    price: 27_990_000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Mỏng nhẹ, pin lâu, yên tĩnh. Học tập và văn phòng.',
    specs: [
      { label: 'Chip', value: 'Apple M3' },
      { label: 'RAM / SSD', value: '16GB / 256GB' },
      { label: 'Màn hình', value: '13.6 inch Liquid Retina' },
      { label: 'Khối lượng', value: '1.24 kg' },
    ],
  },
  {
    id: 'p5',
    slug: 'asus-vivobook-15',
    name: 'ASUS Vivobook 15 OLED i5 16GB/512GB',
    category: 'laptop',
    price: 16_490_000,
    originalPrice: 18_990_000,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Màn OLED đẹp, cấu hình đủ dùng học và làm việc.',
    specs: [
      { label: 'CPU', value: 'Intel Core i5' },
      { label: 'RAM / SSD', value: '16GB / 512GB' },
      { label: 'Màn hình', value: '15.6 inch OLED' },
      { label: 'Hệ điều hành', value: 'Windows 11' },
    ],
  },
  {
    id: 'p6',
    slug: 'dell-xps-14',
    name: 'Dell XPS 14 Ultra 7 16GB/1TB',
    category: 'laptop',
    price: 42_990_000,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Laptop cao cấp, màn sắc nét, làm đồ họa và code.',
    specs: [
      { label: 'CPU', value: 'Intel Core Ultra 7' },
      { label: 'RAM / SSD', value: '16GB / 1TB' },
      { label: 'Màn hình', value: '14.5 inch OLED' },
      { label: 'Khối lượng', value: '1.68 kg' },
    ],
  },
  {
    id: 'p7',
    slug: 'airpods-pro-2',
    name: 'AirPods Pro 2 USB-C',
    category: 'accessory',
    price: 5_990_000,
    originalPrice: 6_490_000,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Chống ồn chủ động, xuyên âm, sạc USB-C.',
    specs: [
      { label: 'Kết nối', value: 'Bluetooth / USB-C' },
      { label: 'Chống ồn', value: 'ANC + Adaptive Audio' },
      { label: 'Pin', value: 'Đến 6 giờ (tai nghe)' },
      { label: 'Tương thích', value: 'iPhone, iPad, Mac' },
    ],
  },
  {
    id: 'p8',
    slug: 'sony-wh-1000xm5',
    name: 'Sony WH-1000XM5',
    category: 'accessory',
    price: 7_490_000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Over-ear chống ồn hàng đầu, đeo lâu không mỏi.',
    specs: [
      { label: 'Kiểu', value: 'Over-ear không dây' },
      { label: 'Chống ồn', value: 'ANC' },
      { label: 'Pin', value: 'Đến 30 giờ' },
      { label: 'Cổng', value: 'USB-C, jack 3.5mm' },
    ],
  },
  {
    id: 'p9',
    slug: 'galaxy-buds3-pro',
    name: 'Samsung Galaxy Buds3 Pro',
    category: 'accessory',
    price: 4_490_000,
    originalPrice: 4_990_000,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Tai true wireless cho Galaxy, chống ồn tốt.',
    specs: [
      { label: 'Kết nối', value: 'Bluetooth 5.4' },
      { label: 'Chống ồn', value: 'ANC' },
      { label: 'Pin', value: 'Đến 7 giờ (tai nghe)' },
      { label: 'Chuẩn kháng', value: 'IP57' },
    ],
  },
  {
    id: 'p10',
    slug: 'op-lung-iphone-16-pro',
    name: 'Ốp lưng silicon iPhone 16 Pro',
    category: 'accessory',
    price: 390_000,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Ốp ôm máy, chống bám vân tay, có gờ bảo vệ camera.',
    specs: [
      { label: 'Tương thích', value: 'iPhone 16 Pro' },
      { label: 'Chất liệu', value: 'Silicon' },
      { label: 'Màu', value: 'Đen' },
      { label: 'Bảo vệ', value: 'Gờ camera, cạnh viền' },
    ],
  },
  {
    id: 'p11',
    slug: 'cu-sac-45w',
    name: 'Củ sạc nhanh 45W USB-C',
    category: 'accessory',
    price: 590_000,
    originalPrice: 790_000,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Sạc điện thoại và laptop mỏng. Cổng USB-C.',
    specs: [
      { label: 'Công suất', value: '45W' },
      { label: 'Cổng', value: 'USB-C' },
      { label: 'Chuẩn', value: 'PD 3.0' },
      { label: 'Tương thích', value: 'Điện thoại, tablet, laptop mỏng' },
    ],
  },
  {
    id: 'p12',
    slug: 'logitech-mx-master-3s',
    name: 'Chuột Logitech MX Master 3S',
    category: 'accessory',
    price: 2_290_000,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Chuột văn phòng cao cấp, lăn siêu nhanh, dùng đa máy.',
    specs: [
      { label: 'Kết nối', value: 'Bluetooth / Logi Bolt' },
      { label: 'Cảm biến', value: '8000 DPI' },
      { label: 'Pin', value: 'Sạc USB-C, dùng nhiều tuần' },
      { label: 'Hệ điều hành', value: 'Windows, macOS' },
    ],
  },
  {
    id: 'p13',
    slug: 'apple-watch-series-10',
    name: 'Apple Watch Series 10 46mm GPS',
    category: 'smartwatch',
    price: 10_990_000,
    originalPrice: 11_990_000,
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Màn lớn hơn, đo sức khỏe, pin cả ngày.',
    specs: [
      { label: 'Màn hình', value: '46mm Retina LTPO3' },
      { label: 'Kết nối', value: 'GPS, Bluetooth' },
      { label: 'Kháng nước', value: '50m' },
      { label: 'Pin', value: 'Đến 18 giờ' },
    ],
  },
  {
    id: 'p14',
    slug: 'ipad-air-m2-11',
    name: 'iPad Air M2 11 inch 128GB WiFi',
    category: 'tablet',
    price: 16_990_000,
    originalPrice: 17_990_000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Chip M2, hỗ trợ Apple Pencil. Học tập và giải trí.',
    specs: [
      { label: 'Chip', value: 'Apple M2' },
      { label: 'Màn hình', value: '11 inch Liquid Retina' },
      { label: 'Lưu trữ', value: '128GB' },
      { label: 'Kết nối', value: 'WiFi, USB-C' },
    ],
  },
  {
    id: 'p15',
    slug: 'samsung-odyssey-g5-27',
    name: 'Màn hình Samsung Odyssey G5 27 inch 165Hz',
    category: 'monitor',
    price: 5_490_000,
    originalPrice: 6_490_000,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Cong 1000R, 165Hz. Chơi game và làm việc.',
    specs: [
      { label: 'Kích thước', value: '27 inch' },
      { label: 'Tấm nền', value: 'VA, 2560x1440' },
      { label: 'Tần số quét', value: '165Hz' },
      { label: 'Cổng', value: 'HDMI, DisplayPort' },
    ],
  },
  {
    id: 'p16',
    slug: 'samsung-crystal-uhd-55',
    name: 'Smart TV Samsung Crystal UHD 55 inch',
    category: 'tv',
    price: 9_990_000,
    originalPrice: 12_990_000,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
    shortDescription: '4K, Tizen, remote một lần nhấn. Xem phim và YouTube.',
    specs: [
      { label: 'Kích thước', value: '55 inch' },
      { label: 'Độ phân giải', value: '4K UHD' },
      { label: 'Hệ điều hành', value: 'Tizen' },
      { label: 'Cổng', value: 'HDMI, USB, WiFi' },
    ],
  },
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

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug)
}

export function filterProducts(query?: string, category?: string) {
  const normalizedQuery = query?.trim().toLowerCase() ?? ''
  const normalizedCategory = category?.trim() as ProductCategory | undefined

  return PRODUCTS.filter((product) => {
    const matchCategory = !normalizedCategory || product.category === normalizedCategory
    const matchQuery =
      !normalizedQuery ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      categoryLabel(product.category).toLowerCase().includes(normalizedQuery)
    return matchCategory && matchQuery
  })
}

export function featuredProducts() {
  return PRODUCTS.filter((product) => Boolean(product.originalPrice)).concat(
    PRODUCTS.filter((product) => !product.originalPrice).slice(0, 2),
  )
}

export function saleProducts() {
  return PRODUCTS.filter((product) => Boolean(product.originalPrice))
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
