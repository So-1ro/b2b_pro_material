"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const slides = [
  {
    id: 1,
    title: "法人向け資材調達を\nもっとシンプルに",
    description: "50,000点以上の商品を、拠点ごとに発注・管理。請求書・納品書もダウンロード可能。",
    cta: "商品を探す",
    href: "/categories",
    bgColor: "bg-primary",
    icon: Building2,
  },
  {
    id: 2,
    title: "当日出荷対応\n急ぎの発注も安心",
    description: "平日17時までのご注文で当日出荷対応商品多数。現場を止めません。",
    cta: "当日出荷商品を見る",
    href: "/same-day",
    bgColor: "bg-accent",
    icon: Truck,
  },
  {
    id: 3,
    title: "企業専用価格で\nコスト削減",
    description: "御社専用の価格設定が可能。まとめ買いでさらにお得に。",
    cta: "法人登録はこちら",
    href: "/register",
    bgColor: "bg-secondary",
    textColor: "text-secondary-foreground",
    icon: ShieldCheck,
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => {
          const Icon = slide.icon
          return (
            <div
              key={slide.id}
              className={cn(
                "min-w-full px-6 py-10 md:px-12 md:py-16",
                slide.bgColor,
                slide.textColor || "text-primary-foreground"
              )}
            >
              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    slide.textColor ? "bg-foreground/10" : "bg-primary-foreground/20"
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold mb-4 whitespace-pre-line leading-tight">
                  {slide.title}
                </h2>
                <p className={cn(
                  "text-sm md:text-base mb-6 max-w-md",
                  slide.textColor ? "text-muted-foreground" : "text-primary-foreground/90"
                )}>
                  {slide.description}
                </p>
                <Link href={slide.href}>
                  <Button
                    size="lg"
                    variant={slide.textColor ? "default" : "secondary"}
                    className={cn(
                      slide.textColor 
                        ? "" 
                        : "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    )}
                  >
                    {slide.cta}
                  </Button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 flex items-center justify-center hover:bg-card transition-colors"
        aria-label="前のスライド"
      >
        <ChevronLeft className="h-5 w-5 text-foreground" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 flex items-center justify-center hover:bg-card transition-colors"
        aria-label="次のスライド"
      >
        <ChevronRight className="h-5 w-5 text-foreground" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentSlide === index
                ? "w-6 bg-card"
                : "bg-card/50 hover:bg-card/70"
            )}
            aria-label={`スライド ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
