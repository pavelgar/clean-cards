// From home-assistant/frontend src/panels/lovelace/types.ts (see src/ha/README.md).
// Left out for now: the deprecated getLayoutOptions, and every type besides cards.

import type { LovelaceCardConfig } from "@/ha/data/lovelace/config/card"
import type { HomeAssistant } from "@/ha/types"

export interface LovelaceGridOptions {
  columns?: number | "full"
  rows?: number | "auto"
  max_columns?: number
  min_columns?: number
  min_rows?: number
  max_rows?: number
}

export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant
  preview?: boolean
  layout?: string
  connectedWhileHidden?: boolean
  getCardSize(): number | Promise<number>
  getGridOptions?(): LovelaceGridOptions
  setConfig(config: LovelaceCardConfig): void
}
