"use client"

import { Folder, Pencil, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Project } from "@/hooks/use-project-dialogs"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  projects: Project[]
  onCreateProject: () => void
  onRenameProject: (project: Project) => void
  onDeleteProject: (project: Project) => void
}

export function ProjectSidebar({
  isOpen,
  onClose,
  projects,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  const ownedProjects = projects.filter((p) => p.isOwned)
  const sharedProjects = projects.filter((p) => !p.isOwned)

  return (
    <>
      {/* Mobile backdrop scrim */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border-default bg-surface transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border-default px-4">
          <span className="text-sm font-medium text-copy-primary">Projects</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-copy-muted hover:text-copy-primary"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex min-h-0 flex-1 flex-col p-3">
          <Tabs defaultValue="my-projects" className="flex flex-1 flex-col">
            <TabsList className="w-full">
              <TabsTrigger value="my-projects" className="flex-1">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1">
                Shared
              </TabsTrigger>
            </TabsList>

            {/* My Projects */}
            <TabsContent value="my-projects" className="mt-2 flex-1">
              {ownedProjects.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-copy-muted">No projects yet.</p>
                </div>
              ) : (
                <ul className="space-y-0.5">
                  {ownedProjects.map((project) => (
                    <li key={project.id}>
                      <div className="group flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-subtle cursor-pointer">
                        <Folder className="h-4 w-4 shrink-0 text-copy-muted" />
                        <span className="flex-1 truncate text-sm text-copy-primary">
                          {project.name}
                        </span>
                        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-copy-muted hover:text-copy-primary"
                            onClick={(e) => {
                              e.stopPropagation()
                              onRenameProject(project)
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-copy-muted hover:text-error"
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteProject(project)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            {/* Shared */}
            <TabsContent value="shared" className="mt-2 flex-1">
              {sharedProjects.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-copy-muted">No shared projects.</p>
                </div>
              ) : (
                <ul className="space-y-0.5">
                  {sharedProjects.map((project) => (
                    <li key={project.id}>
                      <div className="flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-subtle cursor-pointer">
                        <Folder className="h-4 w-4 shrink-0 text-copy-muted" />
                        <span className="flex-1 truncate text-sm text-copy-primary">
                          {project.name}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border-default p-3">
          <Button className="w-full gap-2" onClick={onCreateProject}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
