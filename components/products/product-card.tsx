"use client"

import Link from "next/link"
import { Star, Truck, ShoppingCart, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/data/products"

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  className?: string
}

export function ProductCard({ product, onAddToCart, className }: ProductCardProps) {
  const priceWithTax = Math.floor(product.basePrice * (1 + product.taxRate))
  const primaryImage = product.images?.[0]

  const stockStatus = {
    in_stock: { label: "在庫あり", color: "text-green-600" },
    low_stock: { label: "残りわずか", color: "text-amber-600" },
    out_of_stock: { label: "在庫切れ", color: "text-destructive" },
    contact: { label: "要問合せ", color: "text-muted-foreground" },
  }

  const status = stockStatus[product.stock]

  return (
    <Card className={cn("group overflow-hidden transition-shadow hover:shadow-md", className)}>
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square relative bg-muted overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
          {product.sameDay && (
            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
              <Truck className="h-3 w-3 mr-1" />
              当日出荷
            </Badge>
          )}
          {product.tags.length > 0 && (
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {product.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="mb-2">
          <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
        
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        <div className="mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-accent">
              ¥{product.basePrice.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">〜</span>
          </div>
          <p className="text-xs text-muted-foreground">
            ¥{priceWithTax.toLocaleString()}（税込）
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className={cn("text-xs font-medium", status.color)}>
            {status.label}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.preventDefault()
              onAddToCart?.(product)
            }}
            disabled={product.stock === "out_of_stock"}
            className="h-8 px-3 bg-transparent"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            カートに追加
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
