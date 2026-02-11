import Link from "next/link"
import { 
  HardHat, 
  Package, 
  Shield, 
  Briefcase, 
  Wrench, 
  Ruler, 
  Hammer, 
  Building, 
  Fan, 
  Car 
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/data/categories"

const categoryStyles = [
  {
    id: "safety",
    icon: HardHat,
    color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  },
  {
    id: "logistics",
    icon: Package,
    color: "bg-amber-50 text-amber-600 hover:bg-amber-100",
  },
  {
    id: "safety-disaster",
    icon: Shield,
    color: "bg-red-50 text-red-600 hover:bg-red-100",
  },
  {
    id: "office",
    icon: Briefcase,
    color: "bg-slate-50 text-slate-600 hover:bg-slate-100",
  },
  {
    id: "cutting",
    icon: Wrench,
    color: "bg-zinc-50 text-zinc-600 hover:bg-zinc-100",
  },
  {
    id: "measuring",
    icon: Ruler,
    color: "bg-green-50 text-green-600 hover:bg-green-100",
  },
  {
    id: "power-tools",
    icon: Hammer,
    color: "bg-orange-50 text-orange-600 hover:bg-orange-100",
  },
  {
    id: "building",
    icon: Building,
    color: "bg-stone-50 text-stone-600 hover:bg-stone-100",
  },
  {
    id: "hvac",
    icon: Fan,
    color: "bg-cyan-50 text-cyan-600 hover:bg-cyan-100",
  },
  {
    id: "automotive",
    icon: Car,
    color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
  },
]

type CategoryGridProps = {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section>
      <h2 className="text-xl font-bold mb-4 text-foreground">カテゴリーから探す</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {categories.map((category) => {
          const style = categoryStyles.find((s) => s.id === category.id)
          const Icon = style?.icon ?? Package
          const color = style?.color ?? "bg-muted text-foreground hover:bg-muted/80"
          return (
            <Link
              key={category.id}
              href={category.href}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-lg transition-colors",
                color
              )}
            >
              <Icon className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium text-center leading-tight">
                {category.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
