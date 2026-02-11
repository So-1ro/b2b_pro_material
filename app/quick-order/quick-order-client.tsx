"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { 
  AlertCircle,
  ChevronRight,
  Package,
  Plus as PlusIcon,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { Product } from "@/lib/data/products"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/context/cart-context"

type QuickOrderRow = {
  id: number
  sku: string
  quantity: number
}

const shippingThreshold = 5000
const shippingFee = 550

const stockStatus = {
  in_stock: { label: "在庫あり", color: "text-green-600" },
  low_stock: { label: "残りわずか", color: "text-amber-600" },
  out_of_stock: { label: "在庫切れ", color: "text-destructive" },
  contact: { label: "要問合せ", color: "text-muted-foreground" },
}

type QuickOrderClientProps = {
  products: Product[]
}

export function QuickOrderClient({ products }: QuickOrderClientProps) {
  const { toast } = useToast()
  const { addItem } = useCart()
  const [rows, setRows] = useState<QuickOrderRow[]>([
    { id: 1, sku: "", quantity: 1 },
    { id: 2, sku: "", quantity: 1 },
    { id: 3, sku: "", quantity: 1 },
  ])

  const findProductBySku = (sku: string): Product | undefined => {
    const normalized = sku.trim().toLowerCase()
    if (!normalized) return undefined
    return products.find((p) => p.sku.toLowerCase() === normalized)
  }

  const matchedRows = useMemo(() => {
    return rows.map((row) => {
      const product = findProductBySku(row.sku)
      const lineSubtotal = product ? product.basePrice * row.quantity : 0
      const lineTax = product
        ? Math.floor(product.basePrice * product.taxRate) * row.quantity
        : 0
      return { ...row, product, lineSubtotal, lineTax }
    })
  }, [rows, products])

  const totals = useMemo(() => {
    const subtotal = matchedRows.reduce((sum, row) => sum + row.lineSubtotal, 0)
    const tax = matchedRows.reduce((sum, row) => sum + row.lineTax, 0)
    const total = subtotal + tax
    const shipping = subtotal === 0 ? 0 : subtotal >= shippingThreshold ? 0 : shippingFee
    return { subtotal, tax, total, shipping, grandTotal: total + shipping }
  }, [matchedRows])

  const handleRowChange = (id: number, key: keyof QuickOrderRow, value: string | number) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [key]: value } : row))
    )
  }

  const handleAddRow = () => {
    const nextId = rows.length === 0 ? 1 : Math.max(...rows.map((r) => r.id)) + 1
    setRows([...rows, { id: nextId, sku: "", quantity: 1 }])
  }

  const handleRemoveRow = (id: number) => {
    if (rows.length === 1) return
    setRows(rows.filter((row) => row.id !== id))
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const validRows = matchedRows.filter((row) => row.product && row.quantity > 0)

    if (validRows.length === 0) {
      toast({
        title: "商品を入力してください",
        description: "SKUと数量を入力するとクイックオーダーできます。",
        variant: "destructive",
      })
      return
    }

    validRows.forEach((row) => {
      if (row.product) {
        addItem(row.product, row.quantity)
      }
    })

    toast({
      title: "カートに追加しました",
      description: `${validRows.length}件の商品をカートに追加しました。`,
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
            <span className="text-foreground">クイックオーダー</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">クイックオーダー</h1>
              <p className="text-sm text-muted-foreground mt-1">
                注文コード（SKU）と数量を入力して一括でカートに追加できます。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">CSVアップロード準備中</Badge>
              <Badge variant="secondary">自拠点のみ閲覧可</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <div className="bg-card rounded-lg border border-border">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">注文内容を入力</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      SKUは大文字・小文字を区別せず検索します
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddRow}
                    className="gap-1 bg-transparent"
                  >
                    <PlusIcon className="h-4 w-4" />
                    行を追加
                  </Button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground w-1/5">
                            注文コード（SKU）
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground w-20">
                            数量
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                            商品情報
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground w-32">
                            金額（税込）
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground w-12">
                            削除
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {matchedRows.map((row, index) => {
                          const product = row.product
                          const status = product ? stockStatus[product.stock] : undefined
                          const lineTotal = row.lineSubtotal + row.lineTax

                          return (
                            <tr
                              key={row.id}
                              className={cn(
                                "border-b border-border",
                                index % 2 === 0 ? "bg-card" : "bg-muted/30"
                              )}
                            >
                              <td className="px-4 py-3 align-top">
                                <Input
                                  value={row.sku}
                                  onChange={(e) =>
                                    handleRowChange(row.id, "sku", e.target.value)
                                  }
                                  placeholder="例) CPP-A4-250"
                                />
                              </td>
                              <td className="px-4 py-3 align-top">
                                <Input
                                  type="number"
                                  min={1}
                                  value={row.quantity}
                                  onChange={(e) =>
                                    handleRowChange(
                                      row.id,
                                      "quantity",
                                      Math.max(1, parseInt(e.target.value) || 1)
                                    )
                                  }
                                />
                              </td>
                              <td className="px-4 py-3 align-top">
                                {product ? (
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-foreground line-clamp-2">
                                      {product.name}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <Badge variant="secondary" className="text-xs">
                                        {product.brand}
                                      </Badge>
                                      {product.sameDay && (
                                        <Badge className="bg-accent text-accent-foreground text-xs">
                                          <Truck className="h-3 w-3 mr-1" />
                                          当日出荷
                                        </Badge>
                                      )}
                                      {status && (
                                        <span className={cn("text-xs font-medium", status.color)}>
                                          {status.label}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      SKU: {product.sku} / 税別 ¥{product.basePrice.toLocaleString()}
                                    </p>
                                  </div>
                                ) : row.sku ? (
                                  <div className="flex items-center gap-2 text-sm text-destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>該当する商品が見つかりません</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Package className="h-4 w-4" />
                                    <span>SKUを入力してください</span>
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 align-top text-right">
                                {product ? (
                                  <div className="text-sm">
                                    <p className="font-bold text-foreground">
                                      ¥{lineTotal.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      税抜 ¥{row.lineSubtotal.toLocaleString()}
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3 align-top text-center">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveRow(row.id)}
                                  disabled={rows.length === 1}
                                  className="bg-transparent"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">行を削除</span>
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddRow}
                      className="gap-2 bg-transparent"
                    >
                      <PlusIcon className="h-4 w-4" />
                      行を追加
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      CSVアップロードでの一括登録は現在準備中です
                    </div>
                  </div>

                  <Separator />

                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-sm text-muted-foreground">
                      自拠点に紐づく注文コードのみ表示・計算対象になります
                    </div>
                    <Button type="submit" className="gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      カートに追加する
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            <div className="xl:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24 space-y-4">
                <h2 className="text-lg font-bold text-foreground mb-2">注文内容</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">商品小計</span>
                    <span className="text-foreground">
                      ¥{totals.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">消費税</span>
                    <span className="text-foreground">¥{totals.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">送料</span>
                    <span className="text-foreground">
                      {totals.shipping === 0 ? (
                        <span className="text-green-600">無料</span>
                      ) : (
                        `¥${totals.shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>
                </div>

                {totals.shipping > 0 && (
                  <div className="bg-secondary rounded-lg p-3 text-sm text-foreground">
                    あと
                    <span className="font-bold text-primary">
                      ¥{Math.max(0, shippingThreshold - totals.subtotal).toLocaleString()}
                    </span>
                    で送料無料
                  </div>
                )}

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground">合計（税込）</span>
                  <span className="text-2xl font-bold text-accent">
                    ¥{totals.grandTotal.toLocaleString()}
                  </span>
                </div>

                <Button className="w-full gap-2" onClick={() => handleSubmit()}>
                  <ShoppingCart className="h-4 w-4" />
                  カートに追加する
                </Button>

                <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                  <p>・SKUは注文コード/型番で検索します</p>
                  <p>・注文確定後、発注書（PO）が即時ダウンロード可能です</p>
                  <p>・納品書/請求書は出荷ステータス更新後に公開されます</p>
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
