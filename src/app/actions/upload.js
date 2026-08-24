"use server";

import crypto from 'crypto';

export async function uploadImageToCloud(base64Image) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.warn("Cloudinary credentials are missing.");
      return { success: false, error: "Missing Cloudinary Credentials" };
    }

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
      console.error("Cloudinary Upload Error:", data);
      return { success: false, error: data.error?.message || "Failed to upload image." };
    }
  } catch (error) {
    console.error("Error in uploadImageToCloud:", error);
    return { success: false, error: error.message };
  }
}
