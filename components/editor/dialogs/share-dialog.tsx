"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Check, Link2, Loader2, Mail, Trash2, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Person {
  email: string
  name: string | null
  imageUrl: string | null
}

interface Collaborator extends Person {
  createdAt: string
}

interface CollaboratorsResponse {
  isOwner: boolean
  owner: Person
  collaborators: Collaborator[]
}

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ShareDialog({
  open,
  onOpenChange,
  projectId,
}: ShareDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [owner, setOwner] = useState<Person | null>(null)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [isInviting, setIsInviting] = useState(false)

  const [removingEmail, setRemovingEmail] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const loadCollaborators = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`)
      if (!res.ok) {
        setLoadError("Could not load collaborators.")
        return
      }
      const data: CollaboratorsResponse = await res.json()
      setIsOwner(data.isOwner)
      setOwner(data.owner)
      setCollaborators(data.collaborators)
    } catch {
      setLoadError("Could not load collaborators.")
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    if (!open) {
      setInviteEmail("")
      setInviteError(null)
      setCopied(false)
      return
    }
    loadCollaborators()
  }, [open, loadCollaborators])

  const handleInvite = async () => {
    const email = inviteEmail.trim().toLowerCase()
    if (!EMAIL_PATTERN.test(email)) {
      setInviteError("Enter a valid email address.")
      return
    }
    setIsInviting(true)
    setInviteError(null)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.status === 409) {
        setInviteError("This collaborator is already invited.")
        return
      }
      if (!res.ok) {
        setInviteError("Could not invite collaborator.")
        return
      }
      const collaborator: Collaborator = await res.json()
      setCollaborators((prev) => [...prev, collaborator])
      setInviteEmail("")
    } catch {
      setInviteError("Could not invite collaborator.")
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemove = async (email: string) => {
    setRemovingEmail(email)
    try {
      const res = await fetch(
        `/api/projects/${projectId}/collaborators?email=${encodeURIComponent(email)}`,
        { method: "DELETE" },
      )
      if (!res.ok) return
      setCollaborators((prev) => prev.filter((c) => c.email !== email))
    } finally {
      setRemovingEmail(null)
    }
  }

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/editor/${projectId}`
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard failures are silent
    }
  }

  const totalCount = (owner ? 1 : 0) + collaborators.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-border-default bg-elevated sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-copy-primary">Share project</DialogTitle>
          <DialogDescription className="text-copy-muted">
            Invite collaborators, copy the workspace link, and manage access.
          </DialogDescription>
        </DialogHeader>

        {isOwner && (
          <>
            <div className="flex items-center justify-between rounded-2xl border border-border-default bg-surface px-4 py-3">
              <div className="min-w-0 pr-3">
                <p className="text-sm font-medium text-copy-primary">
                  Workspace link
                </p>
                <p className="mt-0.5 text-xs text-copy-muted">
                  Share a direct link with teammates after you grant them access.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyLink}
                className={cn(
                  "h-8 shrink-0 gap-1.5 text-xs",
                  copied && "text-success",
                )}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4" />
                    Copy link
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 rounded-2xl border border-border-default bg-surface py-1.5 pl-3 pr-1.5">
                <Mail className="h-4 w-4 shrink-0 text-copy-muted" />
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value)
                    if (inviteError) setInviteError(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isInviting) handleInvite()
                  }}
                  placeholder="teammate@company.com"
                  className="h-8 flex-1 border-0 bg-transparent px-1 text-sm text-copy-primary placeholder:text-copy-faint shadow-none focus-visible:ring-0"
                />
                <Button
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim() || isInviting}
                  size="sm"
                  className="h-8 shrink-0"
                >
                  {isInviting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Invite"
                  )}
                </Button>
              </div>
              {inviteError && (
                <p className="px-2 text-xs text-error">{inviteError}</p>
              )}
            </div>
          </>
        )}

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-medium text-copy-primary">
              People with access
            </p>
            {!isLoading && !loadError && (
              <p className="text-xs text-copy-muted">{totalCount} total</p>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center rounded-2xl border border-border-default bg-surface py-8">
              <Loader2 className="h-4 w-4 animate-spin text-copy-muted" />
            </div>
          ) : loadError ? (
            <div className="rounded-2xl border border-border-default bg-surface px-4 py-6">
              <p className="text-center text-sm text-error">{loadError}</p>
            </div>
          ) : (
            <ScrollArea className="max-h-72">
              <ul className="space-y-2">
                {owner && (
                  <PersonRow
                    person={owner}
                    badge="owner"
                    showRemove={false}
                  />
                )}
                {collaborators.map((c) => (
                  <PersonRow
                    key={c.email}
                    person={c}
                    badge="collaborator"
                    showRemove={isOwner}
                    isRemoving={removingEmail === c.email}
                    onRemove={() => handleRemove(c.email)}
                  />
                ))}
              </ul>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface PersonRowProps {
  person: Person
  badge: "owner" | "collaborator"
  showRemove: boolean
  isRemoving?: boolean
  onRemove?: () => void
}

function PersonRow({
  person,
  badge,
  showRemove,
  isRemoving,
  onRemove,
}: PersonRowProps) {
  const primary = person.name ?? person.email
  const secondary = person.name ? person.email : null

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border-default bg-surface px-3 py-2.5">
      <PersonAvatar person={person} />
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-copy-primary">
              {primary}
            </p>
            <Badge variant={badge} />
          </div>
          {secondary && (
            <p className="truncate text-xs text-copy-muted">{secondary}</p>
          )}
        </div>
      </div>
      {showRemove && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={isRemoving}
          className="h-8 w-8 shrink-0 text-copy-muted hover:text-error"
          aria-label={`Remove ${person.email}`}
        >
          {isRemoving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      )}
    </li>
  )
}

function PersonAvatar({ person }: { person: Person }) {
  if (person.imageUrl) {
    return (
      <Image
        src={person.imageUrl}
        alt={person.name ?? person.email}
        width={36}
        height={36}
        className="h-9 w-9 shrink-0 rounded-full border border-border-default object-cover"
        unoptimized
      />
    )
  }
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-copy-primary"
      style={{
        background:
          "linear-gradient(135deg, var(--accent-ai) 0%, var(--accent-ai-text) 100%)",
      }}
    >
      <User className="h-4 w-4" />
    </div>
  )
}

function Badge({ variant }: { variant: "owner" | "collaborator" }) {
  if (variant === "owner") {
    return (
      <span className="shrink-0 rounded-md border border-brand/40 bg-brand-dim px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
        Owner
      </span>
    )
  }
  return (
    <span className="shrink-0 rounded-md border border-border-default bg-subtle px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-copy-muted">
      Collaborator
    </span>
  )
}
