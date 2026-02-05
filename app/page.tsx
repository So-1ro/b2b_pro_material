import { HomeClient } from "@/app/_components/home-client"
import { fetchProducts } from "@/lib/supabase/products"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const products = await fetchProducts()
  return <HomeClient products={products} />
}
