"use client";

import React, { useState, useMemo } from "react";
import { 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  AlignLeft, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  MessageCircle, 
  Search, 
  Filter, 
  CheckCheck,
  AlertCircle,
  Inbox,
  Sparkles,
  Camera,
  Heart,
  Baby,
  Cake,
  GraduationCap
} from "lucide-react";
import { updateBookingStatus, deleteBooking } from "@/app/actions/booking";

const SHOOT_TYPES = [
  "All",
  "Wedding & Event Photo Shoot",
  "Pre-Wedding & Post Wedding Shoot",
  "Birthday Shoot",
  "School / College Events",
  "Baby Photo Shoot",
  "Maternity Photo Shoot",
  "Custom Shoot Session",
];

export default function AdminBookingsView({ initialBookings = [] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("All");
  const [isUpdating, setIsUpdating] = useState(null);

  // Statistics
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === "PENDING").length;
    const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
    const completed = bookings.filter((b) => b.status === "COMPLETED").length;
    return { total, pending, confirmed, completed };
  }, [bookings]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.phone.includes(searchQuery) ||
        (b.location && b.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.eventType && b.eventType.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === "ALL" || b.status === statusFilter;
      const matchType = typeFilter === "All" || b.eventType === typeFilter;

      return matchSearch && matchStatus && matchType;
    });
  }, [bookings, searchQuery, statusFilter, typeFilter]);

  const handleStatusUpdate = async (id, newStatus) => {
    setIsUpdating(id);
    // Optimistic update
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    try {
      await updateBookingStatus(id, newStatus);
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async (id, clientName) => {
    if (confirm(`Are you sure you want to delete the booking for "${clientName}"?`)) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
      try {
        await deleteBooking(id);
      } catch (err) {
        console.error("Error deleting booking:", err);
      }
    }
  };

  const handleWhatsAppContact = (booking) => {
    const dateFormatted = booking.date ? new Date(booking.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }) : "your requested date";

    const msg = `Hello ${booking.name}! 👋\n\nThank you for reaching out to *SSS Photography Studio* for your *${booking.eventType}* on *${dateFormatted}*.\n\n` +
      `We are pleased to connect with you regarding your shoot requirements.\n\n` +
      `How can we best assist you today? 📸✨`;

    const cleanPhone = booking.phone.replace(/\D/g, "");
    const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3 animate-pulse" /> PENDING
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <CheckCircle2 className="w-3 h-3" /> CONFIRMED
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCheck className="w-3 h-3" /> COMPLETED
          </span>
        );
      default:
        return (
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="bg-[#0b1412] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">Total Inquiries</p>
            <span className="p-2 bg-white/5 rounded-xl text-zinc-300">
              <Inbox className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">{stats.total}</h3>
          <p className="text-[11px] text-zinc-500 mt-1">All shoot requests</p>
        </div>

        <div className="bg-[#0b1412] border border-amber-500/20 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-amber-400 text-xs sm:text-sm font-medium">Action Required</p>
            <span className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-2">{stats.pending}</h3>
          <p className="text-[11px] text-amber-400/70 mt-1">Pending client responses</p>
        </div>

        <div className="bg-[#0b1412] border border-teal-500/20 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-teal-400 text-xs sm:text-sm font-medium">Confirmed Shoots</p>
            <span className="p-2 bg-teal-500/10 rounded-xl text-teal-400 border border-teal-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-teal-300 mt-2">{stats.confirmed}</h3>
          <p className="text-[11px] text-teal-400/70 mt-1">Ready on calendar</p>
        </div>

        <div className="bg-[#0b1412] border border-emerald-500/20 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-emerald-400 text-xs sm:text-sm font-medium">Completed</p>
            <span className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <CheckCheck className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-300 mt-2">{stats.completed}</h3>
          <p className="text-[11px] text-emerald-400/70 mt-1">Albums in delivery</p>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-[#0a110f] border border-white/10 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by client, phone, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#080c0b] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Shoot Type Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-zinc-400 whitespace-nowrap">Service:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#080c0b] border border-white/10 text-white rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-teal-400 cursor-pointer w-full md:w-auto"
            >
              {SHOOT_TYPES.map((type) => (
                <option key={type} value={type} className="bg-[#080c0b]">
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Tab Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <span className="text-xs text-zinc-400 mr-1">Status:</span>
          {[
            { label: "All Inquiries", value: "ALL", count: stats.total },
            { label: "Pending", value: "PENDING", count: stats.pending },
            { label: "Confirmed", value: "CONFIRMED", count: stats.confirmed },
            { label: "Completed", value: "COMPLETED", count: stats.completed },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === tab.value
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                  : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                statusFilter === tab.value ? "bg-teal-400 text-black font-bold" : "bg-zinc-800 text-zinc-400"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Bookings List & Table */}
      <div className="bg-[#0a110f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {filteredBookings.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No Bookings Found</h3>
            <p className="text-sm text-zinc-400 max-w-sm mx-auto">
              {searchQuery || statusFilter !== "ALL" || typeFilter !== "All"
                ? "Try clearing your filters or search keywords."
                : "No customer booking inquiries yet."}
            </p>
          </div>
        ) : (
          <div>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                    <th className="p-4">Client Information</th>
                    <th className="p-4">Shoot Type & Details</th>
                    <th className="p-4">Target Date & Time</th>
                    <th className="p-4">Venue & Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Instant Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Client */}
                      <td className="p-4 align-top">
                        <div className="font-bold text-white text-base">{b.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={`tel:${b.phone}`}
                            className="text-xs text-zinc-400 hover:text-teal-300 font-mono flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-teal-400" /> {b.phone}
                          </a>
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-1">
                          Received: {new Date(b.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Shoot Type & Notes */}
                      <td className="p-4 align-top max-w-xs">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20 mb-1.5">
                          {b.eventType}
                        </span>
                        {b.requirements ? (
                          <p className="text-xs text-zinc-400 bg-[#080c0b] p-2 rounded-lg border border-white/5 line-clamp-2" title={b.requirements}>
                            "{b.requirements}"
                          </p>
                        ) : (
                          <span className="text-xs text-zinc-600 italic block">No special notes</span>
                        )}
                      </td>

                      {/* Date & Time */}
                      <td className="p-4 align-top">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-teal-400" />
                          {new Date(b.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </div>
                        <div className="text-xs text-teal-300/80 font-medium mt-1">
                          {b.timeSlot || "Full Day Coverage"}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="p-4 align-top">
                        <div className="text-zinc-300 font-medium flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span className="truncate max-w-[180px]" title={b.location}>
                            {b.location || "Studio / Venue"}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4 align-top">
                        {getStatusBadge(b.status)}
                      </td>

                      {/* Actions */}
                      <td className="p-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp Direct */}
                          <button
                            onClick={() => handleWhatsAppContact(b)}
                            title="Chat on WhatsApp"
                            className="p-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 transition-all hover:scale-105"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>

                          {/* Confirm */}
                          {b.status === "PENDING" && (
                            <button
                              onClick={() => handleStatusUpdate(b.id, "CONFIRMED")}
                              title="Confirm Booking"
                              disabled={isUpdating === b.id}
                              className="px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-bold transition-all hover:scale-105"
                            >
                              Confirm
                            </button>
                          )}

                          {/* Complete */}
                          {b.status === "CONFIRMED" && (
                            <button
                              onClick={() => handleStatusUpdate(b.id, "COMPLETED")}
                              title="Mark as Completed"
                              disabled={isUpdating === b.id}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all hover:scale-105"
                            >
                              Complete
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(b.id, b.name)}
                            title="Delete / Archive"
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all opacity-70 hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="block lg:hidden divide-y divide-white/5">
              {filteredBookings.map((b) => (
                <div key={b.id} className="p-4 sm:p-5 space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-white text-base">{b.name}</h4>
                      <a
                        href={`tel:${b.phone}`}
                        className="text-xs text-zinc-400 hover:text-teal-300 font-mono flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3 text-teal-400" /> {b.phone}
                      </a>
                    </div>
                    <div>{getStatusBadge(b.status)}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 bg-[#080c0b] p-3 rounded-xl border border-white/5 text-xs">
                    <div>
                      <span className="text-zinc-500 flex items-center gap-1 mb-1">
                        <Calendar className="w-3 h-3 text-teal-400" /> Shoot Date
                      </span>
                      <p className="font-semibold text-white">
                        {new Date(b.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short"
                        })}
                      </p>
                      <p className="text-teal-400 font-medium">{b.timeSlot}</p>
                    </div>

                    <div>
                      <span className="text-zinc-500 flex items-center gap-1 mb-1">
                        <MapPin className="w-3 h-3 text-rose-400" /> Location
                      </span>
                      <p className="font-semibold text-white truncate">{b.location || "Studio"}</p>
                      <p className="text-zinc-400 truncate">{b.eventType}</p>
                    </div>
                  </div>

                  {b.requirements && (
                    <div className="bg-[#080c0b] p-2.5 rounded-xl border border-white/5 text-xs">
                      <span className="text-zinc-500 block mb-0.5 font-medium">Notes & Needs:</span>
                      <p className="text-zinc-300">{b.requirements}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleWhatsAppContact(b)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 text-xs font-bold transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </button>

                    {b.status === "PENDING" && (
                      <button
                        onClick={() => handleStatusUpdate(b.id, "CONFIRMED")}
                        disabled={isUpdating === b.id}
                        className="flex-1 py-2 px-3 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold transition-all text-center"
                      >
                        Confirm
                      </button>
                    )}

                    {b.status === "CONFIRMED" && (
                      <button
                        onClick={() => handleStatusUpdate(b.id, "COMPLETED")}
                        disabled={isUpdating === b.id}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all text-center"
                      >
                        Complete
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(b.id, b.name)}
                      className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20"
                      title="Delete Booking"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
