import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
}

export function GlassCard({ children, className, glow = false, hover = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        glow ? "glass-card-glow" : "glass-card",
        "p-5 transition-shadow duration-300",
        hover && "hover:shadow-lg",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
