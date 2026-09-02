"use client";

import { motion } from "framer-motion";

export default function AnimatedSection({ children, className = "", delay = 0, yOffset = 20 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      className={`opacity-100 ${className}`}
    >
      {children}
    </motion.div>
  );
}
