"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Phone, Calendar, MapPin, Clock, DollarSign, MessageSquare, Sparkles, CheckSquare } from "lucide-react";

export const SHOOT_TYPES = [
  "Wedding & Event Photo Shoot",
  "Pre-Wedding & Post Wedding Shoot",
  "Birthday Shoot",
  "School / College Events",
  "Baby Photo shoot",
  "Maternity Photo Shoot",
  "Cinematic Wedding Shoot",
  "Custom Shoot Session",
  "Makeup Artist Available",
];

const MAKEUP_OPTIONS = [
  { key: "hairstyle", label: "Hairstyle" },
  { key: "saree", label: "Saree Draping" },
  { key: "bridesmaid", label: "Bridesmaid Makeup" },
  { key: "normalMakeup", label: "Normal Makeup" },
  { key: "semiHd", label: "Semi HD Makeup" },
  { key: "glossyMakeup", label: "Glossy Makeup" },
  { key: "hdMakeup", label: "HD Makeup" },
];

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
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [makeupDetails, setMakeupDetails] = useState({
    hairstyle: false,
    saree: false,
    bridesmaid: false,
    normalMakeup: false,
    semiHd: false,
    glossyMakeup: false,
    hdMakeup: false,
  });
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
      setMakeupDetails({
        hairstyle: false,
        saree: false,
        bridesmaid: false,
        normalMakeup: false,
        semiHd: false,
        glossyMakeup: false,
        hdMakeup: false,
      });
    }
  }, [isOpen, prefilledType, prefilledMode]);

  const handleSubmit = (e) => {
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

    let makeupSummary = "";
    if (shootType === "Makeup Artist Available") {
      const activeOptions = MAKEUP_OPTIONS.filter((opt) => makeupDetails[opt.key]).map((opt) => opt.label);
      if (activeOptions.length > 0) {
        makeupSummary = `💄 *Makeup Services:* ${activeOptions.join(", ")}\n`;
      }
    }

    let message = "";
    if (mode === "booking") {
      message = `📸 *New Shoot Booking Request* 📸\n` +
        `--------------------------------\n` +
        `👤 *Name:* ${name.trim()}\n` +
        `📞 *Phone:* ${phone.trim()}\n` +
        `💍 *Shoot Type:* ${shootType}\n` +
        (makeupSummary || "") +
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
        (makeupSummary || "") +
        `📅 *Proposed Date:* ${date}\n` +
        `📍 *Location:* ${location.trim()}\n` +
        (duration.trim() ? `⏳ *Duration:* ${duration.trim()}\n` : "") +
        (budget.trim() ? `💰 *Budget:* ${budget.trim()}\n` : "") +
        (notes.trim() ? `💬 *Notes:* ${notes.trim()}\n` : "") +
        `--------------------------------\n` +
        `Please provide a customized quotation!`;
    }

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex justify-center items-center p-4 overflow-y-auto py-8">
          <div className="absolute inset-0" onClick={onClose} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
            className="bg-gradient-to-br from-[#0c3530]/98 via-[#104b43]/98 to-[#166055]/98 border border-white/15 text-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative z-10 overflow-hidden text-left my-auto max-h-[90vh] overflow-y-auto"
          >
            {/* Top Glow Bar */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 hover:text-white transition-colors duration-300 focus:outline-none cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="mb-4 text-center">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-white flex items-center justify-center gap-2">
                {mode === "booking" ? "Book a Shoot" : "Request a Quote"}
              </h3>
              <p className="text-teal-300 text-xs font-semibold tracking-wider uppercase mt-1">
                SSS Photography Studio
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-white/10 mb-6">
              <button
                type="button"
                onClick={() => setMode("booking")}
                className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all duration-300 cursor-pointer ${
                  mode === "booking"
                    ? "border-teal-400 text-teal-300 font-bold"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                Shoot Booking
              </button>
              <button
                type="button"
                onClick={() => setMode("quote")}
                className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all duration-300 cursor-pointer ${
                  mode === "quote"
                    ? "border-teal-400 text-teal-300 font-bold"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                General Enquiry
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-500/25 border border-red-500/40 rounded-xl text-red-200 text-sm font-medium text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <User size={14} className="text-teal-400" /> Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all duration-300 w-full text-sm"
                />
              </div>

              {/* Phone & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                    <Phone size={14} className="text-teal-400" /> Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter contact number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all duration-300 w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar size={14} className="text-teal-400" /> Shoot Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all duration-300 w-full text-sm"
                  />
                </div>
              </div>

              {/* Type of Shoot */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-teal-400" /> Type of Shoot <span className="text-red-400">*</span>
                </label>
                <select
                  value={shootType}
                  onChange={(e) => setShootType(e.target.value)}
                  className="bg-[#0b3430] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all duration-300 w-full text-sm cursor-pointer"
                >
                  {SHOOT_TYPES.map((type, idx) => (
                    <option key={idx} value={type} className="bg-[#0b3430]">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conditional Makeup Details */}
              {shootType === "Makeup Artist Available" && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                    <CheckSquare size={14} className="text-teal-400" /> Select Required Makeup Services
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {MAKEUP_OPTIONS.map((opt) => (
                      <label
                        key={opt.key}
                        className="flex items-center gap-2.5 cursor-pointer hover:text-teal-300 transition-colors p-2 rounded-lg bg-white/5 border border-white/5 hover:border-teal-400/30"
                      >
                        <input
                          type="checkbox"
                          checked={makeupDetails[opt.key] || false}
                          onChange={(e) =>
                            setMakeupDetails({
                              ...makeupDetails,
                              [opt.key]: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded border-white/20 text-teal-500 focus:ring-teal-400 accent-teal-400 cursor-pointer"
                        />
                        <span className="text-gray-200 hover:text-white transition-colors">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <MapPin size={14} className="text-teal-400" /> Location / Venue <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Madurai, Avaniyapuram, etc."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all duration-300 w-full text-sm"
                />
              </div>

              {/* Quote Mode Extra Fields */}
              {mode === "quote" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <Clock size={14} className="text-teal-400" /> Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4 Hours, 2 Days"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all duration-300 w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <DollarSign size={14} className="text-teal-400" /> Estimated Budget
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹25,000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all duration-300 w-full text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Special Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-teal-400" /> Special Requests & Notes
                </label>
                <textarea
                  rows="3"
                  placeholder="Tell us about specific rituals, venue timings, or album preferences..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all duration-300 w-full text-sm resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-1/3 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-300 text-sm cursor-pointer order-2 sm:order-1"
                >
                  Close
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full sm:flex-1 py-3 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#071f1b] font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer order-1 sm:order-2"
                >
                  <Send size={18} /> Send via WhatsApp
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
