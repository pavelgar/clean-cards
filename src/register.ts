import type {
  CustomCardEntry,
  CustomCardsWindow,
} from "@/ha/data/lovelace_custom_cards"

/**
 * Defines a card element and lists it in the dashboard card picker.
 * Safe to call twice: Home Assistant can load a resource more than once,
 * and `customElements.define` throws on a name that's already taken.
 */
export function registerCard(
  ctor: CustomElementConstructor,
  entry: CustomCardEntry,
): void {
  if (!customElements.get(entry.type)) {
    customElements.define(entry.type, ctor)
  }
  const customCardsWindow = window as CustomCardsWindow
  customCardsWindow.customCards ??= []
  if (!customCardsWindow.customCards.some((card) => card.type === entry.type)) {
    customCardsWindow.customCards.push(entry)
  }
}
