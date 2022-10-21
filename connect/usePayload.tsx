import { RealtimeClient } from "@supabase/realtime-js"
import { useState } from "react"

export type PayloadType = "JOIN" | "LEAVE" | "MOVE" | "SHOOT"

export interface Payload {
  event: PayloadType
  payload: any
}

export type PayloadReturn =
  | {
      event: "JOIN"
      id: string
    }
  | {
      event: "LEAVE"
      id: string
    }
  | {
      event: "MOVE"
      mouseX: number
      mouseY: number
    }

export default function usePayload() {
  const decodePayload = (payload: Payload): PayloadReturn => {
    const data = payload.payload
    switch (payload.event) {
      case "JOIN":
        return {
          event: payload.event,
          id: data.id
        }
      case "LEAVE":
        return {
          event: payload.event,
          id: data.id
        }
      case "MOVE":
        return {
          event: payload.event,
          mouseX: data.mouseX,
          mouseY: data.mouseY
        }
    }
  }

  return {}
}
