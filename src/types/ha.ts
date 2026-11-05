// Minimal types for the parts of the Home Assistant frontend our cards use.
// The frontend doesn't publish its types, so these mirror
// home-assistant/frontend src/types.ts and src/panels/lovelace/types.ts.
// Extend them as the cards need more.

import type {
  Connection,
  HassConfig,
  HassEntities,
  HassEntity,
  HassServiceTarget,
  HassUser,
  MessageBase,
} from "home-assistant-js-websocket";

/** The `hass` object Home Assistant sets on every card. */
export interface HomeAssistant {
  connection: Connection;
  states: HassEntities;
  config: HassConfig;
  user?: HassUser;
  language: string;
  themes: { darkMode: boolean };
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: HassServiceTarget,
  ): Promise<unknown>;
  callWS<T>(msg: MessageBase): Promise<T>;
  /** Localized, unit-aware state, e.g. "On" or "21.5 °C". */
  formatEntityState(stateObj: HassEntity, state?: string): string;
}

export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}

/** Size of a card in the sections (grid) layout. */
export interface LovelaceGridOptions {
  columns?: number | "full";
  rows?: number | "auto";
  min_columns?: number;
  max_columns?: number;
  min_rows?: number;
  max_rows?: number;
}

export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  preview?: boolean;
  setConfig(config: LovelaceCardConfig): void;
  getCardSize(): number | Promise<number>;
  getGridOptions?(): LovelaceGridOptions;
}

/** Entry in `window.customCards`, which feeds the card picker. */
export interface CustomCardEntry {
  type: string;
  name: string;
  description?: string;
  preview?: boolean;
  documentationURL?: string;
}
