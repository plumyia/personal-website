"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type FeatherVariant = "full" | "small";

interface FeatherTrailProps {
  variant: FeatherVariant;
  className?: string;
}

const sizes: Record<FeatherVariant, number> = {
  full: 220,
  small: 44,
};

export function FeatherTrail({ variant, className = "" }: FeatherTrailProps) {
  const size = sizes[variant];

  if (variant === "small") {
    return (
      <span className={`relative inline-block shrink-0 ${className}`}>
        <motion.span
          className="inline-block"
          animate={{
            x: [0, 3, 0, -3, 0],
            y: [0, -2, 1, -2, 0],
            rotate: [0, 4, 1, -4, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            repeatType: "mirror" as const,
            ease: "easeInOut",
          }}
          style={{ width: size, height: size }}
        >
          <Image
            src="/feather.webp"
            alt="羽毛"
            width={size}
            height={size}
            className="object-contain"
            priority
          />
        </motion.span>
      </span>
    );
  }

  // "full" variant — position animation handled by parent
  return (
    <div
      className={`shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/feather.webp"
        alt="羽毛"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
    </div>
  );
}
