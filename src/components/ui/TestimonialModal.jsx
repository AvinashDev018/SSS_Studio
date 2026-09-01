"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Send, User, Tag, MessageSquare } from "lucide-react";
import { SHOOT_TYPES } from "./BookingQuoteModal";

export default function TestimonialModal({
  isOpen,
  onClose,
  whatsappNumber = "917871117875",
}) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState("Wedding & Event Photo Shoot");
  const [review, setReview] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !review.trim()) {
      setError("Please fill in your name and review.");
      return;
    }

    const starsStr = "★".repeat(rating) + "☆".repeat(5 - rating);
    const message = `⭐ *New Client Testimonial* ⭐\n` +
      `--------------------------------\n` +
      `👤 *Client Name:* ${name.trim()}\n` +
      `💍 *Shoot Category:* ${category}\n` +
      `⭐ *Rating:* ${starsStr} (${rating}/5)\n` +
      `💬 *Review:* "${review.trim()}"\n` +
      `--------------------------------\n` +
      `Please add this to the studio website reviews!`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0" onClick={onClose} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
            className="bg-gradient-to-br from-[#0c3530]/98 via-[#104b43]/98 to-[#166055]/98 border border-white/15 text-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative z-10 overflow-hidden text-left my-auto"
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 hover:text-white transition-colors duration-300 focus:outline-none cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="mb-6 text-center">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-white">
                Share Your Experience
              </h3>
              <p className="text-teal-300 text-xs font-semibold tracking-wider uppercase mt-1">
                Leave a Client Review
              </p>
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
              {/* Full Name */}
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

              {/* Shoot Category & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                    <Tag size={14} className="text-teal-400" /> Shoot Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-[#0b3430] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all duration-300 w-full text-sm cursor-pointer"
                  >
                    {SHOOT_TYPES.map((type, idx) => (
                      <option key={idx} value={type} className="bg-[#0b3430]">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                    <Star size={14} className="text-amber-400" /> Rating
                  </label>
                  <div className="flex gap-2 items-center h-10">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-2xl text-amber-400 hover:scale-125 transition-transform focus:outline-none cursor-pointer"
                      >
                        <Star
                          size={22}
                          className={star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-500"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-teal-400" /> Your Review & Feedback <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Tell us about the shoot experience, photo quality, album finish, and team friendliness..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all duration-300 w-full text-sm resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-[#071f1b] font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-6"
              >
                <Send size={18} /> Submit Review
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
