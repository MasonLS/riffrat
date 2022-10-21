import type { RealtimeChannel } from "@supabase/realtime-js"
import type { PlasmoContentScript, PlasmoGetOverlayAnchor } from "plasmo"
import { useEffect, useLayoutEffect, useState } from "react"

import Spaceship from "../components/Spaceship"
import client from "../core/store"

interface MouseInfo {
  mouseX: number
  mouseY: number
}

const Overlay = () => {
  const [myMouseInfo, setMyMouseInfo] = useState<MouseInfo>()
  const [otherMouseInfo, setOtherMouseInfo] = useState<MouseInfo>()
  const [channel, setChannel] = useState<RealtimeChannel>()

  useEffect(() => {
    const channel = client.channel("room1")

    // Subscribe registers your client with the server
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        setChannel(channel)
      }
    })

    // Receive
  }, [])

  useEffect(() => {
    if (channel) {
      channel
        .on("broadcast", { event: "mouse-pos" }, (payload) => {
          console.log(payload)
          setOtherMouseInfo({ mouseX: payload.mouseX, mouseY: payload.mouseY })
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            console.log("SUBSCRIBED!")
          }
        })
    }
  }, [])

  useLayoutEffect(() => {
    window.onmousemove = (ev: MouseEvent) => {
      const x = ev.pageX
      const y = ev.pageY
      setMyMouseInfo({ mouseX: x, mouseY: y })
      if (channel) {
        channel
          .send({
            type: "broadcast",
            event: "mouse-pos",
            payload: { mouseX: x, mouseY: y }
          })
          .then((x) => console.log("SENT"))
      }
    }
  })

  return (
    <div>
      {myMouseInfo && (
        <Spaceship
          text="Flavio"
          mouseX={myMouseInfo.mouseX}
          mouseY={myMouseInfo.mouseY}
        />
      )}
      {otherMouseInfo && (
        <Spaceship
          text="Mason"
          mouseX={otherMouseInfo.mouseX}
          mouseY={otherMouseInfo.mouseY}
        />
      )}
    </div>
  )
}

export default Overlay
