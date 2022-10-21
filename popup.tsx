import { Storage } from "@plasmohq/storage"
import { useEffect, useReducer, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import type { Team } from "./connect/Gamestate"
import useSupabase from "./connect/usePayload"

import "./style.css"

const storage = new Storage()

function IndexPopup() {
  const [active, setActive] = useState(false)
  const [team, setTeam] = useState<Team>()
  const [ship, setShip] = useState<number>()

  const join = () => {
    let uuid = localStorage.getItem("playerID")
    if (!uuid) {
      uuid = uuidv4()
      localStorage.setItem("playerID", uuid)
    }
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          active: true,
          team,
          ship,
          id: uuid
        })
      })
    })
    setActive(true)
    window.close()
  }

  const leave = () => {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, { active: false })
      })
    })
    setActive(false)
  }

  if (active) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 10,
          width: 400
        }}>
        <button onClick={leave} className="bg-black text-white w-full text-lg">
          LEAVE FIGHT
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 10,
        width: 400
      }}>
      {!team && (
        <div>
          <div className="flex flex-row">
            <div
              className="w-32 h-32 bg-green-400 cursor-pointer flex justify-center items-center"
              onClick={() => setTeam("GREEN")}>
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/green_01.png`}
                alt=""
                className="w-12 h-12"
              />
            </div>
            <div
              className="w-32 h-32  bg-orange-400 cursor-pointer flex justify-center items-center"
              onClick={() => setTeam("ORANGE")}>
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/orange_01.png`}
                alt=""
                className="w-12 h-12"
              />
            </div>
          </div>
          <div className="flex flex-row">
            <div
              className="w-32 h-32  bg-blue-400 cursor-pointer flex justify-center items-center"
              onClick={() => setTeam("BLUE")}>
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/blue_01.png`}
                alt=""
                className="w-12 h-12"
              />
            </div>
            <div
              className="w-32 h-32  bg-purple-400 cursor-pointer flex justify-center items-center"
              onClick={() => setTeam("PURPLE")}>
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/purple_01.png`}
                alt=""
                className="w-12 h-12"
              />
            </div>
          </div>
        </div>
      )}
      {team && !ship && (
        <div className={`bg-${team.toLowerCase()}-400`}>
          <div className="flex flex-row">
            <div
              className="w-24 h-24 cursor-pointer flex justify-center items-center"
              onClick={() => setShip(1)}>
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${team.toLowerCase()}_01.png`}
                alt=""
                className="w-12 h-12"
              />
            </div>
            <div
              className="w-24 h-24 cursor-pointer flex justify-center items-center"
              onClick={() => setShip(2)}>
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${team.toLowerCase()}_02.png`}
                alt=""
                className="w-12 h-12"
              />
            </div>
            <div
              className="w-24 h-24 cursor-pointer flex justify-center items-center"
              onClick={() => setShip(3)}>
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${team.toLowerCase()}_03.png`}
                alt=""
                className="w-12 h-12"
              />
            </div>
          </div>
          <div className="flex flex-row">
            <div
              className="w-24 h-24 cursor-pointer flex justify-center items-center"
              onClick={() => setShip(4)}>
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${team.toLowerCase()}_04.png`}
                alt=""
                className="w-12 h-12"
              />
            </div>
            <div
              className="w-24 h-24 cursor-pointer flex justify-center items-center"
              onClick={() => setShip(5)}>
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${team.toLowerCase()}_05.png`}
                alt=""
                className="w-12 h-12"
              />
            </div>
            <div
              className="w-24 h-24 cursor-pointer flex justify-center items-center"
              onClick={() => setShip(6)}>
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${team.toLowerCase()}_06.png`}
                alt=""
                className="w-12 h-12"
              />
            </div>
          </div>
        </div>
      )}
      {team && ship && (
        <div>
          <button onClick={join} className="bg-black text-white w-full text-lg">
            JOIN FIGHT
          </button>
        </div>
      )}
    </div>
  )
}
export default IndexPopup
