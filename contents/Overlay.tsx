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
            presence: {
              key: settings.playerID
            }
          }
        })

        // Subscribe registers your client with the server
        channel.subscribe(async (status) => {
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
                const players = uniqBy(Object.values(state).flat(), "key")
                console.log("PLAYERS ", players)
                setPlayers(players)
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
