import Link from "next/link"
import { CheckCircle, FileText, ArrowRight } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"

export default function CheckoutCompletePage() {
  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold mb-4 text-foreground">
              ご注文ありがとうございます
            </h1>
            
            <p className="text-muted-foreground mb-6">
              ご注文を受け付けました。確認メールをお送りしましたのでご確認ください。
            </p>

            <div className="bg-card rounded-lg border border-border p-6 mb-8">
              <p className="text-sm text-muted-foreground mb-2">注文番号</p>
              <p className="text-xl font-bold text-foreground">{orderNumber}</p>
            </div>

            <div className="space-y-3">
              <Link href="/orders" className="block">
                <Button className="w-full" size="lg">
                  <FileText className="mr-2 h-5 w-5" />
                  注文履歴を確認
                </Button>
              </Link>
              
              <Link href="/" className="block">
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  トップページへ戻る
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground mt-8">
              帳票（発注書・納品書・請求書）は注文履歴ページからダウンロードできます。
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
