import { fetchProducts } from "@/lib/supabase/products"
import { QuickOrderClient } from "@/app/quick-order/quick-order-client"

export const dynamic = "force-dynamic"

export default async function QuickOrderPage() {
  const products = await fetchProducts()
  return <QuickOrderClient products={products} />
}
