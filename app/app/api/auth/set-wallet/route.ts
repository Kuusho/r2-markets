import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { wallet } = await request.json()
  
  if (!wallet || typeof wallet !== 'string') {
    return NextResponse.json({ error: 'wallet required' }, { status: 400 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('pending_wallet', wallet.toLowerCase(), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  })
  
  return response
}
