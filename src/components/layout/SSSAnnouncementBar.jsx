"use client";

import React from "react";
import { Sparkles, Clock, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SSSAnnouncementBar() {
  const { t } = useLanguage();

  const triggerModal = (mode = "booking", shootType = "Complimentary Pre-Wedding Shoot Offer") => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-sss-modal", {
          detail: { mode, shootType },
        })
      );
    }
  };

  const items = [
    {
      badge: "Exclusive Atelier Offer",
      text: t.announcementOffer || "Pre Wedding Shoot",
      highlight: t.announcementOfferHighlight || "Complimentary with Wedding Packages",
      action: () => triggerModal("offer", "Complimentary Pre-Wedding Shoot Offer"),
      icon: Sparkles,
    },
    {
      badge: "Signature Guarantee",
      text: t.announcementDelivery || "Album Delivered Within",
      highlight: t.announcementDeliveryHighlight || "1 Month (30 Days) Guaranteed",
      action: () => triggerModal("booking", "1-Month Delivery Guarantee Enquiry"),
      icon: Clock,
    },
    {
      badge: "Madurai & Worldwide",
      text: "Open for 2026–27 Bookings",
      highlight: "Avaniyapuram Studio & Destination Celebrations",
      action: () => triggerModal("quote", "Destination Wedding Inquiry"),
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="bg-[#050505] border-b border-white/10 text-white text-xs py-2 overflow-hidden relative z-50 select-none">
      <div className="flex w-max animate-marquee space-x-12 items-center whitespace-nowrap font-normal">
        {items.concat(items).concat(items).map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={item.action}
              className="inline-flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Icon size={12} className="text-[#c5a880]" />
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#c5a880]/10 text-[#c5a880] border border-[#c5a880]/30">
                {item.badge}
              </span>
              <span className="text-zinc-300 text-[11px] tracking-wide">
                {item.text}:{" "}
                <span className="font-medium text-white underline underline-offset-4 decoration-[#c5a880]/40">
                  {item.highlight}
                </span>
              </span>
              <span className="text-[#c5a880]/50 ml-3">✦</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
