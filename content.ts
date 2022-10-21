import { createClient } from "@supabase/supabase-js"

export { }

const supabase = createClient(
    'https://gfderspnyufytfnpxnsb.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmZGVyc3BueXVmeXRmbnB4bnNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjU3NzI3MTQsImV4cCI6MTk4MTM0ODcxNH0.qV59Y-sgXMyfEJVvLFjLW_xtEsw2BcGEH4N2xtpmfGY',
    {
        realtime: {
            params: {
                eventsPerSecond: 10,
            },
        },
    }
)

supabase
    .channel('room1')
    .on('broadcast', { event: 'cursor-pos' }, (payload) => console.log(payload))
    .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
            // your callback function will now be called with the messages broadcast by the other client
        }
    })