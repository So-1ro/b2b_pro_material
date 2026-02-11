"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ChevronRight, 
  Star, 
  Truck, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Package,
  Minus,
  Plus,
  Check,
  AlertCircle
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { Product } from "@/lib/data/products"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/context/cart-context"

type ProductClientProps = {
  product: Product
  relatedProducts: Product[]
  breadcrumbCategory: {
    id: string
    name: string
    href: string
  }
}

export function ProductClient({ product, relatedProducts, breadcrumbCategory }: ProductClientProps) {
  const { toast } = useToast()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const primaryImage = product.images?.[0]

  const priceWithTax = Math.floor(product.basePrice * (1 + product.taxRate))
  const totalPrice = product.basePrice * quantity
  const totalPriceWithTax = Math.floor(totalPrice * (1 + product.taxRate))

  const stockStatus = {
    in_stock: { label: "在庫あり", color: "text-green-600", icon: Check },
    low_stock: { label: "残りわずか", color: "text-amber-600", icon: AlertCircle },
    out_of_stock: { label: "在庫切れ", color: "text-destructive", icon: AlertCircle },
    contact: { label: "要問合せ", color: "text-muted-foreground", icon: AlertCircle },
  }
  const status = stockStatus[product.stock]
  const StatusIcon = status.icon

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast({
      title: "カートに追加しました",
      description: `${product.name} × ${quantity}点 をカートに追加しました`,
    })
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast({
      title: isFavorite ? "お気に入りから削除しました" : "お気に入りに追加しました",
      description: product.name,
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
            <Link href={breadcrumbCategory.href} className="hover:text-foreground transition-colors">
              {breadcrumbCategory.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground truncate">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                {primaryImage ? (
                  <img
                    src={primaryImage}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="h-32 w-32 text-muted-foreground/30" />
                  </div>
                )}
                {product.sameDay && (
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                    <Truck className="h-3 w-3 mr-1" />
                    当日出荷
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <div className="mb-4">
                <Badge variant="outline" className="mb-2">
                  {product.brand}
                </Badge>
                <h1 className="text-2xl font-bold text-foreground mb-2">{product.name}</h1>
                <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount}件のレビュー)
                </span>
              </div>

              <div className="bg-secondary rounded-lg p-4 mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-accent">
                    ¥{product.basePrice.toLocaleString()}
                  </span>
                  <span className="text-lg text-muted-foreground">〜</span>
                  <span className="text-sm text-muted-foreground">(税別)</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  ¥{priceWithTax.toLocaleString()}〜（税込）
                </p>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <StatusIcon className={cn("h-4 w-4", status.color)} />
                <span className={cn("text-sm font-medium", status.color)}>
                  {status.label}
                </span>
                {product.sameDay && product.stock === "in_stock" && (
                  <span className="text-sm text-muted-foreground">
                    | 平日17時までのご注文で当日出荷
                  </span>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  数量
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none rounded-l-lg bg-transparent"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 h-10 text-center border-0 rounded-none focus-visible:ring-0"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none rounded-r-lg bg-transparent"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    小計: <span className="font-bold text-foreground">¥{totalPrice.toLocaleString()}</span>
                    <span className="ml-1">(税込 ¥{totalPriceWithTax.toLocaleString()})</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
                  disabled={product.stock === "out_of_stock"}
                >
                  <ShoppingCart className="h-5 w-5" />
                  カートに入れる
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={cn(
                    "gap-2 bg-transparent",
                    isFavorite && "text-red-500 border-red-200 hover:text-red-600"
                  )}
                  onClick={handleFavorite}
                >
                  <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
                  お気に入り
                </Button>
                <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                  <Share2 className="h-5 w-5" />
                  <span className="sr-only sm:not-sr-only">共有</span>
                </Button>
              </div>

              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Tabs defaultValue="description" className="mb-12">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="description" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                商品説明
              </TabsTrigger>
              <TabsTrigger 
                value="specs" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                仕様・スペック
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                レビュー ({product.reviewCount})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-6">
              <div className="prose max-w-none">
                <p className="text-foreground leading-relaxed">{product.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="specs" className="pt-6">
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value], index) => (
                      <tr 
                        key={key}
                        className={cn(
                          "border-b border-border last:border-0",
                          index % 2 === 0 ? "bg-muted/50" : "bg-card"
                        )}
                      >
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-1/3">
                          {key}
                        </th>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <p>レビュー機能は現在準備中です</p>
              </div>
            </TabsContent>
          </Tabs>

          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-6 text-foreground">関連商品</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((p) => (
                  <Link key={p.id} href={`/product/${p.id}`}>
                    <div className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden relative">
                        {p.images?.[0] ? (
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="absolute inset-0 h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Package className="h-12 w-12 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2">
                        {p.name}
                      </h3>
                      <p className="text-lg font-bold text-accent">
                        ¥{p.basePrice.toLocaleString()}〜
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  )
}
