"use server";

import { prisma } from "@/lib/prisma";

const FALLBACK_PACKAGES = [
  {
    id: "pkg_5",
    name: "Premium Wedding & Cinematic",
    price: "₹75,000",
    description: "Our flagship signature package for comprehensive wedding day coverage & memories.",
    features: [
      "Full Day Coverage (12 Hours)",
      "2 Senior Photographers & 1 Cinema Videographer",
      "Licensed 4K Aerial Drone Coverage",
      "FREE Outdoor Pre-Wedding Shoot Perk",
      "Handcrafted 40-Page Layflat Master Album",
      "1-Month Delivery Guarantee (or ₹1,000 Cash Credit)"
    ],
    popular: true
  },
  {
    id: "pkg_4",
    name: "Standard Muhurtham & Event",
    price: "₹18,000",
    description: "Traditional ceremony rituals, candid portraits & master photobook album.",
    features: [
      "Traditional Rituals & Stage Coverage",
      "1 Senior Photographer & 1 Videographer",
      "30-Page Master Leather Photobook Album",
      "1-Month Delivery Guarantee"
    ],
    popular: false
  },
  {
    id: "pkg_3",
    name: "Outdoor Pre-Wedding Shoot",
    price: "₹8,000",
    description: "Scenic hill stations (Kodaikanal, Munnar), tea estates or heritage temple shoots.",
    features: [
      "4-6 Hours Outdoor Session",
      "Creative Couple & Bridal Styling",
      "30 Master Retouched High-Res Photos",
      "3-Minute HD Cinematic Teaser"
    ],
    popular: false
  },
  {
    id: "pkg_2",
    name: "Maternity Portrait Shoot",
    price: "₹6,000",
    description: "Safe, tender & creative indoor studio or outdoor couple maternity session.",
    features: [
      "Studio Gowns & Backdrop Access",
      "Indoor & Outdoor Posing Concepts",
      "25 Master Retouched High-Res Photos",
      "1-Month Delivery Guarantee"
    ],
    popular: false
  },
  {
    id: "pkg_1",
    name: "Baby Milestone & Birthday",
    price: "₹5,000",
    description: "Sanitized props, wraps & cake smash milestone themes for 3M, 6M, 1Y.",
    features: [
      "Full Birthday / Milestone Session",
      "Sanitized Props & Baby Wraps",
      "20 Master Retouched High-Res Photos",
      "Private Digital Cloud Gallery (6 Months)"
    ],
    popular: false
  }
];

export async function getPackages() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: [
        { popular: "desc" },
        { createdAt: "desc" }
      ]
    });
    
    // Fallback packages if DB is empty
    if (!packages || packages.length === 0) {
      return [...FALLBACK_PACKAGES].sort((a, b) => (b.popular === a.popular ? 0 : b.popular ? 1 : -1));
    }
    
    return packages;
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [...FALLBACK_PACKAGES].sort((a, b) => (b.popular === a.popular ? 0 : b.popular ? 1 : -1));
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
