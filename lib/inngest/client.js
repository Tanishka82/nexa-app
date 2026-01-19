// lib/inngest/client.js
import { Inngest } from "inngest";

export const inngest = new Inngest({ 
    id: "nexa",
    name: "Nexa",
    credentials: {
        gemini: {
            apiKey: process.env.GEMINI_API_KEY,
        },
    },
});
