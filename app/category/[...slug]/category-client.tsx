"use client"

import Link from "next/link"
import { ChevronRight, PackageSearch } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CategorySidebar } from "@/components/layout/category-sidebar"
import { ProductGrid } from "@/components/products/product-grid"
import type { Product } from "@/lib/data/products"
import type { Category } from "@/lib/data/categories"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useCart } from "@/lib/context/cart-context"

type CategoryInfo = {
  id: string
  name: string
  href: string
  parent: string | null
} | null

type CategoryClientProps = {
  products: Product[]
  currentCategoryId: string
  currentCategory: CategoryInfo
  categories: Category[]
}

export function CategoryClient({ products, currentCategoryId, currentCategory, categories }: CategoryClientProps) {
  const { toast } = useToast()
  const { addItem } = useCart()

  const handleAddToCart = (product: Product) => {
    addItem(product, 1)
    toast({
      title: "カートに追加しました",
      description: `${product.name} をカートに追加しました`,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              トップ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/categories" className="hover:text-foreground transition-colors">
              商品カテゴリ
            </Link>
            {currentCategory && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">{currentCategory.name}</span>
              </>
            )}
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            <div className="hidden lg:block">
              <CategorySidebar currentCategoryId={currentCategoryId} categories={categories} />
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {currentCategory ? currentCategory.name : "商品一覧"}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    カテゴリ内の商品を表示しています
                  </p>
                </div>
                <Link
                  href="/categories"
                  className="text-sm text-primary hover:underline"
                >
                  カテゴリ一覧に戻る
                </Link>
              </div>

              {products.length === 0 ? (
                <div className="border border-border rounded-lg bg-card p-8 flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <PackageSearch className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-foreground font-medium">商品が見つかりませんでした</p>
                  <p className="text-sm text-muted-foreground">
                    別のカテゴリをお試しください。
                  </p>
                </div>
              ) : (
                <ProductGrid products={products} onAddToCart={handleAddToCart} />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  )
}
