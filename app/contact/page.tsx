"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  BadgeHelp,
  Building2,
  ChevronRight,
  FileText,
  Mail,
  Phone,
  Send,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Separator } from "@/components/ui/separator"

export default function ContactPage() {
  const { toast } = useToast()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    company: "",
    location: "",
    name: "",
    email: "",
    phone: "",
    orderNumber: "",
    category: "product",
    message: "",
  })

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    toast({
      title: "お問い合わせを送信しました",
      description: "担当より折り返しご連絡いたします。"
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
            <span className="text-foreground">お問い合わせ</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BadgeHelp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">お問い合わせ</h1>
                  <p className="text-sm text-muted-foreground">
                    24時間受付。営業時間内に担当よりご連絡いたします。
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                {submitted ? (
                  <div className="text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Send className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-1">送信が完了しました</h2>
                      <p className="text-sm text-muted-foreground">
                        担当が内容を確認し、ご登録のメール宛にご連絡いたします。
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                      <Link href="/orders">
                        <Button variant="outline" className="bg-transparent gap-2">
                          <FileText className="h-4 w-4" />
                          注文履歴を確認
                        </Button>
                      </Link>
                      <Link href="/">
                        <Button className="gap-2">
                          トップページへ戻る
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company">企業名</Label>
                        <Input
                          id="company"
                          value={form.company}
                          onChange={(e) => handleChange("company", e.target.value)}
                          placeholder="例）プロマテリアル株式会社"
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">拠点名</Label>
                        <Input
                          id="location"
                          value={form.location}
                          onChange={(e) => handleChange("location", e.target.value)}
                          placeholder="例）東京本社 / 大阪支店"
                          required
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">ご担当者名</Label>
                        <Input
                          id="name"
                          value={form.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="山田 太郎"
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">メールアドレス</Label>
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          placeholder="example@company.co.jp"
                          required
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">電話番号（任意）</Label>
                        <Input
                          id="phone"
                          value={form.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          placeholder="03-1234-5678"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="orderNumber">注文番号（任意）</Label>
                        <Input
                          id="orderNumber"
                          value={form.orderNumber}
                          onChange={(e) => handleChange("orderNumber", e.target.value)}
                          placeholder="ORD-2026011501"
                          className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          ご注文に関する問い合わせは注文番号を入力してください
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label>お問い合わせ種別</Label>
                      <Select
                        value={form.category}
                        onValueChange={(value) => handleChange("category", value)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product">商品に関するご質問</SelectItem>
                          <SelectItem value="order">注文内容の確認・変更</SelectItem>
                          <SelectItem value="invoice">請求書・帳票について</SelectItem>
                          <SelectItem value="account">アカウント/ログイン</SelectItem>
                          <SelectItem value="other">その他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message">お問い合わせ内容</Label>
                      <Textarea
                        id="message"
                        value={form.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        placeholder="ご要望・ご不明点をできるだけ詳しくご記載ください。"
                        required
                        rows={5}
                        className="mt-2"
                      />
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                        <Badge variant="secondary" className="text-[11px]">必須</Badge>
                        <span>機密情報は記載しないでください。</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <p className="text-xs text-muted-foreground">
                        送信いただいた内容は暗号化され、安全に送信されます。
                      </p>
                      <Button type="submit" className="gap-2">
                        <Send className="h-4 w-4" />
                        送信する
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            <div className="lg:col-span-1 space-y-4">
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <h2 className="text-lg font-bold text-foreground mb-2">サポート窓口</h2>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">電話（平日 9:00-18:00）</p>
                    <p className="font-bold text-foreground">0120-XXX-XXX</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">メール</p>
                    <p className="font-bold text-foreground break-words">
                      support@promaterial.example.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-muted-foreground">
                    <p>企業別価格や拠点アカウントの発行・再発行は運営へご依頼ください。</p>
                  </div>
                </div>
              </div>

              <div className="bg-secondary rounded-lg p-4 text-sm text-foreground space-y-2">
                <div className="font-bold">よくあるご質問</div>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>パスワードを忘れた場合の再設定方法</li>
                  <li>請求書のダウンロードタイミング</li>
                  <li>企業別価格（SKU単位の上書き）について</li>
                </ul>
                <Link href="/faq" className="text-primary hover:underline text-sm">
                  FAQを見る
                </Link>
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
