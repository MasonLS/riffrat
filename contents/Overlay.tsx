import type { RealtimeChannel } from "@supabase/realtime-js"
import type { PlasmoContentScript, PlasmoGetOverlayAnchor } from "plasmo"
import { useCallback, useEffect, useLayoutEffect, useState } from "react"

import Spaceship from "../components/Spaceship"
import type { Team } from "../connect/Gamestate"
import useGamestate from "../connect/useGamestate"
import usePayload from "../connect/usePayload"
import client from "../core/store"

export const config: PlasmoContentScript = {
  matches: ["https://www.google.com/*"]
}

interface UserSettings {
  playerID: string
  team: Team
  spaceship: string
}

const Overlay = () => {
  const [settings, setSettings] = useState<UserSettings>()
  const [channel, setChannel] = useState<RealtimeChannel>()
  const [active, setActive] = useState(false)

  const { createNewPlayer, move, players } = useGamestate(channel, active)

  useEffect(() => {
    const channel = client.channel("room1")
    setChannel(channel)

    // Subscribe registers your client with the server
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("Adding listeners")
        // Add channel listeners
        // Receive join
        channel.on("broadcast", { event: "join" }, (payload) => {
          if (active && payload.payload.id) {
            const data: any = payload.payload
            console.log("Received join")
            createNewPlayer(data.id, data.team, { type: data.spaceship_type })
          }
        })

        // Receive movement
        channel.on("broadcast", { event: "move" }, (payload) => {
          if (active) {
            console.log("Received move")
            const data: any = payload.payload
            move(data.id, data.x, data.y)
          }
        })
      }
    })
    // Receive

    chrome.runtime.onMessage.addListener((msgObj) => {
      setActive(msgObj.active)
      if (msgObj.active) {
        console.log(msgObj)
        setSettings({
          playerID: msgObj.id,
          spaceship: msgObj.ship,
          team: msgObj.team
        })
        const uuid = msgObj.id
        const { team, id, spaceship } = createNewPlayer(uuid, msgObj.team, {
          type: msgObj.ship
        })

        console.log("Broadcast join")

        // Broadcast join
        const data = { id, team, spaceship_type: spaceship.type }
        channel.send({
          type: "broadcast",
          event: "join",
          payload: data
        })
      }
    })
  }, [])

  useLayoutEffect(() => {
    document.querySelector("html").style.cursor = !active ? "auto" : "none"
  }, [active])

  useLayoutEffect(() => {
    window.onmousemove = (ev: MouseEvent) => {
      if (active) {
        const x = ev.pageX
        const y = ev.pageY

        if (channel && settings.playerID) {
          move(settings.playerID, x, y)
          const data = { id: settings.playerID, x, y }
          channel.send({
            type: "broadcast",
            event: "move",
            payload: data
          })
        }
      }
    }
  })

  if (!active) return <></>

  return (
    <div>
      {players.map((x) => (
        <Spaceship
          key={x.id}
          spaceship={x.spaceship}
          position={x.cursor}
          team={x.team}
        />
      ))}
    </div>
  )
}

export default Overlay
