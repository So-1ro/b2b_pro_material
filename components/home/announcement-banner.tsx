"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertCircle, X, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Announcement {
  id: string
  type: "important" | "info" | "promotion"
  title: string
  href: string
}

const announcements: Announcement[] = [
  {
    id: "1",
    type: "important",
    title: "【重要】年末年始の営業日・配送スケジュールについて",
    href: "/news/1",
  },
  {
    id: "2",
    type: "info",
    title: "決済システムのリニューアルについて [2026.01.15]",
    href: "/news/2",
  },
  {
    id: "3",
    type: "promotion",
    title: "新規会員登録で500ポイントプレゼント",
    href: "/campaign/welcome",
  },
]

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const importantAnnouncement = announcements.find((a) => a.type === "important")

  return (
    <div className="bg-red-50 border-b border-red-100">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 overflow-hidden">
            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
            <span className="text-sm font-medium text-destructive flex-shrink-0">
              重要なお知らせ
            </span>
            <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] text-red-700 flex-shrink-0">
              ダミー表示
            </span>
            <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
              {announcements.map((announcement, index) => (
                <Link
                  key={announcement.id}
                  href={announcement.href}
                  className={cn(
                    "text-sm whitespace-nowrap hover:underline flex items-center gap-1",
                    announcement.type === "important" 
                      ? "text-destructive font-medium" 
                      : "text-foreground"
                  )}
                >
                  {announcement.title}
                  <ChevronRight className="h-3 w-3" />
                </Link>
              ))}
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-red-100 rounded flex-shrink-0"
            aria-label="閉じる"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}
