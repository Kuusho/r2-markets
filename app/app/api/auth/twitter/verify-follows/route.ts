import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const REQUIRED_FOLLOWS = ['r2markets', 'korewapandesu']

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get('wallet')
  
  if (!wallet) {
    return NextResponse.json({ error: 'wallet required' }, { status: 400 })
  }

  const supabase = await createClient()
  
  // Get user's twitter credentials
  const { data: user, error } = await supabase
    .from('users')
    .select('twitter_id, twitter_access_token, twitter_token_expires_at')
    .eq('wallet_address', wallet.toLowerCase())
    .single()

  if (error || !user?.twitter_access_token) {
    return NextResponse.json({ error: 'twitter not linked' }, { status: 400 })
  }

  // Check if token expired
  if (new Date(user.twitter_token_expires_at) < new Date()) {
    return NextResponse.json({ error: 'twitter token expired, please re-authenticate' }, { status: 401 })
  }

  try {
    // Get the user IDs for the accounts we want to check
    const targetUsersRes = await fetch(
      `https://api.twitter.com/2/users/by?usernames=${REQUIRED_FOLLOWS.join(',')}`,
      { headers: { Authorization: `Bearer ${user.twitter_access_token}` } }
    )
    const targetUsersData = await targetUsersRes.json()
    
    if (!targetUsersData.data) {
      console.error('[Twitter Verify] Failed to fetch target users:', targetUsersData)
      return NextResponse.json({ error: 'failed to fetch target accounts' }, { status: 500 })
    }

    const targetIds = new Map(targetUsersData.data.map((u: any) => [u.username.toLowerCase(), u.id]))

    // Check follows for each target
    const followStatus: Record<string, boolean> = {}
    
    for (const username of REQUIRED_FOLLOWS) {
      const targetId = targetIds.get(username.toLowerCase())
      if (!targetId) {
        followStatus[username] = false
        continue
      }

      // Check if the authenticated user follows this target
      // Using the "following" lookup endpoint
      const followCheckRes = await fetch(
        `https://api.twitter.com/2/users/${user.twitter_id}/following?user.fields=username&max_results=1000`,
        { headers: { Authorization: `Bearer ${user.twitter_access_token}` } }
      )
      const followCheckData = await followCheckRes.json()
      
      if (followCheckData.data) {
        const followingIds = new Set(followCheckData.data.map((u: any) => u.id))
        followStatus[username] = followingIds.has(targetId)
      } else {
        followStatus[username] = false
      }
    }

    const allFollowed = REQUIRED_FOLLOWS.every(u => followStatus[u])

    // Update DB with follow status if all followed
    if (allFollowed) {
      await supabase
        .from('users')
        .update({
          twitter_follows_verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq('wallet_address', wallet.toLowerCase())
    }

    return NextResponse.json({
      success: true,
      followStatus,
      allFollowed,
    })
  } catch (err) {
    console.error('[Twitter Verify] Error:', err)
    return NextResponse.json({ error: 'verification failed' }, { status: 500 })
  }
}
