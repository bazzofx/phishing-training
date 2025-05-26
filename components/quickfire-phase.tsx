"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Clock, CheckCircle, XCircle, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useGameContext, quickfireEmails } from "./game-context"
import EmailLink from "./email-link"
import EmailAttachment from "./email-attachment"
import ParticleEffect from "./particle-effect"

interface QuickfirePhaseProps {
  onComplete: (score: number) => void
}

export default function QuickfirePhase({ onComplete }: QuickfirePhaseProps) {
  const { addPoints, updateQuickfireResults, addMissedFlag } = useGameContext()
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [showParticles, setShowParticles] = useState(false)
  const [particlePosition, setParticlePosition] = useState({ x: 0, y: 0 })
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const currentEmail = quickfireEmails[currentEmailIndex]

  useEffect(() => {
    if (!showFeedback) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            handleAnswer(null) // Time's up, count as wrong
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [currentEmailIndex, showFeedback])

  const handleAnswer = (answer: boolean | null) => {
    if (timerRef.current) clearInterval(timerRef.current)

    const isAnswerCorrect = answer === currentEmail.isPhishing
    setIsCorrect(isAnswerCorrect)
    setShowFeedback(true)

    if (isAnswerCorrect) {
      addPoints(10)
      setCorrectAnswers((prev) => prev + 1)

      // Set particle position to center of card
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        setParticlePosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        })
        setShowParticles(true)
      }
    } else if (currentEmail.redFlags) {
      // Add missed flags if the answer was wrong
      currentEmail.redFlags.forEach((flag) => addMissedFlag(flag))
    }
  }

  const nextEmail = () => {
    setShowParticles(false)

    if (currentEmailIndex < quickfireEmails.length - 1) {
      setCurrentEmailIndex((prev) => prev + 1)
      setTimeLeft(10)
      setShowFeedback(false)
      setIsCorrect(null)
    } else {
      // Phase complete
      updateQuickfireResults(correctAnswers, quickfireEmails.length)
      onComplete(correctAnswers * 10) // Pass the score (10 points per correct answer)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] relative">
      <ParticleEffect
        x={particlePosition.x}
        y={particlePosition.y}
        type={isCorrect ? "success" : "error"}
        isActive={showParticles}
        onComplete={() => {}}
      />

      <div className="w-full max-w-[600px] mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <Shield className="w-6 h-6 text-emerald-500 mr-2" />
          <h2 className="text-xl font-bold">Quickfire Challenge</h2>
        </div>
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-amber-500 mr-2" />
          <span className="font-medium">{timeLeft}s</span>
        </div>
      </div>

      <div className="w-full max-w-[600px] mb-4">
        <Progress value={(currentEmailIndex / quickfireEmails.length) * 100} className="h-2" />
        <div className="text-sm text-right mt-1">
          {currentEmailIndex + 1} of {quickfireEmails.length}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentEmailIndex + (showFeedback ? "-feedback" : "")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[600px]"
          ref={cardRef}
        >
          <Card className="shadow-lg relative overflow-hidden">
            {/* Decorative border */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-[50px] h-[50px] border-t-2 border-l-2 border-blue-200 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-[50px] h-[50px] border-t-2 border-r-2 border-blue-200 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-[50px] h-[50px] border-b-2 border-l-2 border-blue-200 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-[50px] h-[50px] border-b-2 border-r-2 border-blue-200 rounded-br-lg" />
            </div>

            <CardHeader className="pb-2 relative z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{currentEmail.sender}</h3>
                  <p className="text-sm text-slate-500">{currentEmail.senderEmail}</p>
                </div>
                <span className="text-sm text-slate-400">{currentEmail.date}</span>
              </div>
            </CardHeader>
            <CardContent className="py-4 relative z-10">
              <h4 className="font-semibold mb-1">{currentEmail.subject}</h4>

              {/* Email preview with interactive links */}
              <div className="text-slate-600 mb-3">
                {(() => {
                  // If the email has no links, just return the preview text
                  if (!currentEmail.links || currentEmail.links.length === 0) {
                    return currentEmail.preview
                  }

                  // If the email has links, replace the link text with the EmailLink component
                  let previewWithLinks = currentEmail.preview
                  currentEmail.links.forEach((link) => {
                    if (previewWithLinks.includes(link.text)) {
                      previewWithLinks = previewWithLinks.replace(link.text, `[LINK:${link.text}:LINK]`)
                    }
                  })

                  // Split by the link placeholders and map to components
                  const parts = previewWithLinks.split(/(\[LINK:.*?:LINK\])/)
                  return parts.map((part, index) => {
                    const linkMatch = part.match(/\[LINK:(.*?):LINK\]/)
                    if (linkMatch) {
                      const linkText = linkMatch[1]
                      const link = currentEmail.links?.find((l) => l.text === linkText)
                      if (link) {
                        return (
                          <EmailLink
                            key={index}
                            text={link.text}
                            displayUrl={link.displayUrl}
                            actualUrl={link.actualUrl}
                            isSuspicious={link.isSuspicious}
                          />
                        )
                      }
                    }
                    return <span key={index}>{part}</span>
                  })
                })()}
              </div>

              {/* Attachments section */}
              {currentEmail.attachments && currentEmail.attachments.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center mb-1">
                    <Paperclip className="w-4 h-4 mr-1 text-slate-400" />
                    <span className="text-sm font-medium">Attachments</span>
                  </div>
                  <div className="space-y-2">
                    {currentEmail.attachments.map((attachment, index) => (
                      <EmailAttachment
                        key={index}
                        name={attachment.name}
                        type={attachment.type}
                        size={attachment.size}
                        isSuspicious={attachment.isSuspicious}
                        suspiciousReason={attachment.suspiciousReason}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            {!showFeedback ? (
              <CardFooter className="flex justify-between pt-2 relative z-10">
                <Button
                  variant="outline"
                  className="w-[48%] border-green-500 text-green-600 hover:bg-green-50"
                  onClick={() => handleAnswer(false)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Legitimate
                </Button>
                <Button
                  variant="outline"
                  className="w-[48%] border-red-500 text-red-600 hover:bg-red-50"
                  onClick={() => handleAnswer(true)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Phishing
                </Button>
              </CardFooter>
            ) : (
              <CardFooter className="flex-col pt-2 relative z-10">
                <div
                  className={`w-full p-3 mb-3 rounded-md ${isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                >
                  <div className="flex items-center mb-2">
                    {isCorrect ? <CheckCircle className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />}
                    <span className="font-medium">{isCorrect ? "Correct!" : "Incorrect!"}</span>
                  </div>
                  <p className="text-sm">{currentEmail.explanation}</p>
                </div>
                <Button
                  onClick={nextEmail}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600"
                >
                  {currentEmailIndex < quickfireEmails.length - 1 ? "Next Email" : "Continue to Inbox Phase"}
                </Button>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
