"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog"
import { RenameProjectDialog } from "@/components/editor/dialogs/rename-project-dialog"
import { DeleteProjectDialog } from "@/components/editor/dialogs/delete-project-dialog"
import { useProjectActions } from "@/hooks/use-project-actions"
import { Button } from "@/components/ui/button"
import type { ProjectItem } from "@/hooks/use-project-actions"

interface EditorHomeClientProps {
  ownedProjects: ProjectItem[]
  sharedProjects: ProjectItem[]
}

export function EditorHomeClient({ ownedProjects, sharedProjects }: EditorHomeClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
    <div className="h-screen bg-base overflow-hidden">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        onCreateProject={openCreate}
        onRenameProject={openRename}
        onDeleteProject={openDelete}
      />

      <main className="h-full pt-12 flex flex-col items-center justify-center gap-3">
        <h1 className="text-xl font-semibold text-copy-primary">
          Create a project or open an existing one
        </h1>
        <p className="text-sm text-copy-muted">
          Start a new architecture workspace, or choose a project from the sidebar.
        </p>
        <Button onClick={openCreate} className="mt-2 gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </main>

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
    </div>
  )
}
