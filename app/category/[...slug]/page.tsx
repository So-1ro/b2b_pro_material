import { fetchCategories } from "@/lib/supabase/categories"
import { fetchProducts } from "@/lib/supabase/products"
import { CategoryClient } from "@/app/category/[...slug]/category-client"
import type { Product } from "@/lib/data/products"
import type { Category } from "@/lib/data/categories"

interface CategoryPageProps {
  params: Promise<{ slug: string[] }>
}

function flattenCategories(navCategories: Category[]) {
  return navCategories.flatMap((cat) => [
    { id: cat.id, name: cat.name, href: cat.href, parent: null },
    ...(cat.subcategories || []).map((sub) => ({
      id: sub.id,
      name: sub.name,
      href: sub.href,
      parent: cat.id,
    })),
  ])
}

export const dynamic = "force-dynamic"

function filterByCategory(products: Product[], categoryId: string, flattened: ReturnType<typeof flattenCategories>) {
  if (categoryId === "all") return products
  const childIds = flattened
    .filter((c) => c.parent === categoryId)
    .map((c) => c.id)
  const matchIds = new Set([categoryId, ...childIds])
  return products.filter(
    (p) => matchIds.has(p.categoryId) || matchIds.has(p.subcategoryId)
  )
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const navCategories = await fetchCategories()
  const flat = flattenCategories(navCategories)
  const slug = Array.isArray(resolvedParams.slug) ? resolvedParams.slug : []

  const currentId = slug.length > 0 ? slug[slug.length - 1] : "all"
  const currentCategory = flat.find((c) => c.id === currentId)
  const allProducts = await fetchProducts()
  const products = filterByCategory(allProducts, currentId, flat)

  return (
    <CategoryClient
      products={products}
      currentCategoryId={currentId}
      currentCategory={currentCategory ?? null}
      categories={navCategories}
    />
  )
}
