"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { 
  BadgeCheck,
  Building2,
  FileText,
  Package,
  ShieldCheck,
  ShoppingCart,
  Upload,
  Users,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

type Company = {
  id: string
  name: string
  enabled: boolean
  locations: number
  users: number
}

type PriceOverride = {
  company: string
  sku: string
  price: number
}

type AdminOrder = {
  orderNumber: string
  company: string
  location: string
  status: "pending" | "shipped" | "cancelled"
  total: number
}

type DocumentUpload = {
  orderNumber: string
  type: "invoice" | "dn" | "po"
  status: "ready" | "uploaded"
}

const companiesSeed: Company[] = [
  { id: "c01", name: "株式会社サンプル商事", enabled: true, locations: 3, users: 12 },
  { id: "c02", name: "〇〇工業株式会社", enabled: true, locations: 2, users: 7 },
  { id: "c03", name: "△△物流株式会社", enabled: false, locations: 1, users: 3 },
]

const overridesSeed: PriceOverride[] = [
  { company: "株式会社サンプル商事", sku: "CPP-A4-250", price: 320 },
  { company: "〇〇工業株式会社", sku: "DRILL-18V", price: 22800 },
  { company: "△△物流株式会社", sku: "GLV-NTR-M", price: 1180 },
]

const adminOrdersSeed: AdminOrder[] = [
  { orderNumber: "ORD-2026011501", company: "株式会社サンプル商事", location: "東京本社", status: "pending", total: 10879 },
  { orderNumber: "ORD-2026011002", company: "〇〇工業株式会社", location: "大阪工場", status: "shipped", total: 6534 },
  { orderNumber: "ORD-2026010503", company: "△△物流株式会社", location: "川崎DC", status: "pending", total: 33836 },
]

const uploadsSeed: DocumentUpload[] = [
  { orderNumber: "ORD-2026011501", type: "invoice", status: "uploaded" },
  { orderNumber: "ORD-2026011002", type: "invoice", status: "ready" },
  { orderNumber: "ORD-2026010503", type: "dn", status: "ready" },
]

const statusConfig = {
  pending: { label: "受付中", color: "bg-blue-100 text-blue-700" },
  shipped: { label: "出荷済", color: "bg-green-100 text-green-700" },
  cancelled: { label: "キャンセル", color: "bg-red-100 text-red-700" },
}

const docTypeLabel = {
  invoice: "請求書",
  dn: "納品書",
  po: "発注書",
}

