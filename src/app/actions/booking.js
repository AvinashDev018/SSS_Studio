"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Creates a new booking in the Supabase PostgreSQL database
 */
export async function createBooking(formData) {
 try {
 const { name, phone, eventType, customEventType, date, timeSlot, location, requirements, packageId } = formData;
 
 // Determine the final event type
 const finalEventType = eventType === "Other" ? customEventType : eventType;

 // Check if the specific time slot on that date is already booked
 const existingBooking = await prisma.booking.findFirst({
 where: {
 date: new Date(date),
 timeSlot: timeSlot
 }
 });

 if (existingBooking) {
 return { success: false, error: "This time slot is already booked. Please choose another time." };
 }

 // Save to database
 await prisma.booking.create({
 data: {
 name,
 phone,
 eventType: finalEventType,
 date: new Date(date),
 timeSlot,
 location,
 requirements: requirements || null,
 packageId: packageId || null,
 status: "PENDING"
 }
 });

 // Revalidate relevant pages
 revalidatePath("/");
 revalidatePath("/admin");

 return { success: true };
 } catch (error) {
 console.error("Failed to create booking:", error);
 return { success: false, error: "Failed to create booking" };
 }
}

/**
 * Fetches all booked dates and time slots to disable them on the frontend calendar
 */
export async function getBookedSlots() {
 try {
 const bookings = await prisma.booking.findMany({
 select: {
 date: true,
 timeSlot: true
 },
 where: {
 date: {
 gte: new Date(new Date().setHours(0, 0, 0, 0)) // Only get today and future dates
 }
 }
 });

 // Return array of objects with formatted date strings
 return bookings.map(b => ({
 date: b.date.toISOString().split('T')[0],
 timeSlot: b.timeSlot
 }));
 } catch (error) {
 console.error("Failed to fetch booked slots:", error);
 return [];
 }
}

export async function updateBookingStatus(id, newStatus) {
 try {
 await prisma.booking.update({
 where: { id },
 data: { status: newStatus }
 });
 revalidatePath("/admin");
 return { success: true };
 } catch (error) {
 console.error("Failed to update booking status:", error);
 return { success: false, error: "Failed to update status." };
 }
}

export async function deleteBooking(id) {
 try {
 await prisma.booking.delete({
 where: { id }
 });
 revalidatePath("/admin");
 return { success: true };
 } catch (error) {
 console.error("Failed to delete booking:", error);
 return { success: false, error: "Failed to delete booking." };
 }
}
