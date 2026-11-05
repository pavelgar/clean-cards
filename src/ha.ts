// Types for what Home Assistant's frontend hands to custom cards. It doesn't
// publish its own, so these cover just what our cards use; add members as needed.
// Reference: home-assistant/frontend src/types.ts and src/panels/lovelace/types.ts.

import type { HassEntities, HassEntity } from "home-assistant-js-websocket"

/** The `hass` object set on every card. */
export interface HomeAssistant {
  states: HassEntities
  language: string
  /** Localized, unit-aware state, e.g. "On" or "21.5 °C". */
  formatEntityState(stateObj: HassEntity, state?: string): string
}

export interface LovelaceCardConfig {
  type: string
  [key: string]: unknown
}

/** Card size in the sections (grid) layout. */
export interface LovelaceGridOptions {
  columns?: number | "full"
  rows?: number | "auto"
  min_columns?: number
  max_columns?: number
  min_rows?: number
  max_rows?: number
}

export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant
  setConfig(config: LovelaceCardConfig): void
  getCardSize(): number | Promise<number>
  getGridOptions?(): LovelaceGridOptions
}

/** An entry in `window.customCards`, which feeds the card picker. */
export interface CustomCardEntry {
  type: string
  name?: string
  description?: string
  preview?: boolean
  documentationURL?: string
}

export interface CustomCardsWindow {
  customCards?: CustomCardEntry[]
}
