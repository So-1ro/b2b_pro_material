"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LogIn, UserPlus, CheckCircle } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { createClient } from "@/utils/supabase/browser"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    company: "",
    location: "",
    name: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
  })

  const handleChange = (key: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.agree) {
      toast({
        title: "利用規約への同意が必要です",
        description: "利用規約とプライバシーポリシーに同意してください。",
        variant: "destructive",
      })
      return
    }

    if (form.password !== form.confirm) {
      toast({
        title: "パスワードが一致しません",
        description: "確認用パスワードが一致するよう入力してください。",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            company: form.company,
            location: form.location,
            name: form.name,
          },
        },
      })

      if (error) {
        throw error
      }

      toast({
        title: "登録が完了しました",
        description: "確認メールをご確認ください。",
      })
      router.push("/login")
    } catch (err) {
      toast({
        title: "登録に失敗しました",
        description: err instanceof Error ? err.message : "時間をおいて再試行してください。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="bg-card rounded-xl border border-border p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold text-xl">PM</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">新規会員登録</h1>
              <p className="text-sm text-muted-foreground mt-2">
                企業・拠点情報を入力してアカウントを作成してください
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="location">拠点名 / 部署</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="例）東京本社 / 大阪支店"
                  required
                  className="mt-2"
                />
              </div>

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

              <div>
                <Label htmlFor="password">パスワード</Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirm">パスワード（確認）</Label>
                <div className="relative mt-2">
                  <Input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    value={form.confirm}
                    onChange={(e) => handleChange("confirm", e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="agree"
                  checked={form.agree}
                  onCheckedChange={(checked) => handleChange("agree", checked as boolean)}
                />
                <Label htmlFor="agree" className="text-sm font-normal leading-5 cursor-pointer">
                  利用規約およびプライバシーポリシーに同意します
                  <span className="block text-muted-foreground">
                    拠点アカウント発行後、拠点ごとにログインしてご利用いただけます。
                  </span>
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  "登録処理中..."
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    無料で法人登録する
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-foreground">
                <CheckCircle className="h-4 w-4 text-primary" />
                企業別価格・帳票ダウンロード・拠点別ログインに対応
              </div>
              <p className="text-sm text-muted-foreground">
                すでにアカウントをお持ちの方は
                <Link href="/login" className="text-primary hover:underline font-medium ml-1">
                  ログイン
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            登録により、<Link href="/terms" className="underline">利用規約</Link>および
            <Link href="/privacy" className="underline">プライバシーポリシー</Link>に同意したものとみなされます。
          </p>
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  )
}
