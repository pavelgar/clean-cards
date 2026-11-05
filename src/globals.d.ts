import type { CustomCardEntry } from "./types/ha";

declare global {
  interface Window {
    customCards?: CustomCardEntry[];
  }
}
