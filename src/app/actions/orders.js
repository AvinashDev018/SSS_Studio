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

export async function searchOrdersByPhoneOrId(query) {
  try {
    const raw = (query || "").trim();
    if (!raw) {
      return { success: false, error: "Please enter a valid Order ID or 10-digit Mobile Number" };
    }

    const digitsOnly = raw.replace(/\D/g, "");
    const cleanId = raw.toUpperCase();

    // 1. If it looks like a phone number (at least 7 digits)
    if (digitsOnly.length >= 7) {
      const matchPattern = digitsOnly.slice(-10);

      const orders = await prisma.order.findMany({
        where: {
          customerPhone: {
            contains: matchPattern,
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const bookings = await prisma.booking.findMany({
        where: {
          phone: {
            contains: matchPattern,
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const totalMatches = orders.length + bookings.length;

      if (totalMatches === 0) {
        // Fallback: check if the digits happen to match an order ID
        const orderById = await prisma.order.findFirst({
          where: { orderId: { equals: cleanId, mode: "insensitive" } },
        });
        if (orderById) {
          return { success: true, multiple: false, order: orderById };
        }
        return { success: false, error: `No active orders or shoots found for mobile number ending in ${digitsOnly.slice(-4)}` };
      }

      if (totalMatches === 1 && orders.length === 1) {
        return { success: true, multiple: false, order: orders[0] };
      }

      const unifiedOrders = [
        ...orders.map((o) => ({
          type: "product",
          orderId: o.orderId,
          customerName: o.customerName,
          status: o.status,
          totalAmount: o.totalAmount,
          createdAt: o.createdAt,
          items: typeof o.items === "string" ? JSON.parse(o.items) : o.items,
          courierTrackingId: o.courierTrackingId,
          address: o.address,
        })),
        ...bookings.map((b) => ({
          type: "booking",
          orderId: `SHOOT-${b.id.slice(0, 6).toUpperCase()}`,
          rawId: b.id,
          customerName: b.name,
          status: b.status,
          eventType: b.eventType,
          date: b.date,
          location: b.location,
          createdAt: b.createdAt,
          totalAmount: 0,
          address: b.location,
          items: [{ name: `${b.eventType} Photoshoot Coverage`, quantity: 1, price: 0 }],
        })),
      ];

      return {
        success: true,
        multiple: true,
        orders: unifiedOrders,
      };
    }

    // 2. Search by exact Order ID
    const order = await prisma.order.findFirst({
      where: {
        orderId: {
          equals: cleanId,
          mode: "insensitive",
        },
      },
    });

    if (order) {
      return { success: true, multiple: false, order };
    }

    // 3. Search booking by SHOOT-ID or raw UUID
    if (cleanId.startsWith("SHOOT-")) {
      const shortId = cleanId.replace("SHOOT-", "");
      const booking = await prisma.booking.findFirst({
        where: { id: { startsWith: shortId.toLowerCase() } },
      });
      if (booking) {
        return {
          success: true,
          multiple: false,
          order: {
            type: "booking",
            orderId: cleanId,
            customerName: booking.name,
            customerPhone: booking.phone,
            status: booking.status,
            eventType: booking.eventType,
            date: booking.date,
            location: booking.location,
            createdAt: booking.createdAt,
            totalAmount: 0,
            address: booking.location,
            items: [{ name: `${booking.eventType} Photoshoot Coverage`, quantity: 1, price: 0 }],
          },
        };
      }
    }

    return { success: false, error: `No order found with ID: ${cleanId}` };
  } catch (error) {
    console.error("Error searching orders:", error);
    return { success: false, error: "Database error. Please try again." };
  }
}

export async function getOrder(orderId) {
  return searchOrdersByPhoneOrId(orderId);
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
