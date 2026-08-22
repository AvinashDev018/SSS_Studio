"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
