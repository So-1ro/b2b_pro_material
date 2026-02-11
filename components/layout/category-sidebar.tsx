"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { categories as fallbackCategories, type Category } from "@/lib/data/categories"

interface CategorySidebarProps {
  className?: string
  currentCategoryId?: string
  categories?: Category[]
}

export function CategorySidebar({ className, currentCategoryId, categories }: CategorySidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([currentCategoryId || ""])
  const sourceCategories = categories && categories.length > 0 ? categories : fallbackCategories

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <aside className={cn("w-full", className)}>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary">
          <h2 className="font-bold text-foreground">カテゴリから探す</h2>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            {sourceCategories.map((category) => {
              const isExpanded = expandedCategories.includes(category.id)
              const isActive = currentCategoryId === category.id

              return (
                <li key={category.id}>
                  <div
                    className={cn(
                      "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors cursor-pointer",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted text-foreground"
                    )}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <Link 
                      href={category.href}
                      className="flex-1 truncate"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {category.name}
                    </Link>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <button
                        type="button"
                        className="ml-2 p-1 hover:bg-card/20 rounded"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleCategory(category.id)
                        }}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                  {category.subcategories && isExpanded && (
                    <ul className="ml-4 mt-1 space-y-1 border-l-2 border-border pl-2">
                      {category.subcategories.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            href={sub.href}
                            className={cn(
                              "block rounded-md px-3 py-1.5 text-sm transition-colors",
                              currentCategoryId === sub.id
                                ? "bg-secondary text-secondary-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export { fallbackCategories as categories }
