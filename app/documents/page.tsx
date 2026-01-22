"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { 
  ChevronRight, 
  Search, 
  FileText, 
  Download, 
  File
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
import { useSearchParams } from "next/navigation"

interface Document {
  id: string
  type: "po" | "dn" | "invoice"
  documentNumber: string
  orderNumber: string
  issueDate: string
  amount: number
  status: "available" | "pending"
  fileUrl: string
}

const mockDocuments: Document[] = [
  {
    id: "1",
    type: "invoice",
    documentNumber: "INV-2026011501",
    orderNumber: "ORD-2026011501",
    issueDate: "2026-01-16",
    amount: 10879,
    status: "available",
    fileUrl: "/documents/sample-invoice.pdf",
  },
  {
    id: "2",
    type: "dn",
    documentNumber: "DN-2026011501",
    orderNumber: "ORD-2026011501",
    issueDate: "2026-01-15",
    amount: 10879,
    status: "available",
    fileUrl: "/documents/sample-invoice.pdf",
  },
  {
    id: "3",
    type: "po",
    documentNumber: "PO-2026011501",
    orderNumber: "ORD-2026011501",
    issueDate: "2026-01-15",
    amount: 10879,
    status: "available",
    fileUrl: "/documents/sample-invoice.pdf",
  },
  {
    id: "4",
    type: "dn",
    documentNumber: "DN-2026011002",
    orderNumber: "ORD-2026011002",
    issueDate: "2026-01-11",
    amount: 6534,
    status: "available",
    fileUrl: "/documents/sample-invoice.pdf",
  },
  {
    id: "5",
    type: "po",
    documentNumber: "PO-2026011002",
    orderNumber: "ORD-2026011002",
    issueDate: "2026-01-10",
    amount: 6534,
    status: "available",
    fileUrl: "/documents/sample-invoice.pdf",
  },
  {
    id: "6",
    type: "po",
    documentNumber: "PO-2026010503",
    orderNumber: "ORD-2026010503",
    issueDate: "2026-01-05",
    amount: 33836,
    status: "available",
    fileUrl: "/documents/sample-invoice.pdf",
  },
  {
    id: "7",
    type: "invoice",
    documentNumber: "INV-2026011002",
    orderNumber: "ORD-2026011002",
    issueDate: "2026-01-12",
    amount: 6534,
    status: "pending",
    fileUrl: "/documents/sample-invoice.pdf",
  },
]

const documentTypeConfig = {
  po: { label: "発注書", color: "bg-blue-100 text-blue-700" },
  dn: { label: "納品書", color: "bg-green-100 text-green-700" },
  invoice: { label: "請求書", color: "bg-amber-100 text-amber-700" },
}

const Loading = () => null

function DocumentsInner() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()
  const searchParams = useSearchParams()

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = 
      doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = typeFilter === "all" || doc.type === typeFilter
    
    const matchesTab = activeTab === "all" || doc.type === activeTab
    
    return matchesSearch && matchesType && matchesTab
  })

  const handleDownload = (doc: Document) => {
    if (doc.status === "pending") {
      toast({
        title: "準備中",
        description: "この帳票は現在準備中です。しばらくお待ちください。",
        variant: "destructive",
      })
      return
    }
    const link = document.createElement("a")
    link.href = doc.fileUrl || `/documents/${doc.documentNumber}.pdf`
    link.download = `${doc.documentNumber}.pdf`
    link.target = "_blank"
    link.rel = "noopener"
    link.click()

    toast({
      title: "ダウンロード開始",
      description: `${documentTypeConfig[doc.type].label} ${doc.documentNumber} をダウンロードしています...`,
    })
  }

  const documentCounts = {
    all: mockDocuments.length,
    po: mockDocuments.filter((d) => d.type === "po").length,
    dn: mockDocuments.filter((d) => d.type === "dn").length,
    invoice: mockDocuments.filter((d) => d.type === "invoice").length,
  }

  return (
    <>
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              トップ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">帳票管理</span>
          </nav>

          <h1 className="text-2xl font-bold mb-6 text-foreground">帳票管理</h1>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="bg-muted">
              <TabsTrigger value="all" className="gap-1">
                すべて
                <Badge variant="secondary" className="ml-1">
                  {documentCounts.all}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="po" className="gap-1">
                発注書
                <Badge variant="secondary" className="ml-1">
                  {documentCounts.po}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="dn" className="gap-1">
                納品書
                <Badge variant="secondary" className="ml-1">
                  {documentCounts.dn}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="invoice" className="gap-1">
                請求書
                <Badge variant="secondary" className="ml-1">
                  {documentCounts.invoice}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="帳票番号、注文番号で検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Documents List */}
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">該当する帳票が見つかりませんでした</p>
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                        種類
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                        帳票番号
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                        注文番号
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                        発行日
                      </th>
                      <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                        金額（税込）
                      </th>
                      <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">
                        ステータス
                      </th>
                      <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((doc) => {
                      const typeInfo = documentTypeConfig[doc.type]
                      
                      return (
                        <tr 
                          key={doc.id}
                          className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <Badge className={typeInfo.color}>
                              {typeInfo.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <File className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">
                                {doc.documentNumber}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Link 
                              href={`/orders?q=${doc.orderNumber}`}
                              className="text-primary hover:underline"
                            >
                              {doc.orderNumber}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {doc.issueDate}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-foreground">
                            ¥{doc.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {doc.status === "available" ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                ダウンロード可
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                                準備中
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(doc)}
                              disabled={doc.status === "pending"}
                              className="gap-1 bg-transparent"
                            >
                              <Download className="h-3 w-3" />
                              PDF
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-8 p-4 bg-secondary rounded-lg">
            <h3 className="font-bold text-foreground mb-2">帳票について</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>・<strong>発注書（PO）</strong>：ご注文確定時に発行されます</li>
              <li>・<strong>納品書（DN）</strong>：商品出荷時に発行されます</li>
              <li>・<strong>請求書（Invoice）</strong>：商品配送完了後に発行されます</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
      <Toaster />
    </>
  )
}

export default function DocumentsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Suspense fallback={<Loading />}>
        <DocumentsInner />
      </Suspense>
    </div>
  )
}

export { Loading }
