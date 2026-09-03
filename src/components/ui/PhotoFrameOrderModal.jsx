"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Upload, 
  Check, 
  Copy, 
  MessageCircle, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  User, 
  Phone, 
  CreditCard,
  QrCode,
  CheckCircle2,
  Tag
} from "lucide-react";

export default function PhotoFrameOrderModal({ isOpen, onClose, selectedFrame }) {
  const [step, setStep] = useState(1);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [finishType, setFinishType] = useState("wood");
  const [quantity, setQuantity] = useState(1);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState("pickup"); // 'pickup' or 'courier'
  const [address, setAddress] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [paymentOption, setPaymentOption] = useState("upi");
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isGift, setIsGift] = useState(true);
  const [giftWish, setGiftWish] = useState("");
  const [recipientName, setRecipientName] = useState("");

  if (!isOpen || !selectedFrame) return null;

  // Base price calculation
  const baseNum = parseInt(selectedFrame.price.replace(/[^\d]/g, ""), 10) || 499;
  
  // Finish multiplier: Wood (1x), Acrylic (1.25x), Canvas (1.35x)
  const finishMultiplier = finishType === "acrylic" ? 1.25 : finishType === "canvas" ? 1.35 : 1;
  const finishLabel = finishType === "acrylic" 
    ? "Ultra-Gloss Acrylic Glass" 
    : finishType === "canvas" 
    ? "Textured Canvas Gallery Wrap" 
    : "Classic Synthetic Wood Frame";

  const subtotal = Math.round(baseNum * finishMultiplier * quantity);
  const discount = isCouponApplied ? Math.round(subtotal * 0.15) : 0;
  const finalTotal = subtotal - discount;

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 20MB. Please select a smaller photo.");
      return;
    }

    setErrorMsg("");
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const clean = couponCode.trim().toUpperCase();
    if (clean === "SSS-LUCKY2026" || clean === "SSS15" || clean === "STUDIO2026") {
      setIsCouponApplied(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Invalid coupon code. Try SSS-LUCKY2026");
    }
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText("6383565425@upi");
    setCopiedUPI(true);
    setTimeout(() => setCopiedUPI(false), 2500);
  };

  const handleDispatchWhatsApp = () => {
    if (!clientName.trim() || !clientPhone.trim()) {
      setErrorMsg("Please provide your name and WhatsApp phone number.");
      setStep(2);
      return;
    }

    const receipt = 
      `🎁 *NEW PERSONALIZED PHOTO GIFT ORDER* 🎁\n` +
      `----------------------------------------\n` +
      `📐 *Size:* ${selectedFrame.size} Inches\n` +
      `✨ *Finish:* ${finishLabel}\n` +
      `🔢 *Quantity:* ${quantity} Units\n` +
      `💵 *Unit Price:* ₹${Math.round(baseNum * finishMultiplier).toLocaleString("en-IN")}\n` +
      (isCouponApplied ? `🏷️ *Coupon:* ${couponCode.toUpperCase()} (₹${discount.toLocaleString("en-IN")} OFF)\n` : "") +
      `💰 *Total Order Value:* ₹${finalTotal.toLocaleString("en-IN")}\n` +
      `----------------------------------------\n` +
      (isGift ? `🎀 *GIFT PACKAGING & WISH:*\n` +
        `• *Gift Wish:* "${giftWish.trim() || "With Best Wishes!"}"\n` +
        (recipientName.trim() ? `• *For Recipient:* ${recipientName.trim()}\n` : "") +
        `• *Packaging:* Complimentary Luxury Gift Wrapping & Handwritten Card\n` +
        `----------------------------------------\n` : "") +
      `👤 *CLIENT DETAILS:*\n` +
      `• *Name:* ${clientName.trim()}\n` +
      `• *Phone:* ${clientPhone.trim()}\n` +
      `• *Fulfillment:* ${deliveryType === "pickup" ? "Studio Pickup (Avaniyapuram, Madurai)" : `Courier Delivery to:\n  ${address.trim()}`}\n` +
      `• *Payment Mode:* ${paymentOption === "upi" ? "UPI / Google Pay (6383565425@upi)" : "Pay at Studio Counter"}\n` +
      `----------------------------------------\n` +
      `📸 *Photo Attachment:* Attached below in this chat.\n\n` +
      `Hello SSS Studio! Please confirm my personalized photo gift order. I am attaching the high-resolution photo now! ✨`;

    const waUrl = `https://wa.me/916383565425?text=${encodeURIComponent(receipt)}`;
    window.open(waUrl, "_blank");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl bg-white border-2 border-[#d4af37] rounded-[28px] shadow-[0_25px_70px_rgba(0,0,0,0.3)] overflow-hidden text-zinc-900 my-auto"
        >
          {/* Header Bar */}
          <div className="p-5 sm:p-6 border-b border-black/10 flex items-center justify-between bg-[#FAFAFA]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-black tracking-wider text-[#8b6508]">
                  Custom Framing Studio
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#8b6508] font-extrabold text-[10px]">
                  Step {step} of 3
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-zinc-900 mt-0.5">
                {selectedFrame.size} Inch Custom Photo Frame
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/5 hover:bg-black/10 text-zinc-600 hover:text-black transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content by Step */}
          <div className="p-5 sm:p-6 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs font-bold">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* STEP 1: Select/Upload Photo */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-zinc-800 font-medium leading-relaxed">
                  Upload your memorable photo to mount in your <strong className="text-zinc-900 font-bold">{selectedFrame.size} Inch</strong> frame, or choose to send your photo directly on WhatsApp after ordering.
                </p>

                {/* Upload Box */}
                <div className="relative border-2 border-dashed border-[#d4af37]/60 hover:border-[#d4af37] rounded-2xl p-6 text-center transition-colors bg-[#FAFAFA] group">
                  <input
                    type="file"
                    id="frame-photo-upload"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  {photoPreview ? (
                    <div className="space-y-3">
                      <div className="relative mx-auto max-w-[240px] aspect-[4/3] rounded-xl overflow-hidden border-2 border-[#d4af37] shadow-lg bg-black">
                        <img
                          src={photoPreview}
                          alt="Uploaded Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-[#d4af37] font-bold">
                          ✓ Photo Selected
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-3">
                        <label
                          htmlFor="frame-photo-upload"
                          className="text-xs text-[#8b6508] hover:underline font-bold cursor-pointer"
                        >
                          Change Photo
                        </label>
                        <span className="text-zinc-400">•</span>
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoFile(null);
                            setPhotoPreview(null);
                          }}
                          className="text-xs text-red-600 hover:underline font-bold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="frame-photo-upload"
                      className="cursor-pointer block space-y-2 py-4"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#8b6508] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-sm">
                        <Upload size={22} />
                      </div>
                      <h4 className="text-sm font-bold text-zinc-900">Upload Photo from Device Gallery</h4>
                      <p className="text-[11px] text-zinc-600 font-medium">
                        Supports high-resolution JPG, PNG, WEBP photos (up to 20MB)
                      </p>
                    </label>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-600 font-semibold">
                    {photoPreview ? "✓ Photo ready for frame mounting" : "Optional: Or send photo on WhatsApp later"}
                  </span>
                  <button
                    onClick={() => {
                      setErrorMsg("");
                      setStep(2);
                    }}
                    className="px-6 py-3 rounded-xl bg-metallic-gold text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md hover:scale-105 transition-all"
                  >
                    <span>Proceed to Details &amp; Options</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Frame Material, Quantity & Delivery */}
            {step === 2 && (
              <div className="space-y-4">
                {/* Finish Options */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6508] mb-2">
                    Select Frame Material &amp; Finish
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: "wood", title: "Synthetic Wood", badge: "Classic", extra: "+₹0" },
                      { id: "acrylic", title: "Acrylic Glass", badge: "Ultra-Gloss", extra: "+25%" },
                      { id: "canvas", title: "Canvas Wrap", badge: "Artistic", extra: "+35%" },
                    ].map((fin) => (
                      <button
                        key={fin.id}
                        type="button"
                        onClick={() => setFinishType(fin.id)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          finishType === fin.id
                            ? "border-[#d4af37] bg-metallic-gold text-black font-bold shadow-md scale-[1.02]"
                            : "border-black/10 bg-[#FAFAFA] text-zinc-700 hover:text-black font-semibold"
                        }`}
                      >
                        <span className="text-[10px] font-black uppercase text-[#8b6508] block mb-0.5">
                          {fin.badge}
                        </span>
                        <span className="text-xs font-bold block">{fin.title}</span>
                        <span className="text-[10px] text-zinc-600 block mt-1">{fin.extra}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAFAFA] border border-black/10">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">Order Quantity</span>
                    <span className="text-[11px] text-zinc-600 font-medium">Total frames of this size</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-black/15 text-zinc-900 font-bold flex items-center justify-center cursor-pointer hover:bg-zinc-100"
                    >
                      -
                    </button>
                    <span className="font-mono font-black text-base text-[#8b6508] min-w-[20px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-black/15 text-zinc-900 font-bold flex items-center justify-center cursor-pointer hover:bg-zinc-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Free Gift Packaging & Handwritten Wish Card */}
                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#d4af37]/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🎀</span>
                      <div>
                        <span className="text-xs font-bold text-zinc-900 block">Free Gift Wrapping &amp; Wish Card</span>
                        <span className="text-[10px] text-[#8b6508] font-bold">Ready-to-gift surprise packaging for your loved ones</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isGift}
                      onChange={(e) => setIsGift(e.target.checked)}
                      className="w-4 h-4 accent-[#d4af37] rounded cursor-pointer"
                    />
                  </div>

                  {isGift && (
                    <div className="space-y-2 pt-1.5 border-t border-black/10">
                      <input
                        type="text"
                        placeholder="Recipient Name (e.g. For Priya / Mom & Dad)"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full bg-white border border-black/15 rounded-xl px-3 py-2 text-xs text-zinc-900 font-semibold placeholder-zinc-400 focus:outline-none focus:border-[#d4af37]"
                      />
                      <textarea
                        placeholder="Personalized Gift Wish Message (Handwritten on luxury card)..."
                        value={giftWish}
                        onChange={(e) => setGiftWish(e.target.value)}
                        rows={2}
                        className="w-full bg-white border border-black/15 rounded-xl px-3 py-2 text-xs text-zinc-900 font-semibold placeholder-zinc-400 focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  )}
                </div>

                {/* Client Contact Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-900 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-black/15 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 font-semibold placeholder-zinc-400 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-900 mb-1">WhatsApp Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="e.g. 98765 43210"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-black/15 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 font-semibold placeholder-zinc-400 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                {/* Delivery Option */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-900 mb-1.5">Fulfillment Option</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryType("pickup")}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        deliveryType === "pickup"
                          ? "border-[#d4af37] bg-metallic-gold text-black shadow-sm"
                          : "border-black/10 bg-[#FAFAFA] text-zinc-700"
                      }`}
                    >
                      <MapPin size={13} /> Studio Pickup (Madurai)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType("courier")}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        deliveryType === "courier"
                          ? "border-[#d4af37] bg-metallic-gold text-black shadow-sm"
                          : "border-black/10 bg-[#FAFAFA] text-zinc-700"
                      }`}
                    >
                      <ShieldCheck size={13} /> Courier Delivery
                    </button>
                  </div>
                  {deliveryType === "courier" && (
                    <textarea
                      placeholder="Full Delivery Address with Pincode..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      className="w-full bg-white border border-black/15 rounded-xl px-3.5 py-2 text-xs text-zinc-900 font-semibold placeholder-zinc-400 focus:outline-none focus:border-[#d4af37] mt-2"
                    />
                  )}
                </div>

                {/* Promo Code Strip */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon Code (e.g. SSS-LUCKY2026)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={isCouponApplied}
                    className="flex-1 bg-[#FAFAFA] border border-black/15 rounded-xl px-3.5 py-2 text-xs text-zinc-900 uppercase font-bold placeholder-zinc-400 focus:outline-none focus:border-[#d4af37] disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isCouponApplied}
                    className="px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 text-xs font-bold text-zinc-900 transition-colors cursor-pointer disabled:bg-[#d4af37]/20 disabled:text-[#8b6508]"
                  >
                    {isCouponApplied ? "✓ Applied" : "Apply"}
                  </button>
                </div>

                {/* Step 2 Buttons */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-zinc-600 hover:text-black font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!clientName.trim() || !clientPhone.trim()) {
                        setErrorMsg("Please enter your name and phone number.");
                        return;
                      }
                      setErrorMsg("");
                      setStep(3);
                    }}
                    className="px-6 py-3 rounded-xl bg-metallic-gold text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md hover:scale-105 transition-all"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Instant UPI Payment & WhatsApp Dispatch */}
            {step === 3 && (
              <div className="space-y-5">
                {/* Total Bill Box */}
                <div className="p-4 rounded-2xl bg-metallic-gold border border-[#d4af37] shadow-lg flex items-center justify-between text-black">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-black/80 font-black block">
                      Total Payable Amount
                    </span>
                    <div className="text-2xl sm:text-3xl font-serif font-black text-black">
                      ₹{finalTotal.toLocaleString("en-IN")}
                    </div>
                    {isCouponApplied && (
                      <span className="text-[11px] text-black font-black block mt-0.5">
                        🎉 Coupon Applied (Saved ₹{discount.toLocaleString("en-IN")})
                      </span>
                    )}
                  </div>
                  <div className="text-right text-xs font-bold text-black">
                    <span className="block">{selectedFrame.size} Inch</span>
                    <span className="text-[11px] text-black/80 block">{finishLabel}</span>
                    <span className="text-[11px] text-black/80 block">Qty: {quantity}</span>
                  </div>
                </div>

                {/* Studio Official UPI Payment Box */}
                <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-black/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                      <CreditCard size={14} className="text-[#8b6508]" />
                      Studio Direct UPI / Google Pay
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                      Zero Processing Fee
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-black/15 shadow-sm">
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase font-bold">Official Studio UPI ID</span>
                      <span className="font-mono font-bold text-sm text-[#8b6508]">6383565425@upi</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUPI}
                      className="px-3 py-1.5 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#8b6508] text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedUPI ? <Check size={13} className="text-emerald-700" /> : <Copy size={13} />}
                      <span>{copiedUPI ? "Copied" : "Copy UPI"}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-zinc-600 font-medium">
                    Pay via Google Pay, PhonePe, or Paytm using the UPI ID above, or pay directly upon Studio Pickup at Avaniyapuram, Madurai.
                  </p>
                </div>

                {/* Final WhatsApp Order Button */}
                <button
                  type="button"
                  onClick={handleDispatchWhatsApp}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2.5 text-xs sm:text-sm uppercase tracking-wider cursor-pointer"
                >
                  <MessageCircle size={18} className="stroke-[2.5]" />
                  <span>Submit Order to SSS Studio WhatsApp</span>
                </button>

                <div className="flex items-center justify-between text-xs text-zinc-600 font-bold pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="hover:text-black flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <span className="flex items-center gap-1 text-[11px] text-[#8b6508] font-bold">
                    <ShieldCheck size={13} /> SSS Studio 1-Month Delivery Guarantee
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
