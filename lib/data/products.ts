export interface Product {
  id: string
  sku: string
  name: string
  description: string
  basePrice: number
  taxRate: number
  category: string
  subcategory: string
  brand: string
  images: string[]
  specs: Record<string, string>
  stock: "in_stock" | "low_stock" | "out_of_stock" | "contact"
  rating: number
  reviewCount: number
  sameDay: boolean
  tags: string[]
}
