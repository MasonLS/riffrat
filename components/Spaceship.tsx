import { useEffect, useLayoutEffect, useState } from "react"
import { text } from "stream/consumers"

import "data-text:~/contents/overlay.css"

interface SpaceshipProps {
  position: { mouseX: number; mouseY: number }
  ship: any
  team: string
}

export default function Spaceship({ position, ship, team }: SpaceshipProps) {
  return ship ? (
    <div
      style={{
        top: position.mouseY,
        left: position.mouseX,
        position: "absolute",
        userSelect: "none"
      }}
      id="spaceship-cursor">
      {position?.mouseX && position?.mouseY && (
        <img
          style={{ width: 60 }}
          src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${team}_0${ship}.png`}
        />
      )}
    </div>
  ) : (
    <div></div>
  )
}
