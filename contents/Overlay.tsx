import type { RealtimeChannel } from "@supabase/realtime-js"
import type { PlasmoContentScript, PlasmoGetOverlayAnchor } from "plasmo"
import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import Spaceship from "../components/Spaceship"
import useGamestate from "../connect/useGamestate"
import usePayload from "../connect/usePayload"
import client from "../core/store"

;("uuid")

export const config: PlasmoContentScript = {
  matches: ["https://www.google.com/*"]
}

const Overlay = () => {
  const [myID, setMyID] = useState<string>()
  const [channel, setChannel] = useState<RealtimeChannel>()
  const [active, setActive] = useState(true)

  const { createNewPlayer, move, players } = useGamestate(channel, active)

  useEffect(() => {
    const uuid = "user" + uuidv4()
    setMyID(uuid)

    const channel = client.channel("room1")
    setChannel(channel)

    // Subscribe registers your client with the server
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        const { team, id, spaceship } = createNewPlayer(uuid, "BLUE", {
          type: "03"
        })

        console.log("Broadcast join")

        // Broadcast join
        const data = { id, team, spaceship_type: spaceship.type }
        channel.send({
          type: "broadcast",
          event: "join",
          payload: data
        })

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
      if (!active && channel) {
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

        if (channel && myID) {
          move(myID, x, y)
          const data = { id: myID, x, y }
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
