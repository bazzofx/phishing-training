"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function DecorativeBorder() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-0 w-[150px] h-[150px] border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
      <div className="absolute top-0 right-0 w-[150px] h-[150px] border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 w-[150px] h-[150px] border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
      <div className="absolute bottom-0 right-0 w-[150px] h-[150px] border-b-4 border-r-4 border-blue-500 rounded-br-xl" />
    </div>
  )
}

const staticIcons = [
  { x: 10, y: 20, yEnd: 80, opacity: 0.4, scale: 0.6, duration: 20 },
  { x: 25, y: 50, yEnd: 10, opacity: 0.5, scale: 1.0, duration: 18 },
  { x: 40, y: 30, yEnd: 90, opacity: 0.45, scale: 0.75, duration: 22 },
  { x: 60, y: 10, yEnd: 70, opacity: 0.35, scale: 0.9, duration: 17 },
  { x: 70, y: 60, yEnd: 20, opacity: 0.6, scale: 0.8, duration: 25 },
  { x: 85, y: 40, yEnd: 100, opacity: 0.38, scale: 1.1, duration: 21 },
  { x: 15, y: 80, yEnd: 5, opacity: 0.42, scale: 0.7, duration: 19 },
  { x: 50, y: 15, yEnd: 85, opacity: 0.55, scale: 0.95, duration: 23 },
  { x: 35, y: 70, yEnd: 30, opacity: 0.48, scale: 1.2, duration: 26 },
  { x: 90, y: 25, yEnd: 75, opacity: 0.3, scale: 0.65, duration: 24 },
];

export function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {staticIcons.map((icon, i) => (
        <motion.div
          key={i}
          className="absolute text-blue-100"
          initial={{
            x: `${icon.x}%`,
            y: `${icon.y}%`,
            opacity: icon.opacity,
            scale: icon.scale,
          }}
          animate={{
            y: [`${icon.y}%`, `${icon.yEnd}%`],
            rotate: [0, 360],
          }}
          transition={{
            duration: icon.duration,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          {i % 3 === 0 ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          ) : i % 3 === 1 ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
    }> = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particles = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000)

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.1,
        })
      }
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`
        ctx.fill()

        // Draw connections
        connectParticles(particle, i)
      })
    }

    const connectParticles = (particle: (typeof particles)[0], index: number) => {
      const connectionDistance = 100

      for (let j = index + 1; j < particles.length; j++) {
        const otherParticle = particles[j]
        const dx = particle.x - otherParticle.x
        const dy = particle.y - otherParticle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < connectionDistance) {
          const opacity = 1 - distance / connectionDistance
          ctx.beginPath()
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.2})`
          ctx.lineWidth = 1
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(otherParticle.x, otherParticle.y)
          ctx.stroke()
        }
      }
    }

    const animate = () => {
      drawParticles()
      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-20" />
}
