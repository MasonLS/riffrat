import { RealtimeClient } from '@supabase/realtime-js'

var client = new RealtimeClient(process.env.PLASMO_PUBLIC_SUPABASE_URL, {
    params: { apikey: process.env.PLASMO_PUBLIC_SUPABASE_KEY },
})
client.connect()

export default client;