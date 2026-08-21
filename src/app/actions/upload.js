"use server";

export async function uploadImageToCloud(base64Image) {
  try {
    // Remove the data:image/jpeg;base64, prefix so ImgBB can process it
    const base64Data = base64Image.split(',')[1];
    
    // We need an API key. We will use a public env variable or tell the user to provide one.
    const apiKey = process.env.IMGBB_API_KEY;
    
    if (!apiKey) {
      console.warn("IMGBB_API_KEY is missing. Returning the base64 string instead (which will break WhatsApp links). Please add it to your .env file.");
      return { success: false, error: "Missing API Key" };
    }

    const formData = new FormData();
    formData.append("image", base64Data);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return { success: true, url: data.data.url };
    } else {
      console.error("ImgBB Upload Error:", data);
      return { success: false, error: "Failed to upload image to cloud." };
    }
  } catch (error) {
    console.error("Error in uploadImageToCloud:", error);
    return { success: false, error: error.message };
  }
}
