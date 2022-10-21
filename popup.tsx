import { useEffect, useReducer, useState } from "react"

import useSupabase from "./connect/useSupabase"

import "./style.css"

import client from "./core/store"

function IndexPopup() {
  const [message, setMessage] = useState("")

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 100
      }}>
      <input
        value={message}
        onChange={(ev) => {
          setMessage(ev.currentTarget.value)
        }}
        type="text"
        onKeyDown={(ev) => (ev.key === "Enter" ? alert(message) : undefined)}
        className="inline-flex items-center flex-1 p-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      />
    </div>
  )
}

export default IndexPopup
