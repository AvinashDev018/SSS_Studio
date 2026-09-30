/** Launch offer: ₹100 off frames & birthday gifts — first 20 customers */
export const LAUNCH_OFFER = {
  code: "SSS100",
  /** Keep old code working as alias */
  aliases: ["SSS-LUCKY2026", "SSS100"],
  discountInr: 100,
  maxUses: 20,
  type: "fixed",
  label: "₹100 OFF — First 20 customers (Frames & Birthday Gifts)",
};

export function isLaunchOfferCode(code) {
  const clean = String(code || "").trim().toUpperCase();
  return LAUNCH_OFFER.aliases.includes(clean);
}
