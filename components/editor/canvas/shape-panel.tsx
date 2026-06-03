"use client"

import type { DragEvent } from "react"
import {
  Circle,
  Cylinder,
  Diamond,
  Hexagon,
  Pill,
  RectangleHorizontal,
  type LucideIcon,
} from "lucide-react"
import { NODE_SHAPES, type NodeShape } from "@/types/canvas"
import { SHAPE_DRAG_MIME, type ShapeDragPayload } from "./shape-drag"

interface ShapeMeta {
  label: string
  Icon: LucideIcon
  /** Default node size used as the drag payload. */
  width: number
  height: number
}

/**
 * Per-shape panel metadata. Default sizes follow the spec: rectangles are wider
 * than tall, circles are square, and diamonds are slightly larger so labels
 * have room.
 */
const SHAPE_META: Record<NodeShape, ShapeMeta> = {
  rectangle: { label: "Rectangle", Icon: RectangleHorizontal, width: 160, height: 64 },
  diamond: { label: "Diamond", Icon: Diamond, width: 150, height: 110 },
  circle: { label: "Circle", Icon: Circle, width: 100, height: 100 },
  pill: { label: "Pill", Icon: Pill, width: 160, height: 56 },
  cylinder: { label: "Cylinder", Icon: Cylinder, width: 120, height: 100 },
  hexagon: { label: "Hexagon", Icon: Hexagon, width: 140, height: 96 },
}

/**
 * Floating pill-shaped toolbar at the bottom-center of the canvas. Each button
 * is draggable; dragging writes a `ShapeDragPayload` onto the drag event so the
 * canvas can spawn a node of that shape and default size on drop.
 */
export function ShapePanel() {
  function handleDragStart(event: DragEvent<HTMLButtonElement>, shape: NodeShape) {
    const { width, height } = SHAPE_META[shape]
    const payload: ShapeDragPayload = { shape, width, height }
    event.dataTransfer.setData(SHAPE_DRAG_MIME, JSON.stringify(payload))
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border-default bg-surface/90 px-2 py-1.5 shadow-lg backdrop-blur">
      {NODE_SHAPES.map((shape) => {
        const { label, Icon } = SHAPE_META[shape]
        return (
          <button
            key={shape}
            type="button"
            draggable
            onDragStart={(event) => handleDragStart(event, shape)}
            title={`Drag to add ${label.toLowerCase()}`}
            aria-label={`Drag to add ${label.toLowerCase()}`}
            className="flex h-9 w-9 cursor-grab items-center justify-center rounded-full text-copy-secondary transition-colors hover:bg-elevated hover:text-copy-primary active:cursor-grabbing"
          >
            <Icon className="h-5 w-5" />
          </button>
        )
      })}
    </div>
  )
}
