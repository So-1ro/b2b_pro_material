import { createClient } from "@/utils/supabase/server"
import type { Product } from "@/lib/data/products"
import { fetchCurrentBranch } from "@/lib/supabase/branches"

type ProductRow = {
  id: string
  product_code: string | null
  name: string | null
  standard_price: number | null
  tax_rate: number | null
  description: string | null
  brand: string | null
  category: string | null
  images: string[] | null
  image_url: string | null
  stock_status: string | null
  is_active: boolean | null
}

type PriceRow = {
  product_id: string
  override_price: number | null
}

const STOCK_STATUSES = new Set(["in_stock", "low_stock", "out_of_stock", "contact"])

function toProduct(row: ProductRow, overridePrice?: number | null): Product {
  const images =
    row.images && row.images.length > 0
      ? row.images
      : row.image_url
        ? [row.image_url]
        : []

  const stock = STOCK_STATUSES.has(row.stock_status ?? "")
    ? (row.stock_status as Product["stock"])
    : "in_stock"

  return {
    id: row.id,
    sku: row.product_code ?? row.id,
    name: row.name ?? "名称未設定",
    description: row.description ?? "",
    basePrice: overridePrice ?? row.standard_price ?? 0,
    taxRate: (row.tax_rate ?? 10) / 100,
    category: row.category ?? "uncategorized",
    subcategory: row.category ?? "uncategorized",
    brand: row.brand ?? "",
    images,
    specs: {},
    stock,
    rating: 4.0,
    reviewCount: 0,
    sameDay: false,
    tags: [],
  }
}

const SELECT_COLUMNS =
  "id,product_code,name,standard_price,tax_rate,description,brand,category,images,image_url,stock_status,is_active"

export async function fetchProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const branch = await fetchCurrentBranch()
  const { data, error } = await supabase
    .from("products")
    .select(SELECT_COLUMNS)
    .eq("is_active", true)
    .order("name", { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`)
  }

  const productRows = (data ?? []) as ProductRow[]
  const overrideMap = new Map<string, number>()

  if (branch?.company_id && productRows.length > 0) {
    const ids = productRows.map((row) => row.id)
    const { data: priceRows } = await supabase
      .from("prices")
      .select("product_id,override_price")
      .eq("company_id", branch.company_id)
      .in("product_id", ids)

    for (const row of (priceRows ?? []) as PriceRow[]) {
      if (row.override_price !== null) {
        overrideMap.set(row.product_id, row.override_price)
      }
    }
  }

  return productRows.map((row) => {
    const overridePrice = overrideMap.get(row.id)
    return toProduct(row, overridePrice)
  })
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const supabase = await createClient()
  const branch = await fetchCurrentBranch()
  const { data, error } = await supabase
    .from("products")
    .select(SELECT_COLUMNS)
    .or(`id.eq.${id},product_code.eq.${id}`)
    .single()

  if (error) {
    return null
  }

  if (!data) return null
  let overridePrice: number | null = null

  if (branch?.company_id) {
    const { data: priceRow } = await supabase
      .from("prices")
      .select("override_price")
      .eq("company_id", branch.company_id)
      .eq("product_id", (data as ProductRow).id)
      .single()
    overridePrice = (priceRow as { override_price: number | null } | null)?.override_price ?? null
  }

  return toProduct(data as ProductRow, overridePrice)
}
