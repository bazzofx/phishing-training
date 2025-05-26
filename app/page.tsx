"use client"

import { useState } from "react"
import GameStart from "@/components/game-start"
import QuickfirePhase from "@/components/quickfire-phase"
import InboxPhase from "@/components/inbox-phase"
import SecurityLab from "@/components/security-lab"
import Scorecard from "@/components/scorecard"
import GameCompletion from "@/components/game-completion"
import { GameProvider, quickfireEmails, inboxEmails } from "@/components/game-context"
import { labChallenges } from "@/data/lab-challenges"

export default function Home() {
  const [gamePhase, setGamePhase] = useState<"start" | "quickfire" | "inbox" | "lab" | "scorecard">("start") //swap between "start" and "lab" to start directly in the lab phase
  const [showCompletion, setShowCompletion] = useState(false)
  const [completionData, setCompletionData] = useState({ score: 0, maxScore: 0 })

  const handleQuickfireComplete = (score: number) => {
    setCompletionData({
      score,
      maxScore: quickfireEmails.length * 10, // 10 points per correct answer
    })
    setShowCompletion(true)
    setTimeout(() => {
      setShowCompletion(false)
      setGamePhase("inbox")
    }, 5000) // Auto-continue after 5 seconds, or user can click continue
  }

  const handleInboxComplete = (score: number) => {
    setCompletionData({
      score,
      maxScore: inboxEmails.length * 15, // 15 points per correct answer (max for reporting phishing)
    })
    setShowCompletion(true)
    setTimeout(() => {
      setShowCompletion(false)
      setGamePhase("lab")
    }, 5000)
  }

  const handleLabComplete = (score: number) => {
    setCompletionData({
      score,
      maxScore: labChallenges.length * 15, // 15 points per correct challenge
    })
    setShowCompletion(true)
    setTimeout(() => {
      setShowCompletion(false)
      setGamePhase("scorecard")
    }, 5000)
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <GameProvider>
        <div className="container mx-auto px-4 py-8">
          {gamePhase === "start" && <GameStart onStart={() => setGamePhase("quickfire")} />}
          {gamePhase === "quickfire" && <QuickfirePhase onComplete={handleQuickfireComplete} />}
          {gamePhase === "inbox" && <InboxPhase onComplete={handleInboxComplete} />}
          {gamePhase === "lab" && <SecurityLab onComplete={handleLabComplete} />}
          {gamePhase === "scorecard" && <Scorecard onRestart={() => setGamePhase("start")} />}

          {showCompletion && (
            <GameCompletion
              score={completionData.score}
              maxScore={completionData.maxScore}
              onContinue={() => setShowCompletion(false)}
            />
          )}
        </div>
      </GameProvider>
    </main>
  )
}
