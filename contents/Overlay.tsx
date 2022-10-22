import { add, uniqBy } from "lodash"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react"

import Spaceship from "../components/Spaceship"
import client from "../core/store"

const Overlay = () => {
  const [active, setActive] = useState(true)
  const [players, setPlayers] = useState<any[]>([])
  const [settings, setSettings] = useState<any>()
  const [dead, setDead] = useState(false)
  const [channel, setChannel] = useState<any>()
  const lastClicked = useRef<number>(0)
  const canvasRef = useRef<HTMLCanvasElement>()

  useEffect(() => {
    console.log("Instance Ref: ", 4)
    chrome.runtime.onMessage.addListener((msgObj) => {
      setActive(msgObj.active)
      setDead(false)
      if (msgObj.active) {
        const settings = {
          key: msgObj.id,
          ship: msgObj.ship,
          team: msgObj.team
        }
        setSettings(settings)

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
        setChannel(channel)

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

            window.ondrag = (ev: MouseEvent) => {
              ev.preventDefault()
            }

            window.onmousemove = (ev: MouseEvent) => {
              if (active) {
                const x = ev.pageX
                const y = ev.pageY

                channel.send({
                  type: "broadcast",
                  event: "cursor-pos",
                  payload: { id: settings.key, x, y }
                })
              }
            }

            channel.on("broadcast", { event: "cursor-pos" }, (payload) => {
              setPlayers((players) => {
                return players.map((p) =>
                  p.key === payload.payload.id
                    ? {
                        ...p,
                        mouseX: payload.payload.x,
                        mouseY: payload.payload.y
                      }
                    : p
                )
              })
            })

            channel.on("broadcast", { event: "death" }, (payload) => {
              if (payload.payload.id === settings.key) {
                setDead(true)
                setActive(false)
              }
              setPlayers((players) => {
                return players.filter((p) => p.key !== payload.payload.id)
              })
            })

            channel.on("broadcast", { event: "laser" }, (payload) => {
              const canvas = canvasRef.current
              const ctx = canvas.getContext("2d")
              const rect = canvas.getBoundingClientRect()
              let x = payload.payload.x - rect.left
              let y = payload.payload.y - rect.top
              let width = 1
              const growTimer = setInterval(() => {
                if (width < 30) draw(ctx, x, y, width, payload.payload.team)
                width += 2
                if (width >= 45) {
                  clearInterval(growTimer)
                  if (
                    payload.payload.team === "orange" ||
                    payload.payload.team === "purple"
                  ) {
                    killFirstInSight(x - 30, y, x, window.innerHeight)
                    ctx.clearRect(x - 30, y, x, window.innerHeight)
                  } else {
                    killFirstInSight(x - 30, 0, x, y)
                    ctx.clearRect(x - 30, 0, x, y)
                  }
                }
              }, 10)
            })

            channel.on("presence", { event: "sync" }, () => {
              // console.log(
              //   "Online users: ",
              //   JSON.stringify(channel.presenceState())
              // )
              const state = channel.presenceState()
              const addPlayers = new Map<string, any>()
              const presenceArray = Object.values(state).flat()
              presenceArray.forEach((presence) => {
                if (presence.updated_at)
                  if (
                    addPlayers.has(presence.key || presence.playerID) &&
                    !addPlayers.get(presence.key || presence.playerID)
                      .updated_at &&
                    addPlayers.get(presence.key || presence.playerID)
                      .updated_at < presence.updated_at
                  ) {
                    addPlayers.set(presence.key, presence)
                  } else if (
                    !addPlayers.has(presence.key || presence.playerID)
                  ) {
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

  console.log("PLAYERS, ", players)

  useLayoutEffect(() => {
    document.body.style.cursor = active ? "none" : "auto"
    document.body.style.userSelect = active ? "none" : "auto"
  }, [active])

  const draw = (ctx, x: number, y: number, width: number, team: string) => {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(
      x,
      team === "orange" || team === "purple" ? window.innerHeight : 0
    )
    ctx.strokeStyle = team
    ctx.lineWidth = width
    ctx.stroke()
    ctx.closePath()
  }

  const killFirstInSight = useCallback(
    (x1, y1, width, height) => {
      let playerKilled
      const hitbox = 50
      for (const player of players.filter((p) => p.team !== settings.team)) {
        if (
          player.mouseX >= x1 - hitbox &&
          player.mouseX <= width + hitbox &&
          player.mouseY >= Math.min(y1, height) - hitbox &&
          player.mouseY <= Math.max(y1, height) + hitbox
        ) {
          playerKilled = player
          break
        }
      }
      if (playerKilled) {
        channel?.send({
          type: "broadcast",
          event: "death",
          payload: { id: playerKilled.key }
        })
      }
    },
    [settings, players, channel]
  )

  const click = useCallback(
    (ev: any) => {
      if (active && Date.now() - lastClicked.current > 1200) {
        lastClicked.current = Date.now()
        const canvas = ev.target as HTMLCanvasElement
        const ctx = canvas.getContext("2d")
        const rect = canvas.getBoundingClientRect()
        let x = ev.pageX - rect.left
        let y = ev.pageY - rect.top
        let width = 1
        ;(async () => {
          channel?.send({
            type: "broadcast",
            event: "laser",
            payload: { team: settings.team, x, y }
          })
        })()
        const growTimer = setInterval(() => {
          if (width < 30) draw(ctx, x, y, width, settings.team)
          width += 2
          if (width >= 45) {
            clearInterval(growTimer)
            if (settings.team === "orange" || settings.team === "purple") {
              killFirstInSight(x - 30, y, x, window.innerHeight)
              ctx.clearRect(x - 30, y, x, window.innerHeight)
            } else {
              killFirstInSight(x - 30, 0, x, y)
              ctx.clearRect(x - 30, 0, x, y)
            }
          }
        }, 10)
      }
    },
    [settings, players, channel]
  )

  return (
    <>
      {dead === true && <h1>YOU DIED!!1</h1>}
      {active && (
        <canvas
          id="battleCanvas"
          ref={canvasRef}
          onClick={click}
          height={window.innerHeight}
          width={window.innerWidth}
          style={{
            flex: 1,
            display: "block",
            opacity: 0.4,
            backgroundColor: "black",
            height: "100vh",
            width: "100vw",
            cursor: "auto"
          }}
        />
      )}

      {players.map((x) => (
        <Spaceship
          key={x.key}
          ship={x.ship}
          position={{ mouseX: x.mouseX, mouseY: x.mouseY }}
          team={x.team}
        />
      ))}
    </>
  )
}

export default Overlay
