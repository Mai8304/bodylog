import { NextResponse } from 'next/server'

// TODO: 引入 createRouteHandlerClient 并实现真实逻辑

export async function GET() {
  return NextResponse.json(
    { message: 'GET /api/reports 尚未实现' },
    { status: 501 }
  )
}

export async function POST() {
  return NextResponse.json(
    { message: 'POST /api/reports 尚未实现' },
    { status: 501 }
  )
}
