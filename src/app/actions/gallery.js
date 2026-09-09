"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Fetch client gallery by slug
export async function getClientGallery(slug) {
  try {
    if (!prisma?.clientGallery) return null;
    const gallery = await prisma.clientGallery.findUnique({
      where: { slug },
      include: {
        photos: {
          orderBy: { filename: "asc" }
        }
      }
    });
    return gallery;
  } catch (error) {
    console.error("Error fetching client gallery:", error);
    return null;
  }
}

// Toggle photo selection
export async function togglePhotoSelection(photoId, isSelected, comment = "") {
  try {
    if (!prisma?.galleryPhoto) return { success: false, error: "Database not initialized" };
    const photo = await prisma.galleryPhoto.update({
      where: { id: photoId },
      data: {
        isSelected,
        comment
      }
    });
    return { success: true, photo };
  } catch (error) {
    console.error("Error toggling photo selection:", error);
    return { success: false, error: "Failed to update selection" };
  }
}

// Submit album selection for printing
export async function submitGallerySelections(galleryId) {
  try {
    if (!prisma?.clientGallery) return { success: false, error: "Database not initialized" };
    const gallery = await prisma.clientGallery.update({
      where: { id: galleryId },
      data: { status: "SUBMITTED" }
    });
    revalidatePath(`/client-gallery/${gallery.slug}`);
    revalidatePath("/admin/galleries");
    return { success: true, gallery };
  } catch (error) {
    console.error("Error submitting gallery selections:", error);
    return { success: false, error: "Failed to submit album choices" };
  }
}

// Admin: Create new client gallery
export async function createClientGallery(data) {
  try {
    if (!prisma?.clientGallery) return { success: false, error: "Database not initialized" };
    const gallery = await prisma.clientGallery.create({
      data: {
        slug: data.slug,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        passcode: data.passcode,
        eventDate: new Date(data.eventDate),
        maxSelections: parseInt(data.maxSelections) || 40,
        status: "OPEN",
        photos: {
          create: data.photos || []
        }
      }
    });
    revalidatePath("/admin/galleries");
    return { success: true, gallery };
  } catch (error) {
    console.error("Error creating client gallery:", error);
    return { success: false, error: "Failed to create client gallery" };
  }
}

// Admin: Add batch of photos to existing gallery
export async function addPhotosToGallery(galleryId, photos) {
  try {
    if (!prisma?.galleryPhoto) return { success: false, error: "Database not initialized" };
    await prisma.galleryPhoto.createMany({
      data: photos.map((p) => ({
        galleryId,
        url: p.url,
        filename: p.filename,
        isSelected: false,
      })),
    });
    const gallery = await prisma.clientGallery.findUnique({
      where: { id: galleryId },
      select: { slug: true },
    });
    if (gallery?.slug) {
      revalidatePath(`/client-gallery/${gallery.slug}`);
    }
    revalidatePath("/admin/galleries");
    return { success: true };
  } catch (error) {
    console.error("Error adding batch photos to gallery:", error);
    return { success: false, error: "Failed to upload photo batch" };
  }
}

// Admin: Delete client gallery and all associated photos
export async function deleteClientGallery(id) {
  try {
    if (!prisma?.clientGallery) return { success: false, error: "Database not initialized" };
    await prisma.clientGallery.delete({
      where: { id },
    });
    revalidatePath("/admin/galleries");
    return { success: true };
  } catch (error) {
    console.error("Error deleting client gallery:", error);
    return { success: false, error: "Failed to delete gallery" };
  }
}

// Admin: Get all galleries
export async function getAllClientGalleries() {
  try {
    if (!prisma?.clientGallery) {
      console.warn("prisma.clientGallery is not initialized on the Prisma client.");
      return [];
    }
    const galleries = await prisma.clientGallery.findMany({
      include: {
        photos: true,
        _count: {
          select: { photos: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return galleries;
  } catch (error) {
    console.error("Error fetching all galleries:", error);
    return [];
  }
}



export async function getPhotos() {
 try {
 const photos = await prisma.photo.findMany({
 orderBy: {
 createdAt: "desc"
 }
 });
 return photos;
 } catch (error) {
 console.error("Error fetching photos:", error);
 return [];
 }
}

export async function addPhoto(formDataOrUrl, maybeCategory) {
  let url, category;

  if (formDataOrUrl && typeof formDataOrUrl.get === "function") {
    url = formDataOrUrl.get("url");
    category = formDataOrUrl.get("category");
  } else if (typeof formDataOrUrl === "object" && formDataOrUrl !== null && !Array.isArray(formDataOrUrl)) {
    url = formDataOrUrl.url;
    category = formDataOrUrl.category || maybeCategory;
  } else {
    url = formDataOrUrl;
    category = maybeCategory;
  }

  if (!url || !category) {
    return { success: false, error: "URL and Category are required." };
  }

  try {
    const photo = await prisma.photo.create({
      data: {
        url,
        category,
      },
    });
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    revalidatePath("/");
    return { success: true, photo };
  } catch (error) {
    console.error("Error adding photo:", error);
    return { success: false, error: "Failed to save photo to database." };
  }
}

export async function deletePhoto(id) {
 try {
 await prisma.photo.delete({
 where: { id },
 });
 revalidatePath("/gallery");
 revalidatePath("/admin/gallery");
 revalidatePath("/");
 return { success: true };
 } catch (error) {
 console.error("Error deleting photo:", error);
 return { success: false, error: "Failed to delete photo." };
 }
}

export async function togglePhotoFeatured(id, featured) {
  try {
    const photo = await prisma.photo.update({
      where: { id },
      data: { featured: !!featured },
    });
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    revalidatePath("/");
    return { success: true, photo };
  } catch (error) {
    console.error("Error toggling featured photo:", error);
    return { success: false, error: "Failed to update featured status." };
  }
}

export async function getFeaturedPhotos() {
  try {
    return await prisma.photo.findMany({
      where: { featured: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching featured photos:", error);
    return [];
  }
}
