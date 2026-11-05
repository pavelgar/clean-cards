// From home-assistant/frontend src/data/lovelace_custom_cards.ts (see src/ha/README.md).
// Left out for now: badges and card features.

import type { LovelaceCardConfig } from "@/ha/data/lovelace/config/card"
import type { HomeAssistant } from "@/ha/types"

export interface CustomCardSuggestion<
  T extends LovelaceCardConfig = LovelaceCardConfig,
> {
  label?: string
  config: T
}

export interface CustomCardEntry {
  type: string
  name?: string
  description?: string
  preview?: boolean
  documentationURL?: string
  getEntitySuggestion?: (
    hass: HomeAssistant,
    entityId: string,
  ) => CustomCardSuggestion | CustomCardSuggestion[] | null
}

export interface CustomCardsWindow {
  customCards?: CustomCardEntry[]
}
