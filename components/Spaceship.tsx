import { useLayoutEffect } from "react"
import { text } from "stream/consumers"

interface SpaceshipProps {
  mouseX: number
  mouseY: number
  text: string
}

export default function Spaceship({ mouseX, mouseY, text }: SpaceshipProps) {
  return (
    <div
      style={{ top: mouseY, left: mouseX, position: "absolute", fontSize: 58 }}
      id="spaceship-cursor">
      <div>{text}</div>
    </div>
  )
}
