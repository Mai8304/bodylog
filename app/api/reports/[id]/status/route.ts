import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// TODO: 实现 GET /api/reports/:id/status，返回报告当前状态

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json(
    { message: `GET /api/reports/${params.id}/status 尚未实现` },
    { status: 501 }
  )
}
