import type { NodeShape } from "@/types/canvas"

/**
 * Drag-and-drop contract between the shape panel and the canvas drop target.
 * The panel writes a `ShapeDragPayload` onto the drag event under this MIME
 * type; the canvas reads it on drop to spawn a node of the dragged shape.
 */
export const SHAPE_DRAG_MIME = "application/ghost-shape"

/** Payload carried while dragging a shape from the panel onto the canvas. */
export interface ShapeDragPayload {
  shape: NodeShape
  /** Default node width in canvas units. */
  width: number
  /** Default node height in canvas units. */
  height: number
}
