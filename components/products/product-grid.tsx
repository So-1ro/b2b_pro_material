"use client"

import { ProductCard } from "./product-card"
import type { Product } from "@/lib/data/products"

interface ProductGridProps {
  products: Product[]
  onAddToCart?: (product: Product) => void
  emptyMessage?: string
}

export function ProductGrid({ products, onAddToCart, emptyMessage = "商品が見つかりませんでした" }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}
