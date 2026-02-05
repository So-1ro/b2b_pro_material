"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  ChevronRight, 
  MapPin, 
  CreditCard, 
  FileText,
  Check,
  Building2,
  Package
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { products, type Product } from "@/lib/data/products"
import { cn } from "@/lib/utils"

interface CartItem {
  product: Product
  quantity: number
}

// Mock data
const mockCartItems: CartItem[] = [
  { product: products[0], quantity: 5 },
  { product: products[1], quantity: 2 },
]

const mockBranch = {
  name: "東京本社",
  zipCode: "100-0001",
  prefecture: "東京都",
  city: "千代田区",
  address1: "丸の内1-1-1",
  address2: "○○ビル5F",
  phone: "03-1234-5678",
}

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("invoice")
  const [deliveryNotes, setDeliveryNotes] = useState("")

  const cartItems = mockCartItems
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.basePrice * item.quantity,
    0
  )
  
  const tax = cartItems.reduce(
    (sum, item) => sum + Math.floor(item.product.basePrice * item.product.taxRate) * item.quantity,
    0
  )
  
  const total = subtotal + tax
  const shippingFee = subtotal >= 5000 ? 0 : 550
  const grandTotal = total + shippingFee

  const handleSubmitOrder = async () => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    toast({
      title: "ご注文ありがとうございます",
      description: "注文を受け付けました。確認メールをお送りしました。",
    })
    
    router.push("/checkout/complete")
  }

  const steps = [
    { id: 1, name: "配送先確認", icon: MapPin },
    { id: 2, name: "お支払い方法", icon: CreditCard },
    { id: 3, name: "注文確認", icon: FileText },
  ]

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
            <Link href="/cart" className="hover:text-foreground transition-colors">
              カート
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">ご注文手続き</span>
          </nav>

          {/* Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((s, index) => {
              const Icon = s.icon
              const isActive = step === s.id
              const isCompleted = step > s.id
              
              return (
                <div key={s.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs mt-2",
                        isActive || isCompleted
                          ? "text-primary font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {s.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-16 md:w-24 h-0.5 mx-4",
                        step > s.id ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Delivery Address */}
              {step === 1 && (
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    配送先
                  </h2>
                  
                  <div className="bg-secondary rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">{mockBranch.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          〒{mockBranch.zipCode}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {mockBranch.prefecture}{mockBranch.city}{mockBranch.address1}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {mockBranch.address2}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          TEL: {mockBranch.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="notes">配送に関するご要望（任意）</Label>
                      <Textarea
                        id="notes"
                        placeholder="例：午前中希望、○○様宛など"
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button onClick={() => setStep(2)}>
                      お支払い方法へ進む
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    お支払い方法
                  </h2>
                  
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      <label
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                          paymentMethod === "invoice"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted"
                        )}
                      >
                        <RadioGroupItem value="invoice" id="invoice" />
                        <div>
                          <p className="font-medium text-foreground">請求書払い（月末締め翌月払い）</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            月末締めで請求書を発行し、翌月末日までにお支払いいただきます。
                          </p>
                        </div>
                      </label>
                      
                      <label
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                          paymentMethod === "bank"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted"
                        )}
                      >
                        <RadioGroupItem value="bank" id="bank" />
                        <div>
                          <p className="font-medium text-foreground">銀行振込（前払い）</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            ご注文後に振込先をご案内いたします。入金確認後の出荷となります。
                          </p>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setStep(1)} className="bg-transparent">
                      戻る
                    </Button>
                    <Button onClick={() => setStep(3)}>
                      注文内容の確認へ
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Order Confirmation */}
              {step === 3 && (
                <div className="space-y-6">
                  {/* Delivery Info */}
                  <div className="bg-card rounded-lg border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        配送先
                      </h2>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setStep(1)}
                        className="text-primary bg-transparent"
                      >
                        変更
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">{mockBranch.name}</p>
                      <p>〒{mockBranch.zipCode} {mockBranch.prefecture}{mockBranch.city}{mockBranch.address1} {mockBranch.address2}</p>
                      {deliveryNotes && <p className="mt-2">備考: {deliveryNotes}</p>}
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-card rounded-lg border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        お支払い方法
                      </h2>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setStep(2)}
                        className="text-primary bg-transparent"
                      >
                        変更
                      </Button>
                    </div>
                    <p className="text-sm text-foreground">
                      {paymentMethod === "invoice" ? "請求書払い（月末締め翌月払い）" : "銀行振込（前払い）"}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h2 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      ご注文商品
                    </h2>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.product.id} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                          <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden relative flex-shrink-0">
                            {item.product.images?.[0] ? (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="absolute inset-0 h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Package className="h-8 w-8 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ¥{item.product.basePrice.toLocaleString()} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-bold text-foreground">
                            ¥{(item.product.basePrice * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)} className="bg-transparent">
                      戻る
                    </Button>
                    <Button 
                      onClick={handleSubmitOrder} 
                      disabled={isSubmitting}
                      size="lg"
                    >
                      {isSubmitting ? "処理中..." : "注文を確定する"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <h2 className="text-lg font-bold mb-4 text-foreground">注文内容</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">商品小計 ({itemCount}点)</span>
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

                <Separator className="my-4" />

                <div className="flex justify-between">
                  <span className="font-bold text-foreground">合計（税込）</span>
                  <span className="text-2xl font-bold text-accent">
                    ¥{grandTotal.toLocaleString()}
                  </span>
                </div>
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
