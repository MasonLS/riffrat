import { useEffect, useReducer, useState } from "react"

import useSupabase from "./connect/useConnect"

import "./style.css"

function IndexPopup() {
  const [active, setActive] = useState(true)
  const [team, setTeam] = useState<"blue" | "green" | "orange" | "purple">()
  const [ship, setShip] = useState<number>()

  const onSubmit = (data) => {
    localStorage.setItem("playerSettings", data)
    toggleActive()
  }

  const toggleActive = () => {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, { active: !active })
      })
    })
    setActive(!active)
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 10
      }}>
      {!team && (
        <div>
          <div className="flex flex-row">
            <div className="w-32 h-32 bg-red-50"></div>
            <div className="w-32 h-32  bg-red-50"></div>
          </div>
          <div className="flex flex-row">
            <div className="w-32 h-32  bg-red-50"></div>
            <div className="w-32 h-32  bg-red-50"></div>
          </div>
        </div>
      )}
      {!ship && <div></div>}
    </div>
  )
}
export default IndexPopup
