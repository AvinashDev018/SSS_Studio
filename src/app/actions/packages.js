"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

const FALLBACK_PACKAGES = [
  {
    id: "pkg_1",
    name: "Baby Milestone & Birthday",
    price: "₹5,000",
    description: "Sanitized props, wraps & cake smash milestone themes for 3M, 6M, 1Y.",
    popular: false
  },
  {
    id: "pkg_2",
    name: "Maternity Portrait Shoot",
    price: "₹6,000",
    description: "Safe, tender & creative indoor studio or outdoor couple maternity session.",
    popular: false
  },
  {
    id: "pkg_3",
    name: "Outdoor Pre-Wedding Shoot",
    price: "₹8,000",
    description: "Scenic hill stations (Kodaikanal, Munnar), tea estates or heritage temple shoots.",
    popular: false
  },
  {
    id: "pkg_4",
    name: "Standard Muhurtham & Event",
    price: "₹18,000",
    description: "Traditional ceremony rituals, candid portraits & master photobook album.",
    popular: false
  },
  {
    id: "pkg_5",
    name: "Premium Wedding & Cinematic",
    price: "₹75,000",
    description: "Full day coverage, 4K Drone, master album, free pre-wedding shoot perk & 1-Month Delivery Guarantee.",
    popular: true
  }
];

export async function getPackages() {
 try {
 const packages = await prisma.package.findMany({
 orderBy: {
 createdAt: "asc"
 }
 });
 
 // Fallback packages if DB is empty
 if (!packages || packages.length === 0) {
 return FALLBACK_PACKAGES;
 }
 
 return packages;
 } catch (error) {
 console.error("Error fetching packages:", error);
 return FALLBACK_PACKAGES; // Return fallback on DB error too
 }
}

export async function addPackage(formData) {
 try {
 const name = formData.get("name");
 const price = formData.get("price");
 const description = formData.get("description");
 const featuresStr = formData.get("features") || "";
 const popular = formData.get("popular") === "on" || formData.get("popular") === "true";

 const pkg = await prisma.package.create({
 data: {
 name,
 price,
 description,
 features: featuresStr.split(',').map(f => f.trim()).filter(f => f.length > 0),
 popular,
 }
 });
 revalidatePath("/packages");
 revalidatePath("/admin/packages");
 return { success: true, pkg };
 } catch (error) {
 console.error("Error adding package:", error);
 return { success: false, error: "Failed to add package" };
 }
}

export async function deletePackage(id) {
 try {
 await prisma.package.delete({
 where: { id }
 });
 revalidatePath("/packages");
 revalidatePath("/admin/packages");
 return { success: true };
 } catch (error) {
 console.error("Error deleting package:", error);
 return { success: false, error: "Failed to delete package" };
 }
}
