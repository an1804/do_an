import fs from 'node:fs'

const text = fs.readFileSync(new URL('../frontend/lib/products.ts', import.meta.url), 'utf8')
const start = text.indexOf('export const PRODUCTS: Product[] =')
const arrStart = text.indexOf('[', start)
const end = text.indexOf('export function formatVnd', arrStart)
let src = text.slice(arrStart, end).trim()
let next = src.replace(/(\d)_(\d)/g, '$1$2')
while (next !== src) {
  src = next
  next = src.replace(/(\d)_(\d)/g, '$1$2')
}
const products = Function(`"use strict"; return (${src})`)()
const dest = new URL('../backend/src/main/resources/catalog-seed.json', import.meta.url)
fs.writeFileSync(dest, `${JSON.stringify(products, null, 2)}\n`)
console.log(`${products.length} products -> ${dest.pathname}`)
