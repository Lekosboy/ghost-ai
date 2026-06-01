"use client"

import { useState } from "react"
import { Bot, Compass, Sparkles } from "lucide-react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog"
import { RenameProjectDialog } from "@/components/editor/dialogs/rename-project-dialog"
import { DeleteProjectDialog } from "@/components/editor/dialogs/delete-project-dialog"
import { ShareDialog } from "@/components/editor/dialogs/share-dialog"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { ProjectItem } from "@/hooks/use-project-actions"

interface WorkspaceClientProps {
  project: { id: string; name: string }
  ownedProjects: ProjectItem[]
  sharedProjects: ProjectItem[]
}

export function WorkspaceClient({ project, ownedProjects, sharedProjects }: WorkspaceClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)

  const {
    openDialog,
    activeProject,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    createName,
    setCreateName,
    roomId,
    renameName,
    setRenameName,
    isLoading,
    handleCreate,
    handleRename,
    handleDelete,
  } = useProjectActions()

  return (
    <div className="h-screen overflow-hidden bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)}
        projectName={project.name}
        onShareClick={() => setIsShareOpen(true)}
        isAISidebarOpen={isAISidebarOpen}
        onAISidebarToggle={() => setIsAISidebarOpen((prev) => !prev)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        activeProjectId={project.id}
        onCreateProject={openCreate}
        onRenameProject={openRename}
        onDeleteProject={openDelete}
      />

      <main className="relative flex h-full flex-col items-center justify-center gap-5 pt-12 bg-base">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,200,212,0.05) 0%, transparent 65%)" }}
        />

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border-default bg-elevated">
          <Compass className="h-8 w-8 text-brand" />
        </div>

        <p className="text-xs font-medium uppercase tracking-widest text-copy-faint">
          Workspace Shell
        </p>

        <h1 className="max-w-md text-center text-2xl font-semibold text-copy-primary">
          Canvas and collaboration tooling land here next.
        </h1>

        <p className="max-w-sm text-center text-sm leading-relaxed text-copy-muted">
          This room is ready for the shared architecture canvas, durable AI
          workflows, and real-time presence. For now, the shell is wired with
          project context and navigation only.
        </p>
      </main>

      {isAISidebarOpen && (
        <aside className="fixed inset-y-0 right-0 z-40 flex w-80 flex-col border-l border-border-default bg-surface pt-12">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border-default px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-copy-primary">AI Copilot</p>
              <p className="mt-0.5 text-xs text-copy-muted">Placeholder panel</p>
            </div>
            <Sparkles className="mt-0.5 h-4 w-4 text-ai-text" />
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
            {/* Status card */}
            <div className="rounded-2xl bg-elevated p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-subtle">
                  <Bot className="h-4 w-4 text-copy-muted" />
                </div>
                <div>
                  <p className="text-sm font-medium text-copy-primary">Chat surface pending</p>
                  <p className="mt-1 text-xs leading-relaxed text-copy-muted">
                    The toggle is wired. Messaging and generation are intentionally out of scope here.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1" />

            {/* Future hooks */}
            <div className="rounded-2xl bg-elevated p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-copy-faint">
                Future Hooks
              </p>
              <p className="text-xs leading-relaxed text-copy-muted">
                Prompt composer, run status, and architecture guidance will attach to this sidebar.
              </p>
            </div>
          </div>
        </aside>
      )}

      <CreateProjectDialog
        open={openDialog === "create"}
        onOpenChange={(open) => { if (!open) closeDialog() }}
        name={createName}
        onNameChange={setCreateName}
        roomId={roomId}
        isLoading={isLoading}
        onSubmit={handleCreate}
      />

      <RenameProjectDialog
        open={openDialog === "rename"}
        onOpenChange={(open) => { if (!open) closeDialog() }}
        currentName={activeProject?.name ?? ""}
        name={renameName}
        onNameChange={setRenameName}
        isLoading={isLoading}
        onSubmit={handleRename}
      />

      <DeleteProjectDialog
        open={openDialog === "delete"}
        onOpenChange={(open) => { if (!open) closeDialog() }}
        projectName={activeProject?.name ?? ""}
        isLoading={isLoading}
        onConfirm={handleDelete}
      />

      <ShareDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        projectId={project.id}
      />
    </div>
  )
}
