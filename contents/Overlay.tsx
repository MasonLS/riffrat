import type { RealtimeChannel } from "@supabase/realtime-js"
import type { PlasmoContentScript, PlasmoGetOverlayAnchor } from "plasmo"
import { useEffect, useLayoutEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import Spaceship from "../components/Spaceship"
import client from "../core/store"

export const config: PlasmoContentScript = {
  matches: ["https://www.google.com/*"]
}

const Overlay = () => {
  const [myID, setMyID] = useState<string>()
  const [channel, setChannel] = useState<RealtimeChannel>()
  const [active, setActive] = useState(true)

  useEffect(() => {
    setMyID("user" + uuidv4())

    const channel = client.channel("room1")

    // Subscribe registers your client with the server
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        setChannel(channel)
        channel.on("broadcast", { event: "mouse-pos" }, (payload) => {
          if (active) {
            // setOtherMouseInfo({
            //   mouseX: payload.payload.mouseX,
            //   mouseY: payload.payload.mouseY
            // })
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

        if (channel) {
          // channel.send({
          //   type: "broadcast",
          //   event: "mouse-pos",
          //   payload: { mouseX: x, mouseY: y }
          // })
        }
      }
    }
  })

  if (!active) return <></>

  return <div></div>
}

export default Overlay
