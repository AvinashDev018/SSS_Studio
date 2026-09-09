"use server";

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export async function uploadImageToCloud(base64Image) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = "sss-orders";

        // Signature params must be sorted alphabetically
        const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

        const formData = new FormData();
        formData.append("file", base64Image);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("folder", folder);
        formData.append("signature", signature);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.secure_url) {
          return { success: true, url: data.secure_url };
        } else {
          console.warn("Cloudinary upload returned non-OK, using local fallback:", data);
        }
      } catch (cloudErr) {
        console.warn("Cloudinary fetch error, using local fallback:", cloudErr.message);
      }
    }

    // Local Storage Fallback: guarantees image is stored and always fetchable
    const match = base64Image.match(/^data:image\/([a-zA-Z0-9-+.]+);base64,(.+)$/);
    const ext = match ? match[1].replace('jpeg', 'jpg') : 'jpg';
    const rawBase64 = match ? match[2] : base64Image;
    const buffer = Buffer.from(rawBase64, 'base64');

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `gallery_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);

    return { success: true, url: `/uploads/${filename}` };
  } catch (error) {
    console.error("Error in uploadImageToCloud:", error);
    return { success: false, error: error.message };
  }
}
