import type { CustomCardEntry } from "./types/ha";

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
    customElements.define(entry.type, ctor);
  }
  window.customCards ??= [];
  if (!window.customCards.some((card) => card.type === entry.type)) {
    window.customCards.push(entry);
  }
}
