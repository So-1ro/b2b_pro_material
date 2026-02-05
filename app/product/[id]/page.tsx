import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { fetchProductById, fetchProducts } from "@/lib/supabase/products"
import { ProductClient } from "@/app/product/[id]/product-client"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await fetchProductById(id)

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">商品が見つかりません</h1>
            <p className="text-muted-foreground mb-6">
              お探しの商品は存在しないか、削除された可能性があります。
            </p>
            <Link href="/">
              <Button>トップページへ戻る</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const allProducts = await fetchProducts()
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return <ProductClient product={product} relatedProducts={relatedProducts} />
}
