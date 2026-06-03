"use client"

import { Component, type ReactNode } from "react"
import { TriangleAlert } from "lucide-react"

interface CanvasErrorBoundaryProps {
  children: ReactNode
}

interface CanvasErrorBoundaryState {
  hasError: boolean
}

/**
 * Catches Liveblocks connection / room errors thrown during render so a failed
 * realtime connection degrades to a readable message instead of a blank canvas.
 */
export class CanvasErrorBoundary extends Component<
  CanvasErrorBoundaryProps,
  CanvasErrorBoundaryState
> {
  state: CanvasErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): CanvasErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-base">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border-default bg-elevated">
            <TriangleAlert className="h-8 w-8 text-error" />
          </div>
          <h2 className="text-lg font-semibold text-copy-primary">
            Canvas connection lost
          </h2>
          <p className="max-w-sm text-center text-sm leading-relaxed text-copy-muted">
            We couldn&apos;t connect to the realtime room for this project.
            Check your connection and refresh the page to reconnect.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
