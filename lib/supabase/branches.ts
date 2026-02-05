import { createClient } from "@/utils/supabase/server"

type BranchRow = {
  id: string
  company_id: string
  name: string | null
}

export async function fetchCurrentBranch(): Promise<BranchRow | null> {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()

  if (!authData?.user) {
    return null
  }

  const { data, error } = await supabase
    .from("branches")
    .select("id,company_id,name")
    .eq("auth_user_id", authData.user.id)
    .single()

  if (error) {
    return null
  }

  return data as BranchRow
}
