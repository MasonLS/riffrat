import { useEffect, useLayoutEffect, useState } from "react"
import { text } from "stream/consumers"

import "data-text:~/contents/overlay.css"

import type { MouseInfo, Spaceship, Team } from "../connect/Gamestate"

interface SpaceshipProps {
  position: MouseInfo
  spaceship: Spaceship
  team: Team
}

export default function Spaceship({ position, spaceship, team }: SpaceshipProps) {

  return spaceship ? <div
      style={{
        top: position?.mouseY,
        left: position?.mouseX,
        position: "absolute"
      }}
      id="spaceship-cursor">
      {position && <img style={{ width: 60 }} src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${team.toLowerCase()}_${spaceship.type}.png`} />}
    </div> : <div></div>
  
}
