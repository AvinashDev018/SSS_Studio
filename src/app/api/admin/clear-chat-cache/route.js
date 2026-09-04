import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { category, secret } = body;

    // Optional admin authentication check
    if (secret && secret !== process.env.ADMIN_SECRET && secret !== "sss-admin-cache-clear") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let deleted = 0;
    if (category) {
      const res = await prisma.chatCache.deleteMany({
        where: { category: category.toUpperCase() },
      });
      deleted = res.count;
    } else {
      const res = await prisma.chatCache.deleteMany({});
      deleted = res.count;
    }

    return NextResponse.json({
      success: true,
      message: `Cleared ${deleted} cached AI chat responses${category ? ` for category '${category}'` : ""}.`,
      deletedCount: deleted,
    });
  } catch (error) {
    console.error("Clear Cache API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
