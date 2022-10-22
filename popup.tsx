import classNames from "classnames"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import "./style.css"

function IndexPopup() {
  const [active, setActive] = useState(false)
  const [team, setTeam] = useState<string>()
  const [ship, setShip] = useState<number>()

  const join = (close = true) => {
    localStorage.setItem("gameActive", "true")
    let uuid = localStorage.getItem("key")
    if (!uuid) {
      uuid = uuidv4()
      localStorage.setItem("key", uuid)
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
    if (close) window.close()
  }

  const leave = () => {
    localStorage.setItem("gameActive", "false")
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
        width: 300
      }}
      className="flex flex-column justify-center items-center">
      {!team && (
        <div className="flex flex-col gap-0.5">
          <div
            style={{
              color: "white",
              fontFamily: "Visitor TT2 BRK",
              fontSize: 30,
              textAlign: "center"
            }}>
            SELECT TEAM
          </div>
          <div className="flex flex-row gap-0.5">
            <div
              className="w-32 h-32 bg-orange-400 cursor-pointer flex justify-center items-center"
              onClick={() => setTeam("orange")}>
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/orange_01.png`}
                alt=""
                className="w-14 h-14 -scale-y-100"
              />
            </div>
            <div
              className="w-32 h-32 bg-purple-400 cursor-pointer flex justify-center items-center"
              onClick={() => setTeam("purple")}>
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/purple_01.png`}
                alt=""
                className="w-14 h-14 -scale-y-100"
              />
            </div>
          </div>
          <div className="flex flex-row gap-0.5">
            <div
              className="w-32 h-32 bg-green-400 cursor-pointer flex justify-center items-center"
              onClick={() => setTeam("green")}>
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/green_01.png`}
                alt=""
                className="w-14 h-14"
              />
            </div>
            <div
              className="w-32 h-32 bg-blue-400 cursor-pointer flex justify-center items-center"
              onClick={() => setTeam("blue")}>
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/blue_01.png`}
                alt=""
                className="w-14 h-14"
              />
            </div>
          </div>
        </div>
      )}
      {team && !ship && (
        <div
          className="flex flex-col gap-0.5"
          style={{ backgroundColor: "#12181F" }}>
          <div
            style={{
              color: "white",
              fontFamily: "Visitor TT2 BRK",
              fontSize: 30,
              textAlign: "center"
            }}>
            SELECT SHIP
          </div>
          <div className="flex flex-row gap-0.5">
            <div
              className={classNames(
                "w-32 h-32 cursor-pointer flex justify-center items-center",
                `bg-${team}-400`
              )}
              onClick={() => setShip(1)}>
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${team}_01.png`}
                alt=""
                className={classNames("w-14 h-14", {
                  "-scale-y-100": team === "orange" || team === "purple"
                })}
              />
            </div>
            <div
              className={classNames(
                "w-32 h-32 cursor-pointer flex justify-center items-center",
                `bg-${team}-400`
              )}
              onClick={() => setShip(2)}>
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${team}_02.png`}
                alt=""
                className={classNames("w-14 h-14", {
                  "-scale-y-100": team === "orange" || team === "purple"
                })}
              />
            </div>
            <div
              className={classNames(
                "w-32 h-32 cursor-pointer flex justify-center items-center",
                `bg-${team}-400`
              )}
              onClick={() => setShip(3)}>
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${team}_03.png`}
                alt=""
                className={classNames("w-14 h-14", {
                  "-scale-y-100": team === "orange" || team === "purple"
                })}
              />
            </div>
          </div>
          <div className="flex flex-row gap-0.5">
            <div
              className={classNames(
                "w-32 h-32 cursor-pointer flex justify-center items-center",
                `bg-${team}-400`
              )}
              onClick={() => setShip(4)}>
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${team}_04.png`}
                alt=""
                className={classNames("w-14 h-14", {
                  "-scale-y-100": team === "orange" || team === "purple"
                })}
              />
            </div>
            <div
              className={classNames(
                "w-32 h-32 cursor-pointer flex justify-center items-center",
                `bg-${team}-400`
              )}
              onClick={() => setShip(5)}>
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${team}_05.png`}
                alt=""
                className={classNames("w-14 h-14", {
                  "-scale-y-100": team === "orange" || team === "purple"
                })}
              />
            </div>
            <div
              className={classNames(
                "w-32 h-32 cursor-pointer flex justify-center items-center",
                `bg-${team}-400`
              )}
              onClick={() => setShip(6)}>
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${team}_06.png`}
                alt=""
                className={classNames("w-14 h-14", {
                  "-scale-y-100": team === "orange" || team === "purple"
                })}
              />
            </div>
          </div>
        </div>
      )}
      {team && ship && (
        <div
          className={classNames(
            "flex flex-col justify-center items-center p-10",
            `bg-${team}-400`
          )}>
          <div
            style={{
              fontFamily: "Visitor TT2 BRK",
              fontSize: 30,
              textAlign: "center"
            }}>
            READY ?
          </div>
          <div
            className={classNames(
              "w-32 h-32 cursor-pointer flex justify-center items-center",
              `bg-${team}-400`
            )}>
            <img
              src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${team}_0${ship}.png`}
              alt=""
              className={classNames("w-20 h-20", {
                "-scale-y-100": team === "orange" || team === "purple"
              })}
            />
          </div>
          <button
            onClick={() => join()}
            className="bg-black text-white w-full text-lg">
            <div
              style={{
                fontFamily: "Visitor TT2 BRK",
                fontSize: 24,
                textAlign: "center",
                width: 200,
                padding: 10
              }}>
              JOIN FIGHT
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
export default IndexPopup
