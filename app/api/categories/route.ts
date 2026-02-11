import { NextResponse } from "next/server"
import { fetchCategories } from "@/lib/supabase/categories"

function flattenNames(categories: Awaited<ReturnType<typeof fetchCategories>>) {
  const names: string[] = ["すべて"]
  for (const category of categories) {
    names.push(category.name)
  }
  return names
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const flat = searchParams.get("flat")
  const categories = await fetchCategories()

  if (flat === "1") {
    return NextResponse.json({ categories: flattenNames(categories) })
  }

  return NextResponse.json({ categories })
}
