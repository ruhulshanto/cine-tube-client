import { liveChannels } from "@/lib/channels";

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return Response.json({
    success: true,
    data: liveChannels,
    timestamp: new Date().toISOString(),
  });
}
