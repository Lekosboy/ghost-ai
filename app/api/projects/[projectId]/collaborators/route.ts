import { prisma } from '@/lib/prisma'
import { getCurrentIdentity, getProjectWithAccess } from '@/lib/project-access'
import { getClerkUserById, getClerkUsersByEmail } from '@/lib/clerk-users'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const identity = await getCurrentIdentity()
  if (!identity) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId } = await params
  const project = await getProjectWithAccess(
    projectId,
    identity.userId,
    identity.email,
  )
  if (!project) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const collaborators = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: 'asc' },
    select: { email: true, createdAt: true },
  })

  const [enriched, ownerSummary] = await Promise.all([
    getClerkUsersByEmail(collaborators.map((c) => c.email)),
    getClerkUserById(project.ownerId),
  ])

  const result = collaborators.map((c) => {
    const match = enriched.get(c.email.toLowerCase())
    return {
      email: c.email,
      name: match?.name ?? null,
      imageUrl: match?.imageUrl ?? null,
      createdAt: c.createdAt.toISOString(),
    }
  })

  return Response.json({
    isOwner: project.ownerId === identity.userId,
    owner: ownerSummary ?? {
      email: '',
      name: null,
      imageUrl: null,
    },
    collaborators: result,
  })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const identity = await getCurrentIdentity()
  if (!identity) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true },
  })
  if (!project) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }
  if (project.ownerId !== identity.userId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const rawEmail = (body as Record<string, unknown>)?.email
  if (typeof rawEmail !== 'string') {
    return Response.json({ error: 'Email is required' }, { status: 400 })
  }
  const email = rawEmail.trim().toLowerCase()
  if (!EMAIL_PATTERN.test(email)) {
    return Response.json({ error: 'Invalid email' }, { status: 400 })
  }

  try {
    const collaborator = await prisma.projectCollaborator.create({
      data: { projectId, email },
      select: { email: true, createdAt: true },
    })

    const enriched = await getClerkUsersByEmail([collaborator.email])
    const match = enriched.get(collaborator.email.toLowerCase())

    return Response.json(
      {
        email: collaborator.email,
        name: match?.name ?? null,
        imageUrl: match?.imageUrl ?? null,
        createdAt: collaborator.createdAt.toISOString(),
      },
      { status: 201 },
    )
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return Response.json(
        { error: 'Collaborator already invited' },
        { status: 409 },
      )
    }
    throw error
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const identity = await getCurrentIdentity()
  if (!identity) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true },
  })
  if (!project) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }
  if (project.ownerId !== identity.userId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const url = new URL(request.url)
  const email = url.searchParams.get('email')?.trim().toLowerCase()
  if (!email || !EMAIL_PATTERN.test(email)) {
    return Response.json({ error: 'Invalid email' }, { status: 400 })
  }

  const { count } = await prisma.projectCollaborator.deleteMany({
    where: { projectId, email },
  })

  if (count === 0) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  return new Response(null, { status: 204 })
}
