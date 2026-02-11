"use client"

import { createClient } from "@/utils/supabase/browser"
import type { Product } from "@/lib/data/products"

export type CheckoutCartItem = {
  product: Product
  quantity: number
}

type BranchRow = {
  id: string
  company_id: string
  name: string | null
  address: string | null
  phone: string | null
}

type OrderRow = {
  id: string
  order_number: string | null
  created_at: string | null
  total_amount: number | null
  status: string | null
  order_items:
    | {
        id: string
        quantity: number | null
        unit_price: number | null
        product:
          | {
              id: string
              name: string | null
              images: string[] | null
              image_url: string | null
            }
          | {
              id: string
              name: string | null
              images: string[] | null
              image_url: string | null
            }[]
          | null
      }[]
    | null
  documents:
    | {
        type: "po" | "dn" | "invoice"
        url: string | null
      }[]
    | null
}

type DocumentRow = {
  id: string
  type: "po" | "dn" | "invoice"
  document_number: string | null
  created_at: string | null
  status: "available" | "pending" | null
  url: string | null
  order:
    | {
        order_number: string | null
        total_amount: number | null
      }
    | {
        order_number: string | null
        total_amount: number | null
      }[]
    | null
}

export type UiOrder = {
  id: string
  orderNumber: string
  orderDate: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: {
    id: string
    name: string
    quantity: number
    unitPrice: number
  }[]
  subtotal: number
  tax: number
  total: number
  documents: {
    po?: string
    dn?: string
    invoice?: string
  }
}

export type UiDocument = {
  id: string
  type: "po" | "dn" | "invoice"
  documentNumber: string
  orderNumber: string
  issueDate: string
  amount: number
  status: "available" | "pending"
  fileUrl: string
}

export type BranchProfile = {
  id: string
  companyId: string
  name: string
  address: string
  phone: string
}

function normalizeOrderStatus(status: string | null): UiOrder["status"] {
  if (!status) return "pending"
  if (status === "ordered") return "pending"
  if (status === "canceled") return "cancelled"
  if (["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
    return status as UiOrder["status"]
  }
  return "pending"
}

function formatDate(iso: string | null): string {
  if (!iso) return "-"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "-"
  return d.toISOString().slice(0, 10)
}

function orderNumber(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  const h = String(now.getHours()).padStart(2, "0")
  const mi = String(now.getMinutes()).padStart(2, "0")
  const s = String(now.getSeconds()).padStart(2, "0")
  return `ORD-${y}${m}${d}-${h}${mi}${s}`
}

async function fetchBranchInternal(): Promise<BranchRow | null> {
  const supabase = createClient()
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData.user) return null

  const { data, error } = await supabase
    .from("branches")
    .select("id,company_id,name,address,phone")
    .eq("auth_user_id", authData.user.id)
    .single()

  if (error || !data) return null
  return data as BranchRow
}

export async function fetchCurrentBranchProfile(): Promise<BranchProfile | null> {
  const row = await fetchBranchInternal()
  if (!row) return null
  return {
    id: row.id,
    companyId: row.company_id,
    name: row.name ?? "未設定拠点",
    address: row.address ?? "",
    phone: row.phone ?? "",
  }
}

export async function fetchOrdersForCurrentUser(): Promise<UiOrder[]> {
  const branch = await fetchBranchInternal()
  if (!branch) return []

  const supabase = createClient()
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id,order_number,created_at,total_amount,status,order_items(id,quantity,unit_price,product:products(id,name,images,image_url)),documents(type,url)"
    )
    .eq("branch_id", branch.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`)
  }

  return ((data ?? []) as unknown as OrderRow[]).map((row) => {
    const items =
      row.order_items?.map((item) => ({
        id: item.id,
        name: (Array.isArray(item.product) ? item.product[0]?.name : item.product?.name) ?? "名称未設定",
        quantity: item.quantity ?? 0,
        unitPrice: item.unit_price ?? 0,
      })) ?? []

    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    const tax = row.total_amount ? Math.max(0, row.total_amount - subtotal) : 0

    const docs: UiOrder["documents"] = {}
    ;(row.documents ?? []).forEach((d) => {
      if (d.url) docs[d.type] = d.url
    })

    return {
      id: row.id,
      orderNumber: row.order_number ?? row.id,
      orderDate: formatDate(row.created_at),
      status: normalizeOrderStatus(row.status),
      items,
      subtotal,
      tax,
      total: row.total_amount ?? subtotal + tax,
      documents: docs,
    }
  })
}

export async function fetchDocumentsForCurrentUser(): Promise<UiDocument[]> {
  const branch = await fetchBranchInternal()
  if (!branch) return []

  const supabase = createClient()
  const { data: orderRows, error: orderError } = await supabase
    .from("orders")
    .select("id")
    .eq("branch_id", branch.id)

  if (orderError) {
    throw new Error(`Failed to fetch order ids: ${orderError.message}`)
  }

  const orderIds = (orderRows ?? []).map((row: { id: string }) => row.id)
  if (orderIds.length === 0) return []

  const { data, error } = await supabase
    .from("documents")
    .select("id,type,document_number,created_at,status,url,order:orders(order_number,total_amount)")
    .in("order_id", orderIds)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch documents: ${error.message}`)
  }

  return ((data ?? []) as unknown as DocumentRow[]).map((row) => ({
    id: row.id,
    type: row.type,
    documentNumber: row.document_number ?? row.id,
    orderNumber: (Array.isArray(row.order) ? row.order[0]?.order_number : row.order?.order_number) ?? "-",
    issueDate: formatDate(row.created_at),
    amount: (Array.isArray(row.order) ? row.order[0]?.total_amount : row.order?.total_amount) ?? 0,
    status: row.status === "pending" ? "pending" : "available",
    fileUrl: row.url ?? "",
  }))
}

export async function submitOrder(params: {
  items: CheckoutCartItem[]
  paymentMethod: string
  deliveryNotes: string
}): Promise<string> {
  const branch = await fetchBranchInternal()
  if (!branch) {
    throw new Error("拠点情報を取得できません。再ログインしてください。")
  }
  if (params.items.length === 0) {
    throw new Error("カートが空です。")
  }

  const subtotal = params.items.reduce(
    (sum, item) => sum + item.product.basePrice * item.quantity,
    0
  )
  const tax = params.items.reduce(
    (sum, item) =>
      sum + Math.floor(item.product.basePrice * item.product.taxRate) * item.quantity,
    0
  )
  const total = subtotal + tax
  const currentOrderNumber = orderNumber()

  const supabase = createClient()
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: currentOrderNumber,
      branch_id: branch.id,
      total_amount: total,
      tax_amount: tax,
      status: "ordered",
    })
    .select("id")
    .single()

  if (orderError || !orderData) {
    throw new Error(orderError?.message ?? "注文ヘッダーの保存に失敗しました。")
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    params.items.map((item) => ({
      order_id: orderData.id,
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.product.basePrice,
    }))
  )

  if (itemsError) {
    throw new Error(itemsError.message)
  }

  const { error: docError } = await supabase.from("documents").insert({
    order_id: orderData.id,
    type: "po",
    document_number: `PO-${currentOrderNumber.replace("ORD-", "")}`,
    url: "https://placehold.co/600x800?text=PO",
    status: "pending",
  })

  if (docError) {
    throw new Error(docError.message)
  }

  return currentOrderNumber
}
