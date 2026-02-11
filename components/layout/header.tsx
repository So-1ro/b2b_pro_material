"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  ChevronDown,
  Clock,
  BookOpen,
  Zap,
  MapPin,
  FileText,
  HelpCircle,
  LogIn,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/browser"
import { useCart } from "@/lib/context/cart-context"

const categories = [
  "すべて",
  "安全保護具・作業服・安全靴",
  "物流/保管/梱包用品/テープ",
  "オフィスサプライ",
  "切削工具・研磨材",
  "測定・測量用品",
  "作業工具/電動・空圧工具",
  "配管・水廻り部材/ポンプ",
  "建築金物・建材・塗装内装用品",
  "空調・電設資材/電気材料",
  "自動車用品",
]

interface HeaderProps {
  cartItemCount?: number
  isAdmin?: boolean
}

export function Header({ cartItemCount = 0, isAdmin = false }: HeaderProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("すべて")
  const [searchQuery, setSearchQuery] = useState("")
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const { itemCount } = useCart()
  const displayCartCount = cartItemCount > 0 ? cartItemCount : itemCount

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUserEmail(null)
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim())
    }
    if (selectedCategory !== "すべて") {
      params.set("category", selectedCategory)
    }
    const query = params.toString()
    router.push(query ? `/search?${query}` : "/search")
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">取扱点数 <strong>50,000</strong> 点以上</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">当日出荷対応商品多数</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/help" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">ヘルプ</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">PM</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-lg text-foreground leading-tight">ProMaterial</div>
                <div className="text-xs text-muted-foreground">B2B資材調達</div>
              </div>
            </div>
          </Link>

          {/* Search bar */}
          {!isAdmin && (
            <div className="flex-1 max-w-3xl hidden md:flex">
              <form
                onSubmit={handleSearchSubmit}
                className="flex w-full border border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="rounded-none border-r border-border px-3 h-10 text-sm font-normal hover:bg-muted bg-transparent"
                    >
                      <span className="max-w-[100px] truncate">{selectedCategory}</span>
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 max-h-80 overflow-y-auto">
                    {categories.map((category) => (
                      <DropdownMenuItem 
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                          "cursor-pointer",
                          selectedCategory === category && "bg-secondary"
                        )}
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Input
                  type="text"
                  placeholder="商品名、型番、キーワードで検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-0 rounded-none h-10 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button type="submit" className="rounded-none h-10 px-6">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">検索</span>
                </Button>
              </form>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!isAdmin && (
              <>
                {userEmail ? (
                  <>
                    <span className="hidden lg:inline text-xs text-muted-foreground">
                      {userEmail}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden lg:flex gap-2 bg-transparent"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      ログアウト
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="hidden lg:flex">
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <LogIn className="h-4 w-4" />
                        ログイン
                      </Button>
                    </Link>
                    <Link href="/register" className="hidden lg:flex">
                      <Button size="sm" className="gap-2">
                        <User className="h-4 w-4" />
                        新規登録
                      </Button>
                    </Link>
                  </>
                )}
                <Link href="/cart" className="relative">
                  <Button variant="ghost" size="icon" className="relative bg-transparent">
                    <ShoppingCart className="h-5 w-5" />
                    {displayCartCount > 0 && (
                      <Badge 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground"
                      >
                        {displayCartCount > 99 ? "99+" : displayCartCount}
                      </Badge>
                    )}
                    <span className="sr-only">カート</span>
                  </Button>
                </Link>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden bg-transparent"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">メニュー</span>
            </Button>
          </div>
        </div>

      {/* Mobile search */}
      {!isAdmin && (
        <div className="mt-3 md:hidden">
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full border border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary"
          >
            <Input
              type="text"
              placeholder="商品名、型番で検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 rounded-none h-10 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button type="submit" className="rounded-none h-10 px-4">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
      </div>

      {/* Navigation bar */}
      {!isAdmin && (
        <nav className="border-t border-border bg-card hidden md:block">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-1 py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 text-sm font-medium bg-transparent">
                    <Menu className="h-4 w-4" />
                    カテゴリー
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  {categories.slice(1).map((category) => (
                    <DropdownMenuItem key={category} asChild>
                      <Link href={`/category/${encodeURIComponent(category)}`}>
                        {category}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/orders">
                <Button variant="ghost" className="gap-2 text-sm bg-transparent">
                  <Clock className="h-4 w-4" />
                  履歴・再注文
                </Button>
              </Link>
              <Link href="/quick-order">
                <Button variant="ghost" className="gap-2 text-sm bg-transparent">
                  <Zap className="h-4 w-4" />
                  クイックオーダー
                </Button>
              </Link>
              <Link href="/documents">
                <Button variant="ghost" className="gap-2 text-sm bg-transparent">
                  <FileText className="h-4 w-4" />
                  帳票管理
                </Button>
              </Link>
              <div className="flex-1" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>お届け先：</span>
                <span className="font-medium text-foreground">〒100-0001</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile menu */}
      {isMenuOpen && !isAdmin && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2">
              {userEmail ? (
                <>
                  <div className="text-xs text-muted-foreground px-1">
                    {userEmail}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-transparent"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    ログアウト
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="w-full">
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <LogIn className="h-4 w-4" />
                      ログイン
                    </Button>
                  </Link>
                  <Link href="/register" className="w-full">
                    <Button className="w-full justify-start gap-2">
                      <User className="h-4 w-4" />
                      新規登録
                    </Button>
                  </Link>
                </>
              )}
              <div className="h-px bg-border my-2" />
              <Link href="/orders">
                <Button variant="ghost" className="w-full justify-start gap-2 bg-transparent">
                  <Clock className="h-4 w-4" />
                  履歴・再注文
                </Button>
              </Link>
              <Link href="/quick-order">
                <Button variant="ghost" className="w-full justify-start gap-2 bg-transparent">
                  <Zap className="h-4 w-4" />
                  クイックオーダー
                </Button>
              </Link>
              <Link href="/documents">
                <Button variant="ghost" className="w-full justify-start gap-2 bg-transparent">
                  <FileText className="h-4 w-4" />
                  帳票管理
                </Button>
              </Link>
              <div className="h-px bg-border my-2" />
              <p className="text-sm font-medium text-muted-foreground mb-2">カテゴリー</p>
              {categories.slice(1, 6).map((category) => (
                <Link key={category} href={`/category/${encodeURIComponent(category)}`}>
                  <Button variant="ghost" className="w-full justify-start text-sm bg-transparent">
                    {category}
                  </Button>
                </Link>
              ))}
              <Link href="/categories">
                <Button variant="ghost" className="w-full justify-start text-sm text-primary bg-transparent">
                  すべてのカテゴリーを見る →
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
