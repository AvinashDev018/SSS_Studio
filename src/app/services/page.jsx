"use client";

import SSSServices from "@/components/sections/SSSServices";
import SSSGuarantees from "@/components/sections/SSSGuarantees";
import SSSStudioInfo from "@/components/sections/SSSStudioInfo";
import BookingQuoteModal from "@/components/ui/BookingQuoteModal";
import { useState } from "react";

export default function ServicesPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [shootType, setShootType] = useState("Wedding & Event Photo Shoot");

  const handleOpenBooking = (type = "Wedding & Event Photo Shoot") => {
    setShootType(type);
    setIsBookingOpen(true);
  };

  return (
    <div className="bg-[#080c0b] text-white min-h-screen">
      <SSSServices onOpenBooking={handleOpenBooking} />
      <SSSGuarantees onOpenBooking={handleOpenBooking} />
      <SSSStudioInfo onOpenBooking={handleOpenBooking} />

      <BookingQuoteModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        prefilledType={shootType}
        prefilledMode="booking"
      />
    </div>
  );
}
