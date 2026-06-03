"use client"

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react"
import { Loader2 } from "lucide-react"
import { Canvas } from "@/components/editor/canvas/canvas"
import { CanvasErrorBoundary } from "@/components/editor/canvas/canvas-error-boundary"

interface CanvasRoomProps {
  roomId: string
}

function CanvasLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-base">
      <Loader2 className="h-6 w-6 animate-spin text-brand" />
      <p className="text-sm text-copy-muted">Connecting to canvas…</p>
    </div>
  )
}

/**
 * Sets up the Liveblocks room for a project and renders the collaborative
 * canvas inside it. Handles the loading state while Storage initializes and
 * falls back gracefully on connection errors.
 */
export function CanvasRoom({ roomId }: CanvasRoomProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={roomId} initialPresence={{ cursor: null, isThinking: false }}>
        <CanvasErrorBoundary>
          <ClientSideSuspense fallback={<CanvasLoading />}>
            <Canvas />
          </ClientSideSuspense>
        </CanvasErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
