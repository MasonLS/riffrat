import type { RealtimeChannel } from "@supabase/realtime-js"
import { channel } from "diagnostics_channel"
import { useCallback, useState } from "react"

import type { GamePlayer, MouseInfo, Spaceship, Team } from "./Gamestate"

export default function useGamestate(
  channel: RealtimeChannel,
  active: boolean
) {
  const [players, setPlayers] = useState<GamePlayer[]>([])

  const createNewPlayer = (id: string, team: Team, spaceship: Spaceship) => {
    const player: GamePlayer = { id, team, spaceship }

    setPlayers((players) =>
      players.map((x) => x.id).includes(player.id)
        ? players
        : [...players, player]
    )

    return player
  }

  const move = (id: string, x: number, y: number) => {
    setPlayers((players) =>
      players.map((player) =>
        player.id === id
          ? { ...player, cursor: { mouseX: x, mouseY: y } }
          : player
      )
    )
  }

  return {
    players,
    createNewPlayer,
    move
  }
}
