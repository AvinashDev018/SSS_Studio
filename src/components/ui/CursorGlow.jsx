"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CursorGlow() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-30 hidden md:block"
      animate={{
        x: mousePosition.x - 250,
        y: mousePosition.y - 250,
      }}
      transition={{
        type: "spring",
        damping: 35,
        stiffness: 250,
        mass: 0.5,
      }}
    >
      <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-r from-teal-500/10 via-emerald-500/8 to-amber-500/5 blur-[120px]" />
    </motion.div>
  );
}
