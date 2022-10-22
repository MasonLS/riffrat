import { uniqBy } from "lodash"
import { useEffect, useLayoutEffect, useState } from "react"

import Spaceship from "../components/Spaceship"
import client from "../core/store"

const Overlay = () => {
  const [active, setActive] = useState(true)
  const [players, setPlayers] = useState<any[]>([])

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msgObj) => {
      setActive(msgObj.active)

      if (msgObj.active) {
        const settings = {
          playerID: msgObj.id,
          ship: msgObj.ship,
          team: msgObj.team
        }

        const channel = client.channel(window.location.href, {
          config: {
            broadcast: { self: true, ack: true },
            presence: {
              key: settings.playerID
            }
          }
        })

        // Subscribe registers your client with the server
        channel.subscribe(async (status) => {
          console.log(status)
          if (status === "SUBSCRIBED") {
            channel.track({
              team: settings.team,
              ship: settings.ship,
              playerID: settings.playerID
            })

            window.onmousemove = (ev: MouseEvent) => {
              if (active) {
                const x = ev.pageX
                const y = ev.pageY

                channel.track({
                  team: settings.team,
                  ship: settings.ship,
                  key: settings.playerID,
                  mouseX: x,
                  mouseY: y
                })
              }
            }

            channel
              .on("presence", { event: "sync" }, () => {
                console.log(
                  "Online users: ",
                  JSON.stringify(channel.presenceState())
                )
                const state = channel.presenceState()
                console.log(
                  "PLAYERS ",
                  uniqBy(state[settings.playerID], "presence_ref")
                )
                setPlayers([
                  ...uniqBy(
                    state[settings.playerID].filter(
                      (x) => x.key !== settings.playerID
                    ),
                    "presence_ref"
                  ),
                  state[settings.playerID].filter(
                    (x) => x.key === settings.playerID
                  )[
                    state[settings.playerID].filter(
                      (x) => x.key === settings.playerID
                    ).length
                  ]
                ])
              })
              .subscribe()
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
