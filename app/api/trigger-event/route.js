// app/api/trigger-event/route.js
import { inngest } from "@/lib/inngest/client";

export async function GET(req, res) {
  const event = await inngest.send({
    name: "test/hello.world",
    data: { email: "tanishka@example.com" },
  });

  return new Response(JSON.stringify({ status: "ok", event }), {
    headers: { "Content-Type": "application/json" },
  });
}
