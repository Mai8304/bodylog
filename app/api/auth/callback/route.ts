import { NextRequest, NextResponse } from 'next/server'

import { createSupabaseRouteHandlerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const locale = requestUrl.searchParams.get('locale') ?? 'zh'
  const redirectTo = requestUrl.searchParams.get('redirectTo') ?? `/${locale}/dashboard`

  const supabase = createSupabaseRouteHandlerClient()

  await supabase.auth.exchangeCodeForSession(request)

  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin), {
    status: 302
  })
}
