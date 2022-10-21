import type { RealtimeChannel } from "@supabase/realtime-js"
import type { PlasmoContentScript, PlasmoGetOverlayAnchor } from "plasmo"
import { useEffect, useLayoutEffect, useState } from "react"

import Spaceship from "../components/Spaceship"
import client from "../core/store"

export const config: PlasmoContentScript = {
  matches: ["https://www.google.com/*"]
}

interface MouseInfo {
  mouseX: number
  mouseY: number
}

const Overlay = () => {
  const [myMouseInfo, setMyMouseInfo] = useState<MouseInfo>()
  const [otherMouseInfo, setOtherMouseInfo] = useState<MouseInfo>()
  const [channel, setChannel] = useState<RealtimeChannel>()
  const [active, setActive] = useState(false)

  useEffect(() => {
    const channel = client.channel("room1")

    // Subscribe registers your client with the server
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        setChannel(channel)
        channel.on("broadcast", { event: "mouse-pos" }, (payload) => {
          if (active) {
            setOtherMouseInfo({
              mouseX: payload.payload.mouseX,
              mouseY: payload.payload.mouseY
            })
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
    document.querySelector("html").style.cursor = "none"
    window.onmousemove = (ev: MouseEvent) => {
      if (active) {
        const x = ev.pageX
        const y = ev.pageY
        setMyMouseInfo({ mouseX: x, mouseY: y })
        if (channel) {
          channel.send({
            type: "broadcast",
            event: "mouse-pos",
            payload: { mouseX: x, mouseY: y }
          })
        }
      }
    }
  })

  if (!active) return <></>

  return (
    <div>
      {myMouseInfo && (
        <Spaceship
          text="Me"
          mouseX={myMouseInfo.mouseX}
          mouseY={myMouseInfo.mouseY}
        />
      )}
      {otherMouseInfo && (
        <Spaceship
          text="Other"
          mouseX={otherMouseInfo.mouseX}
          mouseY={otherMouseInfo.mouseY}
        />
      )}
    </div>
  )
}

export default Overlay
