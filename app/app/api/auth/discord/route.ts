import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

  if (process.env.NEXT_PUBLIC_AUTH_STUB === 'true') {
    return NextResponse.redirect(
      new URL('/waitlist?discord_stub=true&username=R2AGENT%230042', baseUrl)
    )
  }

  const clientId = process.env.DISCORD_CLIENT_ID!
  const redirectUri = encodeURIComponent(`${baseUrl}/api/auth/discord/callback`)
  const scope = encodeURIComponent('identify guilds.members.read')
  const state = crypto.randomUUID()

  const discordAuthUrl =
    `https://discord.com/api/oauth2/authorize` +
    `?response_type=code` +
    `&client_id=${clientId}` +
    `&redirect_uri=${redirectUri}` +
    `&scope=${scope}` +
    `&state=${state}`

  const response = NextResponse.redirect(discordAuthUrl)
  response.cookies.set('discord_oauth_state', state, { httpOnly: true, sameSite: 'lax', maxAge: 600 })
  return response
}
