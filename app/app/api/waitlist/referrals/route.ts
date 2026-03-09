import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get('wallet')

  if (!wallet) {
    return NextResponse.json({ error: 'wallet param required' }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    const { count, error } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_wallet', wallet.toLowerCase())

    if (error) {
      return NextResponse.json({ count: 0, stub: true, error: error.message })
    }

    return NextResponse.json({ count: count ?? 0 })
  } catch {
    // Supabase not configured yet — return stub so UI doesn't crash
    return NextResponse.json({ count: 0, stub: true })
  }
}
