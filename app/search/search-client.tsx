"use client"

import Link from "next/link"
import { ChevronRight, PackageSearch } from "lucide-react"
import { ProductGrid } from "@/components/products/product-grid"
import type { Product } from "@/lib/data/products"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useCart } from "@/lib/context/cart-context"

type SearchClientProps = {
  products: Product[]
  query: string
  category?: string
}

export function SearchClient({ products, query, category }: SearchClientProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (product: Product) => {
    addItem(product, 1)
    toast({
      title: "カートに追加しました",
      description: `${product.name} をカートに追加しました`,
    })
  }

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            トップ
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">検索結果</span>
        </nav>

        <div className="mb-4">
          <h1 className="text-2xl font-bold text-foreground">検索結果</h1>
          <p className="text-sm text-muted-foreground mt-1">
            キーワード: {query || "未指定"} / カテゴリ: {category || "すべて"} / {products.length}件
          </p>
        </div>

        {products.length === 0 ? (
          <div className="border border-border rounded-lg bg-card p-8 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <PackageSearch className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium">商品が見つかりませんでした</p>
            <p className="text-sm text-muted-foreground">条件を変更して再検索してください。</p>
          </div>
        ) : (
          <ProductGrid products={products} onAddToCart={handleAddToCart} />
        )}
      </div>
      <Toaster />
    </main>
  )
}
