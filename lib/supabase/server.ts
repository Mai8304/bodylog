import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 仅在 Route Handler / Server Action 中使用（允许写入 Cookie）
export function createSupabaseRouteClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: '', ...options })
      }
    }
  })
}

// 仅在 RSC（服务器组件/布局）中使用：禁止写 Cookie，避免 Next 15 报错
export function createSupabaseRSCClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      // 在 RSC 中禁止写入，提供 no-op 以避免抛错
      set(_name: string, _value: string, _options: CookieOptions) {
        // no-op
      },
      remove(_name: string, _options: CookieOptions) {
        // no-op
      }
    }
  })
}
