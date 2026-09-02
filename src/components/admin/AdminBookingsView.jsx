"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Calendar, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  CheckCheck, 
  MessageCircle, 
  Trash2, 
  Inbox, 
  Filter, 
  RefreshCw,
  X,
  Sparkles,
  User,
  ArrowRight
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
];

export default function AdminBookingsView({ initialBookings = [] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("All");
  const [isUpdating, setIsUpdating] = useState(null);

  // Quick stats
  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "PENDING").length,
      confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
      completed: bookings.filter((b) => b.status === "COMPLETED").length,
    };
  }, [bookings]);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        (b.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.phone || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.location || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.eventType || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.requirements || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
      const matchesType = typeFilter === "All" || b.eventType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [bookings, searchQuery, statusFilter, typeFilter]);

  const handleStatusUpdate = async (id, newStatus) => {
    setIsUpdating(id);
    try {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
      await updateBookingStatus(id, newStatus);
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async (id, clientName) => {
    if (confirm(`Are you sure you want to delete the booking inquiry for "${clientName}"?`)) {
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

    const cleanPhone = (booking.phone || "").replace(/\D/g, "");
    const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm">
            <Clock className="w-3 h-3 animate-pulse" /> PENDING
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-teal-400" /> CONFIRMED
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm">
            <CheckCheck className="w-3 h-3 text-emerald-400" /> COMPLETED
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

  const hasActiveFilters = searchQuery || statusFilter !== "ALL" || typeFilter !== "All";

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setTypeFilter("All");
  };

  return (
    <div className="space-y-6">
      {/* 1. Interactive & Friendly Metric Filter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Total Inquiries */}
        <button
          type="button"
          onClick={() => setStatusFilter("ALL")}
          className={`p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
            statusFilter === "ALL"
              ? "bg-[#0f231e] border-2 border-teal-400/80 shadow-lg shadow-teal-500/15 scale-[1.02]"
              : "bg-[#0b1412] border border-white/10 hover:border-teal-500/40 hover:bg-[#0d1815]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-zinc-300 text-xs sm:text-sm font-semibold">Total Inquiries</span>
            <span className={`p-2 rounded-xl transition-colors ${
              statusFilter === "ALL" ? "bg-teal-400 text-black" : "bg-white/5 text-zinc-300 group-hover:bg-teal-500/20 group-hover:text-teal-300"
            }`}>
              <Inbox className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">{stats.total}</h3>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[11px] text-zinc-400 font-light">All shoot requests</span>
            {statusFilter === "ALL" && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
        </button>

        {/* Card 2: Action Required (Pending) */}
        <button
          type="button"
          onClick={() => setStatusFilter("PENDING")}
          className={`p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
            statusFilter === "PENDING"
              ? "bg-[#251b0a] border-2 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]"
              : "bg-[#0b1412] border border-amber-500/20 hover:border-amber-400/60 hover:bg-[#161208]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-amber-300 text-xs sm:text-sm font-semibold">Action Required</span>
            <span className={`p-2 rounded-xl transition-colors ${
              statusFilter === "PENDING" ? "bg-amber-400 text-black" : "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20"
            }`}>
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-3">{stats.pending}</h3>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[11px] text-amber-400/80 font-light">Needs response</span>
            {statusFilter === "PENDING" ? (
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/30 px-2 py-0.5 rounded-full">
                Active
              </span>
            ) : (
              <span className="text-[10px] text-amber-400 font-medium hidden sm:inline">Click to filter</span>
            )}
          </div>
        </button>

        {/* Card 3: Confirmed Shoots */}
        <button
          type="button"
          onClick={() => setStatusFilter("CONFIRMED")}
          className={`p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
            statusFilter === "CONFIRMED"
              ? "bg-[#09221d] border-2 border-teal-400 shadow-lg shadow-teal-500/20 scale-[1.02]"
              : "bg-[#0b1412] border border-teal-500/20 hover:border-teal-400/60 hover:bg-[#0d1c18]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-teal-300 text-xs sm:text-sm font-semibold">Confirmed Shoots</span>
            <span className={`p-2 rounded-xl transition-colors ${
              statusFilter === "CONFIRMED" ? "bg-teal-400 text-black" : "bg-teal-500/10 text-teal-400 group-hover:bg-teal-500/20"
            }`}>
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-teal-300 mt-3">{stats.confirmed}</h3>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[11px] text-teal-400/80 font-light">Ready on calendar</span>
            {statusFilter === "CONFIRMED" ? (
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 bg-teal-500/30 px-2 py-0.5 rounded-full">
                Active
              </span>
            ) : (
              <span className="text-[10px] text-teal-400 font-medium hidden sm:inline">Click to filter</span>
            )}
          </div>
        </button>

        {/* Card 4: Completed */}
        <button
          type="button"
          onClick={() => setStatusFilter("COMPLETED")}
          className={`p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
            statusFilter === "COMPLETED"
              ? "bg-[#0a2318] border-2 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.02]"
              : "bg-[#0b1412] border border-emerald-500/20 hover:border-emerald-400/60 hover:bg-[#0c1c14]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-emerald-300 text-xs sm:text-sm font-semibold">Completed</span>
            <span className={`p-2 rounded-xl transition-colors ${
              statusFilter === "COMPLETED" ? "bg-emerald-400 text-black" : "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20"
            }`}>
              <CheckCheck className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-300 mt-3">{stats.completed}</h3>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[11px] text-emerald-400/80 font-light">Albums delivered</span>
            {statusFilter === "COMPLETED" ? (
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/30 px-2 py-0.5 rounded-full">
                Active
              </span>
            ) : (
              <span className="text-[10px] text-emerald-400 font-medium hidden sm:inline">Click to filter</span>
            )}
          </div>
        </button>
      </div>

      {/* 2. User-Friendly Search & Quick Filter Strip */}
      <div className="bg-[#0a1310] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by client name, mobile, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#070e0c] border border-white/10 rounded-xl pl-10 pr-9 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-1 rounded-md"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Service Selector Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-zinc-400 whitespace-nowrap font-medium">Service:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#070e0c] border border-white/10 text-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-teal-400 cursor-pointer w-full md:w-auto"
            >
              {SHOOT_TYPES.map((type) => (
                <option key={type} value={type} className="bg-[#0b1412]">
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filter Tabs & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/5">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { label: "All Inquiries", value: "ALL", count: stats.total },
              { label: "Action Needed", value: "PENDING", count: stats.pending },
              { label: "Confirmed Shoots", value: "CONFIRMED", count: stats.confirmed },
              { label: "Completed", value: "COMPLETED", count: stats.completed },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  statusFilter === tab.value
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                    : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  statusFilter === tab.value ? "bg-teal-400 text-black" : "bg-zinc-800 text-zinc-400"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-zinc-400 hover:text-teal-300 underline underline-offset-4 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 3. Bookings List / Cards */}
      <div className="bg-[#0a1310] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {filteredBookings.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">No Bookings Found</h3>
            <p className="text-sm text-zinc-400 max-w-sm mx-auto font-light">
              {hasActiveFilters
                ? "No shoot inquiries match your active filters. Try clearing your search keyword."
                : "No customer booking requests recorded in the database yet."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="mt-2 px-4 py-2 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30 text-xs font-bold hover:bg-teal-500/25 transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                    <th className="p-4 pl-6">Client Details</th>
                    <th className="p-4">Shoot Service</th>
                    <th className="p-4">Target Date & Time</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Instant Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredBookings.map((b) => {
                    const initials = (b.name || "Client")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <tr key={b.id} className="hover:bg-white/[0.02] transition-colors group">
                        {/* Client Info with Avatar */}
                        <td className="p-4 pl-6 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center font-bold text-teal-300 text-xs shrink-0 shadow-inner">
                              {initials}
                            </div>
                            <div>
                              <div className="font-bold text-white text-base leading-snug">{b.name}</div>
                              <a
                                href={`tel:${b.phone}`}
                                className="text-xs text-zinc-400 hover:text-teal-300 font-mono flex items-center gap-1 mt-0.5"
                                title="Click to call client"
                              >
                                <Phone className="w-3 h-3 text-teal-400" /> {b.phone}
                              </a>
                            </div>
                          </div>
                        </td>

                        {/* Shoot Type & Notes */}
                        <td className="p-4 align-middle max-w-xs">
                          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20 mb-1">
                            {b.eventType}
                          </span>
                          {b.requirements ? (
                            <p className="text-xs text-zinc-400 bg-[#070e0c] p-2 rounded-lg border border-white/5 line-clamp-1" title={b.requirements}>
                              "{b.requirements}"
                            </p>
                          ) : (
                            <span className="text-xs text-zinc-500 italic block">No special notes</span>
                          )}
                        </td>

                        {/* Date & Time */}
                        <td className="p-4 align-middle">
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-teal-400" />
                            {new Date(b.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </div>
                          <div className="text-xs text-teal-300/80 font-medium mt-0.5">
                            {b.timeSlot || "Full Day Coverage"}
                          </div>
                        </td>

                        {/* Location */}
                        <td className="p-4 align-middle">
                          <div className="text-zinc-300 font-medium flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span className="truncate max-w-[160px]" title={b.location}>
                              {b.location || "Studio / Madurai"}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="p-4 align-middle">
                          {getStatusBadge(b.status)}
                        </td>

                        {/* Friendly Instant Actions */}
                        <td className="p-4 pr-6 align-middle text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* WhatsApp Button */}
                            <button
                              onClick={() => handleWhatsAppContact(b)}
                              title="Send WhatsApp Greeting Message"
                              className="px-3 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 text-xs font-bold transition-all hover:scale-105 flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </button>

                            {/* Status Advancement Buttons */}
                            {b.status === "PENDING" && (
                              <button
                                onClick={() => handleStatusUpdate(b.id, "CONFIRMED")}
                                disabled={isUpdating === b.id}
                                title="Confirm this photoshoot date"
                                className="px-3 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 text-xs font-bold transition-all hover:scale-105 cursor-pointer"
                              >
                                ✓ Confirm
                              </button>
                            )}

                            {b.status === "CONFIRMED" && (
                              <button
                                onClick={() => handleStatusUpdate(b.id, "COMPLETED")}
                                disabled={isUpdating === b.id}
                                title="Mark photoshoot & albums as completed"
                                className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all hover:scale-105 cursor-pointer"
                              >
                                ✓ Complete
                              </button>
                            )}

                            {/* Delete / Archive Button */}
                            <button
                              onClick={() => handleDelete(b.id, b.name)}
                              title="Delete booking request"
                              className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all opacity-60 hover:opacity-100 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
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

                  <div className="grid grid-cols-2 gap-2.5 bg-[#070e0c] p-3 rounded-xl border border-white/5 text-xs">
                    <div>
                      <span className="text-zinc-400 flex items-center gap-1 mb-1 font-medium">
                        <Calendar className="w-3 h-3 text-teal-400" /> Shoot Date
                      </span>
                      <p className="font-bold text-white">
                        {new Date(b.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short"
                        })}
                      </p>
                      <p className="text-teal-400 font-medium">{b.timeSlot || "Full Day"}</p>
                    </div>

                    <div>
                      <span className="text-zinc-400 flex items-center gap-1 mb-1 font-medium">
                        <MapPin className="w-3 h-3 text-rose-400" /> Location
                      </span>
                      <p className="font-bold text-white truncate">{b.location || "Madurai Studio"}</p>
                      <p className="text-zinc-400 truncate">{b.eventType}</p>
                    </div>
                  </div>

                  {b.requirements && (
                    <div className="bg-[#070e0c] p-2.5 rounded-xl border border-white/5 text-xs">
                      <span className="text-zinc-400 block mb-0.5 font-medium">Notes & Needs:</span>
                      <p className="text-zinc-300">{b.requirements}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleWhatsAppContact(b)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-xs font-bold transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </button>

                    {b.status === "PENDING" && (
                      <button
                        onClick={() => handleStatusUpdate(b.id, "CONFIRMED")}
                        disabled={isUpdating === b.id}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold transition-all text-center cursor-pointer"
                      >
                        ✓ Confirm
                      </button>
                    )}

                    {b.status === "CONFIRMED" && (
                      <button
                        onClick={() => handleStatusUpdate(b.id, "COMPLETED")}
                        disabled={isUpdating === b.id}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all text-center cursor-pointer"
                      >
                        ✓ Complete
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(b.id, b.name)}
                      className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 cursor-pointer"
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
