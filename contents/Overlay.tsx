import { add, uniqBy } from "lodash"
import { useEffect, useLayoutEffect, useState } from "react"

import Spaceship from "../components/Spaceship"
import client from "../core/store"

const Overlay = () => {
  const [active, setActive] = useState(true)
  const [players, setPlayers] = useState<any[]>([])

  useEffect(() => {
    console.log("Instance Ref: ", 3)
    chrome.runtime.onMessage.addListener((msgObj) => {
      setActive(msgObj.active)

      if (msgObj.active) {
        const settings = {
          key: msgObj.id,
          ship: msgObj.ship,
          team: msgObj.team
        }

        const channel = client.channel(window.location.href, {
          config: {
            presence: {
              key: settings.key
            },
            broadcast: {
              self: true
            }
          }
        })

        // Subscribe registers your client with the server
        channel.subscribe(async (status, err) => {
          if (status === "SUBSCRIBED") {
            console.log("Error, ", err)
            channel.track({
              team: settings.team,
              ship: settings.ship,
              key: settings.key,
              updated_at: Date.now()
            })

            window.onclick = (ev: MouseEvent) => {
              ev.preventDefault()
              console.log("Hi")
            }

            window.onmousemove = (ev: MouseEvent) => {
              if (active) {
                const x = ev.pageX
                const y = ev.pageY

                console.log("Sent!")
                channel.send({
                  type: "broadcast",
                  event: "cursor-pos",
                  payload: { id: settings.key, x, y }
                })
              }
            }

            channel.on("broadcast", { event: "cursor-pos" }, (payload) => {
              console.log(payload.payload.x)
              setPlayers((players) => {
                return players.map((p) =>
                  p.key === payload.payload.key
                    ? {
                        ...p,
                        mouseX: payload.payload.x,
                        mouseY: payload.payload.y
                      }
                    : p
                )
              })
            })

            channel.on("presence", { event: "sync" }, () => {
              console.log(
                "Online users: ",
                JSON.stringify(channel.presenceState())
              )
              const state = channel.presenceState()
              const addPlayers = new Map<string, any>()
              const presenceArray = Object.values(state).flat()
              presenceArray.forEach((presence) => {
                if (
                  addPlayers.has(presence.key) &&
                  addPlayers.get(presence.key).updated_at < presence.updated_at
                ) {
                  addPlayers.set(presence.key, presence)
                } else if (!addPlayers.has(presence.key)) {
                  addPlayers.set(presence.key, presence)
                }
              })
              setPlayers(Array.from(addPlayers.values()))
            })
          }
        })
      }
    })
  }, [])

  useLayoutEffect(() => {
    document.body.style.cursor = active ? "none" : "auto"
  }, [active])

  return (
    <div>
      {players.map((x) => (
        <Spaceship
          key={x.key}
          ship={x.ship}
          position={{ mouseX: x.mouseX, mouseY: x.mouseY }}
          team={x.team}
        />
      ))}
    </div>
  )
}

export default Overlay
