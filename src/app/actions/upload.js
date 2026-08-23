"use server";

import crypto from 'crypto';

export async function uploadImageToCloud(base64Image) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.warn("Cloudinary credentials are missing. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env file.");
      return { success: false, error: "Missing Cloudinary Credentials" };
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Cloudinary requires the signature string to be sorted alphabetically by parameter name.
    // Since we only have timestamp, it's just timestamp=<value>
    const signatureString = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

    const formData = new FormData();
    // Cloudinary accepts the full data URI (e.g., data:image/jpeg;base64,...)
    formData.append("file", base64Image);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
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
      return { success: false, error: data.error?.message || "Failed to upload image to Cloudinary." };
    }
  } catch (error) {
    console.error("Error in uploadImageToCloud:", error);
    return { success: false, error: error.message };
  }
}
