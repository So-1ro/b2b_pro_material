import { createClient } from "@/utils/supabase/server"
import { categories as fallbackCategories, type Category } from "@/lib/data/categories"

type CategoryRow = {
  id: string
  name: string
  parent_id: string | null
  sort_order: number | null
  is_active: boolean | null
}

function buildTree(rows: CategoryRow[]): Category[] {
  const activeRows = rows.filter((row) => row.is_active !== false)
  const sorted = [...activeRows].sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999))

  const byParent = new Map<string | null, CategoryRow[]>()
  for (const row of sorted) {
    const key = row.parent_id ?? null
    const list = byParent.get(key) ?? []
    list.push(row)
    byParent.set(key, list)
  }

  const toNode = (row: CategoryRow): Category => {
    const children = (byParent.get(row.id) ?? []).map(toNode)
    return {
      id: row.id,
      name: row.name,
      href: `/category/${row.id}`,
      subcategories: children.length > 0 ? children : undefined,
    }
  }

  return (byParent.get(null) ?? []).map(toNode)
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("categories")
      .select("id,name,parent_id,sort_order,is_active")
      .order("sort_order", { ascending: true })

    if (error || !data) {
      return fallbackCategories
    }

    const tree = buildTree(data as CategoryRow[])
    return tree.length > 0 ? tree : fallbackCategories
  } catch {
    return fallbackCategories
  }
}
