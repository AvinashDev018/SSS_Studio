import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Lightweight DB ping to keep Supabase free-tier projects from auto-pausing.
 * Called by Vercel Cron and/or external uptime/cron services.
 *
 * Optional protection: set CRON_SECRET and send
 *   Authorization: Bearer <CRON_SECRET>
 * Vercel Cron also sends `x-vercel-cron: 1`.
 */
export async function GET(request) {
  const cronSecret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization") || "";
  const isVercelCron = request.headers.get("x-vercel-cron") === "1";
  const bearerOk =
    !cronSecret ||
    auth === `Bearer ${cronSecret}` ||
    isVercelCron;

  if (!bearerOk) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const started = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      db: "up",
      ms: Date.now() - started,
      at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[/api/health] DB ping failed:", error?.message || error);
    return NextResponse.json(
      {
        ok: false,
        db: "down",
        error: error?.message || "Database ping failed",
        ms: Date.now() - started,
        at: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
