import { useEffect, useReducer, useState } from "react"

import useSupabase from "./connect/usePayload"

import "./style.css"

function IndexPopup() {
  const [active, setActive] = useState(true)

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
        padding: 100
      }}>
      <button
        onClick={toggleActive}
        className="inline-flex items-center flex-1 p-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        {active ? "Deactivate" : "Activated"}
      </button>
    </div>
  )
}
export default IndexPopup
