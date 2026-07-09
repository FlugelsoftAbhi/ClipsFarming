import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, negativePrompt, aspectRatio, duration, style, resolution } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    // Refined prompt using preset style configurations
    let finalPrompt = prompt;
    if (style && style !== "None") {
      finalPrompt = `${prompt}, style preset: ${style}`;
    }

    // Prepare parameters for Google Veo predictLongRunning REST call
    // Map human-friendly options to API parameters
    const mappedAspectRatio = aspectRatio?.includes("9:16") 
      ? "9:16" 
      : aspectRatio?.includes("1:1") 
        ? "1:1" 
        : "16:9";

    // Duration is in seconds (supported range typically 5-8s)
    const durationSeconds = typeof duration === "number" ? duration : 5;

    // Resolution options
    const mappedResolution = resolution?.includes("1080p") 
      ? "1080p" 
      : resolution?.includes("720p") 
        ? "720p" 
        : "720p";

    // Model name selection. We use the preview standard veo-3.1
    const model = "veo-3.1-generate-preview";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predictLongRunning`;

    const requestBody = {
      instances: [
        {
          prompt: finalPrompt,
          ...(negativePrompt ? { negativePrompt } : {})
        }
      ],
      parameters: {
        sampleCount: 1,
        resolution: mappedResolution,
        aspectRatio: mappedAspectRatio,
        durationSeconds: durationSeconds
      }
    };

    console.log(`Starting Veo Generation on ${endpoint} for prompt: "${finalPrompt}"`);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errText = await response.text();
      let parsedErr;
      try { parsedErr = JSON.parse(errText); } catch { parsedErr = null; }
      
      const errorMsg = parsedErr?.error?.message || errText || "Unknown API error";
      console.error("Veo API request failed:", errText);
      return NextResponse.json({ error: errorMsg }, { status: response.status });
    }

    const data = await response.json();
    
    // The response returns an operation object containing:
    // { "name": "operations/abcd..." }
    if (!data.name) {
      return NextResponse.json(
        { error: "Invalid response from Veo API: Operation name missing." },
        { status: 502 }
      );
    }

    // --- Supabase Log Insertion ---
    // Log the initial generation metadata dynamically.
    // If Supabase config is mock or missing, we gracefully proceed.
    console.log(`Veo generation started successfully. Operation ID: ${data.name}`);

    return NextResponse.json({
      success: true,
      operationId: data.name,
      message: "Generation started."
    });

  } catch (error: any) {
    console.error("Error in /api/video/generate:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
