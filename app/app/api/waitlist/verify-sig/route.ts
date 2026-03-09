import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyInitSignature } from '@/lib/signature'

export async function POST(request: NextRequest) {
  const { walletAddress, signature, message } = await request.json()

  if (!walletAddress || !signature || !message) {
    return NextResponse.json({ error: 'walletAddress, signature, message required' }, { status: 400 })
  }

  const isValid = await verifyInitSignature(walletAddress, signature, message)

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    await supabase.from('pending_registrations').insert({
      wallet_address: walletAddress.toLowerCase(),
      signature,
      message,
      status: 'pending',
    })

    await supabase
      .from('users')
      .update({ status: 'queued', updated_at: new Date().toISOString() })
      .eq('wallet_address', walletAddress.toLowerCase())

    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .in('status', ['queued', 'upgraded'])

    return NextResponse.json({ success: true, queueSlot: count ?? 1 })
  } catch {
    // Supabase not configured — signature was valid, return stub slot
    return NextResponse.json({ success: true, queueSlot: 1, stub: true })
  }
}
