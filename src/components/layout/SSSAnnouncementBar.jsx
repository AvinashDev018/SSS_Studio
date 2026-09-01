"use client";

import React from "react";
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
      badge: t.badgeExclusive,
      badgeClass: "bg-gradient-to-r from-amber-400 to-yellow-500 text-[#071f1b]",
      icon: "🎁",
      text: t.announcementOffer,
      highlight: t.announcementOfferHighlight,
      action: () => triggerModal("offer", "Complimentary Pre-Wedding Shoot Offer"),
    },
    {
      badge: t.badgeDelivery,
      badgeClass: "bg-gradient-to-r from-amber-400 to-yellow-500 text-[#071f1b]",
      icon: "📸",
      text: t.announcementDelivery,
      highlight: t.announcementDeliveryHighlight,
      action: () => triggerModal("booking", "1-Month Delivery Guarantee Enquiry"),
    },
    {
      badge: t.badgeExclusive,
      badgeClass: "bg-gradient-to-r from-amber-400 to-yellow-500 text-[#071f1b]",
      icon: "🎁",
      text: t.announcementOffer,
      highlight: t.announcementOfferHighlight,
      action: () => triggerModal("offer", "Complimentary Pre-Wedding Shoot Offer"),
    },
    {
      badge: t.badgeDelivery,
      badgeClass: "bg-gradient-to-r from-amber-400 to-yellow-500 text-[#071f1b]",
      icon: "📸",
      text: t.announcementDelivery,
      highlight: t.announcementDeliveryHighlight,
      action: () => triggerModal("booking", "1-Month Delivery Guarantee Enquiry"),
    },
  ];

  return (
    <div className="bg-[#0c3530] border-b border-teal-500/30 text-white text-xs py-2 overflow-hidden relative z-50 select-none shadow-md">
      <div className="flex w-max animate-marquee space-x-12 items-center whitespace-nowrap font-medium">
        {items.concat(items).map((item, idx) => (
          <div
            key={idx}
            onClick={item.action}
            className="inline-flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="text-sm">{item.icon}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase shadow-sm ${item.badgeClass}`}>
              {item.badge}
            </span>
            <span className="text-zinc-200">
              {item.text} <span className="font-bold text-yellow-300">{item.highlight}</span>
            </span>
            <span className="text-teal-400 font-bold ml-2">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
