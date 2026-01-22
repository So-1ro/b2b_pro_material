"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ShieldCheck, LogIn } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

const SAMPLE_ADMIN_ID = "admin@promaterial.example.com"
const SAMPLE_ADMIN_PASSWORD = "admin1234"

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [adminId, setAdminId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    if (adminId !== SAMPLE_ADMIN_ID || password !== SAMPLE_ADMIN_PASSWORD) {
      toast({
        title: "認証に失敗しました",
        description: "運営IDまたはパスワードが正しくありません。",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    toast({
      title: "運営管理者としてログインしました",
      description: "ダッシュボードへ移動します。",
    })

    router.push("/admin")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="bg-card rounded-xl border border-border p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-7 w-7 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">運営管理者ログイン</h1>
              <p className="text-sm text-muted-foreground mt-2">
                企業/拠点/商品/価格/帳票を管理する運営向けログインです
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="adminId">運営ID / メールアドレス</Label>
                <Input
                  id="adminId"
                  type="text"
                  placeholder="admin@example.com"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
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
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                    ログイン状態を保持
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  パスワードを忘れた方
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  "ログイン中..."
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    ログイン
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 text-xs text-muted-foreground text-center">
              サンプルID: {SAMPLE_ADMIN_ID} / パスワード: {SAMPLE_ADMIN_PASSWORD}
            </div>

            <div className="mt-4 pt-6 border-top border-border text-sm text-muted-foreground text-center">
              拠点ユーザーの方は{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                こちらからログイン
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            管理者アカウントをお持ちでない場合は運営本部までお問い合わせください。
          </p>
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  )
}
