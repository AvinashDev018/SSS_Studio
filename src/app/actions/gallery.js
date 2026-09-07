"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Fetch client gallery by slug
export async function getClientGallery(slug) {
  try {
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

// Admin: Get all galleries
export async function getAllClientGalleries() {
  try {
    const galleries = await prisma.clientGallery.findMany({
      include: {
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

export async function addPhoto(formData) {
 const url = formData.get("url");
 const category = formData.get("category");

 if (!url || !category) {
 return { success: false, error: "URL and Category are required." };
 }

 try {
 await prisma.photo.create({
 data: {
 url,
 category,
 },
 });
 revalidatePath("/gallery");
 revalidatePath("/admin/gallery");
 return { success: true };
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
 return { success: true };
 } catch (error) {
 console.error("Error deleting photo:", error);
 return { success: false, error: "Failed to delete photo." };
 }
}
