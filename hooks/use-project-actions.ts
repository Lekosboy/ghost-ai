"use client"

import { useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"

export interface ProjectItem {
  id: string
  name: string
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

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 8)
}

export function useProjectActions() {
  const router = useRouter()
  const pathname = usePathname()

  const [openDialog, setOpenDialog] = useState<DialogType>(null)
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null)
  const [createName, setCreateName] = useState("")
  const [suffix, setSuffix] = useState(() => randomSuffix())
  const [renameName, setRenameName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const createSlug = toSlug(createName)
  const roomId = createSlug ? `${createSlug}-${suffix}` : ""

  const closeDialog = useCallback(() => {
    setOpenDialog(null)
    setActiveProject(null)
  }, [])

  const openCreate = useCallback(() => {
    setCreateName("")
    setSuffix(randomSuffix())
    setOpenDialog("create")
  }, [])

  const openRename = useCallback((project: ProjectItem) => {
    setActiveProject(project)
    setRenameName(project.name)
    setOpenDialog("rename")
  }, [])

  const openDelete = useCallback((project: ProjectItem) => {
    setActiveProject(project)
    setOpenDialog("delete")
  }, [])

  const handleCreate = useCallback(async () => {
    const trimmed = createName.trim()
    if (!trimmed || !roomId) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, id: roomId }),
      })
      if (!res.ok) return
      router.push(`/editor/${roomId}`)
    } finally {
      setIsLoading(false)
    }
  }, [createName, roomId, router])

  const handleRename = useCallback(async () => {
    const trimmed = renameName.trim()
    if (!trimmed || !activeProject) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${activeProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      })
      if (!res.ok) return
      closeDialog()
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }, [renameName, activeProject, closeDialog, router])

  const handleDelete = useCallback(async () => {
    if (!activeProject) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${activeProject.id}`, {
        method: "DELETE",
      })
      if (!res.ok) return
      if (pathname === `/editor/${activeProject.id}`) {
        router.push("/editor")
      } else {
        closeDialog()
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }, [activeProject, pathname, closeDialog, router])

  return {
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
  }
}
