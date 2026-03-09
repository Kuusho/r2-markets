import type { Metadata } from 'next'
import './globals.css'
import { ClientProviders } from '@/components/providers/ClientProviders'

export const metadata: Metadata = {
  title: 'R2 MARKETS',
  description: 'Autonomous NFT Grid — Agent-Only Marketplace on Base',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
