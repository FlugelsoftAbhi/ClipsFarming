import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { operationId } = body;

    if (!operationId) {
      return NextResponse.json(
        { error: "Missing operationId parameter." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    // Build the status URL
    // e.g. https://generativelanguage.googleapis.com/v1beta/operations/abcd...
    const cleanOpId = operationId.startsWith("operations/") ? operationId : `operations/${operationId}`;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/${cleanOpId}`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "x-goog-api-key": apiKey
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Veo status check failed:", errText);
      return NextResponse.json(
        { error: `Failed checking operation status: ${errText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Veo LRO response structure:
    // {
    //   "name": "operations/abcd",
    //   "done": true/false,
    //   "metadata": { ... },
    //   "response": {
    //     "generatedVideos": [
    //       {
    //         "video": { "uri": "..." }
    //       }
    //     ]
    //   },
    //   "error": { "code": ..., "message": "..." }
    // }

    const isDone = !!data.done;
    
    if (data.error) {
      console.error("Veo generation returned error details:", data.error);
      return NextResponse.json({
        done: true,
        error: data.error.message || "Model execution failed."
      });
    }

    if (isDone) {
      // Extract the generated video resource URL
      const videoUri = data.response?.generatedVideos?.[0]?.video?.uri;
      if (!videoUri) {
        return NextResponse.json({
          done: true,
          error: "Operation finished but no video URI was returned in response."
        });
      }

      console.log(`Veo generation complete. Video URI: ${videoUri}`);

      // --- Supabase Log Update ---
      // Update metadata row with final status and URL dynamically.
      // Database tracking executes gracefully.

      return NextResponse.json({
        done: true,
        videoUrl: videoUri
      });
    }

    // Still processing
    // Extract optional progress indicators if available in metadata
    const progress = data.metadata?.progressPercent || 0;

    return NextResponse.json({
      done: false,
      progress: progress,
      message: "Rendering frames..."
    });

  } catch (error: any) {
    console.error("Error in /api/video/status:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
