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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl bg-gradient-to-b from-[#0c221e] via-[#091915] to-[#071310] border border-teal-500/30 rounded-[28px] shadow-2xl overflow-hidden text-zinc-100 my-auto"
        >
          {/* Header Bar */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-black/30">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-teal-400">
                  Custom Framing Studio
                </span>
                <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-bold text-[10px]">
                  Step {step} of 3
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-white mt-0.5">
                {selectedFrame.size} Inch Custom Photo Frame
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content by Step */}
          <div className="p-5 sm:p-6 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* STEP 1: Select/Upload Photo */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-zinc-300 font-light">
                  Upload your memorable wedding, family, or portrait photo to mount in your <strong className="text-white">{selectedFrame.size} Inch</strong> frame.
                </p>

                {/* Upload Box */}
                <div className="relative border-2 border-dashed border-teal-500/30 hover:border-teal-400 rounded-2xl p-6 text-center transition-colors bg-[#081210]/60 group">
                  <input
                    type="file"
                    id="frame-photo-upload"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  {photoPreview ? (
                    <div className="space-y-3">
                      <div className="relative mx-auto max-w-[240px] aspect-[4/3] rounded-xl overflow-hidden border-2 border-teal-400 shadow-xl bg-black">
                        <img
                          src={photoPreview}
                          alt="Uploaded Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] text-teal-300 font-bold">
                          ✓ Photo Ready
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-3">
                        <label
                          htmlFor="frame-photo-upload"
                          className="text-xs text-teal-300 hover:underline font-semibold cursor-pointer"
                        >
                          Change Photo
                        </label>
                        <span className="text-zinc-600">•</span>
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoFile(null);
                            setPhotoPreview(null);
                          }}
                          className="text-xs text-red-400 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="frame-photo-upload"
                      className="cursor-pointer block space-y-2 py-6"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-300 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <Upload size={22} />
                      </div>
                      <h4 className="text-sm font-bold text-white">Choose Photo from Device Gallery</h4>
                      <p className="text-[11px] text-zinc-400 font-light">
                        Supports JPG, PNG, WEBP high-resolution photos (up to 20MB)
                      </p>
                    </label>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      if (!photoPreview) {
                        setErrorMsg("Please upload your photo before proceeding.");
                        return;
                      }
                      setErrorMsg("");
                      setStep(2);
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-[#071f1b] font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-500/20"
                  >
                    <span>Proceed to Customization</span>
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
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
                            ? "border-teal-400 bg-teal-500/20 text-white shadow-md scale-[1.02]"
                            : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span className="text-[10px] font-extrabold uppercase text-teal-300 block mb-0.5">
                          {fin.badge}
                        </span>
                        <span className="text-xs font-bold block">{fin.title}</span>
                        <span className="text-[10px] text-zinc-400 block mt-1">{fin.extra}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#081210] border border-white/10">
                  <div>
                    <span className="text-xs font-semibold text-white block">Order Quantity</span>
                    <span className="text-[11px] text-zinc-400">Total frames of this size</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-base text-teal-300 min-w-[20px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Free Gift Packaging & Handwritten Wish Card */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-teal-500/10 to-transparent border border-amber-400/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🎀</span>
                      <div>
                        <span className="text-xs font-bold text-white block">Free Gift Wrapping &amp; Wish Card</span>
                        <span className="text-[10px] text-amber-300 font-medium">Ready-to-gift surprise packaging for your loved ones</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isGift}
                      onChange={(e) => setIsGift(e.target.checked)}
                      className="w-4 h-4 accent-teal-400 rounded cursor-pointer"
                    />
                  </div>

                  {isGift && (
                    <div className="space-y-2 pt-1.5 border-t border-white/10">
                      <input
                        type="text"
                        placeholder="Recipient Name (e.g. For Priya / Mom & Dad)"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full bg-[#081210] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-teal-400"
                      />
                      <textarea
                        placeholder="Personalized Gift Wish Message (Handwritten on luxury card)..."
                        value={giftWish}
                        onChange={(e) => setGiftWish(e.target.value)}
                        rows={2}
                        className="w-full bg-[#081210] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  )}
                </div>

                {/* Client Contact Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-[#081210] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-1">WhatsApp Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="e.g. 98765 43210"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-[#081210] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                {/* Delivery Option */}
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1.5">Fulfillment Option</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryType("pickup")}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                        deliveryType === "pickup"
                          ? "border-teal-400 bg-teal-500/20 text-teal-300 font-bold"
                          : "border-white/10 bg-white/5 text-zinc-400"
                      }`}
                    >
                      <MapPin size={13} /> Studio Pickup (Madurai)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType("courier")}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                        deliveryType === "courier"
                          ? "border-teal-400 bg-teal-500/20 text-teal-300 font-bold"
                          : "border-white/10 bg-white/5 text-zinc-400"
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
                      className="w-full bg-[#081210] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-teal-400 mt-2"
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
                    className="flex-1 bg-[#081210] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white uppercase placeholder-zinc-500 focus:outline-none focus:border-teal-400 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isCouponApplied}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer disabled:bg-teal-500/20 disabled:text-teal-300"
                  >
                    {isCouponApplied ? "✓ Applied" : "Apply"}
                  </button>
                </div>

                {/* Step 2 Buttons */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
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
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-[#071f1b] font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-500/20"
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
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0d2a22] to-[#091b16] border border-teal-400/40 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-teal-300 font-extrabold block">
                      Total Payable Amount
                    </span>
                    <div className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
                      ₹{finalTotal.toLocaleString("en-IN")}
                    </div>
                    {isCouponApplied && (
                      <span className="text-[11px] text-emerald-400 font-bold block mt-0.5">
                        🎉 Coupon Applied (Saved ₹{discount.toLocaleString("en-IN")})
                      </span>
                    )}
                  </div>
                  <div className="text-right text-xs text-zinc-300">
                    <span className="block font-bold">{selectedFrame.size} Inch</span>
                    <span className="text-[11px] text-teal-300 block">{finishLabel}</span>
                    <span className="text-[11px] text-zinc-400 block">Qty: {quantity}</span>
                  </div>
                </div>

                {/* Studio Official UPI Payment Box */}
                <div className="p-4 rounded-2xl bg-[#081210] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CreditCard size={14} className="text-teal-400" />
                      Studio Direct UPI / Google Pay
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Zero Processing Fee
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-teal-500/20">
                    <div>
                      <span className="text-[10px] text-zinc-400 block uppercase">Official Studio UPI ID</span>
                      <span className="font-mono font-bold text-sm text-teal-300">6383565425@upi</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUPI}
                      className="px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedUPI ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      <span>{copiedUPI ? "Copied" : "Copy UPI"}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-zinc-400 font-light">
                    Pay via Google Pay, PhonePe, or Paytm using the UPI ID above, or pay directly upon Studio Pickup at Avaniyapuram, Madurai.
                  </p>
                </div>

                {/* Final WhatsApp Order Button */}
                <button
                  type="button"
                  onClick={handleDispatchWhatsApp}
                  className="w-full py-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 hover:from-emerald-300 hover:to-teal-300 text-[#071f1b] font-black rounded-2xl shadow-[0_0_30px_rgba(20,184,166,0.5)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2.5 text-xs sm:text-sm uppercase tracking-wider cursor-pointer"
                >
                  <MessageCircle size={18} className="stroke-[2.5]" />
                  <span>Submit Order to SSS Studio WhatsApp</span>
                </button>

                <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <span className="flex items-center gap-1 text-[11px] text-teal-400/80">
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
