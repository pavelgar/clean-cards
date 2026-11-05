import { version } from "../package.json"
import { CleanEntityCard } from "@/cards/entity-card"
import { registerCard } from "@/register"

registerCard(CleanEntityCard, {
  type: "clean-entity-card",
  name: "Clean Entity Card",
  description: "An entity's name and current state.",
  preview: true,
  documentationURL: "https://github.com/pavelgar/clean-cards",
})

console.info(`clean-cards ${version}`)
