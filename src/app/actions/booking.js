"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Creates a new booking in the Supabase PostgreSQL database
 */
export async function createBooking(formData) {
  try {
    const { name, phone, eventType, customEventType, date, location, requirements } = formData;
    
    // Determine the final event type
    const finalEventType = eventType === "Other" ? customEventType : eventType;

    // Check if date is already booked
    const existingBooking = await prisma.booking.findFirst({
      where: {
        date: new Date(date)
      }
    });

    if (existingBooking) {
      return { success: false, error: "This date is already booked. Please choose another date." };
    }

    // Save to database
    await prisma.booking.create({
      data: {
        name,
        phone,
        eventType: finalEventType,
        date: new Date(date),
        location,
        requirements: requirements || null,
        status: "PENDING"
      }
    });

    // Revalidate the contact page so the new booked date appears in the calendar
    revalidatePath("/contact");

    return { success: true };
  } catch (error) {
    console.error("Failed to create booking:", error);
    return { success: false, error: "An error occurred while submitting your booking request. Please try again." };
  }
}

/**
 * Fetches an array of all booked dates (YYYY-MM-DD format)
 */
export async function getBookedDates() {
  try {
    const bookings = await prisma.booking.findMany({
      select: {
        date: true
      },
      where: {
        date: {
          gte: new Date() // Only get future dates
        }
      }
    });

    // Format dates to YYYY-MM-DD
    return bookings.map(b => b.date.toISOString().split('T')[0]);
  } catch (error) {
    console.error("Failed to fetch booked dates:", error);
    return [];
  }
}
