import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId } = await params

  const body: unknown = await request.json().catch(() => ({}))
  const rawName = (body as Record<string, unknown>)?.name
  if (typeof rawName !== 'string' || !rawName.trim()) {
    return Response.json({ error: 'Name is required' }, { status: 400 })
  }

  const { count } = await prisma.project.updateMany({
    where: { id: projectId, ownerId: userId },
    data: { name: rawName.trim() },
  })

  if (count === 0) {
    const exists = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    })
    if (!exists) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updated = await prisma.project.findUnique({ where: { id: projectId } })
  return Response.json(updated)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId } = await params

  const { count } = await prisma.project.deleteMany({
    where: { id: projectId, ownerId: userId },
  })

  if (count === 0) {
    const exists = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    })
    if (!exists) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  return new Response(null, { status: 204 })
}
