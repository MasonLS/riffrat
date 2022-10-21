import type { RealtimeChannel } from "@supabase/realtime-js"
import { channel } from "diagnostics_channel"
import { useCallback, useState } from "react"

import type { GamePlayer, MouseInfo, Spaceship, Team } from "./Gamestate"

export default function useGamestate(
  channel: RealtimeChannel,
  active: boolean
) {
  const [players, setPlayers] = useState<GamePlayer[]>([])
  const [myMouseInfo, setMyMouseInfo] = useState<MouseInfo>()

  const createNewPlayer = useCallback(
    (id: string, team: Team, spaceship: Spaceship) => {
      const player: GamePlayer = { id, team, spaceship }
      setPlayers(players.concat(player))
      return player
    },
    []
  )

  const move = useCallback((id: string, x: number, y: number) => {
    setPlayers(
      players.map((player) =>
        player.id === id
          ? { ...player, cursor: { mouseX: x, mouseY: y } }
          : player
      )
    )
    if (channel && active) {
    }
  }, [])

  return {
    players,
    createNewPlayer,
    move
  }
}
