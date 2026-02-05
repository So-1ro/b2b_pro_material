import { categories as navCategories } from "@/lib/data/categories"
import { fetchProducts } from "@/lib/supabase/products"
import { CategoryClient } from "@/app/category/[...slug]/category-client"
import type { Product } from "@/lib/data/products"

interface CategoryPageProps {
  params: { slug: string[] }
}

const flattenCategories = navCategories.flatMap((cat) => [
  { id: cat.id, name: cat.name, href: cat.href, parent: null },
  ...(cat.subcategories || []).map((sub) => ({
    id: sub.id,
    name: sub.name,
    href: sub.href,
    parent: cat.id,
  })),
])

export const dynamic = "force-dynamic"

function filterByCategory(products: Product[], categoryId: string) {
  if (categoryId === "all") return products
  const currentCategory = flattenCategories.find((c) => c.id === categoryId)
  const childNames = flattenCategories
    .filter((c) => c.parent === categoryId)
    .map((c) => c.name)
  const matchNames = new Set(
    [categoryId, currentCategory?.name, ...childNames].filter(Boolean) as string[]
  )
  return products.filter(
    (p) => matchNames.has(p.category) || matchNames.has(p.subcategory)
  )
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const slug = Array.isArray(params.slug) ? params.slug : []

  const currentId = slug.length > 0 ? slug[slug.length - 1] : "all"
  const currentCategory = flattenCategories.find((c) => c.id === currentId)
  const allProducts = await fetchProducts()
  const products = filterByCategory(allProducts, currentId)

  return (
    <CategoryClient
      products={products}
      currentCategoryId={currentId}
      currentCategory={currentCategory ?? null}
    />
  )
}
