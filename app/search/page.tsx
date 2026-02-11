import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { fetchProductsBySearch } from "@/lib/supabase/products"
import { SearchClient } from "@/app/search/search-client"

type SearchPageProps = {
  searchParams: Promise<{
    q?: string
    category?: string
  }>
}

export const dynamic = "force-dynamic"

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "", category: categoryId } = await searchParams
  const filtered = await fetchProductsBySearch(q, categoryId)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <SearchClient products={filtered} query={q} categoryId={categoryId} />
      <Footer />
    </div>
  )
}
