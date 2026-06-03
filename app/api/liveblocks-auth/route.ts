import { LiveblocksError } from '@liveblocks/node'
import { getClerkUserById } from '@/lib/clerk-users'
import {
  getCurrentIdentity,
  getProjectWithAccess,
} from '@/lib/project-access'
import { getCursorColorForUserId, liveblocks } from '@/lib/liveblocks'

export async function POST(request: Request) {
  const identity = await getCurrentIdentity()
  if (!identity) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const room = (body as Record<string, unknown>)?.room
  if (typeof room !== 'string' || !room) {
    return Response.json({ error: 'Missing room' }, { status: 400 })
  }

  const project = await getProjectWithAccess(
    room,
    identity.userId,
    identity.email,
  )
  if (!project) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    await liveblocks.getOrCreateRoom(project.id, {
      defaultAccesses: [],
    })
  } catch (error) {
    if (!(error instanceof LiveblocksError) || error.status !== 409) {
      throw error
    }
  }

  const clerkUser = await getClerkUserById(identity.userId)
  const name = clerkUser?.name ?? identity.email ?? 'Anonymous'
  const color = getCursorColorForUserId(identity.userId)

  const session = liveblocks.prepareSession(identity.userId, {
    userInfo: {
      name,
      color,
      ...(clerkUser?.imageUrl ? { avatar: clerkUser.imageUrl } : {}),
    },
  })
  session.allow(project.id, session.FULL_ACCESS)

  const { status, body: tokenBody } = await session.authorize()
  return new Response(tokenBody, {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
