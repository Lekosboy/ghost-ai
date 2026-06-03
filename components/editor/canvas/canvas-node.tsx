"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import type { CanvasNode } from "@/types/canvas"

/**
 * One connection handle per side. Each needs a unique `id` — React Flow keys
 * handles by id, so several handles of the same type with a `null` id collapse
 * into one and every drag connects to the same point. With the canvas in
 * `ConnectionMode.Loose`, a single handle per side acts as both source and
 * target.
 */
const HANDLE_SIDES = [
  { id: "top", position: Position.Top },
  { id: "right", position: Position.Right },
  { id: "bottom", position: Position.Bottom },
  { id: "left", position: Position.Left },
] as const

/**
 * Basic renderer for the custom canvas node. For this unit every shape is drawn
 * as a simple bordered rectangle with the label centered; shape-specific
 * visuals (diamond, hexagon, cylinder SVGs) are added in a later unit.
 */
export function CanvasNodeRenderer({ data }: NodeProps<CanvasNode>) {
  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-xl border border-border-subtle px-3 py-2 text-center text-sm text-copy-primary"
      style={{ backgroundColor: data.color }}
    >
      {HANDLE_SIDES.map(({ id, position }) => (
        <Handle
          key={id}
          id={id}
          type="source"
          position={position}
          className="!bg-white"
        />
      ))}
      <span className="truncate">{data.label}</span>
    </div>
  )
}
