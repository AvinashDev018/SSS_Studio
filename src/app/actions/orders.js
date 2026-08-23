"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// Generate a random Order ID like ORD-1A2B
function generateOrderId() {
 const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
 let result = 'ORD-';
 for (let i = 0; i < 6; i++) {
 result += chars.charAt(Math.floor(Math.random() * chars.length));
 }
 return result;
}

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function createOrder(data) {
  try {
    const session = await getServerSession(authOptions);
    let userId = null;

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      if (user) {
        userId = user.id;
      }
    }

    const orderId = generateOrderId();
    const order = await prisma.order.create({
      data: {
        orderId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        address: data.address,
        items: data.items,
        totalAmount: data.totalAmount,
        status: "PENDING",
        userId: userId, // associate if logged in
      }
    });
    revalidatePath("/admin/orders");
    if (userId) {
      revalidatePath("/profile");
    }
    return { success: true, orderId };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function getOrder(orderId) {
 try {
  const order = await prisma.order.findFirst({
    where: { 
      OR: [
        {
          orderId: {
            equals: orderId,
            mode: 'insensitive'
          }
        },
        {
          id: orderId.toLowerCase()
        }
      ]
    }
  });
 
 if (!order && orderId.startsWith("ORD-") && orderId.length === 10) {
 // Fallback for demo without database
 return { 
 success: true, 
 order: { 
 orderId, 
 status: "PROCESSING", 
 customerName: "Customer", 
 createdAt: new Date(),
 items: [],
 totalAmount: 0
 } 
 };
 }
 
 return { success: true, order };
 } catch (error) {
 console.error("Error fetching order:", error);
 if (orderId.startsWith("ORD-") && orderId.length === 10) {
 return { 
 success: true, 
 order: { 
 orderId, 
 status: "PROCESSING", 
 customerName: "Customer", 
 createdAt: new Date(),
 items: [],
 totalAmount: 0
 } 
 };
 }
 return { success: false, error: "Failed to fetch order" };
 }
}

export async function getOrders() {
 try {
 const orders = await prisma.order.findMany({
 orderBy: { createdAt: "desc" }
 });
 return { success: true, orders };
 } catch (error) {
 console.error("Error fetching orders:", error);
 return { success: false, error: "Failed to fetch orders" };
 }
}

export async function updateOrderStatus(orderId, newStatus) {
 try {
 const order = await prisma.order.update({
 where: { orderId },
 data: { status: newStatus }
 });
 revalidatePath("/admin/orders");
 revalidatePath("/track"); // in case they are tracking it
 return { success: true, order };
 } catch (error) {
 console.error("Error updating order:", error);
 return { success: false, error: "Failed to update order status" };
 }
}

export async function updateOrderTrackingId(orderId, trackingId) {
 try {
 const order = await prisma.order.update({
 where: { orderId },
 data: { courierTrackingId: trackingId }
 });
 revalidatePath("/admin/orders");
 revalidatePath("/track");
 return { success: true, order };
 } catch (error) {
 console.error("Error updating tracking ID:", error);
 return { success: false, error: "Failed to update tracking ID" };
 }
}
