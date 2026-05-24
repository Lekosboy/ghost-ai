import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
  })

  return Response.json(projects)
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: unknown = await request.json().catch(() => ({}))
  const raw = body as Record<string, unknown>
  const rawName = raw?.name
  const name =
    typeof rawName === 'string' && rawName.trim()
      ? rawName.trim()
      : 'Untitled Project'

  const rawId = raw?.id
  const id =
    typeof rawId === 'string' && /^[a-z0-9-]{1,100}$/.test(rawId.trim())
      ? rawId.trim()
      : undefined

  const project = await prisma.project.create({
    data: { ...(id ? { id } : {}), ownerId: userId, name },
  })

  return Response.json(project, { status: 201 })
}
