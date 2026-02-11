import { HomeClient } from "@/app/_components/home-client"
import { fetchProducts } from "@/lib/supabase/products"
import { fetchCategories } from "@/lib/supabase/categories"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()])
  return <HomeClient products={products} categories={categories} />
}
