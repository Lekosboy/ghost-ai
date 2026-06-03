"use client"

import { Folder, Pencil, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { ProjectItem } from "@/hooks/use-project-actions"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  ownedProjects: ProjectItem[]
  sharedProjects: ProjectItem[]
  activeProjectId?: string
  onCreateProject: () => void
  onRenameProject: (project: ProjectItem) => void
  onDeleteProject: (project: ProjectItem) => void
  onSelectProject: (project: ProjectItem) => void
}

export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  activeProjectId,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
  onSelectProject,
}: ProjectSidebarProps) {

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
          "fixed bottom-3 left-3 top-[3.75rem] z-40 flex w-72 flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface/80 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-in-out",
          isOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-[calc(100%+0.75rem)] opacity-0"
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
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => onSelectProject(project)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            onSelectProject(project)
                          }
                        }}
                        className={cn(
                        "group flex items-center gap-2 rounded-xl px-2 py-2 cursor-pointer",
                        project.id === activeProjectId ? "bg-brand-dim" : "hover:bg-subtle",
                      )}>
                        <Folder className={cn(
                          "h-4 w-4 shrink-0",
                          project.id === activeProjectId ? "text-brand" : "text-copy-muted",
                        )} />
                        <span className={cn(
                          "flex-1 truncate text-sm",
                          project.id === activeProjectId ? "text-brand" : "text-copy-primary",
                        )}>
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
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => onSelectProject(project)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            onSelectProject(project)
                          }
                        }}
                        className={cn(
                        "flex items-center gap-2 rounded-xl px-2 py-2 cursor-pointer",
                        project.id === activeProjectId ? "bg-brand-dim" : "hover:bg-subtle",
                      )}>
                        <Folder className={cn(
                          "h-4 w-4 shrink-0",
                          project.id === activeProjectId ? "text-brand" : "text-copy-muted",
                        )} />
                        <span className={cn(
                          "flex-1 truncate text-sm",
                          project.id === activeProjectId ? "text-brand" : "text-copy-primary",
                        )}>
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
