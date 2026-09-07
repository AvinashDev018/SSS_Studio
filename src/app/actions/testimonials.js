"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getTestimonials(onlyApproved = false) {
  try {
    const where = onlyApproved ? { status: "APPROVED" } : {};
    const testimonials = await prisma.testimonial.findMany({
      where,
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
        event: data.event || data.category || "General Feedback",
        text: data.text || data.review,
        rating: parseInt(data.rating) || 5,
        status: data.status || "PENDING",
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

export async function updateTestimonialStatus(id, status) {
  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/");
    revalidatePath("/admin/reviews");
    return { success: true, testimonial };
  } catch (error) {
    console.error("Error updating testimonial status:", error);
    return { success: false, error: "Failed to update testimonial status" };
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
