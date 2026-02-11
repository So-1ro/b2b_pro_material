import { NextResponse } from "next/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

type RegisterBody = {
  company: string
  location: string
  name: string
  email: string
  password: string
}

function normalizeLoginId(input: string) {
  const raw = input.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
  const base = raw || "branch"
  const suffix = Date.now().toString().slice(-6)
  return `${base}-${suffix}`
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterBody
    if (!body.company || !body.location || !body.name || !body.email || !body.password) {
      return NextResponse.json({ error: "必須項目が不足しています。" }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 }
      )
    }

    const admin = createSupabaseClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: createdAuth, error: authError } = await admin.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: false,
      user_metadata: {
        company: body.company,
        location: body.location,
        contact_name: body.name,
      },
    })
    if (authError || !createdAuth.user) {
      return NextResponse.json(
        { error: authError?.message ?? "Authユーザー作成に失敗しました。" },
        { status: 400 }
      )
    }

    const authUserId = createdAuth.user.id
    const { data: existingCompany } = await admin
      .from("companies")
      .select("id")
      .eq("name", body.company.trim())
      .maybeSingle()

    const companyId = existingCompany?.id ?? crypto.randomUUID()

    if (!existingCompany) {
      const { error: companyInsertError } = await admin.from("companies").insert({
        id: companyId,
        name: body.company.trim(),
      })
      if (companyInsertError) {
        await admin.auth.admin.deleteUser(authUserId)
        return NextResponse.json({ error: companyInsertError.message }, { status: 400 })
      }
    }

    const { error: branchInsertError } = await admin.from("branches").insert({
      id: crypto.randomUUID(),
      company_id: companyId,
      name: body.location.trim(),
      login_id: normalizeLoginId(body.location),
      email: body.email.trim().toLowerCase(),
      auth_user_id: authUserId,
    })
    if (branchInsertError) {
      await admin.auth.admin.deleteUser(authUserId)
      return NextResponse.json({ error: branchInsertError.message }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      message: "登録が完了しました。確認メールをご確認ください。",
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "登録に失敗しました。" },
      { status: 500 }
    )
  }
}
