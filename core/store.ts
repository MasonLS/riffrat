import { createClient } from "@supabase/supabase-js"

const client = createClient(
  process.env.PLASMO_PUBLIC_SUPABASE_URL,
  process.env.PLASMO_PUBLIC_SUPABASE_KEY,
  {
    realtime: {
      params: {
        eventsPerSecond: 100
      }
    }
  }
)

export default client
