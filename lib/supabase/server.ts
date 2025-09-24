import { cookies } from 'next/headers'
import { createServerComponentClient, createServerActionClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import type { SupabaseClient } from '@supabase/supabase-js'

type Database = Record<string, never>

type ServerClientOptions = {
  cookieStore?: ReturnType<typeof cookies>
}

function getCookieStore() {
  return cookies()
}

export function createSupabaseServerClient(options: ServerClientOptions = {}): SupabaseClient<Database> {
  const cookieStore = options.cookieStore ?? getCookieStore()
  return createServerComponentClient<Database>({
    cookies: () => cookieStore
  })
}

export function createSupabaseServerActionClient(options: ServerClientOptions = {}): SupabaseClient<Database> {
  const cookieStore = options.cookieStore ?? getCookieStore()
  return createServerActionClient<Database>({
    cookies: () => cookieStore
  })
}

export function createSupabaseRouteHandlerClient(): SupabaseClient<Database> {
  return createRouteHandlerClient<Database>({
    cookies
  })
}
