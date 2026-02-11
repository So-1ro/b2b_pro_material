"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ChevronRight, Search, Download } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { fetchDocumentsForCurrentUser, type UiDocument } from "@/lib/supabase/client-orders"

const documentTypeConfig = {
  po: { label: "発注書", color: "bg-blue-100 text-blue-700" },
  dn: { label: "納品書", color: "bg-green-100 text-green-700" },
  invoice: { label: "請求書", color: "bg-amber-100 text-amber-700" },
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [documents, setDocuments] = useState<UiDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    let mounted = true
    async function run() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchDocumentsForCurrentUser()
        if (!mounted) return
        setDocuments(data)
      } catch (e) {
        if (!mounted) return
        setError(e instanceof Error ? e.message : "帳票の取得に失敗しました。")
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [])

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTab = activeTab === "all" || doc.type === activeTab
      return matchesSearch && matchesTab
    })
  }, [documents, searchQuery, activeTab])

  const handleDownload = (doc: UiDocument) => {
    if (doc.status === "pending") {
      toast({
        title: "準備中",
        description: "この帳票は現在準備中です。しばらくお待ちください。",
        variant: "destructive",
      })
      return
    }
    if (!doc.fileUrl) {
      toast({
        title: "URL未設定",
        description: "帳票URLが設定されていません。",
        variant: "destructive",
      })
      return
    }

    const link = document.createElement("a")
    link.href = doc.fileUrl
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
    all: documents.length,
    po: documents.filter((d) => d.type === "po").length,
    dn: documents.filter((d) => d.type === "dn").length,
    invoice: documents.filter((d) => d.type === "invoice").length,
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
            <span className="text-foreground">帳票管理</span>
          </nav>

          <h1 className="text-2xl font-bold mb-6 text-foreground">帳票管理</h1>

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

          {loading && <p className="text-muted-foreground">読み込み中...</p>}
          {!loading && error && <p className="text-destructive">{error}</p>}
          {!loading && !error && filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">該当する帳票が見つかりませんでした</p>
            </div>
          )}

          {!loading && !error && filteredDocuments.length > 0 && (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">種類</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">帳票番号</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">注文番号</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">発行日</th>
                      <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">金額（税込）</th>
                      <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">ステータス</th>
                      <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <Badge className={documentTypeConfig[doc.type].color}>
                            {documentTypeConfig[doc.type].label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">{doc.documentNumber}</td>
                        <td className="px-4 py-3 text-muted-foreground">{doc.orderNumber}</td>
                        <td className="px-4 py-3 text-muted-foreground">{doc.issueDate}</td>
                        <td className="px-4 py-3 text-right font-medium text-foreground">
                          ¥{doc.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={doc.status === "available" ? "default" : "secondary"}>
                            {doc.status === "available" ? "閲覧可能" : "準備中"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(doc)}
                            disabled={doc.status === "pending"}
                            className="gap-1 bg-transparent"
                          >
                            <Download className="h-3 w-3" />
                            ダウンロード
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}
