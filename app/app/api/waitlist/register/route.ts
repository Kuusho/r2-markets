import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateReferralCode } from '@/lib/referral'

export async function POST(request: NextRequest) {
  const { walletAddress, referralCode } = await request.json()

  if (!walletAddress || typeof walletAddress !== 'string') {
    return NextResponse.json({ error: 'walletAddress required' }, { status: 400 })
  }

  let supabase: Awaited<ReturnType<typeof createClient>>
  try {
    supabase = await createClient()
  } catch {
    // Supabase not configured — return stub registration
    const code = generateReferralCode(walletAddress)
    return NextResponse.json({
      user: { wallet_address: walletAddress.toLowerCase(), referral_code: code, status: 'pending' },
      alreadyExisted: false,
      stub: true,
    })
  }
  const code = generateReferralCode(walletAddress)

  const { data: existingUser } = await supabase
    .from('users')
    .select('wallet_address, referral_code, status')
    .eq('wallet_address', walletAddress.toLowerCase())
    .single()

  if (existingUser) {
    return NextResponse.json({ user: existingUser, alreadyExisted: true })
  }

  let referredBy: string | null = null
  if (referralCode) {
    const { data: referrer } = await supabase
      .from('users')
      .select('wallet_address')
      .eq('referral_code', referralCode)
      .single()
    if (referrer) {
      referredBy = referrer.wallet_address
    }
  }

  const { data: newUser, error } = await supabase
    .from('users')
    .insert({
      wallet_address: walletAddress.toLowerCase(),
      referral_code: code,
      referred_by: referredBy,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (referredBy) {
    await supabase.from('referrals').insert({
      referrer_wallet: referredBy,
      referred_wallet: walletAddress.toLowerCase(),
    })
  }

  return NextResponse.json({ user: newUser, alreadyExisted: false })
}