export default function AdminDashboardPage() {
  const { toast } = useToast()
  const [companies, setCompanies] = useState<Company[]>(companiesSeed)
  const [overrides, setOverrides] = useState<PriceOverride[]>(overridesSeed)
  const [adminOrders, setAdminOrders] = useState<AdminOrder[]>(adminOrdersSeed)
  const [uploads, setUploads] = useState<DocumentUpload[]>(uploadsSeed)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isOverrideOpen, setIsOverrideOpen] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [selectedOverride, setSelectedOverride] = useState<PriceOverride | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)

  const [createForm, setCreateForm] = useState({
    name: "",
    locations: 1,
    users: 1,
    enabled: true,
  })

  const enabledCompanies = useMemo(() => companies.filter((c) => c.enabled).length, [companies])
  const disabledCompanies = companies.length - enabledCompanies

  const handleCreateCompany = () => {
    if (!createForm.name.trim()) {
      toast({
        title: "企業名を入力してください",
        variant: "destructive",
      })
      return
    }
    const newCompany: Company = {
      id: `c${String(companies.length + 1).padStart(2, "0")}`,
      name: createForm.name.trim(),
      enabled: createForm.enabled,
      locations: createForm.locations,
      users: createForm.users,
    }
    setCompanies((prev) => [...prev, newCompany])
    setCreateForm({ name: "", locations: 1, users: 1, enabled: true })
    setIsCreateOpen(false)
    toast({
      title: "企業を登録しました",
      description: newCompany.name,
    })
  }

  const handleToggleCompany = (companyId: string, enabled: boolean) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, enabled } : c))
    )
    toast({
      title: enabled ? "企業を利用可能にしました" : "企業を停止しました",
    })
  }

  const handleOverrideSave = () => {
    if (!selectedOverride) return
    setOverrides((prev) =>
      prev.map((o) =>
        o.company === selectedOverride.company && o.sku === selectedOverride.sku
          ? selectedOverride
          : o
      )
    )
    setIsOverrideOpen(false)
    toast({
      title: "企業別価格を更新しました",
      description: `${selectedOverride.company} / ${selectedOverride.sku}`,
    })
  }

  const handleStatusSave = () => {
    if (!selectedOrder) return
    setAdminOrders((prev) =>
      prev.map((o) => (o.orderNumber === selectedOrder.orderNumber ? selectedOrder : o))
    )
    setIsStatusOpen(false)
    toast({
      title: "注文ステータスを更新しました",
      description: `${selectedOrder.orderNumber} を ${statusConfig[selectedOrder.status].label} に変更`,
    })
  }

  const handleUpload = (orderNumber: string, type: DocumentUpload["type"]) => {
    setUploads((prev) =>
      prev.map((u) =>
        u.orderNumber === orderNumber && u.type === type
          ? { ...u, status: "uploaded" }
          : u
      )
    )
    toast({
      title: "アップロード完了",
      description: `${orderNumber} の ${docTypeLabel[type]} を公開しました`,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isAdmin />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-muted-foreground">運営ダッシュボード</span>
          </nav>

          {/* Title */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground">運営ダッシュボード</h1>
              <p className="text-sm text-muted-foreground mt-1">
                企業/拠点、商品、価格上書き、帳票を管理します。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/documents">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <FileText className="h-4 w-4" />
                  帳票一覧
                </Button>
              </Link>
              <Link href="/orders">
                <Button className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  注文一覧
                </Button>
              </Link>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">有効企業</p>
                <p className="text-2xl font-bold text-foreground">{enabledCompanies} 社</p>
                <p className="text-xs text-muted-foreground">
                  停止中 {disabledCompanies} 社
                </p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">拠点ユーザー</p>
                <p className="text-2xl font-bold text-foreground">
                  {companies.reduce((sum, c) => sum + c.users, 0)} 名
                </p>
                <p className="text-xs text-muted-foreground">
                  拠点 {companies.reduce((sum, c) => sum + c.locations, 0)} 箇所
                </p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">価格上書き (SKU)</p>
                <p className="text-2xl font-bold text-foreground">{overrides.length} 件</p>
                <p className="text-xs text-muted-foreground">企業別特価の登録状況</p>
              </div>
            </div>
          </div>

          {/* Companies */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <p className="font-bold text-foreground">企業・拠点</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent"
                onClick={() => setIsCreateOpen(true)}
              >
                新規企業を登録
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-left text-sm text-muted-foreground">
                    <th className="px-4 py-3">企業名</th>
                    <th className="px-4 py-3">拠点</th>
                    <th className="px-4 py-3">ユーザー</th>
                    <th className="px-4 py-3">利用可否</th>
                    <th className="px-4 py-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company, idx) => (
                    <tr
                      key={company.id}
                      className={cn(
                        "border-b border-border text-sm",
                        idx % 2 === 0 ? "bg-card" : "bg-muted/30"
                      )}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {company.name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{company.locations}</td>
                      <td className="px-4 py-3 text-muted-foreground">{company.users}</td>
                      <td className="px-4 py-3">
                        <Badge
                          className={
                            company.enabled
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        >
                          {company.enabled ? "利用中" : "停止中"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                          onClick={() => {
                            setSelectedCompany(company)
                            setIsDetailOpen(true)
                          }}
                        >
                          詳細
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Price Overrides */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-primary" />
                <p className="font-bold text-foreground">企業別価格 (SKU上書き)</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent"
                onClick={() =>
                  toast({
                    title: "CSVインポート",
                    description: "デモ環境のため未接続です。",
                  })
                }
              >
                CSVインポート
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-left text-sm text-muted-foreground">
                    <th className="px-4 py-3">企業</th>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">上書き価格</th>
                    <th className="px-4 py-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {overrides.map((row, idx) => (
                    <tr
                      key={`${row.company}-${row.sku}`}
                      className={cn(
                        "border-b border-border text-sm",
                        idx % 2 === 0 ? "bg-card" : "bg-muted/30"
                      )}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">{row.company}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.sku}</td>
                      <td className="px-4 py-3 text-foreground">¥{row.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                          onClick={() => {
                            setSelectedOverride(row)
                            setIsOverrideOpen(true)
                          }}
                        >
                          編集
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <p className="font-bold text-foreground">注文 (ステータス更新)</p>
              </div>
              <Link href="/orders">
                <Button variant="outline" size="sm" className="bg-transparent">
                  すべて見る
                </Button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-left text-sm text-muted-foreground">
                    <th className="px-4 py-3">注文番号</th>
                    <th className="px-4 py-3">企業 / 拠点</th>
                    <th className="px-4 py-3">金額（税込）</th>
                    <th className="px-4 py-3">ステータス</th>
                    <th className="px-4 py-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {adminOrders.map((order, idx) => {
                    const status = statusConfig[order.status]
                    return (
                      <tr
                        key={order.orderNumber}
                        className={cn(
                          "border-b border-border text-sm",
                          idx % 2 === 0 ? "bg-card" : "bg-muted/30"
                        )}
                      >
                        <td className="px-4 py-3 font-medium text-foreground">
                          {order.orderNumber}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {order.company} / {order.location}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          ¥{order.total.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={status.color}>{status.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent"
                            onClick={() => {
                              setSelectedOrder(order)
                              setIsStatusOpen(true)
                            }}
                          >
                            ステータス更新
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Document uploads */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-primary" />
                <p className="font-bold text-foreground">帳票アップロード</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent"
                onClick={() =>
                  toast({
                    title: "ファイル選択",
                    description: "デモ環境のためアップロードは擬似処理です。",
                  })
                }
              >
                ファイルを選択
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-left text-sm text-muted-foreground">
                    <th className="px-4 py-3">注文番号</th>
                    <th className="px-4 py-3">帳票種別</th>
                    <th className="px-4 py-3">ステータス</th>
                    <th className="px-4 py-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {uploads.map((item, idx) => (
                    <tr
                      key={`${item.orderNumber}-${item.type}`}
                      className={cn(
                        "border-b border-border text-sm",
                        idx % 2 === 0 ? "bg-card" : "bg-muted/30"
                      )}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {item.orderNumber}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{docTypeLabel[item.type]}</td>
                      <td className="px-4 py-3">
                        <Badge
                          className={
                            item.status === "uploaded"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }
                        >
                          {item.status === "uploaded" ? "公開中" : "アップロード待ち"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                          onClick={() => handleUpload(item.orderNumber, item.type)}
                        >
                          {item.status === "uploaded" ? "差し替え" : "アップロード"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground">
            監査ログ、権限管理、CSV取込結果など詳細機能は今後拡張予定です。
          </div>
        </div>
      </main>

      <Footer />
      <Toaster />

      {/* Create company dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新規企業を登録</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="company-name">企業名</Label>
              <Input
                id="company-name"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="例）新規企業株式会社"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="company-locations">拠点数</Label>
                <Input
                  id="company-locations"
                  type="number"
                  min={1}
                  value={createForm.locations}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, locations: Math.max(1, parseInt(e.target.value) || 1) })
                  }
                />
              </div>
              <div>
                <Label htmlFor="company-users">ユーザー数</Label>
                <Input
                  id="company-users"
                  type="number"
                  min={1}
                  value={createForm.users}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, users: Math.max(1, parseInt(e.target.value) || 1) })
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="company-enabled">利用可否</Label>
              <Switch
                id="company-enabled"
                checked={createForm.enabled}
                onCheckedChange={(checked) =>
                  setCreateForm({ ...createForm, enabled: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="bg-transparent">
              キャンセル
            </Button>
            <Button onClick={handleCreateCompany}>登録する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Company detail dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>企業詳細</DialogTitle>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-bold text-foreground">{selectedCompany.name}</p>
                <p className="text-muted-foreground">ID: {selectedCompany.id}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg border border-border">
                  <p className="text-muted-foreground">拠点</p>
                  <p className="text-lg font-bold text-foreground">{selectedCompany.locations}</p>
                </div>
                <div className="p-3 rounded-lg border border-border">
                  <p className="text-muted-foreground">ユーザー</p>
                  <p className="text-lg font-bold text-foreground">{selectedCompany.users}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">利用可否</span>
                <Switch
                  checked={selectedCompany.enabled}
                  onCheckedChange={(checked) => {
                    handleToggleCompany(selectedCompany.id, checked)
                    setSelectedCompany({ ...selectedCompany, enabled: checked })
                  }}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="bg-transparent">
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Override edit dialog */}
      <Dialog open={isOverrideOpen} onOpenChange={setIsOverrideOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>企業別価格を編集</DialogTitle>
          </DialogHeader>
          {selectedOverride && (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                {selectedOverride.company} / SKU: {selectedOverride.sku}
              </div>
              <div>
                <Label htmlFor="override-price">上書き価格 (税別)</Label>
                <Input
                  id="override-price"
                  type="number"
                  min={0}
                  value={selectedOverride.price}
                  onChange={(e) =>
                    setSelectedOverride({
                      ...selectedOverride,
                      price: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOverrideOpen(false)} className="bg-transparent">
              キャンセル
            </Button>
            <Button onClick={handleOverrideSave}>保存する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order status dialog */}
      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ステータス更新</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                {selectedOrder.orderNumber} / {selectedOrder.company} {selectedOrder.location}
              </div>
              <div className="space-y-2">
                <Label>ステータス</Label>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {Object.entries(statusConfig).map(([key, info]) => (
                    <Button
                      key={key}
                      variant={selectedOrder.status === key ? "default" : "outline"}
                      className={cn(
                        "w-full",
                        selectedOrder.status === key ? "" : "bg-transparent"
                      )}
                      onClick={() =>
                        setSelectedOrder({ ...selectedOrder, status: key as AdminOrder["status"] })
                      }
                    >
                      {info.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusOpen(false)} className="bg-transparent">
              キャンセル
            </Button>
            <Button onClick={handleStatusSave}>更新する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
