import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { sendProductionAlert } from "@/lib/alerts";

export async function GET() {
  const startedAt = Date.now();

  try {
    await dbConnect();

    return NextResponse.json({
      status: "OK",
      db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      uptimeSeconds: Math.floor(process.uptime()),
      responseTimeMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown health check error";

    try {
      await sendProductionAlert({
        issueType: "Health check failure",
        affectedRoute: "/api/health",
        possibleCause: "Database connection failed or runtime error occurred during health validation.",
        logs: message,
      });
    } catch (alertError) {
      console.error("[HEALTH_ALERT_FAILED]", alertError);
    }

    return NextResponse.json(
      {
        status: "ERROR",
        db: "disconnected",
        uptimeSeconds: Math.floor(process.uptime()),
        responseTimeMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
