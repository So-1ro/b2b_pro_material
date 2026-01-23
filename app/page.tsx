"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AnnouncementBanner } from "@/components/home/announcement-banner"
import { HeroCarousel } from "@/components/home/hero-carousel"
import { CategoryGrid } from "@/components/home/category-grid"
import { ProductCarousel } from "@/components/home/product-carousel"
import { products, type Product } from "@/lib/data/products"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function HomePage() {
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([])
  const { toast } = useToast()

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id)
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
    toast({
      title: "カートに追加しました",
      description: `${product.name} をカートに追加しました`,
    })
  }

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Popular products (first 6)
  const popularProducts = products.slice(0, 6)
  
  // Best sellers (static pick to avoid SSR/client mismatch)
  const bestSellers = products.slice(6, 12).length > 0 ? products.slice(6, 12) : products.slice(0, 6)
  
  // Same day shipping products
  const sameDayProducts = products.filter((p) => p.sameDay).slice(0, 6)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header cartItemCount={cartItemCount} />
      <AnnouncementBanner />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Hero Carousel */}
          <section className="mb-8">
            <HeroCarousel />
          </section>

          {/* Categories */}
          <section className="mb-10">
            <CategoryGrid />
          </section>

          {/* Popular Products */}
          <section className="mb-10">
            <ProductCarousel
              title="よく購入されている人気商品"
              products={popularProducts}
              onAddToCart={handleAddToCart}
            />
          </section>

          {/* Same Day Shipping */}
          <section className="mb-10">
            <ProductCarousel
              title="当日出荷商品"
              products={sameDayProducts}
              onAddToCart={handleAddToCart}
            />
          </section>

          {/* Best Sellers */}
          <section className="mb-10">
            <ProductCarousel
              title="売れ筋商品"
              products={bestSellers}
              onAddToCart={handleAddToCart}
            />
          </section>

          {/* Features */}
          <section className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-bold text-lg mb-2 text-foreground">拠点単位の発注管理</h3>
                <p className="text-sm text-muted-foreground">
                  店舗・事業所ごとにIDを発行。拠点別の発注・配送・請求管理が可能です。
                </p>
              </div>
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-bold text-lg mb-2 text-foreground">帳票ダウンロード</h3>
                <p className="text-sm text-muted-foreground">
                  発注書・納品書・請求書をPDFでダウンロード。経理処理がスムーズに。
                </p>
              </div>
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-bold text-lg mb-2 text-foreground">企業専用価格</h3>
                <p className="text-sm text-muted-foreground">
                  御社専用の特別価格を設定可能。取引条件に合わせた価格でご購入いただけます。
                </p>
              </div>
            </div>
          </section>

          {/* CTA Banner */}
          <section className="mb-10">
            <div className="bg-primary rounded-xl p-8 text-primary-foreground text-center">
              <h2 className="text-2xl font-bold mb-3">今すぐ無料で法人登録</h2>
              <p className="mb-6 text-primary-foreground/90">
                法人登録で企業専用価格をご利用いただけます
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center rounded-lg bg-card text-primary font-medium px-8 py-3 hover:bg-card/90 transition-colors"
                >
                  カンタン新規会員登録
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-primary-foreground/30 font-medium px-8 py-3 hover:bg-primary-foreground/10 transition-colors"
                >
                  お問い合わせ
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  )
}
