import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const framesFilePath = path.join(process.cwd(), "src", "data", "frames.json");

const DEFAULT_FRAMES = [
  { id: "8x10", size: "8x10", width: 8, height: 10, price: "₹349", numericPrice: 349, bestFor: "Bedside Table, Study Desk, Office Cabin", popular: false, tag: "Starter Pick", active: true },
  { id: "8x12", size: "8x12", width: 8, height: 12, price: "₹499", numericPrice: 499, bestFor: "Bookshelf Display, Dressing Mirror Side", popular: true, tag: "Best Value", active: true },
  { id: "10x12", size: "10x12", width: 10, height: 12, price: "₹699", numericPrice: 699, bestFor: "Console Table, Bedside Wall Hanging", popular: false, tag: null, active: true },
  { id: "10x15", size: "10x15", width: 10, height: 15, price: "₹799", numericPrice: 799, bestFor: "Passage Gallery, Staircase Collage Wall", popular: true, tag: "Collage Favorite", active: true },
  { id: "12x15", size: "12x15", width: 12, height: 15, price: "₹999", numericPrice: 999, bestFor: "Living Room Pillar, Dining Room Alcove", popular: false, tag: null, active: true },
  { id: "12x18", size: "12x18", width: 12, height: 18, price: "₹1,199", numericPrice: 1199, bestFor: "Master Bedroom Headboard, Living Room Side Wall", popular: true, tag: "Wedding Top Pick", active: true },
  { id: "12x24", size: "12x24", width: 12, height: 24, price: "₹1,499", numericPrice: 1499, bestFor: "Panoramic Wedding Rituals, Temple Room Wall", popular: false, tag: "Panorama Cut", active: true },
  { id: "16x20", size: "16x20", width: 16, height: 20, price: "₹1,799", numericPrice: 1799, bestFor: "Drawing Room Wall, Couple Portrait Feature", popular: false, tag: null, active: true },
  { id: "16x24", size: "16x24", width: 16, height: 24, price: "₹1,999", numericPrice: 1999, bestFor: "Reception Backdrop, Main Living Room Gallery", popular: true, tag: "Grand Pick", active: true },
  { id: "18x24", size: "18x24", width: 18, height: 24, price: "₹2,499", numericPrice: 2499, bestFor: "Double Height Living Wall, VIP Dining Space", popular: false, tag: null, active: true },
  { id: "20x24", size: "20x24", width: 20, height: 24, price: "₹2,999", numericPrice: 2999, bestFor: "Family Dynasty Wall, Grand Entrance Foyer", popular: false, tag: null, active: true },
  { id: "20x30", size: "20x30", width: 20, height: 30, price: "₹3,499", numericPrice: 3499, bestFor: "Luxury Living Room Feature Wall, Villa Foyer", popular: true, tag: "Statement Art", active: true },
  { id: "36x24", size: "36x24", width: 36, height: 24, price: "₹4,999", numericPrice: 4999, bestFor: "Ballroom Main Centerpiece, Royal Marriage Hall", popular: true, tag: "Royal Showcase", active: true }
];

async function readFramesData() {
  try {
    const raw = await fs.readFile(framesFilePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_FRAMES;
  }
}

async function writeFramesData(data) {
  await fs.writeFile(framesFilePath, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  const frames = await readFramesData();
  return NextResponse.json(frames);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const frames = await readFramesData();

    // If body has action === "reset"
    if (body.action === "reset") {
      await writeFramesData(DEFAULT_FRAMES);
      return NextResponse.json({ success: true, frames: DEFAULT_FRAMES });
    }

    // If body is an entire array of frames
    if (Array.isArray(body)) {
      await writeFramesData(body);
      return NextResponse.json({ success: true, frames: body });
    }

    // Otherwise it's a single frame add or update
    const { id, size, price, numericPrice, bestFor, tag, popular, active } = body;
    const existingIndex = frames.findIndex((f) => f.id === id);

    const formattedPrice = typeof price === "number" ? `₹${price.toLocaleString("en-IN")}` : price.startsWith("₹") ? price : `₹${price}`;
    const numPrice = Number(numericPrice) || parseInt(formattedPrice.replace(/[^\d]/g, ""), 10) || 499;

    const frameObject = {
      id: id || size.toLowerCase().replace(/\s+/g, ""),
      size: size || id,
      width: body.width || parseInt(size?.split("x")[0], 10) || 12,
      height: body.height || parseInt(size?.split("x")[1], 10) || 18,
      price: formattedPrice,
      numericPrice: numPrice,
      bestFor: bestFor || "Interior Feature Wall",
      tag: tag || null,
      popular: popular ?? false,
      active: active ?? true,
    };

    let updatedFrames = [...frames];
    if (existingIndex >= 0) {
      updatedFrames[existingIndex] = { ...updatedFrames[existingIndex], ...frameObject };
    } else {
      updatedFrames.push(frameObject);
    }

    await writeFramesData(updatedFrames);
    return NextResponse.json({ success: true, frame: frameObject, frames: updatedFrames });
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

    const frames = await readFramesData();
    const filtered = frames.filter((f) => f.id !== id);
    await writeFramesData(filtered);

    return NextResponse.json({ success: true, frames: filtered });
  } catch (error) {
    console.error("Error deleting frame:", error);
    return NextResponse.json({ error: "Failed to delete frame" }, { status: 500 });
  }
}
