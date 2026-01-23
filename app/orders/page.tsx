"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { 
  ChevronRight, 
  Search, 
  FileText, 
  Download, 
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"

const Loading = () => null

interface OrderItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
}

interface Order {
  id: string
  orderNumber: string
  orderDate: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  documents: {
    po?: string
    dn?: string
    invoice?: string
  }
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2026011501",
    orderDate: "2026-01-15",
    status: "delivered",
    items: [
      { id: "1", name: "コピー用紙 高白色 A4 250枚", quantity: 10, unitPrice: 349 },
      { id: "2", name: "ニトリル手袋 パウダーフリー M 100枚入り", quantity: 5, unitPrice: 1280 },
    ],
    subtotal: 9890,
    tax: 989,
    total: 10879,
    documents: {
      po: "/documents/sample-invoice.pdf",
      dn: "/documents/sample-invoice.pdf",
      invoice: "/documents/sample-invoice.pdf",
    },
  },
  {
    id: "2",
    orderNumber: "ORD-2026011002",
    orderDate: "2026-01-10",
    status: "shipped",
    items: [
      { id: "3", name: "安全ヘルメット 白 飛来・落下物用", quantity: 3, unitPrice: 1980 },
    ],
    subtotal: 5940,
    tax: 594,
    total: 6534,
    documents: {
      po: "/documents/sample-invoice.pdf",
      dn: "/documents/sample-invoice.pdf",
    },
  },
  {
    id: "3",
    orderNumber: "ORD-2026010503",
    orderDate: "2026-01-05",
    status: "processing",
    items: [
      { id: "5", name: "充電式インパクトドライバー 18V", quantity: 1, unitPrice: 24800 },
      { id: "8", name: "デジタルノギス 150mm", quantity: 2, unitPrice: 2980 },
    ],
    subtotal: 30760,
    tax: 3076,
    total: 33836,
    documents: {
      po: "/documents/sample-invoice.pdf",
    },
  },
  {
    id: "4",
    orderNumber: "ORD-2025122804",
    orderDate: "2025-12-28",
    status: "cancelled",
    items: [
      { id: "4", name: "OPPテープ 透明 50mm×100m 6巻", quantity: 20, unitPrice: 890 },
    ],
    subtotal: 17800,
    tax: 1780,
    total: 19580,
    documents: {},
  },
]

const statusConfig = {
  pending: { label: "受付中", icon: Clock, color: "bg-slate-100 text-slate-700" },
  processing: { label: "処理中", icon: RefreshCw, color: "bg-blue-100 text-blue-700" },
  shipped: { label: "出荷済", icon: Truck, color: "bg-amber-100 text-amber-700" },
  delivered: { label: "配送完了", icon: CheckCircle, color: "bg-green-100 text-green-700" },
  cancelled: { label: "キャンセル", icon: XCircle, color: "bg-red-100 text-red-700" },
}

function OrdersContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleDownload = (documentType: "po" | "dn" | "invoice", order: Order) => {
    const labels = { po: "発注書", dn: "納品書", invoice: "請求書" } as const
    const url = order.documents[documentType] || "/documents/sample-invoice.pdf"

    const link = document.createElement("a")
    link.href = url
    link.download = `${order.orderNumber}-${documentType}.pdf`
    link.target = "_blank"
    link.rel = "noopener"
    link.click()

    toast({
      title: "ダウンロード開始",
      description: `${labels[documentType]}をダウンロードしています...`,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              トップ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">注文履歴</span>
          </nav>

          <h1 className="text-2xl font-bold mb-6 text-foreground">注文履歴</h1>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="注文番号、商品名で検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="pending">受付中</SelectItem>
                <SelectItem value="processing">処理中</SelectItem>
                <SelectItem value="shipped">出荷済</SelectItem>
                <SelectItem value="delivered">配送完了</SelectItem>
                <SelectItem value="cancelled">キャンセル</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">該当する注文が見つかりませんでした</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusInfo = statusConfig[order.status]
                const StatusIcon = statusInfo.icon

                return (
                  <div
                    key={order.id}
                    className="bg-card rounded-lg border border-border overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="bg-muted/50 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">注文番号</p>
                          <p className="font-bold text-foreground">{order.orderNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">注文日</p>
                          <p className="font-medium text-foreground">{order.orderDate}</p>
                        </div>
                      </div>
                      <Badge className={cn("gap-1", statusInfo.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </Badge>
                    </div>

                    {/* Order Items */}
                    <div className="p-4">
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4"
                          >
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                              <Package className="h-6 w-6 text-muted-foreground/30" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {item.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                ¥{item.unitPrice.toLocaleString()} × {item.quantity}
                              </p>
                            </div>
                            <p className="font-bold text-foreground">
                              ¥{(item.unitPrice * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="text-right sm:text-left">
                          <p className="text-sm text-muted-foreground">
                            合計（税込）
                          </p>
                          <p className="text-xl font-bold text-accent">
                            ¥{order.total.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {/* Document Downloads */}
                          {order.documents.po && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload("po", order)}
                              className="gap-1 bg-transparent"
                            >
                              <Download className="h-3 w-3" />
                              発注書
                            </Button>
                          )}
                          {order.documents.dn && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload("dn", order)}
                              className="gap-1 bg-transparent"
                            >
                              <Download className="h-3 w-3" />
                              納品書
                            </Button>
                          )}
                          {order.documents.invoice && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload("invoice", order)}
                              className="gap-1 bg-transparent"
                            >
                              <Download className="h-3 w-3" />
                              請求書
                            </Button>
                          )}
                          
                          {order.status !== "cancelled" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                toast({
                                  title: "カートに追加しました",
                                  description: `注文 ${order.orderNumber} の商品をカートに追加しました`,
                                })
                              }
                              className="gap-1"
                            >
                              <RefreshCw className="h-3 w-3" />
                              再注文
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  )
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<Loading />}>
      <OrdersContent />
    </Suspense>
  )
}

export { Loading }
