import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { fetchCategories } from "@/lib/supabase/categories"

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
  const categories = await fetchCategories()
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
            <span className="text-foreground">商品カテゴリ</span>
          </nav>

          <h1 className="text-2xl font-bold mb-8 text-foreground">商品カテゴリ</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-card rounded-lg border border-border overflow-hidden"
              >
                <Link 
                  href={category.href}
                  className="block p-4 bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <h2 className="font-bold text-foreground">{category.name}</h2>
                </Link>
                {category.subcategories && category.subcategories.length > 0 && (
                  <ul className="p-4 space-y-2">
                    {category.subcategories.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={sub.href}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                        >
                          <ChevronRight className="h-3 w-3" />
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
