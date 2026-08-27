"use client";

import { useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Send, UploadCloud, FileImage, FileText, CheckCircle2 } from "lucide-react";

export default function DamagedItemChatFlow() {
  const [orderId, setOrderId] = useState("");
  const [damageDescription, setDamageDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!orderId.trim()) {
      setError("Please provide an Order ID.");
      return;
    }
    if (!damageDescription.trim()) {
      setError("Please describe the damage.");
      return;
    }
    if (!photo) {
      setError("Please upload a photo of the damaged item.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("damageDescription", damageDescription);
      formData.append("photo", photo);

      const response = await fetch("/api/support/report-damage", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit report.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <AnimatedSection className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 md:p-12 shadow-xl text-center max-w-xl mx-auto">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Report Submitted Successfully</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Thank you for reporting the issue with Order #{orderId}. Our team will review your report and get back to you shortly.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setOrderId("");
            setDamageDescription("");
            setPhoto(null);
            setPhotoPreview(null);
          }}
          className="bg-brand-gradient hover-glow-brand text-white border-transparent text-black px-6 py-3 rounded-xl font-bold transition-colors"
        >
          Submit Another Report
        </button>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-10 shadow-xl max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Report a Damaged Item</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          We're sorry to hear your item arrived damaged. Please provide the details below so we can resolve this for you.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="orderId" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
            Order ID *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <FileText className="w-5 h-5" />
            </div>
            <input
              type="text"
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. SSS-12345678"
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow uppercase"
            />
          </div>
        </div>

        <div>
          <label htmlFor="damageDescription" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
            Damage Description *
          </label>
          <textarea
            id="damageDescription"
            value={damageDescription}
            onChange={(e) => setDamageDescription(e.target.value)}
            placeholder="Please describe the damage in detail..."
            rows={4}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
            Photo of Damage *
          </label>

          {photoPreview ? (
            <div className="relative rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-950 aspect-video flex items-center justify-center">
              <img src={photoPreview} alt="Damage preview" className="max-w-full max-h-full object-contain" />
              <button
                type="button"
                onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors backdrop-blur-sm text-xs font-bold"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-zinc-200 dark:border-zinc-800 border-dashed rounded-xl cursor-pointer bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 text-zinc-400 mb-3" />
                <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                  PNG, JPG or WEBP (MAX. 5MB)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </label>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-gradient hover-glow-brand text-white border-transparent text-black px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>Processing...</>
          ) : (
            <>
              Submit Report <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </AnimatedSection>
  );
}
