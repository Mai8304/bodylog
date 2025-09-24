import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// TODO: 实现 GET /api/analytics/series，返回指标时间序列

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { message: 'GET /api/analytics/series 尚未实现' },
    { status: 501 }
  )
}
