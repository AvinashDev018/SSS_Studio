"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

const FALLBACK_PACKAGES = [
 {
 id: "pkg_1",
 name: "Essential Portrait",
 price: "₹1,500",
 description: "Perfect for quick, professional solo portraits. Includes 5 edited high-res digital photos.",
 popular: false
 },
 {
 id: "pkg_2",
 name: "Signature Family Session",
 price: "₹4,500",
 description: "A beautiful session for the whole family. Includes 15 edited photos and 1 large physical print.",
 popular: true
 },
 {
 id: "pkg_3",
 name: "Premium Event Coverage",
 price: "₹15,000+",
 description: "Full event coverage (birthdays, small functions). Includes a full album and cinematic highlight video.",
 popular: false
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
 const popular = formData.get("popular") === "on";

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
