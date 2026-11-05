import { LitElement, css, html, nothing, type PropertyValues } from "lit"
import { property, state } from "lit/decorators.js"
import type { LovelaceCardConfig } from "@/ha/data/lovelace/config/card"
import type {
  LovelaceCard,
  LovelaceGridOptions,
} from "@/ha/panels/lovelace/types"
import type { HomeAssistant } from "@/ha/types"

export interface EntityCardConfig extends LovelaceCardConfig {
  entity: string
  name?: string
}

/** Shows an entity's name and its current state. */
export class CleanEntityCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) hass?: HomeAssistant

  @state() private config?: EntityCardConfig

  /** Default config when the card is added from the card picker. */
  static getStubConfig(hass: HomeAssistant): Omit<EntityCardConfig, "type"> {
    return { entity: Object.keys(hass.states)[0] ?? "" }
  }

  setConfig(config: EntityCardConfig): void {
    if (!config.entity) {
      throw new Error("Set `entity` to the entity this card should show.")
    }
    this.config = config
  }

  getCardSize(): number {
    return 1
  }

  getGridOptions(): LovelaceGridOptions {
    return { columns: 6, rows: 1, min_columns: 3, min_rows: 1 }
  }

  // `hass` changes on every state change in the whole instance; only
  // re-render when our entity (or the language) actually changed.
  protected override shouldUpdate(changed: PropertyValues): boolean {
    if (!changed.has("hass") || changed.size > 1) return true
    const oldHass = changed.get("hass") as HomeAssistant | undefined
    if (!oldHass || !this.hass || !this.config) return true
    return (
      oldHass.states[this.config.entity] !==
        this.hass.states[this.config.entity] ||
      oldHass.language !== this.hass.language
    )
  }

  protected override render() {
    if (!this.config || !this.hass) return nothing

    const stateObj = this.hass.states[this.config.entity]
    if (!stateObj) {
      return html`
        <ha-card class="warning">
          Entity not found: ${this.config.entity}
        </ha-card>
      `
    }

    const name =
      this.config.name ??
      stateObj.attributes.friendly_name ??
      stateObj.entity_id
    return html`
      <ha-card>
        <span class="name">${name}</span>
        <span class="state">${this.hass.formatEntityState(stateObj)}</span>
      </ha-card>
    `
  }

  static override styles = css`
    ha-card {
      box-sizing: border-box;
      height: 100%;
      min-height: 56px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .name {
      color: var(--primary-text-color);
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .state {
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .warning {
      color: var(--warning-color);
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    "clean-entity-card": CleanEntityCard
  }
}
