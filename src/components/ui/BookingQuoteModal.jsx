"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Phone, Calendar, MapPin, Clock, DollarSign, MessageSquare, Sparkles } from "lucide-react";
import { createBooking } from "@/app/actions/booking";

export const SHOOT_TYPES = [
  "Wedding & Event Photo Shoot",
  "Pre-Wedding & Post Wedding Shoot",
  "Birthday Shoot",
  "School / College Events",
  "Baby Photo Shoot",
  "Maternity Photo Shoot",
  "Cinematic Wedding Shoot",
  "Custom Shoot Session",
];

export const TIME_SLOTS = ["10:00 AM", "02:00 PM", "04:30 PM"];

export default function BookingQuoteModal({
  isOpen,
  onClose,
  prefilledType = "Wedding & Event Photo Shoot",
  prefilledMode = "booking",
  whatsappNumber = "916383565425",
}) {
  const [mode, setMode] = useState(prefilledMode);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [shootType, setShootType] = useState(prefilledType);
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("10:00 AM");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setShootType(prefilledType || "Wedding & Event Photo Shoot");
      setMode(prefilledMode || "booking");
      setName("");
      setPhone("");
      setDate("");
      setLocation("");
      setDuration("");
      setBudget("");
      setNotes("");
      setError("");
    }
  }, [isOpen, prefilledType, prefilledMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim() || !date || !location.trim()) {
      setError("Please fill in all required fields (*).");
      return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("Please select a future date for your shoot.");
      return;
    }

    let message = "";
    if (mode === "booking") {
      message = `📸 *New Shoot Booking Request* 📸\n` +
        `--------------------------------\n` +
        `👤 *Name:* ${name.trim()}\n` +
        `📞 *Phone:* ${phone.trim()}\n` +
        `💍 *Shoot Type:* ${shootType}\n` +
        `📅 *Date:* ${date}\n` +
        `📍 *Location:* ${location.trim()}\n` +
        (notes.trim() ? `💬 *Notes:* ${notes.trim()}\n` : "") +
        `--------------------------------\n` +
        `Please check availability and confirm pricing!`;
    } else {
      message = `📋 *New Quote / Enquiry Request* 📋\n` +
        `--------------------------------\n` +
        `👤 *Name:* ${name.trim()}\n` +
        `📞 *Phone:* ${phone.trim()}\n` +
        `💍 *Shoot Type:* ${shootType}\n` +
        `📅 *Proposed Date:* ${date}\n` +
        `📍 *Location:* ${location.trim()}\n` +
        (duration.trim() ? `⏳ *Duration:* ${duration.trim()}\n` : "") +
        (budget.trim() ? `💰 *Budget:* ${budget.trim()}\n` : "") +
        (notes.trim() ? `💬 *Notes:* ${notes.trim()}\n` : "") +
        `--------------------------------\n` +
        `Please provide a customized quotation!`;
    }

    // Save booking request to Supabase PostgreSQL database first
    try {
      await createBooking({
        name: name.trim(),
        phone: phone.trim(),
        eventType: shootType,
        date,
        timeSlot: selectedSlot || "10:00 AM",
        location: location.trim(),
        requirements: notes.trim() ? `${mode === "quote" ? "[Quote Request] " : ""}${notes.trim()}` : (mode === "quote" ? "[Quote Request]" : null),
      });
    } catch (err) {
      console.error("Database save warning:", err);
    }

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex justify-center items-center p-2 sm:p-4 overflow-y-auto py-4 sm:py-8">
          <div className="absolute inset-0" onClick={onClose} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, type: "spring", bounce: 0.15 }}
            className="bg-gradient-to-b from-[#141622] via-[#0d0e17] to-[#07080e] border border-amber-500/35 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative z-10 text-left my-auto max-h-[92vh] overflow-y-auto scrollbar-thin"
          >
            {/* Top Gold Glow Bar */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-zinc-300 hover:text-white transition-colors duration-300 focus:outline-none cursor-pointer z-20"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="mb-3 sm:mb-4 text-center pr-6 sm:pr-0">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white flex items-center justify-center gap-2 tracking-wide">
                {mode === "booking" ? "Book a Shoot" : "Request a Quote"}
              </h3>
              <p className="text-amber-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase mt-0.5">
                SSS Photography Studio
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-zinc-800 mb-4 sm:mb-6">
              <button
                type="button"
                onClick={() => setMode("booking")}
                className={`flex-1 pb-2.5 sm:pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all duration-300 cursor-pointer ${
                  mode === "booking"
                    ? "border-amber-400 text-amber-400 font-extrabold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Shoot Booking
              </button>
              <button
                type="button"
                onClick={() => setMode("quote")}
                className={`flex-1 pb-2.5 sm:pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all duration-300 cursor-pointer ${
                  mode === "quote"
                    ? "border-amber-400 text-amber-400 font-extrabold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                General Enquiry
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 p-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-xs sm:text-sm font-medium text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1 flex items-center gap-1.5">
                  <User size={13} className="text-amber-400" /> Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-zinc-900/90 border border-zinc-700/80 rounded-xl px-3.5 py-2 sm:py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300 w-full text-xs sm:text-sm"
                />
              </div>

              {/* Phone & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1 flex items-center gap-1.5">
                    <Phone size={13} className="text-amber-400" /> Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter contact number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-zinc-900/90 border border-zinc-700/80 rounded-xl px-3.5 py-2 sm:py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300 w-full text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1 flex items-center gap-1.5">
                    <Calendar size={13} className="text-amber-400" /> Shoot Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-zinc-900/90 border border-zinc-700/80 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300 w-full text-xs sm:text-sm appearance-none min-h-[38px]"
                  />
                </div>
              </div>

              {/* Type of Shoot */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-400" /> Type of Shoot <span className="text-red-400">*</span>
                </label>
                <select
                  value={shootType}
                  onChange={(e) => setShootType(e.target.value)}
                  className="bg-[#141622] border border-zinc-700/80 rounded-xl px-3.5 py-2 sm:py-2.5 text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300 w-full text-xs sm:text-sm cursor-pointer"
                >
                  {SHOOT_TYPES.map((type, idx) => (
                    <option key={idx} value={type} className="bg-[#141622] text-white">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1 flex items-center gap-1.5">
                  <MapPin size={13} className="text-amber-400" /> Location / Venue <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Madurai, Avaniyapuram, etc."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-zinc-900/90 border border-zinc-700/80 rounded-xl px-3.5 py-2 sm:py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300 w-full text-xs sm:text-sm"
                />
              </div>

              {/* Quote Mode Extra Fields */}
              {mode === "quote" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1 flex items-center gap-1.5">
                      <Clock size={13} className="text-amber-400" /> Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4 Hours, 2 Days"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="bg-zinc-900/90 border border-zinc-700/80 rounded-xl px-3.5 py-2 sm:py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300 w-full text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1 flex items-center gap-1.5">
                      <DollarSign size={13} className="text-amber-400" /> Estimated Budget
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹25,000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="bg-zinc-900/90 border border-zinc-700/80 rounded-xl px-3.5 py-2 sm:py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300 w-full text-xs sm:text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Special Notes */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1 flex items-center gap-1.5">
                  <MessageSquare size={13} className="text-amber-400" /> Special Requests & Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us about specific rituals, venue timings, or album preferences..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-zinc-900/90 border border-zinc-700/80 rounded-xl px-3.5 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300 w-full text-xs sm:text-sm resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-row gap-2.5 pt-2 sm:pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-2.5 sm:py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 hover:text-white font-semibold rounded-xl transition-all duration-300 text-xs sm:text-sm cursor-pointer"
                >
                  Close
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-2/3 py-2.5 sm:py-3 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-extrabold rounded-xl shadow-xl shadow-amber-500/20 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer text-xs sm:text-sm"
                >
                  <Send size={16} /> Send via WhatsApp
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
