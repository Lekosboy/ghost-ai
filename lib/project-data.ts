import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export interface ProjectData {
  id: string
  name: string
}

export async function getProjectsForUser(): Promise<{
  ownedProjects: ProjectData[]
  sharedProjects: ProjectData[]
}> {
  const { userId } = await auth()
  if (!userId) return { ownedProjects: [], sharedProjects: [] }

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? null

  const [ownedProjects, collaborations] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      select: { id: true, name: true },
      orderBy: { createdAt: 'desc' },
    }),
    email
      ? prisma.projectCollaborator.findMany({
          where: { email },
          include: { project: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        })
      : Promise.resolve([]),
  ])

  return {
    ownedProjects,
    sharedProjects: collaborations.map((c) => c.project),
  }
}
