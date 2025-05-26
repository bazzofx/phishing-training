"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ConfettiEffect from "./confetti-effect"

interface GameCompletionProps {
  score: number
  maxScore: number
  onContinue: () => void
}

export default function GameCompletion({ score, maxScore, onContinue }: GameCompletionProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const percentage = Math.round((score / maxScore) * 100)

  useEffect(() => {
    // Delay confetti for dramatic effect
    const timer = setTimeout(() => {
      setShowConfetti(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <ConfettiEffect isActive={showConfetti} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12 }}
        className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-emerald-500" />
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-100 rounded-full opacity-50" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-100 rounded-full opacity-50" />

        <div className="text-center relative z-10">
          <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-amber-100 mb-4">
            <Trophy className="w-10 h-10 text-amber-500" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Phase Complete!</h2>

          <div className="flex justify-center items-center space-x-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${i < Math.ceil(percentage / 20) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
              />
            ))}
          </div>

          <div className="bg-gray-100 rounded-full h-4 mb-4">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>

          <div className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            {score} / {maxScore}
          </div>

          <Button
            onClick={onContinue}
            className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-8 py-2 rounded-full"
          >
            Continue
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
