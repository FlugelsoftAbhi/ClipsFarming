import { NextResponse } from "next/server";

// This route runs dynamically on Cloudflare Workers using OpenNext
export async function GET() {
  return NextResponse.json({
    status: "success",
    message: "Hello from the dynamic FlugelClips API running on Cloudflare!",
    timestamp: new Date().toISOString(),
    serverTime: Date.now(),
    environment: process.env.NODE_ENV,
  });
}
