import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// TODO: 实现 GET /api/reports/:id，返回结构化指标与 AI 建议

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  return NextResponse.json(
    { message: `GET /api/reports/${params.id} 尚未实现` },
    { status: 501 }
  )
}
