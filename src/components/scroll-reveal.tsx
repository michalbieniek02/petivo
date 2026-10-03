"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  from?: "bottom" | "left" | "right" | "scale";
  as?: "div" | "li";
}

export function Reveal({ children, delay = 0, className = "", from = "bottom", as = "div" }: Props) {
  const Tag = as === "li" ? motion.li : motion.div;
  const variants = {
    hidden: {
      opacity: 0,
      y: from === "bottom" ? 16 : 0,
      x: from === "left" ? -16 : from === "right" ? 16 : 0,
      scale: from === "scale" ? 0.97 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants}
      className={className}
    >
      {children}
    </Tag>
  );
}
