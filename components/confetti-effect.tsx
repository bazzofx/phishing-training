"use client"

import { useRef } from "react"
import { motion } from "framer-motion"

interface ConfettiEffectProps {
  isActive: boolean
}

export default function ConfettiEffect({ isActive }: ConfettiEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const confettiCount = 150
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

  // Generate confetti pieces with random properties
  const confetti = Array.from({ length: confettiCount }).map((_, i) => {
    const size = Math.random() * 10 + 5
    return {
      id: i,
      x: Math.random() * 100,
      y: -20 - Math.random() * 100,
      size,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      flip: Math.random() > 0.5,
      xVelocity: (Math.random() - 0.5) * 3,
    }
  })

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ display: isActive ? "block" : "none" }}
    >
      {isActive &&
        confetti.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute"
            style={{
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              width: piece.size,
              height: piece.size * (piece.flip ? 0.5 : 1),
              backgroundColor: piece.color,
              borderRadius: piece.flip ? "0" : "50%",
              transform: `rotate(${piece.rotation}deg)`,
            }}
            animate={{
              y: ["0%", "100%"],
              x: [`${piece.x}%`, `${piece.x + piece.xVelocity * 20}%`],
              rotate: [piece.rotation, piece.rotation + (Math.random() * 2 - 1) * 360],
              opacity: [1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              ease: "easeOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
    </div>
  )
}
