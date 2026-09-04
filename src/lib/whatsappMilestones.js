/**
 * SSS Photography Studio WhatsApp Milestone Generator
 * Prepares personalized, professional milestone notification messages for WhatsApp.
 */

export const MILESTONES = [
  { id: "PROCESSING", label: "Printing & Framing Started", icon: "🎨" },
  { id: "SHIPPED", label: "Dispatched via Courier", icon: "🚚" },
  { id: "READY_FOR_PICKUP", label: "Ready for Studio Pickup", icon: "🏬" },
  { id: "DELIVERED", label: "Delivery Completed", icon: "✨" },
];

export function generateMilestoneMessage({ orderId, customerName, address, courierTrackingId, totalAmount }, milestone) {
  const name = customerName || "Valued Customer";

  switch (milestone) {
    case "PROCESSING":
      return `Vanakkam ${name}! 👋

Your SSS Photography Studio order *#${orderId}* has entered *Fine-Art Printing & Framing* at our Avaniyapuram lab.

• Status: 🎨 Color Correction & Lamination Underway
• Total Amount: ₹${totalAmount || 0}

You can track live production progress using your *Order ID (${orderId})* or *Mobile Number* on our website **Track Order** page!

We will notify you the moment your handcrafted order is ready! 📸`;

    case "SHIPPED":
      return `Vanakkam ${name}! 👋

Your handcrafted order *#${orderId}* has been safely bubble-wrapped and *DISPATCHED* via Courier! 🚚

• Courier Tracking ID: *${courierTrackingId || "In Transit"}*
• Destination: ${address || "Your Address"}

You can track delivery status using your *Order ID (${orderId})* or *Mobile Number* on our website **Track Order** page!

Thank you for choosing SSS Photography Studio! ✨`;

    case "READY_FOR_PICKUP":
      return `Vanakkam ${name}! 👋

Great news! Your handcrafted order *#${orderId}* is complete and *READY FOR PICKUP* at our studio! 🏬

📍 *Studio Address:* 34, Prasanna New Colony, Avaniyapuram, Madurai - 625012
⏰ *Timings:* Mon–Sun, 9:00 AM – 8:00 PM
📞 *Direct Helpline:* +91 63835 65425

You can view order details with your *Order ID (${orderId})* or *Mobile Number* on our website **Track Order** page!

See you soon! 📸`;

    case "DELIVERED":
    case "PICKED_UP":
      return `Vanakkam ${name}! 👋

Your order *#${orderId}* has been successfully delivered. We hope you and your family cherish the handcrafted photo memories! ✨

If you love our work and 1-Month Delivery Guarantee, please support us with a quick Google review.

Thank you from the entire SSS Photography Studio family! 🙏`;

    default:
      return `Vanakkam ${name}! Your SSS Studio order *#${orderId}* status is: *${milestone}*.\nTrack live using your Order ID (${orderId}) or Mobile Number on our website Track Order page!`;
  }
}

export function getWhatsAppMilestoneUrl(order, milestone, originUrl) {
  const text = generateMilestoneMessage(order, milestone);
  const cleanPhone = (order.customerPhone || "").replace(/\D/g, "");
  const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}
