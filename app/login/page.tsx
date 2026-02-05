"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { createClient } from "@/utils/supabase/browser"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      toast({
        title: "ログインしました",
        description: "ようこそ、ProMaterialへ",
      })

      router.push("/")
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "ログインに失敗しました"
      toast({
        title: "ログインに失敗しました",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
              <h1 className="text-2xl font-bold text-foreground">ログイン</h1>
              <p className="text-sm text-muted-foreground mt-2">
                拠点アカウントでログインしてください
              </p>
              <Link href="/admin/login" className="inline-flex mt-3">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  管理者としてログイン
                  <LogIn className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">メールアドレス / ログインID</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="example@company.co.jp"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                アカウントをお持ちでない方は
              </p>
              <Link href="/register" className="text-primary hover:underline font-medium">
                新規会員登録
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            ログインすることで、<Link href="/terms" className="underline">利用規約</Link>および
            <Link href="/privacy" className="underline">プライバシーポリシー</Link>に同意したものとみなされます。
          </p>
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  )
}
