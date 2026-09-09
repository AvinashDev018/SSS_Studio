"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPromos() {
  try {
    return await prisma.promo.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    console.error("Error fetching promos:", error);
    return [];
  }
}

export async function addPromo(formData) {
  try {
    const code = String(formData.get("code") || "").trim().toUpperCase();
    const discount = Number(formData.get("discount"));
    const type = String(formData.get("type") || "percentage").toLowerCase();

    if (!code || !discount || Number.isNaN(discount)) {
      return { success: false, error: "Code and discount are required" };
    }

    const promo = await prisma.promo.create({
      data: {
        code,
        discount,
        type: type === "fixed" ? "fixed" : "percentage",
        active: true,
        uses: 0,
      },
    });
    revalidatePath("/admin/promos");
    revalidatePath("/store");
    return { success: true, promo };
  } catch (error) {
    console.error("Error adding promo:", error);
    return { success: false, error: error.code === "P2002" ? "Promo code already exists" : "Failed to add promo" };
  }
}

export async function togglePromo(id, active) {
  try {
    await prisma.promo.update({ where: { id }, data: { active: !!active } });
    revalidatePath("/admin/promos");
    revalidatePath("/store");
    return { success: true };
  } catch (error) {
    console.error("Error toggling promo:", error);
    return { success: false, error: "Failed to update promo" };
  }
}

export async function deletePromo(id) {
  try {
    await prisma.promo.delete({ where: { id } });
    revalidatePath("/admin/promos");
    revalidatePath("/store");
    return { success: true };
  } catch (error) {
    console.error("Error deleting promo:", error);
    return { success: false, error: "Failed to delete promo" };
  }
}

/** Public checkout validation */
export async function validatePromoCode(code) {
  try {
    const normalized = String(code || "").trim().toUpperCase();
    if (!normalized) return { success: false, error: "Enter a promo code" };

    const promo = await prisma.promo.findUnique({ where: { code: normalized } });
    if (!promo || !promo.active) {
      return { success: false, error: "Invalid or inactive promo code." };
    }

    return {
      success: true,
      promo: {
        id: promo.id,
        code: promo.code,
        discount: promo.discount,
        type: promo.type,
        active: promo.active,
      },
    };
  } catch (error) {
    console.error("Error validating promo:", error);
    return { success: false, error: "Could not validate promo code" };
  }
}

export async function incrementPromoUse(id) {
  try {
    if (!id) return;
    await prisma.promo.update({
      where: { id },
      data: { uses: { increment: 1 } },
    });
  } catch (error) {
    console.warn("Could not increment promo uses:", error.message);
  }
}
