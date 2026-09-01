"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import SSSHero from "@/components/sections/SSSHero";
import SSSGuarantees from "@/components/sections/SSSGuarantees";
import SSSPortfolio from "@/components/sections/SSSPortfolio";
import SSSServices from "@/components/sections/SSSServices";
import SSSTestimonials from "@/components/sections/SSSTestimonials";
import SSSStudioInfo from "@/components/sections/SSSStudioInfo";
import BookingQuoteModal from "@/components/ui/BookingQuoteModal";
import TestimonialModal from "@/components/ui/TestimonialModal";

const PackageCalculator = dynamic(() => import("@/components/PackageCalculator"), {
  ssr: false,
});

export default function Home() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [modalShootType, setModalShootType] = useState("Wedding & Event Photo Shoot");
  const [modalMode, setModalMode] = useState("booking");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    const handleCustomModal = (e) => {
      const { mode, shootType } = e.detail || {};
      if (shootType) setModalShootType(shootType);
      if (mode) setModalMode(mode);
      setIsBookingModalOpen(true);
    };

    window.addEventListener("open-sss-modal", handleCustomModal);
    return () => window.removeEventListener("open-sss-modal", handleCustomModal);
  }, []);

  const handleOpenBooking = (shootType = "Wedding & Event Photo Shoot") => {
    setModalShootType(shootType);
    setModalMode("booking");
    setIsBookingModalOpen(true);
  };

  const handleOpenQuote = (shootType = "Wedding & Event Photo Shoot") => {
    setModalShootType(shootType);
    setModalMode("quote");
    setIsBookingModalOpen(true);
  };

  const handleOpenReview = () => {
    setIsReviewModalOpen(true);
  };

  return (
    <div className="bg-[#080c0b] text-white selection:bg-teal-500/30">
      {/* 1. Animated Hero Section with 3D Studio Card & Floating Particles */}
      <SSSHero onOpenBooking={handleOpenBooking} onOpenQuote={handleOpenQuote} />

      {/* 2. SSS Studio Guarantees & 20-Day Delivery Promise */}
      <SSSGuarantees onOpenBooking={handleOpenBooking} />

      {/* 3. Complete SSS Services & Bridal Makeup Studio */}
      <SSSServices onOpenBooking={handleOpenBooking} />

      {/* 4. Interactive Filterable Portfolio & Fullscreen Lightbox */}
      <SSSPortfolio />

      {/* 5. Build-Your-Story Interactive Package Calculator */}
      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <PackageCalculator />
      </div>

      {/* 6. SSS Client Love & Real Testimonials */}
      <SSSTestimonials onOpenReviewModal={handleOpenReview} />

      {/* 7. SSS Studio Location, Direct Booking & Contact Info */}
      <SSSStudioInfo onOpenBooking={handleOpenBooking} />

      {/* Interactive Shoot Booking & Quote Modal */}
      <BookingQuoteModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        prefilledType={modalShootType}
        prefilledMode={modalMode}
      />

      {/* Interactive Testimonial Submission Modal */}
      <TestimonialModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
}
