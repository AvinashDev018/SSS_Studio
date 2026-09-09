"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const FALLBACK_PACKAGES = [
  {
    id: "pkg_1",
    name: "Package 1 - Budget Quality",
    price: "₹45,000",
    description: "Essential traditional photography & videography coverage with basic lighting unit and 40-sheet master album.",
    features: [
      "1 Traditional Photo Unit",
      "1 Traditional Video Unit",
      "1 Basic Lighting Unit",
      "30x10 Size Album (40 Sheets Glossy/Matte)",
      "Full Length Video in CDs",
      "1-Month Delivery Guarantee"
    ],
    popular: false
  },
  {
    id: "pkg_2",
    name: "Package 2 - Classic Wedding",
    price: "₹75,000",
    description: "Upgraded complete coverage including Candid Photographer, Traditional Photo & Video, and a 36x12 luxury album delivered on pendrive.",
    features: [
      "1 Traditional Photographer Unit",
      "1 Traditional Videographer Unit",
      "1 Candid Photographer Unit",
      "1 Basic Lighting Unit",
      "36x12 Size Album - 1 (40 Sheets Glossy/Matte)",
      "Full Length Video in Pendrive - 1",
      "1-Month Delivery Guarantee"
    ],
    popular: false
  },
  {
    id: "pkg_3",
    name: "Package 3 - Elevated Drone & Screen",
    price: "₹90,000",
    description: "Signature wedding production featuring Candid Pro, Aerial 4K Drone, dual 44\" LED TV screens, promo video & specialty album finishes.",
    features: [
      "1 Traditional Photographer Unit",
      "1 Traditional Videographer Unit",
      "1 Candid Photographer Pro Unit",
      "1 Aerial Videography (Drone) Unit",
      "2 LED TV 44\" Units (Live Telecast)",
      "1 Standard Lighting Unit",
      "36x12 Size Album - 1 (45 Sheets: Glossy/Matte/Feather/Transparent/Hologram/Glitter/Metallic)",
      "1 Cinematic Promo Video",
      "1 Full Length Video (Delivered by Pendrive)",
      "1-Month Delivery Guarantee"
    ],
    popular: true
  },
  {
    id: "pkg_5",
    name: "Package 5 - Premium Cinematic Production",
    price: "₹1,50,000",
    description: "High-end cinematic wedding production with Dual Traditional crew, Candid Pro, Drone, 360° video, 8x6 LED Wall, 2x 50\" TVs, and Pre-Wedding Storyteller video.",
    features: [
      "2 Traditional Photographer Pro Units",
      "2 Traditional Videographer Units",
      "1 Candid Photographer Pro Unit",
      "1 Candid Videographer Unit (Cinematic Equipments)",
      "1 Aerial Videography (Drone) Unit",
      "1 360° Degree Videography Unit",
      "1 LED Wall 8x6 Unit",
      "2 LED TV 50\" Units",
      "1 Premium Lighting Unit",
      "Pre-Wedding Outdoor Photoshoot (with Storyteller Video)",
      "2 Master 36x12 Albums (50 Sheets Metallic/Matte/Feather/Emboss)",
      "1 Old Memories Photo Slides Presentation",
      "1 Full Length Video in Pendrive",
      "1 Large Photo Frame A3 Size",
      "1 VR Glass + 360° Video & Photos",
      "1-Month Delivery Guarantee"
    ],
    popular: true
  },
  {
    id: "pkg_7",
    name: "Package 7 - Royal Cinematic Heritage",
    price: "₹2,20,000",
    description: "Grand royal wedding production featuring 10 crew units, Pre & Post Wedding shoots, dual 8x6 LED walls, 4 LED TVs, VR glasses & 360° video.",
    features: [
      "3 Traditional Photographer Pro Units",
      "2 Traditional Videographer Pro Units",
      "1 Candid Photographer Pro+ Unit",
      "2 Candid Videographer Units (Cinematic Equipments)",
      "1 Aerial Videography Pro (Drone) Unit",
      "1 360° Degree Videography Unit",
      "2 LED Wall 8x6 Units + 4 LED TV 50\" Units (Live Telecast)",
      "1 Live Video Mixing Unit + 1 Superior Lighting Unit",
      "Pre-Wedding Outdoor Shoot (Storyteller Video) + Pre-Wedding Cinematic Video",
      "Post-Wedding Outdoor Photoshoot",
      "2 Master 36x12 Albums (50 Sheets Metallic/Matte/Feather/Emboss)",
      "1 Old Memories Photo Slides Presentation",
      "1 Full Length Video in Pendrive + Candid Teaser & Trailer",
      "2 Large Size Photo Frames",
      "2 VR Glasses + 360° Video & Photos",
      "1-Month Delivery Guarantee"
    ],
    popular: false
  },
  {
    id: "pkg_8",
    name: "Package 8 - Imperial Cinema 4K Ultra",
    price: "₹2,80,000",
    description: "Our supreme flagship imperial wedding cinema experience with 4K Videography, 3 luxury albums (including outdoor album), dual LED walls, live mixing, VR glasses & full production.",
    features: [
      "3 Traditional Photographer Pro Units",
      "2 Traditional Videographer 4K Units",
      "2 Candid Photographer Pro Units",
      "2 Candid Videographer Units (Cinematic Equipments)",
      "1 Aerial Videography 4K (Drone) Unit",
      "1 360° Degree Videography Unit",
      "2 LED Wall 8x6 Units + 4 LED TV 50\" Units (Live Telecast)",
      "1 Live Video Mixing Unit + 2 Superior Lighting Units",
      "Pre-Wedding Outdoor Shoot (Storyteller Video) + Pre-Wedding Cinematic Video",
      "Post-Wedding Outdoor Photoshoot",
      "2 Master 36x12 Albums (50 Sheets Metallic/Matte/Feather/Emboss)",
      "1 Dedicated Outdoor Shoot 24x15 Album (30 Sheets)",
      "1 Old Memories Photo Slides Presentation",
      "1 Full Length Video in Pendrive + Candid Teaser & Trailer",
      "2 Large Size Photo Frames",
      "2 VR Glasses + 360° Video & Photos",
      "VIP Priority Editing & 1-Month Delivery Guarantee"
    ],
    popular: true
  },
  {
    id: "pkg_outdoor",
    name: "Outdoor Pre-Wedding Shoot",
    price: "₹8,000",
    description: "Scenic hill stations (Kodaikanal, Munnar), tea estates or heritage temple shoots.",
    features: [
      "4-6 Hours Outdoor Session",
      "Creative Couple & Bridal Styling Concepts",
      "30 Master Retouched High-Res Photos",
      "3-Minute HD Cinematic Teaser",
      "Online Cloud Gallery Delivery"
    ],
    popular: false
  },
  {
    id: "pkg_mat",
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
    id: "pkg_baby",
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

const TIER_ORDER = {
  "Package 1 - Budget Quality": 1,
  "Package 2 - Classic Wedding": 2,
  "Package 3 - Elevated Drone & Screen": 3,
  "Package 5 - Premium Cinematic Production": 4,
  "Package 7 - Royal Cinematic Heritage": 5,
  "Package 8 - Imperial Cinema 4K Ultra": 6,
  "Outdoor Pre-Wedding Shoot": 7,
  "Maternity Portrait Shoot": 8,
  "Baby Milestone & Birthday": 9
};

export async function getPackages() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: [
        { createdAt: "asc" }
      ]
    });
    
    const list = (!packages || packages.length === 0) ? [...FALLBACK_PACKAGES] : packages;
    
    return list.sort((a, b) => {
      const orderA = TIER_ORDER[a.name] ?? 99;
      const orderB = TIER_ORDER[b.name] ?? 99;
      return orderA - orderB;
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [...FALLBACK_PACKAGES].sort((a, b) => {
      const orderA = TIER_ORDER[a.name] ?? 99;
      const orderB = TIER_ORDER[b.name] ?? 99;
      return orderA - orderB;
    });
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
