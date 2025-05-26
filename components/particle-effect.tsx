"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Particle = {
  id: number
  x: number
  y: number
  size: number
  color: string
  velocity: {
    x: number
    y: number
  }
  opacity: number
  rotation: number
}

interface ParticleEffectProps {
  x: number
  y: number
  type: "success" | "error" | "neutral"
  isActive: boolean
  onComplete?: () => void
}

export default function ParticleEffect({ x, y, type, isActive, onComplete }: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  // Generate particles when the effect becomes active
  useEffect(() => {
    if (isActive) {
      const newParticles: Particle[] = []
      const particleCount = 30

      // Colors based on type
      const colors =
        type === "success"
          ? ["#10b981", "#34d399", "#6ee7b7"] // Green shades
          : type === "error"
            ? ["#ef4444", "#f87171", "#fca5a5"] // Red shades
            : ["#3b82f6", "#60a5fa", "#93c5fd"] // Blue shades

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const force = Math.random() * 5 + 2

        newParticles.push({
          id: i,
          x: 0,
          y: 0,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          velocity: {
            x: Math.cos(angle) * force,
            y: Math.sin(angle) * force,
          },
          opacity: 1,
          rotation: Math.random() * 360,
        })
      }

      setParticles(newParticles)

      // Clean up after animation
      const timer = setTimeout(() => {
        if (onComplete) onComplete()
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [isActive, type, onComplete])

  // Animation loop
  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current

      setParticles((prevParticles) =>
        prevParticles
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.velocity.x,
            y: particle.y + particle.velocity.y,
            velocity: {
              x: particle.velocity.x * 0.98,
              y: particle.velocity.y * 0.98 + 0.1, // Add gravity
            },
            opacity: particle.opacity - 0.02,
            rotation: particle.rotation + particle.velocity.x * 2,
          }))
          .filter((particle) => particle.opacity > 0),
      )
    }

    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (isActive && particles.length > 0) {
      requestRef.current = requestAnimationFrame(animate)
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current)
        }
      }
    }
  }, [isActive, particles.length])

  if (!isActive) return null

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="absolute pointer-events-none"
          style={{ left: x, top: y, width: 0, height: 0 }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                opacity: particle.opacity,
                rotate: `${particle.rotation}deg`,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
