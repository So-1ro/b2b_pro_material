import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient } from "@/utils/supabase/server"

type NotifyPayload = {
  orderNumber: string
  amount: number
  itemCount: number
  paymentMethod: string
  deliveryNotes?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as NotifyPayload
    if (!body?.orderNumber) {
      return NextResponse.json({ error: "orderNumber is required" }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.RESEND_FROM_EMAIL
    if (!apiKey || !from) {
      return NextResponse.json(
        { error: "Missing RESEND_API_KEY or RESEND_FROM_EMAIL" },
        { status: 500 }
      )
    }

    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: branch } = await supabase
      .from("branches")
      .select("name,email")
      .eq("auth_user_id", authData.user.id)
      .single()

    const resend = new Resend(apiKey)
    const fallbackTo = process.env.ORDER_NOTIFY_TO
    const to = [branch?.email, fallbackTo].filter(Boolean) as string[]
    if (to.length === 0) {
      return NextResponse.json(
        { error: "Recipient is not configured. Set branches.email or ORDER_NOTIFY_TO." },
        { status: 500 }
      )
    }

    const paymentLabel =
      body.paymentMethod === "invoice" ? "請求書払い（月末締め翌月払い）" : "銀行振込（前払い）"

    await resend.emails.send({
      from,
      to,
      subject: `【受注通知】${body.orderNumber}`,
      html: `
        <h2>注文を受け付けました</h2>
        <p>注文番号: ${body.orderNumber}</p>
        <p>拠点: ${branch?.name ?? "未設定"}</p>
        <p>商品点数: ${body.itemCount} 点</p>
        <p>合計金額(税込): ¥${body.amount.toLocaleString()}</p>
        <p>支払い方法: ${paymentLabel}</p>
        <p>備考: ${body.deliveryNotes?.trim() || "なし"}</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send mail" },
      { status: 500 }
    )
  }
}
