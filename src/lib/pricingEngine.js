// src/lib/pricingEngine.js
// Dynamic Pricing Engine for SSS Studio Booking Calendar

/**
 * Returns pricing information for a given date
 * @param {Date} date - The date to check
 * @returns {{ label: string, discount: number, badgeColor: string, message: string, tier: string }}
 */
export function getDatePricing(date) {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  const month = date.getMonth(); // 0 = January, 11 = December
  const day = date.getDate();

  // Indian Public Holidays (month is 0-indexed)
  const publicHolidays = [
    "01-26", // Republic Day
    "08-15", // Independence Day
    "10-02", // Gandhi Jayanti
    "11-01", // Diwali region approx
    "12-25", // Christmas
  ];
  const dateKey = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  if (publicHolidays.includes(dateKey)) {
    return {
      tier: "luxury",
      label: "Holiday",
      discount: -15, // surcharge
      badgeColor: "rose",
      message: "🎊 Holiday Premium: +15% applies on public holidays.",
    };
  }

  // Peak Season: November - February (wedding season in Tamil Nadu)
  const isPeakSeason = month >= 10 || month <= 1;

  // Sunday - always high demand
  if (dayOfWeek === 0) {
    return {
      tier: "peak",
      label: "High Demand",
      discount: 0,
      badgeColor: "amber",
      message: "🔥 Sunday is a high-demand day. Book early!",
    };
  }

  // Saturday - peak
  if (dayOfWeek === 6) {
    return {
      tier: "peak",
      label: isPeakSeason ? "Peak Season" : "High Demand",
      discount: isPeakSeason ? -10 : 0,
      badgeColor: "amber",
      message: isPeakSeason
        ? "⭐ Peak wedding season Saturday: +10% applies."
        : "🔥 Saturday is a popular booking day!",
    };
  }

  // Friday - slightly elevated
  if (dayOfWeek === 5) {
    return {
      tier: "standard",
      label: "Standard",
      discount: 0,
      badgeColor: "zinc",
      message: "📅 Standard pricing applies.",
    };
  }

  // Weekdays (Mon-Thu) - Saver dates
  return {
    tier: "saver",
    label: "Saver Date",
    discount: 10, // 10% discount
    badgeColor: "green",
    message: "🎉 Weekday Saver! Book today and get 10% off your session.",
  };
}
