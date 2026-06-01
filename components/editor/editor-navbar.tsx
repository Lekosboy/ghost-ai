"use client"

import { PanelLeftClose, PanelLeftOpen, Share2, Sparkles } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onSidebarToggle: () => void
  projectName?: string
  onShareClick?: () => void
  isAISidebarOpen?: boolean
  onAISidebarToggle?: () => void
}

export function EditorNavbar({
  isSidebarOpen,
  onSidebarToggle,
  projectName,
  onShareClick,
  isAISidebarOpen,
  onAISidebarToggle,
}: EditorNavbarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-12 items-center border-b border-border-default bg-surface px-3">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          className="h-8 w-8 text-copy-muted hover:text-copy-primary"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>
      </div>

      {projectName && (
        <span className="ml-3 max-w-xs truncate text-sm font-medium text-copy-primary">
          {projectName}
        </span>
      )}

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        {onShareClick && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onShareClick}
            className="h-8 gap-1.5 text-xs text-copy-muted hover:text-copy-primary"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}
        {onAISidebarToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAISidebarToggle}
            className={cn(
              "h-8 gap-1.5 text-xs",
              isAISidebarOpen
                ? "bg-brand-dim text-brand hover:bg-brand-dim hover:text-brand"
                : "text-copy-muted hover:text-copy-primary",
            )}
          >
            <Sparkles className="h-4 w-4" />
            AI
          </Button>
        )}
        <UserButton />
      </div>
    </header>
  )
}
