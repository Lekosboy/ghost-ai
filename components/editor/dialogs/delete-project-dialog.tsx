"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectName: string
  isLoading: boolean
  onConfirm: () => void
}

export function DeleteProjectDialog({
  open,
  onOpenChange,
  projectName,
  isLoading,
  onConfirm,
}: DeleteProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-border-default bg-elevated sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-copy-primary">Delete Project</DialogTitle>
          <DialogDescription className="text-copy-muted">
            Are you sure you want to delete{" "}
            <span className="font-medium text-copy-secondary">{projectName}</span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

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
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting…" : "Delete Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
