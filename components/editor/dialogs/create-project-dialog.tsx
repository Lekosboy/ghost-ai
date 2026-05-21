"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  onNameChange: (name: string) => void
  slug: string
  isLoading: boolean
  onSubmit: () => void
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  name,
  onNameChange,
  slug,
  isLoading,
  onSubmit,
}: CreateProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-border-default bg-elevated sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-copy-primary">New Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-copy-secondary">
              Project name
            </label>
            <Input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="My Architecture Project"
              autoFocus
              className="border-border-default bg-subtle text-copy-primary placeholder:text-copy-faint focus-visible:ring-brand"
            />
          </div>

          <p className="h-4 text-xs text-copy-muted">
            {slug ? (
              <>
                Slug:{" "}
                <span className="font-mono text-copy-secondary">{slug}</span>
              </>
            ) : null}
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="text-copy-muted hover:text-copy-primary"
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!name.trim() || !slug || isLoading}
          >
            {isLoading ? "Creating…" : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
