"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULT_FRAMES = [
  { size: "8x10", width: 8, height: 10, price: "₹349", numericPrice: 349, bestFor: "Bedside Table, Study Desk, Office Cabin", popular: false, tag: "Starter Pick", active: true },
  { size: "8x12", width: 8, height: 12, price: "₹499", numericPrice: 499, bestFor: "Bookshelf Display, Dressing Mirror Side", popular: true, tag: "Best Value", active: true },
  { size: "10x12", width: 10, height: 12, price: "₹699", numericPrice: 699, bestFor: "Console Table, Bedside Wall Hanging", popular: false, tag: null, active: true },
  { size: "10x15", width: 10, height: 15, price: "₹799", numericPrice: 799, bestFor: "Passage Gallery, Staircase Collage Wall", popular: true, tag: "Collage Favorite", active: true },
  { size: "12x15", width: 12, height: 15, price: "₹999", numericPrice: 999, bestFor: "Living Room Pillar, Dining Room Alcove", popular: false, tag: null, active: true },
  { size: "12x18", width: 12, height: 18, price: "₹1,199", numericPrice: 1199, bestFor: "Master Bedroom Headboard, Living Room Side Wall", popular: true, tag: "Wedding Top Pick", active: true },
  { size: "12x24", width: 12, height: 24, price: "₹1,499", numericPrice: 1499, bestFor: "Panoramic Wedding Rituals, Temple Room Wall", popular: false, tag: "Panorama Cut", active: true },
  { size: "16x20", width: 16, height: 20, price: "₹1,799", numericPrice: 1799, bestFor: "Drawing Room Wall, Couple Portrait Feature", popular: false, tag: null, active: true },
  { size: "16x24", width: 16, height: 24, price: "₹1,999", numericPrice: 1999, bestFor: "Reception Backdrop, Main Living Room Gallery", popular: true, tag: "Grand Pick", active: true },
  { size: "18x24", width: 18, height: 24, price: "₹2,499", numericPrice: 2499, bestFor: "Double Height Living Wall, VIP Dining Space", popular: false, tag: null, active: true },
  { size: "20x24", width: 20, height: 24, price: "₹2,999", numericPrice: 2999, bestFor: "Family Dynasty Wall, Grand Entrance Foyer", popular: false, tag: null, active: true },
  { size: "20x30", width: 20, height: 30, price: "₹3,499", numericPrice: 3499, bestFor: "Luxury Living Room Feature Wall, Villa Foyer", popular: true, tag: "Statement Art", active: true },
  { size: "36x24", width: 36, height: 24, price: "₹4,999", numericPrice: 4999, bestFor: "Ballroom Main Centerpiece, Royal Marriage Hall", popular: true, tag: "Royal Showcase", active: true },
];

function mapFrame(f) {
  return {
    id: f.size,
    size: f.size,
    width: f.width,
    height: f.height,
    price: f.price,
    numericPrice: f.numericPrice,
    bestFor: f.bestFor,
    tag: f.tag,
    popular: f.popular,
    active: f.active,
    dbId: f.id,
  };
}

async function ensureFramesSeeded() {
  const count = await prisma.frame.count();
  if (count === 0) {
    await prisma.frame.createMany({ data: DEFAULT_FRAMES });
  }
}

export async function getFrames({ admin = false } = {}) {
  try {
    await ensureFramesSeeded();
    const frames = await prisma.frame.findMany({
      where: admin ? undefined : { active: true },
      orderBy: { numericPrice: "asc" },
    });
    return frames.map(mapFrame);
  } catch (error) {
    console.error("Error fetching frames:", error);
    return DEFAULT_FRAMES.filter((f) => admin || f.active).map((f) => ({ ...f, id: f.size, dbId: f.size }));
  }
}

export async function upsertFrame(data) {
  try {
    const size = String(data.size || data.id || "").trim();
    if (!size) return { success: false, error: "Frame size is required" };

    const numericPrice =
      Number(data.numericPrice) ||
      parseInt(String(data.price || "").replace(/[^\d]/g, ""), 10) ||
      499;
    const price =
      typeof data.price === "number"
        ? `₹${data.price.toLocaleString("en-IN")}`
        : String(data.price || "").startsWith("₹")
          ? String(data.price)
          : `₹${numericPrice.toLocaleString("en-IN")}`;

    const payload = {
      size,
      width: Number(data.width) || parseInt(size.split("x")[0], 10) || 12,
      height: Number(data.height) || parseInt(size.split("x")[1], 10) || 18,
      price,
      numericPrice,
      bestFor: data.bestFor || "Interior Feature Wall",
      tag: data.tag || null,
      popular: !!data.popular,
      active: data.active !== false,
    };

    const frame = await prisma.frame.upsert({
      where: { size },
      create: payload,
      update: payload,
    });

    revalidatePath("/");
    revalidatePath("/store");
    revalidatePath("/admin/frames-gifts");
    return { success: true, frame: mapFrame(frame) };
  } catch (error) {
    console.error("Error upserting frame:", error);
    return { success: false, error: "Failed to save frame" };
  }
}

export async function deleteFrameBySize(size) {
  try {
    await prisma.frame.delete({ where: { size } });
    revalidatePath("/");
    revalidatePath("/store");
    revalidatePath("/admin/frames-gifts");
    return { success: true };
  } catch (error) {
    console.error("Error deleting frame:", error);
    return { success: false, error: "Failed to delete frame" };
  }
}

export async function resetFrames() {
  try {
    await prisma.frame.deleteMany({});
    await prisma.frame.createMany({ data: DEFAULT_FRAMES });
    revalidatePath("/");
    revalidatePath("/store");
    revalidatePath("/admin/frames-gifts");
    return { success: true, frames: await getFrames({ admin: true }) };
  } catch (error) {
    console.error("Error resetting frames:", error);
    return { success: false, error: "Failed to reset frames" };
  }
}

export async function getSiteAsset(key) {
  try {
    return await prisma.siteAsset.findUnique({ where: { key } });
  } catch (error) {
    console.error("Error fetching site asset:", error);
    return null;
  }
}

export async function setSiteAsset(key, url, meta = null) {
  try {
    const asset = await prisma.siteAsset.upsert({
      where: { key },
      create: { key, url, meta },
      update: { url, meta },
    });
    revalidatePath("/");
    revalidatePath("/admin/gallery");
    return { success: true, asset };
  } catch (error) {
    console.error("Error saving site asset:", error);
    return { success: false, error: "Failed to save asset" };
  }
}
