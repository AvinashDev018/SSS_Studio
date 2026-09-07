import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "e5pnwpo5";
    const apiKey = process.env.CLOUDINARY_API_KEY || "111373897212522";
    const apiSecret = process.env.CLOUDINARY_API_SECRET || "qn_OZ4oK1UiNsXT28COaLH5onlc";

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = `data:${file.type || "image/jpeg"};base64,${buffer.toString("base64")}`;

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "sss_client_galleries";

    // Alphabetically sorted parameters string for Cloudinary SHA1 signature
    const strToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(strToSign).digest("hex");

    const cloudinaryData = new FormData();
    cloudinaryData.append("file", base64Data);
    cloudinaryData.append("api_key", apiKey);
    cloudinaryData.append("timestamp", timestamp.toString());
    cloudinaryData.append("signature", signature);
    cloudinaryData.append("folder", folder);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: cloudinaryData,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Cloudinary upload error payload:", data);
      return NextResponse.json(
        { error: data.error?.message || "Cloudinary upload failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: data.secure_url,
      public_id: data.public_id,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: "Internal server error during upload" }, { status: 500 });
  }
}
