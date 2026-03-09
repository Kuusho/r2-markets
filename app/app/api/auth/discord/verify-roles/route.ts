import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get('wallet')
  const discordId = request.nextUrl.searchParams.get('discord_id')

  if (!wallet || !discordId) {
    return NextResponse.json({ error: 'wallet and discord_id required' }, { status: 400 })
  }

  const botToken = process.env.DISCORD_BOT_TOKEN
  const holderRoleId = process.env.DISCORD_HOLDER_ROLE_ID
  const guildId = process.env.DISCORD_GUILD_ID

  if (!botToken || botToken === 'placeholder' || !holderRoleId || !guildId) {
    return NextResponse.json({ isHolder: false, stub: true })
  }

  const res = await fetch(
    `https://discord.com/api/guilds/${guildId}/members/${discordId}`,
    { headers: { Authorization: `Bot ${botToken}` } }
  )

  if (!res.ok) {
    return NextResponse.json({ isHolder: false, notInGuild: true })
  }

  const member = await res.json()
  const isHolder = member.roles?.includes(holderRoleId) ?? false

  return NextResponse.json({ isHolder })
}
