import { redirect } from 'next/navigation'
import { getCurrentIdentity, getProjectWithAccess } from '@/lib/project-access'
import { getProjectsForUser } from '@/lib/project-data'
import { AccessDenied } from '@/components/editor/access-denied'
import { WorkspaceClient } from '@/components/editor/workspace-client'

interface Props {
  params: Promise<{ roomId: string }>
}

export default async function EditorWorkspacePage({ params }: Props) {
  const { roomId } = await params

  const identity = await getCurrentIdentity()
  if (!identity) redirect('/sign-in')

  const project = await getProjectWithAccess(roomId, identity.userId, identity.email)
  if (!project) return <AccessDenied />

  const { ownedProjects, sharedProjects } = await getProjectsForUser()

  return (
    <WorkspaceClient
      project={project}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  )
}
