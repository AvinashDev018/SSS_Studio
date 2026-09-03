"use client";

import React, { useState, useEffect } from "react";
import SSSHero from "@/components/sections/SSSHero";
import SSSGuarantees from "@/components/sections/SSSGuarantees";
import SSSServices from "@/components/sections/SSSServices";
import SSSPortfolio from "@/components/sections/SSSPortfolio";
import SSSAbout from "@/components/sections/SSSAbout";
import SSSColorGradingComparison from "@/components/sections/SSSColorGradingComparison";
import SSSPhotoFramePricing from "@/components/sections/SSSPhotoFramePricing";
import SSSTestimonials from "@/components/sections/SSSTestimonials";
import SSSStudioInfo from "@/components/sections/SSSStudioInfo";
import BookingQuoteModal from "@/components/ui/BookingQuoteModal";
import TestimonialModal from "@/components/ui/TestimonialModal";
import LuckyGiftModal from "@/components/ui/LuckyGiftModal";

export default function Home() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [modalShootType, setModalShootType] = useState("Wedding & Event Photo Shoot");
  const [modalMode, setModalMode] = useState("booking");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isLuckyGiftOpen, setIsLuckyGiftOpen] = useState(false);

  useEffect(() => {
    const handleCustomModal = (e) => {
      const { mode, shootType } = e.detail || {};
      if (mode === "offer") {
        setIsLuckyGiftOpen(true);
        return;
      }
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

  const handleOpenGift = () => {
    setIsLuckyGiftOpen(true);
  };

  return (
    <div className="bg-[#0a0a0a] text-white selection:bg-[#c5a880]/30 selection:text-white">
      {/* 1. Luxury Editorial Hero Section with Cinematic Photography Frame */}
      <SSSHero onOpenBooking={handleOpenBooking} onOpenQuote={handleOpenQuote} />

      {/* 2. SSS Studio Guarantees & 1-Month Delivery Promise */}
      <SSSGuarantees onOpenBooking={handleOpenBooking} />

      {/* 3. Complete SSS Photography & Visual Services */}
      <SSSServices onOpenBooking={handleOpenBooking} />

      {/* 4. Interactive Before / After Color Grading Slider */}
      <SSSColorGradingComparison onOpenBooking={handleOpenBooking} />

      {/* 5. Interactive Filterable Portfolio & Fullscreen Lightbox */}
      <SSSPortfolio />

      {/* 6. Handcrafted Photo Frame Price List (Sheela Photography inspired) & Custom Orders */}
      <SSSPhotoFramePricing />

      {/* 7. SSS Studio About & Heritage */}
      <SSSAbout onOpenBooking={handleOpenBooking} />

      {/* 7. SSS Client Love & Real Testimonials */}
      <SSSTestimonials onOpenReviewModal={handleOpenReview} />

      {/* 8. SSS Studio Location, Direct Booking & Contact Info */}
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

      {/* Interactive Lucky Surprise Gift Voucher Modal */}
      <LuckyGiftModal
        isOpen={isLuckyGiftOpen}
        onClose={() => setIsLuckyGiftOpen(false)}
      />
    </div>
  );
}
