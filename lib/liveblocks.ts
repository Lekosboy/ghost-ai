import { Liveblocks } from '@liveblocks/node'

const globalForLiveblocks = globalThis as unknown as {
  liveblocks: Liveblocks | undefined
}

function createLiveblocksClient(): Liveblocks {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY
  if (!secret) {
    throw new Error('LIVEBLOCKS_SECRET_KEY is not set')
  }
  return new Liveblocks({ secret })
}

export const liveblocks =
  globalForLiveblocks.liveblocks ?? createLiveblocksClient()

if (process.env.NODE_ENV !== 'production') {
  globalForLiveblocks.liveblocks = liveblocks
}

const CURSOR_COLOR_PALETTE = [
  '#52A8FF',
  '#BF7AF0',
  '#FF990A',
  '#FF6166',
  '#F75F8F',
  '#62C073',
  '#0AC7B4',
  '#EDEDED',
] as const

export function getCursorColorForUserId(userId: string): string {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) | 0
  }
  const index = Math.abs(hash) % CURSOR_COLOR_PALETTE.length
  return CURSOR_COLOR_PALETTE[index]
}
