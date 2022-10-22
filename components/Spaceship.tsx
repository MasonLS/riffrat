import { useEffect, useLayoutEffect, useState } from "react"
import { text } from "stream/consumers"

import "data-text:~/contents/overlay.css"

import { transform } from "lodash"

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
        userSelect: "none",
        pointerEvents: "none",
        cursor: "none",
        zIndex: 9999,
        transform: team === "orange" || team === "purple" ? "scaleY(-1)" : ""
      }}
      id="spaceship-cursor">
      {position?.mouseX && position?.mouseY && (
        <img
          style={{ width: 45, transform: "translate(-50%)" }}
          src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${team}_0${ship}.png`}
        />
      )}
    </div>
  ) : (
    <div></div>
  )
}
