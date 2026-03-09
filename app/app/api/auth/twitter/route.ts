import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

  if (process.env.NEXT_PUBLIC_AUTH_STUB === 'true') {
    return NextResponse.redirect(
      new URL('/waitlist?twitter_stub=true&username=R2AGENT', baseUrl)
    )
  }

  const clientId = process.env.TWITTER_CLIENT_ID!
  const redirectUri = encodeURIComponent(`${baseUrl}/api/auth/twitter/callback`)
  const scope = encodeURIComponent('tweet.read users.read follows.read')
  const state = crypto.randomUUID()

  const twitterAuthUrl =
    `https://twitter.com/i/oauth2/authorize` +
    `?response_type=code` +
    `&client_id=${clientId}` +
    `&redirect_uri=${redirectUri}` +
    `&scope=${scope}` +
    `&state=${state}` +
    `&code_challenge=challenge` +
    `&code_challenge_method=plain`

  const response = NextResponse.redirect(twitterAuthUrl)
  response.cookies.set('twitter_oauth_state', state, { httpOnly: true, sameSite: 'lax', maxAge: 600 })
  return response
}
