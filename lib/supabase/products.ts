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
  prices?: {
    override_price: number | null
    company_id: string | null
  }[] | null
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
const SELECT_COLUMNS_WITH_PRICES = `${SELECT_COLUMNS}, prices:prices(override_price, company_id)`

function resolveOverridePrice(row: ProductRow): number | null {
  if (!row.prices || row.prices.length === 0) return null
  const match = row.prices.find((p) => p.override_price !== null)
  return match?.override_price ?? null
}

export async function fetchProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const branch = await fetchCurrentBranch()
  const query = supabase
    .from("products")
    .select(branch ? SELECT_COLUMNS_WITH_PRICES : SELECT_COLUMNS)
    .eq("is_active", true)
    .order("name", { ascending: true })

  if (branch?.company_id) {
    query.eq("prices.company_id", branch.company_id)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`)
  }

  return (data ?? []).map((row) => {
    const overridePrice = resolveOverridePrice(row as ProductRow)
    return toProduct(row as ProductRow, overridePrice)
  })
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const supabase = await createClient()
  const branch = await fetchCurrentBranch()
  const query = supabase
    .from("products")
    .select(branch ? SELECT_COLUMNS_WITH_PRICES : SELECT_COLUMNS)
    .or(`id.eq.${id},product_code.eq.${id}`)
    .single()

  if (branch?.company_id) {
    query.eq("prices.company_id", branch.company_id)
  }

  const { data, error } = await query

  if (error) {
    return null
  }

  if (!data) return null
  const overridePrice = resolveOverridePrice(data as ProductRow)
  return toProduct(data as ProductRow, overridePrice)
}
