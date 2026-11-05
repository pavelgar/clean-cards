// From home-assistant/frontend src/types.ts (see README.md in this folder).
// Left out for now: registries (entities, devices, areas, floors), locale and
// localize, formatEntityName, auth, user and UI state.

import type {
  Connection,
  HassConfig,
  HassEntities,
  HassEntity,
  HassServices,
  HassServiceTarget,
  MessageBase,
} from "home-assistant-js-websocket"

export interface Context {
  id: string
  parent_id?: string
  user_id?: string | null
}

export interface ValuePart {
  type: "value" | "literal" | "unit"
  value: string
}

export interface ServiceCallResponse<T = any> {
  context: Context
  response?: T
}

export interface ServiceCallRequest {
  domain: string
  service: string
  serviceData?: Record<string, any>
  target?: HassServiceTarget
}

export interface HomeAssistantInternationalization {
  language: string
  selectedLanguage: string | null
}

export type CallWS = <T>(msg: MessageBase) => Promise<T>

export interface HomeAssistantApi {
  callService<T = any>(
    domain: ServiceCallRequest["domain"],
    service: ServiceCallRequest["service"],
    serviceData?: ServiceCallRequest["serviceData"],
    target?: ServiceCallRequest["target"],
    notifyOnError?: boolean,
    returnResponse?: boolean,
  ): Promise<ServiceCallResponse<T>>
  callApi<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    parameters?: Record<string, any>,
    headers?: Record<string, string>,
  ): Promise<T>
  fetchWithAuth(path: string, init?: Record<string, any>): Promise<Response>
  sendWS(msg: MessageBase): void
  callWS: CallWS
}

export interface HomeAssistantFormatters {
  formatEntityState(stateObj: HassEntity, state?: string): string
  formatEntityStateToParts(stateObj: HassEntity, state?: string): ValuePart[]
  formatEntityAttributeValue(
    stateObj: HassEntity,
    attribute: string,
    value?: any,
  ): string
  formatEntityAttributeValueToParts(
    stateObj: HassEntity,
    attribute: string,
    value?: any,
  ): ValuePart[]
  formatEntityAttributeName(stateObj: HassEntity, attribute: string): string
}

export interface HomeAssistantConnection {
  connection: Connection
  connected: boolean
}

export interface HomeAssistantConfig {
  config: HassConfig
}

export interface HomeAssistant
  extends
    HomeAssistantInternationalization,
    HomeAssistantApi,
    HomeAssistantFormatters,
    HomeAssistantConnection,
    HomeAssistantConfig {
  states: HassEntities
  services: HassServices
}
