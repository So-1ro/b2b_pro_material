"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Category {
  id: string
  name: string
  href: string
  icon?: string
  subcategories?: Category[]
}

const categories: Category[] = [
  {
    id: "safety",
    name: "安全保護具・作業服・安全靴",
    href: "/category/safety",
    subcategories: [
      { id: "gloves", name: "手袋", href: "/category/safety/gloves" },
      { id: "masks", name: "マスク", href: "/category/safety/masks" },
      { id: "workwear", name: "作業服", href: "/category/safety/workwear" },
      { id: "safety-shoes", name: "安全靴・作業靴", href: "/category/safety/shoes" },
      { id: "protective", name: "安全保護具", href: "/category/safety/protective" },
    ],
  },
  {
    id: "logistics",
    name: "物流/保管/梱包用品/テープ",
    href: "/category/logistics",
    subcategories: [
      { id: "shipping", name: "物流用品", href: "/category/logistics/shipping" },
      { id: "storage", name: "保管用品", href: "/category/logistics/storage" },
      { id: "packing", name: "梱包用品", href: "/category/logistics/packing" },
      { id: "tape", name: "テープ", href: "/category/logistics/tape" },
    ],
  },
  {
    id: "safety-disaster",
    name: "安全用品/防災・防犯用品/安全標識",
    href: "/category/safety-disaster",
    subcategories: [
      { id: "safety-goods", name: "安全用品", href: "/category/safety-disaster/safety" },
      { id: "disaster", name: "防災用品", href: "/category/safety-disaster/disaster" },
      { id: "security", name: "防犯用品", href: "/category/safety-disaster/security" },
      { id: "signs", name: "安全標識", href: "/category/safety-disaster/signs" },
    ],
  },
  {
    id: "office",
    name: "オフィスサプライ",
    href: "/category/office",
    subcategories: [
      { id: "stationery", name: "事務用品", href: "/category/office/stationery" },
      { id: "food", name: "食品・飲料", href: "/category/office/food" },
      { id: "pc", name: "パソコン/周辺機器", href: "/category/office/pc" },
    ],
  },
  {
    id: "cutting",
    name: "切削工具・研磨材",
    href: "/category/cutting",
    subcategories: [
      { id: "cutting-tools", name: "切削工具", href: "/category/cutting/tools" },
      { id: "abrasives", name: "研磨材", href: "/category/cutting/abrasives" },
    ],
  },
  {
    id: "measuring",
    name: "測定・測量用品",
    href: "/category/measuring",
    subcategories: [
      { id: "measuring-tools", name: "測定用品", href: "/category/measuring/tools" },
      { id: "surveying", name: "測量用品（土木/建設）", href: "/category/measuring/surveying" },
      { id: "services", name: "測定関連サービス", href: "/category/measuring/services" },
    ],
  },
  {
    id: "power-tools",
    name: "作業工具/電動・空圧工具",
    href: "/category/power-tools",
    subcategories: [
      { id: "hand-tools", name: "作業工具", href: "/category/power-tools/hand" },
      { id: "electric", name: "電動工具", href: "/category/power-tools/electric" },
      { id: "engine", name: "エンジン工具", href: "/category/power-tools/engine" },
      { id: "pneumatic", name: "空圧工具", href: "/category/power-tools/pneumatic" },
    ],
  },
  {
    id: "building",
    name: "建築金物・建材・塗装内装用品",
    href: "/category/building",
    subcategories: [
      { id: "paint", name: "塗装・養生・内装用品", href: "/category/building/paint" },
      { id: "hardware", name: "建築金物", href: "/category/building/hardware" },
      { id: "materials", name: "建材・エクステリア", href: "/category/building/materials" },
    ],
  },
  {
    id: "hvac",
    name: "空調・電設資材/電気材料",
    href: "/category/hvac",
    subcategories: [
      { id: "hvac-equipment", name: "空調・電設資材", href: "/category/hvac/equipment" },
      { id: "electrical", name: "電気材料", href: "/category/hvac/electrical" },
    ],
  },
  {
    id: "automotive",
    name: "自動車用品",
    href: "/category/automotive",
    subcategories: [
      { id: "oil", name: "自動車用オイル・ケミカル", href: "/category/automotive/oil" },
      { id: "parts", name: "自動車補修部品", href: "/category/automotive/parts" },
      { id: "battery", name: "バッテリー・電装", href: "/category/automotive/battery" },
      { id: "tires", name: "タイヤ・足回り", href: "/category/automotive/tires" },
    ],
  },
]

interface CategorySidebarProps {
  className?: string
  currentCategoryId?: string
}

export function CategorySidebar({ className, currentCategoryId }: CategorySidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([currentCategoryId || ""])

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
            {categories.map((category) => {
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

export { categories }
