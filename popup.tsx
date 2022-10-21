import { useEffect, useReducer, useState } from "react"
import { useForm } from "react-hook-form"

import useSupabase from "./connect/useConnect"

import "./style.css"

function IndexPopup() {
  const [active, setActive] = useState(true)
  const [team, setTeam] = useState<"blue" | "green" | "orange" | "purple">()
  const [ship, setShip] = useState<number>()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()
  const watchTeam = watch("team")
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
        padding: 100
      }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <select {...register("team", { required: true })}>
          <option value="">Pick your team</option>
          <option value="orange">Orange</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="purple">Purple</option>
        </select>
        {errors.team && <span>This field is required</span>}
        {watchTeam && (
          <select {...register("ship", { required: true })}>
            <option value="">Pick your ship</option>
            <option value="1">
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${watchTeam}_01.png`}
                className="w-5"
              />
            </option>
            <option value="2">
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${watchTeam}_02.png`}
              />
            </option>
            <option value="3">
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${watchTeam}_03.png`}
              />
            </option>
            <option value="4">
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${watchTeam}_04.png`}
              />
            </option>
            <option value="5">
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${watchTeam}_05.png`}
              />
            </option>
            <option value="6">
              <img
                src={`https://gfderspnyufytfnpxnsb.supabase.co/storage/v1/object/public/ships/${watchTeam}_06.png`}
              />
            </option>
          </select>
        )}
        {errors.ship && <span>This field is required</span>}
        <input type="submit" />
      </form>
      <button
        onClick={toggleActive}
        className="inline-flex items-center flex-1 p-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        {active ? "Deactivate" : "Activate"}
      </button>
    </div>
  )
}
export default IndexPopup
