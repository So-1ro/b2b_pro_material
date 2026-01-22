import Link from "next/link"
import { Phone, Mail, Clock } from "lucide-react"

const footerLinks = {
  products: {
    title: "商品カテゴリー",
    links: [
      { label: "安全保護具・作業服", href: "/category/safety" },
      { label: "工具・電動工具", href: "/category/tools" },
      { label: "オフィスサプライ", href: "/category/office" },
      { label: "梱包・物流用品", href: "/category/packaging" },
      { label: "すべてのカテゴリー", href: "/categories" },
    ],
  },
  guide: {
    title: "ご利用ガイド",
    links: [
      { label: "はじめての方へ", href: "/guide/first-time" },
      { label: "ご注文方法", href: "/guide/order" },
      { label: "お届けについて", href: "/guide/delivery" },
      { label: "お支払いについて", href: "/guide/payment" },
      { label: "返品・交換", href: "/guide/return" },
    ],
  },
  company: {
    title: "企業情報",
    links: [
      { label: "会社概要", href: "/company" },
      { label: "特定商取引法に基づく表記", href: "/legal/tokusho" },
      { label: "プライバシーポリシー", href: "/privacy" },
      { label: "利用規約", href: "/terms" },
    ],
  },
  support: {
    title: "サポート",
    links: [
      { label: "よくあるご質問", href: "/faq" },
      { label: "お問い合わせ", href: "/contact" },
      { label: "法人登録について", href: "/business-registration" },
    ],
  },
}

export function Footer() {
  return (
    <footer className="bg-foreground text-card">
      <div className="container mx-auto px-4 py-12">
        {/* Contact info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 pb-10 border-b border-card/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-card/10 flex items-center justify-center">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-card/70">電話でのお問い合わせ</p>
              <p className="font-bold text-lg">0120-XXX-XXX</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-card/10 flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-card/70">メールでのお問い合わせ</p>
              <p className="font-bold">support@promaterial.example.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-card/10 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-card/70">受付時間</p>
              <p className="font-bold">平日 9:00 - 18:00</p>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-bold mb-4 text-card">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-card/70 hover:text-card transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-card/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-card rounded-md flex items-center justify-center">
              <span className="text-foreground font-bold text-sm">PM</span>
            </div>
            <span className="font-bold">ProMaterial</span>
          </div>
          <p className="text-sm text-card/70">
            © 2026 ProMaterial Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
