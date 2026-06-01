import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export interface CurrentIdentity {
  userId: string
  email: string | null
}

export async function getCurrentIdentity(): Promise<CurrentIdentity | null> {
  const { userId } = await auth()
  if (!userId) return null
  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? null
  return { userId, email }
}

export async function getProjectWithAccess(
  projectId: string,
  userId: string,
  email: string | null,
): Promise<{ id: string; name: string; ownerId: string } | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, ownerId: true },
  })
  if (!project) return null
  if (project.ownerId === userId) return project
  if (email) {
    const collaborator = await prisma.projectCollaborator.findUnique({
      where: { projectId_email: { projectId, email } },
    })
    if (collaborator) return project
  }
  return null
}
