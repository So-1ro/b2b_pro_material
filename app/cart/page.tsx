"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ChevronRight, 
  Trash2, 
  Minus, 
  Plus, 
  Package, 
  ShoppingBag,
  ArrowRight,
  Truck
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useCart } from "@/lib/context/cart-context"

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, itemCount, subtotal, tax } = useCart()
  const [imageErrorIds, setImageErrorIds] = useState<Record<string, boolean>>({})
  const { toast } = useToast()
  const handleRemoveItem = (productId: string) => {
    removeItem(productId)
    toast({
      title: "商品を削除しました",
      description: "カートから商品を削除しました",
    })
  }
  
  const total = subtotal + tax
  const shippingFee = subtotal >= 5000 ? 0 : 550
  const grandTotal = total + shippingFee

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header cartItemCount={0} />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-foreground">カートは空です</h1>
            <p className="text-muted-foreground mb-8">
              商品をカートに追加してください
            </p>
            <Link href="/">
              <Button size="lg">商品を探す</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header cartItemCount={itemCount} />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              トップ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">カート</span>
          </nav>

          <h1 className="text-2xl font-bold mb-6 text-foreground">
            カート ({itemCount}点)
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const itemTotal = item.product.basePrice * item.quantity
                const itemTotalWithTax = Math.floor(itemTotal * (1 + item.product.taxRate))
                
                return (
                  <div
                    key={item.product.id}
                    className="bg-card rounded-lg border border-border p-4"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden relative">
                        {item.product.images?.[0] && !imageErrorIds[item.product.id] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="absolute inset-0 h-full w-full object-cover"
                            loading="lazy"
                            onError={() =>
                              setImageErrorIds((prev) => ({ ...prev, [item.product.id]: true }))
                            }
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Package className="h-10 w-10 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {item.product.brand}
                            </p>
                            <Link 
                              href={`/product/${item.product.id}`}
                              className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-xs text-muted-foreground mt-1">
                              SKU: {item.product.sku}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive flex-shrink-0 bg-transparent"
                            onClick={() => handleRemoveItem(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">削除</span>
                          </Button>
                        </div>

                        <div className="flex items-end justify-between mt-4">
                          {/* Quantity */}
                          <div className="flex items-center border border-border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none rounded-l-lg bg-transparent"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                              className="w-12 h-8 text-center text-sm border-0 rounded-none focus-visible:ring-0"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none rounded-r-lg bg-transparent"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              ¥{item.product.basePrice.toLocaleString()} × {item.quantity}
                            </p>
                            <p className="text-lg font-bold text-accent">
                              ¥{itemTotal.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              (税込 ¥{itemTotalWithTax.toLocaleString()})
                            </p>
                          </div>
                        </div>

                        {item.product.sameDay && (
                          <Badge className="mt-3 bg-accent/10 text-accent hover:bg-accent/20">
                            <Truck className="h-3 w-3 mr-1" />
                            当日出荷対応
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <h2 className="text-lg font-bold mb-4 text-foreground">注文内容</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">小計 ({itemCount}点)</span>
                    <span className="text-foreground">¥{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">消費税</span>
                    <span className="text-foreground">¥{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">送料</span>
                    <span className="text-foreground">
                      {shippingFee === 0 ? (
                        <span className="text-green-600">無料</span>
                      ) : (
                        `¥${shippingFee.toLocaleString()}`
                      )}
                    </span>
                  </div>
                </div>

                {shippingFee > 0 && (
                  <div className="bg-secondary rounded-lg p-3 mb-4">
                    <p className="text-sm text-foreground">
                      あと<span className="font-bold text-primary">¥{(5000 - subtotal).toLocaleString()}</span>で送料無料！
                    </p>
                  </div>
                )}

                <Separator className="my-4" />

                <div className="flex justify-between mb-6">
                  <span className="font-bold text-foreground">合計（税込）</span>
                  <span className="text-2xl font-bold text-accent">
                    ¥{grandTotal.toLocaleString()}
                  </span>
                </div>

                <Link href="/checkout" className="block">
                  <Button className="w-full" size="lg">
                    レジに進む
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/" className="block mt-3">
                  <Button variant="outline" className="w-full bg-transparent">
                    買い物を続ける
                  </Button>
                </Link>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  ご注文確定前に配送先・お支払い方法を選択いただけます
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  )
}
