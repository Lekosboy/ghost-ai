"use client"

import { useState, useCallback } from "react"

export interface Project {
  id: string
  name: string
  slug: string
  isOwned: boolean
}

export type DialogType = "create" | "rename" | "delete" | null

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

const MOCK_PROJECTS: Project[] = [
  { id: "1", name: "E-Commerce Platform", slug: "e-commerce-platform", isOwned: true },
  { id: "2", name: "Mobile Banking App", slug: "mobile-banking-app", isOwned: true },
  { id: "3", name: "Partner Analytics", slug: "partner-analytics", isOwned: false },
]

export interface UseProjectDialogsReturn {
  projects: Project[]
  openDialog: DialogType
  activeProject: Project | null
  openCreate: () => void
  openRename: (project: Project) => void
  openDelete: (project: Project) => void
  closeDialog: () => void
  createName: string
  setCreateName: (name: string) => void
  createSlug: string
  renameName: string
  setRenameName: (name: string) => void
  isLoading: boolean
  handleCreate: () => void
  handleRename: () => void
  handleDelete: () => void
}

export function useProjectDialogs(): UseProjectDialogsReturn {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS)
  const [openDialog, setOpenDialog] = useState<DialogType>(null)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [createName, setCreateName] = useState("")
  const [renameName, setRenameName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const createSlug = toSlug(createName)

  const closeDialog = useCallback(() => {
    setOpenDialog(null)
    setActiveProject(null)
  }, [])

  const openCreate = useCallback(() => {
    setCreateName("")
    setOpenDialog("create")
  }, [])

  const openRename = useCallback((project: Project) => {
    setActiveProject(project)
    setRenameName(project.name)
    setOpenDialog("rename")
  }, [])

  const openDelete = useCallback((project: Project) => {
    setActiveProject(project)
    setOpenDialog("delete")
  }, [])

  const handleCreate = useCallback(() => {
    const trimmed = createName.trim()
    if (!trimmed) return
    const slug = toSlug(trimmed)
    if (!slug) return
    setIsLoading(true)
    setTimeout(() => {
      setProjects((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: trimmed,
          slug,
          isOwned: true,
        },
      ])
      setIsLoading(false)
      closeDialog()
    }, 300)
  }, [createName, closeDialog])

  const handleRename = useCallback(() => {
    const trimmed = renameName.trim()
    if (!trimmed || !activeProject) return
    const slug = toSlug(trimmed)
    if (!slug) return
    setIsLoading(true)
    setTimeout(() => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProject.id
            ? { ...p, name: trimmed, slug }
            : p
        )
      )
      setIsLoading(false)
      closeDialog()
    }, 300)
  }, [renameName, activeProject, closeDialog])

  const handleDelete = useCallback(() => {
    if (!activeProject) return
    setIsLoading(true)
    setTimeout(() => {
      setProjects((prev) => prev.filter((p) => p.id !== activeProject.id))
      setIsLoading(false)
      closeDialog()
    }, 300)
  }, [activeProject, closeDialog])

  return {
    projects,
    openDialog,
    activeProject,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    createName,
    setCreateName,
    createSlug,
    renameName,
    setRenameName,
    isLoading,
    handleCreate,
    handleRename,
    handleDelete,
  }
}
