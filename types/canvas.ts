import type { Edge, Node } from "@xyflow/react"

/**
 * Shared canvas graph schema. This contract must stay consistent between
 * user-created content and imported starter templates.
 */

/** Supported node shapes (see `ui-context.md` → Canvas → Node Shapes). */
export type NodeShape =
  | "rectangle"
  | "diamond"
  | "circle"
  | "pill"
  | "cylinder"
  | "hexagon"

/** Ordered list of every supported node shape. */
export const NODE_SHAPES: readonly NodeShape[] = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon",
]

/** Default node fill color from the `NODE_COLORS` palette (neutral dark). */
export const DEFAULT_NODE_COLOR = "#1F1F1F" as const

/** Data carried by every canvas node. */
export interface CanvasNodeData extends Record<string, unknown> {
  label: string
  /** Node fill color from the `NODE_COLORS` palette. */
  color: string
  shape: NodeShape
}

/** React Flow type identifiers for the custom node and edge. */
export const CANVAS_NODE_TYPE = "canvasNode" as const
export const CANVAS_EDGE_TYPE = "canvasEdge" as const

/** The custom canvas node. */
export type CanvasNode = Node<CanvasNodeData, typeof CANVAS_NODE_TYPE>

/** The custom canvas edge. */
export type CanvasEdge = Edge<Record<string, unknown>, typeof CANVAS_EDGE_TYPE>
