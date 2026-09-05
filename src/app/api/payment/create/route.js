import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch (e) {
      session = null;
    }

    const body = await req.json();
    const { amount, customerName, customerPhone, address, items, paymentMode } = body;

    if (!amount || !customerName || !customerPhone || !address || !items) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    if (paymentMode === "CASH" || !process.env.RAZORPAY_KEY_ID) {
      const dbOrder = await prisma.order.create({
        data: {
          orderId: cleanOrderId,
          customerName,
          customerPhone,
          address,
          items: typeof items === "string" ? items : JSON.stringify(items),
          totalAmount: Number(amount),
          status: "PENDING",
          userId: session?.user?.id || null,
        },
      });

      return NextResponse.json({
        success: true,
        isCash: true,
        dbOrderId: dbOrder.orderId,
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Razorpay requires amount in smallest currency unit (e.g., paise for INR)
    // Assuming amount is in INR (e.g. 500 = 500 INR -> 50000 paise)
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return NextResponse.json({ error: "Failed to create Razorpay order" }, { status: 500 });
    }

    // Save PENDING order to database
    const dbOrder = await prisma.order.create({
      data: {
        orderId: `ORD-${Date.now().toString().slice(-6)}`,
        customerName,
        customerPhone,
        address,
        items,
        totalAmount: amount,
        status: "PENDING",
        razorpayOrderId: order.id,
        userId: session?.user?.id || null, // Optional if logged in
      },
    });

    return NextResponse.json({
      success: true,
      order,
      dbOrderId: dbOrder.orderId,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Error creating payment order" },
      { status: 500 }
    );
  }
}
