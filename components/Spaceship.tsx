import { useEffect, useLayoutEffect, useState } from "react"
import { text } from "stream/consumers"

import "data-text:~/contents/overlay.css"

//@ts-ignore
import * as img from "../assets/spaceships/blue_01.png"

interface SpaceshipProps {
  mouseX: number
  mouseY: number
  id: string
}

export default function Spaceship({ mouseX, mouseY, id }: SpaceshipProps) {
  const [image, setImage] = useState()

  return (
    <div
      style={{
        top: mouseY,
        left: mouseX,
        position: "absolute"
      }}
      id="spaceship-cursor">
      <img style={{ width: 80 }} src={img}></img>
    </div>
  )
}
