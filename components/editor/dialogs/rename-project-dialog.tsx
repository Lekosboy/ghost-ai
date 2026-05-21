"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface RenameProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentName: string
  name: string
  onNameChange: (name: string) => void
  isLoading: boolean
  onSubmit: () => void
}

export function RenameProjectDialog({
  open,
  onOpenChange,
  currentName,
  name,
  onNameChange,
  isLoading,
  onSubmit,
}: RenameProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-border-default bg-elevated sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-copy-primary">Rename Project</DialogTitle>
          <DialogDescription className="text-copy-muted">
            Renaming{" "}
            <span className="font-medium text-copy-secondary">{currentName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <label className="text-sm font-medium text-copy-secondary">
            New name
          </label>
          <Input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim()) onSubmit()
            }}
            autoFocus
            className="border-border-default bg-subtle text-copy-primary placeholder:text-copy-faint focus-visible:ring-brand"
          />
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
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? "Renaming…" : "Rename"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
