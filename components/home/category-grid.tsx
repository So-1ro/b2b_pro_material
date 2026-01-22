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

const categories = [
  {
    id: "safety",
    name: "安全保護具・作業服",
    icon: HardHat,
    href: "/category/safety",
    color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  },
  {
    id: "logistics",
    name: "物流・保管・梱包",
    icon: Package,
    href: "/category/logistics",
    color: "bg-amber-50 text-amber-600 hover:bg-amber-100",
  },
  {
    id: "safety-disaster",
    name: "防災・防犯用品",
    icon: Shield,
    href: "/category/safety-disaster",
    color: "bg-red-50 text-red-600 hover:bg-red-100",
  },
  {
    id: "office",
    name: "オフィスサプライ",
    icon: Briefcase,
    href: "/category/office",
    color: "bg-slate-50 text-slate-600 hover:bg-slate-100",
  },
  {
    id: "cutting",
    name: "切削工具・研磨材",
    icon: Wrench,
    href: "/category/cutting",
    color: "bg-zinc-50 text-zinc-600 hover:bg-zinc-100",
  },
  {
    id: "measuring",
    name: "測定・測量用品",
    icon: Ruler,
    href: "/category/measuring",
    color: "bg-green-50 text-green-600 hover:bg-green-100",
  },
  {
    id: "power-tools",
    name: "作業工具・電動工具",
    icon: Hammer,
    href: "/category/power-tools",
    color: "bg-orange-50 text-orange-600 hover:bg-orange-100",
  },
  {
    id: "building",
    name: "建築金物・建材",
    icon: Building,
    href: "/category/building",
    color: "bg-stone-50 text-stone-600 hover:bg-stone-100",
  },
  {
    id: "hvac",
    name: "空調・電設資材",
    icon: Fan,
    href: "/category/hvac",
    color: "bg-cyan-50 text-cyan-600 hover:bg-cyan-100",
  },
  {
    id: "automotive",
    name: "自動車用品",
    icon: Car,
    href: "/category/automotive",
    color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
  },
]

export function CategoryGrid() {
  return (
    <section>
      <h2 className="text-xl font-bold mb-4 text-foreground">カテゴリーから探す</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Link
              key={category.id}
              href={category.href}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-lg transition-colors",
                category.color
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
