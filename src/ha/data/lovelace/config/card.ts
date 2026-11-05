// From home-assistant/frontend src/data/lovelace/config/card.ts (see src/ha/README.md).
// Left out for now: the deprecated layout_options, and visibility.

import type { LovelaceGridOptions } from "@/ha/panels/lovelace/types"

export interface LovelaceCardConfig {
  index?: number
  view_index?: number
  view_layout?: any
  grid_options?: LovelaceGridOptions
  type: string
  [key: string]: any
  disabled?: boolean
}
