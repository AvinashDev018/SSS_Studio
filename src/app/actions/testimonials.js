"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getTestimonials() {
 try {
 const testimonials = await prisma.testimonial.findMany({
 orderBy: {
 createdAt: "desc"
 }
 });
 return testimonials;
 } catch (error) {
 console.error("Error fetching testimonials:", error);
 return [];
 }
}

export async function addTestimonial(data) {
 try {
 const testimonial = await prisma.testimonial.create({
 data: {
 name: data.name,
 event: data.event,
 text: data.text,
 rating: parseInt(data.rating) || 5,
 }
 });
 revalidatePath("/");
 revalidatePath("/admin/reviews");
 return { success: true, testimonial };
 } catch (error) {
 console.error("Error adding testimonial:", error);
 return { success: false, error: "Failed to add testimonial" };
 }
}

export async function deleteTestimonial(id) {
 try {
 await prisma.testimonial.delete({
 where: { id }
 });
 revalidatePath("/");
 revalidatePath("/admin/reviews");
 return { success: true };
 } catch (error) {
 console.error("Error deleting testimonial:", error);
 return { success: false, error: "Failed to delete testimonial" };
 }
}
