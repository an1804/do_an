import type { Product } from '@/lib/products'

function catalogBaseUrl() {
  if (typeof window === 'undefined') {
    return process.env.BACKEND_API_URL || 'http://localhost:8081'
  }
  return process.env.NEXT_PUBLIC_API_URL || ''
}

export async function fetchProducts(params?: { category?: string; q?: string }): Promise<Product[]> {
  const search = new URLSearchParams()
  if (params?.category) search.set('category', params.category)
  if (params?.q) search.set('q', params.q)
  const suffix = search.toString() ? `?${search}` : ''
  try {
    const response = await fetch(`${catalogBaseUrl()}/api/products${suffix}`, { cache: 'no-store' })
    if (!response.ok) return []
    return (await response.json()) as Product[]
  } catch {
    return []
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const response = await fetch(`${catalogBaseUrl()}/api/products/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    })
    if (!response.ok) return undefined
    return (await response.json()) as Product
  } catch {
    return undefined
  }
}
