"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import GameTips from "./game-tips"
import { FloatingIcons, AnimatedBackground } from "./decorative-elements"

interface GameStartProps {
  onStart: () => void
}

export default function GameStart({ onStart }: GameStartProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Welcome to Phish Defender",
      description: "Your mission: Protect SecureCorp Inc. from phishing attacks by identifying suspicious emails.",
      icon: <Shield className="w-16 h-16 text-emerald-500" />,
    },
    {
      title: "Phase 1: Quickfire Challenge",
      description:
        "You'll be shown 10 email snippets. Quickly decide if each is legitimate or phishing within 10 seconds.",
      icon: <AlertTriangle className="w-16 h-16 text-amber-500" />,
    },
    {
      title: "Phase 2: Inbox Defender",
      description:
        "Manage a realistic inbox with multiple emails. Inspect each carefully before deciding what action to take.",
      icon: <CheckCircle className="w-16 h-16 text-blue-500" />,
    },
    {
      title: "Phase 3: Security Lab",
      description:
        "Master advanced techniques to identify forged emails and malicious URLs through interactive tools and challenges.",
      icon: <Shield className="w-16 h-16 text-purple-500" />,
    },
  ]

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onStart()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] relative">
      <AnimatedBackground />
      <FloatingIcons />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[90vw] max-w-[600px] shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-[100px] h-[100px] border-t-2 border-l-2 border-blue-300 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-[100px] h-[100px] border-t-2 border-r-2 border-blue-300 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-[100px] h-[100px] border-b-2 border-l-2 border-blue-300 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-[100px] h-[100px] border-b-2 border-r-2 border-blue-300 rounded-br-xl" />
          </div>

          <CardHeader className="text-center relative z-10">
            <CardTitle className="text-3xl font-bold text-slate-800 bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              {slides[currentSlide].title}
            </CardTitle>
            <CardDescription className="text-lg">{slides[currentSlide].description}</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col justify-center py-6 relative z-10">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center mb-6"
            >
              {slides[currentSlide].icon}
            </motion.div>

            {currentSlide === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <GameTips />
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between relative z-10">
            <Button
              variant="outline"
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="border-blue-300 hover:bg-blue-50"
            >
              Back
            </Button>
            <div className="flex space-x-1">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentSlide ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                />
              ))}
            </div>
            <Button
              onClick={nextSlide}
              className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600"
            >
              {currentSlide === slides.length - 1 ? "Start Game" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
