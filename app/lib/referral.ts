import { keccak256, toBytes } from 'viem'

export function generateReferralCode(walletAddress: string): string {
  const hash = keccak256(toBytes(walletAddress.toLowerCase()))
  const hexBytes = hash.slice(2, 18) // first 8 bytes = 16 hex chars
  const num = BigInt('0x' + hexBytes)
  return num.toString(36).toUpperCase().slice(0, 8)
}
