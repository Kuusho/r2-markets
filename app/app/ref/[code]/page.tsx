'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function RefPage() {
  const router = useRouter()
  const params = useParams()
  const code = params.code as string

  useEffect(() => {
    if (code) {
      localStorage.setItem('r2_referral_code', code)
    }
    router.replace('/waitlist')
  }, [code, router])

  return null
}
