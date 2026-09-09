import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { PDFDocument, PDFName } from "pdf-lib";
import { setSiteAsset } from "@/app/actions/frames";

async function uploadPdfToCloudinary(buffer, filename) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;

  const timestamp = Math.round(Date.now() / 1000);
  const publicId = `sss-wedding-album/${filename.replace(/\.pdf$/i, "")}`;
  const folder = "sss-wedding-album";
  const signatureString = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(signatureString).digest("hex");

  const formData = new FormData();
  const blob = new Blob([buffer], { type: "application/pdf" });
  formData.append("file", blob, filename);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);
  formData.append("public_id", publicId);
  formData.append("resource_type", "raw");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (res.ok && data.secure_url) return data.secure_url;
  console.warn("Cloudinary PDF upload failed:", data);
  return null;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 });
    }

    const name = file.name || "";
    if (!name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a valid PDF document (.pdf)" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Best-effort local copy for page extraction / local preview
    const docsDir = path.join(process.cwd(), "public", "docs");
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(docsDir, "sample-wedding-album.pdf"), buffer);
    fs.writeFileSync(path.join(docsDir, "srijitha-sreeraj-wedding-album.pdf"), buffer);

    let cloudUrl = null;
    try {
      cloudUrl = await uploadPdfToCloudinary(buffer, "srijitha-sreeraj-wedding-album.pdf");
    } catch (cloudErr) {
      console.warn("Cloudinary PDF upload error:", cloudErr.message);
    }

    const publicUrl = cloudUrl || `/docs/srijitha-sreeraj-wedding-album.pdf`;
    await setSiteAsset("wedding_album_pdf", publicUrl, {
      fileName: name,
      fileSize: buffer.length,
      cloudinary: !!cloudUrl,
    });

    let extractedCount = 0;
    try {
      const pdfDoc = await PDFDocument.load(buffer);
      const total = pdfDoc.getPageCount();
      const albumImgDir = path.join(process.cwd(), "public", "images", "wedding-album");
      if (!fs.existsSync(albumImgDir)) {
        fs.mkdirSync(albumImgDir, { recursive: true });
      }

      const manifest = [];
      for (let i = 0; i < total; i++) {
        const page = pdfDoc.getPage(i);
        const resources = page.node.Resources();
        if (!resources) continue;
        const xObject = resources.lookup(PDFName.of("XObject"));
        if (!xObject || !xObject.dict) continue;

        for (const key of xObject.dict.keys()) {
          const obj = xObject.lookup(key);
          if (obj && obj.contents) {
            const filter = obj.dict.lookup(PDFName.of("Filter"))?.toString();
            const width = Number(obj.dict.lookup(PDFName.of("Width"))?.toString() || 1728);
            const height = Number(obj.dict.lookup(PDFName.of("Height"))?.toString() || 1080);
            const ext = filter === "/DCTDecode" ? "jpg" : "jpg";
            const filename = `page-${String(i + 1).padStart(2, "0")}.${ext}`;
            fs.writeFileSync(path.join(albumImgDir, filename), obj.contents);
            manifest.push({
              page: i + 1,
              filename,
              url: `/images/wedding-album/${filename}`,
              width,
              height,
              isCover: i === 0,
            });
            extractedCount++;
            break;
          }
        }
      }
      fs.writeFileSync(path.join(albumImgDir, "manifest.json"), JSON.stringify(manifest, null, 2));
    } catch (extractErr) {
      console.warn("Could not extract raw images from PDF:", extractErr.message);
    }

    return NextResponse.json({
      success: true,
      url: `${publicUrl}${publicUrl.includes("?") ? "&" : "?"}t=${Date.now()}`,
      fileName: name,
      fileSize: `${(buffer.length / (1024 * 1024)).toFixed(2)} MB`,
      pagesExtracted: extractedCount,
      hostedOn: cloudUrl ? "cloudinary" : "local",
      message: `Wedding Album PDF updated successfully (${(buffer.length / (1024 * 1024)).toFixed(2)} MB, ${extractedCount} pages extracted)!`,
    });
  } catch (err) {
    console.error("PDF upload error:", err);
    return NextResponse.json({ error: "Failed to save PDF: " + err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { getSiteAsset } = await import("@/app/actions/frames");
    const asset = await getSiteAsset("wedding_album_pdf");
    return NextResponse.json({
      url: asset?.url || "/docs/srijitha-sreeraj-wedding-album.pdf",
      meta: asset?.meta || null,
    });
  } catch (error) {
    return NextResponse.json({
      url: "/docs/srijitha-sreeraj-wedding-album.pdf",
      meta: null,
    });
  }
}
