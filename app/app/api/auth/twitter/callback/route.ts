import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

  if (process.env.NEXT_PUBLIC_AUTH_STUB === 'true') {
    return NextResponse.redirect(new URL('/waitlist?twitter_stub=true&username=R2AGENT', baseUrl))
  }

  const code = request.nextUrl.searchParams.get('code')
  const wallet = request.cookies.get('pending_wallet')?.value

  if (!code) {
    return NextResponse.redirect(new URL('/waitlist?error=twitter_failed', baseUrl))
  }

  const clientId = process.env.TWITTER_CLIENT_ID!
  const clientSecret = process.env.TWITTER_CLIENT_SECRET!
  const redirectUri = `${baseUrl}/api/auth/twitter/callback`

  const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: 'challenge',
    }),
  })

  const tokenData = await tokenRes.json()
  if (!tokenData.access_token) {
    return NextResponse.redirect(new URL('/waitlist?error=twitter_token_failed', baseUrl))
  }

  const userRes = await fetch('https://api.twitter.com/2/users/me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })
  const userData = await userRes.json()
  const twitterUser = userData.data

  if (wallet && twitterUser) {
    const supabase = await createClient()
    await supabase
      .from('users')
      .update({
        twitter_id: twitterUser.id,
        twitter_username: twitterUser.username,
        updated_at: new Date().toISOString(),
      })
      .eq('wallet_address', wallet.toLowerCase())
  }

  return NextResponse.redirect(
    new URL(`/waitlist?twitter_verified=true&username=${twitterUser?.username ?? ''}`, baseUrl)
  )
}
