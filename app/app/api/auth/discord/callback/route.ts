import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

  if (process.env.NEXT_PUBLIC_AUTH_STUB === 'true') {
    return NextResponse.redirect(
      new URL('/waitlist?discord_stub=true&username=R2AGENT%230042', baseUrl)
    )
  }

  const code = request.nextUrl.searchParams.get('code')
  const wallet = request.cookies.get('pending_wallet')?.value

  if (!code) {
    return NextResponse.redirect(new URL('/waitlist?error=discord_failed', baseUrl))
  }

  const clientId = process.env.DISCORD_CLIENT_ID!
  const clientSecret = process.env.DISCORD_CLIENT_SECRET!
  const redirectUri = `${baseUrl}/api/auth/discord/callback`

  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  const tokenData = await tokenRes.json()
  if (!tokenData.access_token) {
    return NextResponse.redirect(new URL('/waitlist?error=discord_token_failed', baseUrl))
  }

  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })
  const discordUser = await userRes.json()

  if (wallet && discordUser.id) {
    const supabase = await createClient()
    await supabase
      .from('users')
      .update({
        discord_id: discordUser.id,
        discord_username: `${discordUser.username}#${discordUser.discriminator}`,
        updated_at: new Date().toISOString(),
      })
      .eq('wallet_address', wallet.toLowerCase())
  }

  const displayName = `${discordUser.username}#${discordUser.discriminator}`
  return NextResponse.redirect(
    new URL(`/waitlist?discord_verified=true&username=${encodeURIComponent(displayName)}`, baseUrl)
  )
}
