import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PDFDocument, PDFName } from "pdf-lib";

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

    // Ensure public/docs folder exists
    const docsDir = path.join(process.cwd(), "public", "docs");
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    // Save both sample-wedding-album.pdf and srijitha-sreeraj-wedding-album.pdf
    fs.writeFileSync(path.join(docsDir, "sample-wedding-album.pdf"), buffer);
    fs.writeFileSync(path.join(docsDir, "srijitha-sreeraj-wedding-album.pdf"), buffer);

    // Extract pages for zero-lag 60fps web viewer
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
      url: `/docs/sample-wedding-album.pdf?t=${Date.now()}`,
      fileName: name,
      fileSize: `${(buffer.length / (1024 * 1024)).toFixed(2)} MB`,
      pagesExtracted: extractedCount,
      message: `Wedding Album PDF updated successfully (${(buffer.length / (1024 * 1024)).toFixed(2)} MB, ${extractedCount} pages extracted for instant viewer)!`,
    });
  } catch (err) {
    console.error("PDF upload error:", err);
    return NextResponse.json({ error: "Failed to save PDF: " + err.message }, { status: 500 });
  }
}
