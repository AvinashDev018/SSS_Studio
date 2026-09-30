"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { LAUNCH_OFFER, isLaunchOfferCode } from "@/lib/launchOffer";

export async function getPromos() {
  try {
    return await prisma.promo.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    console.error("Error fetching promos:", error);
    return [];
  }
}

/** Ensure launch promo SSS100 exists — ADMIN ONLY (create / restore). */
export async function ensureLaunchPromo() {
  try {
    const existing = await prisma.promo.findUnique({ where: { code: LAUNCH_OFFER.code } });
    if (existing) return existing;
    return await prisma.promo.create({
      data: {
        code: LAUNCH_OFFER.code,
        discount: LAUNCH_OFFER.discountInr,
        type: "fixed",
        active: true,
        uses: 0,
      },
    });
  } catch (error) {
    console.error("ensureLaunchPromo:", error);
    return null;
  }
}

/** Read-only: do not recreate after admin deletes. */
export async function getLaunchPromoRecord() {
  try {
    return await prisma.promo.findUnique({ where: { code: LAUNCH_OFFER.code } });
  } catch {
    return null;
  }
}

/**
 * Validate launch coupon for frames / birthday gifts.
 * Missing / deleted / inactive = no offer.
 */
export async function validateLaunchOfferCode(code) {
  try {
    if (!isLaunchOfferCode(code)) {
      return { success: false, error: `Invalid code. Use ${LAUNCH_OFFER.code}` };
    }

    const promo = await getLaunchPromoRecord();
    if (!promo) {
      return {
        success: false,
        error: "No offer is currently available.",
        remaining: 0,
      };
    }
    if (!promo.active) {
      return {
        success: false,
        error: "No offer is currently available. This promo is inactive.",
        remaining: 0,
      };
    }

    const remaining = Math.max(0, LAUNCH_OFFER.maxUses - (promo.uses || 0));
    if (remaining <= 0) {
      return {
        success: false,
        error: "Offer ended — first 20 customers already claimed ₹100 off.",
        remaining: 0,
      };
    }

    return {
      success: true,
      promo: {
        id: promo.id,
        code: LAUNCH_OFFER.code,
        discount: LAUNCH_OFFER.discountInr,
        type: "fixed",
        remaining,
        maxUses: LAUNCH_OFFER.maxUses,
      },
    };
  } catch (error) {
    console.error("validateLaunchOfferCode:", error);
    return { success: false, error: "Could not validate offer. Try again." };
  }
}

/** Call when a frame/birthday gift order successfully uses the launch coupon. */
export async function claimLaunchOffer(code) {
  try {
    if (!isLaunchOfferCode(code)) return { success: false };

    const promo = await getLaunchPromoRecord();
    if (!promo || !promo.active) return { success: false, error: "No offer is currently available." };

    if ((promo.uses || 0) >= LAUNCH_OFFER.maxUses) {
      return { success: false, error: "Offer limit reached" };
    }

    const updated = await prisma.promo.update({
      where: { id: promo.id },
      data: { uses: { increment: 1 } },
    });

    return {
      success: true,
      uses: updated.uses,
      remaining: Math.max(0, LAUNCH_OFFER.maxUses - updated.uses),
    };
  } catch (error) {
    console.error("claimLaunchOffer:", error);
    return { success: false };
  }
}

export async function getLaunchOfferStatus() {
  try {
    const promo = await getLaunchPromoRecord();
    if (!promo) {
      return {
        code: LAUNCH_OFFER.code,
        discountInr: LAUNCH_OFFER.discountInr,
        maxUses: LAUNCH_OFFER.maxUses,
        uses: 0,
        remaining: 0,
        active: false,
        exists: false,
        message: "No offer is currently available.",
      };
    }

    const uses = promo.uses || 0;
    const remaining = Math.max(0, LAUNCH_OFFER.maxUses - uses);
    const active = !!promo.active && remaining > 0;

    return {
      code: LAUNCH_OFFER.code,
      discountInr: LAUNCH_OFFER.discountInr,
      maxUses: LAUNCH_OFFER.maxUses,
      uses,
      remaining,
      active,
      exists: true,
      promoActive: !!promo.active,
      message: active
        ? null
        : !promo.active
        ? "No offer is currently available."
        : "Offer ended — first 20 customers already claimed.",
    };
  } catch {
    return {
      code: LAUNCH_OFFER.code,
      discountInr: LAUNCH_OFFER.discountInr,
      maxUses: LAUNCH_OFFER.maxUses,
      uses: 0,
      remaining: 0,
      active: false,
      exists: false,
      message: "No offer is currently available.",
    };
  }
}

/** Admin: create / restore SSS100 launch voucher */
export async function createOrRestoreLaunchOffer() {
  try {
    const promo = await ensureLaunchPromo();
    if (!promo) return { success: false, error: "Could not create launch offer" };

    // If it existed but was deactivated, reactivate and optionally reset is NOT done — just ensure exists
    if (!promo.active) {
      await prisma.promo.update({
        where: { id: promo.id },
        data: { active: true },
      });
    }

    revalidatePath("/admin/promos");
    revalidatePath("/store");
    return { success: true, promo };
  } catch (error) {
    console.error("createOrRestoreLaunchOffer:", error);
    return { success: false, error: "Failed to create launch offer" };
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

    if (isLaunchOfferCode(normalized)) {
      return validateLaunchOfferCode(normalized);
    }

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
