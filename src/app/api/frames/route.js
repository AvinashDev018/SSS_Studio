import { NextResponse } from "next/server";
import {
  getFrames,
  upsertFrame,
  deleteFrameBySize,
  resetFrames,
} from "@/app/actions/frames";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const admin = searchParams.get("admin") === "1";
  const frames = await getFrames({ admin });
  return NextResponse.json(frames);
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.action === "reset") {
      const result = await resetFrames();
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }
      return NextResponse.json({ success: true, frames: result.frames });
    }

    if (Array.isArray(body)) {
      for (const frame of body) {
        await upsertFrame(frame);
      }
      const frames = await getFrames({ admin: true });
      return NextResponse.json({ success: true, frames });
    }

    const result = await upsertFrame(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    const frames = await getFrames({ admin: true });
    return NextResponse.json({ success: true, frame: result.frame, frames });
  } catch (error) {
    console.error("Error updating frames:", error);
    return NextResponse.json({ error: "Failed to update frames data" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing frame ID" }, { status: 400 });
    }

    const result = await deleteFrameBySize(id);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    const frames = await getFrames({ admin: true });
    return NextResponse.json({ success: true, frames });
  } catch (error) {
    console.error("Error deleting frame:", error);
    return NextResponse.json({ error: "Failed to delete frame" }, { status: 500 });
  }
}
