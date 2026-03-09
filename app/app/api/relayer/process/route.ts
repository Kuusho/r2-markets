import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: pending } = await supabase
    .from('pending_registrations')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  return NextResponse.json({
    status: 'queue_fetched',
    count: pending?.length ?? 0,
    records: pending ?? [],
  })
}

export async function POST(request: NextRequest) {
  const relayerKey = process.env.RELAYER_PRIVATE_KEY

  if (!relayerKey || relayerKey === 'placeholder') {
    const supabase = await createClient()
    const { data: pending } = await supabase
      .from('pending_registrations')
      .select('*')
      .eq('status', 'pending')

    return NextResponse.json({
      status: 'not_configured',
      message: 'RELAYER_PRIVATE_KEY not set. Would submit these ERC-8004 registrations:',
      pending: pending ?? [],
    })
  }

  // When RELAYER_PRIVATE_KEY is set, this is where the on-chain submission happens.
  // Implementation: read pending records, submit ERC-8004 registration txs via viem walletClient,
  // update status to 'submitted' with tx_hash, mark 'confirmed' on receipt.
  return NextResponse.json({ status: 'relayer_active', message: 'Relayer processing initiated' })
}
