"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function WhatsAppButton() {
 const phoneNumber = "916383565425"; // Replace with actual number
 const message = "Hi! I'm interested in booking a photography session.";

 const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

 return (
 <motion.a
 href={whatsappUrl}
 target="_blank"
 rel="noopener noreferrer"
 initial={{ scale: 0, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 whileHover={{ scale: 1.1 }}
 whileTap={{ scale: 0.9 }}
 className="fixed bottom-6 left-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center hover:bg-green-600 transition-colors"
 aria-label="Chat on WhatsApp"
 >
 <MessageCircle className="w-6 h-6" />
 </motion.a>
 );
}
