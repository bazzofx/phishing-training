"use client"

import { motion } from "framer-motion"
import { Award, Shield, AlertTriangle, BookOpen, RefreshCw, LinkIcon, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useGameContext } from "./game-context"

interface ScorecardProps {
  onRestart: () => void
}

export default function Scorecard({ onRestart }: ScorecardProps) {
  const { score, quickfireResults, inboxResults, labResults, missedFlags } = useGameContext()

  const totalCorrect = quickfireResults.correct + inboxResults.correct + labResults.correct
  const totalQuestions = quickfireResults.total + inboxResults.total + labResults.total
  const successRate = Math.round((totalCorrect / totalQuestions) * 100) || 0

  // Get unique missed flags and count occurrences
  const uniqueFlags = missedFlags.reduce((acc: Record<string, number>, flag) => {
    acc[flag] = (acc[flag] || 0) + 1
    return acc
  }, {})

  // Sort flags by frequency
  const sortedFlags = Object.entries(uniqueFlags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5) // Top 5 missed flags

  // Determine skill level
  let skillLevel = "Novice"
  if (successRate >= 90) skillLevel = "Expert"
  else if (successRate >= 75) skillLevel = "Advanced"
  else if (successRate >= 60) skillLevel = "Intermediate"
  else if (successRate >= 40) skillLevel = "Beginner"

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[800px]"
      >
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-2">
              <Award className="w-12 h-12 text-amber-500" />
            </div>
            <CardTitle className="text-3xl font-bold text-slate-800">Your Phishing Defense Scorecard</CardTitle>
          </CardHeader>
          <CardContent className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Overall Score</h3>
                  <div className="text-4xl font-bold text-emerald-600">{score}</div>
                  <div className="mt-2 text-sm text-slate-500">
                    Skill Level: <span className="font-medium">{skillLevel}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-emerald-500 mr-2" />
                      <h3 className="font-medium">Success Rate</h3>
                    </div>
                    <span className="font-bold">{successRate}%</span>
                  </div>
                  <Progress value={successRate} className="h-2 mb-4" />

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-1 text-blue-500" />
                        <span>Quickfire Phase</span>
                      </div>
                      <span className="font-medium">
                        {quickfireResults.correct} / {quickfireResults.total} correct
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-blue-500" />
                        <span>Inbox Phase</span>
                      </div>
                      <span className="font-medium">
                        {inboxResults.correct} / {inboxResults.total} correct
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <LinkIcon className="w-4 h-4 mr-1 text-blue-500" />
                        <span>Security Lab</span>
                      </div>
                      <span className="font-medium">
                        {labResults.correct} / {labResults.total} correct
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
                    <h3 className="font-medium">Top Missed Red Flags</h3>
                  </div>

                  {sortedFlags.length > 0 ? (
                    <ul className="space-y-2">
                      {sortedFlags.map(([flag, count], index) => (
                        <li key={index} className="flex justify-between text-sm p-2 bg-slate-50 rounded">
                          <span>{flag}</span>
                          <span className="text-amber-600 font-medium">Missed {count}x</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 italic">Great job! You didn't miss any red flags.</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center mb-3">
                    <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
                    <h3 className="font-medium">Recommendations</h3>
                  </div>

                  <ul className="space-y-2 text-sm">
                    <li className="p-2 bg-slate-50 rounded">Always check the sender's email domain carefully</li>
                    <li className="p-2 bg-slate-50 rounded">Be suspicious of urgent requests or threats</li>
                    <li className="p-2 bg-slate-50 rounded">Hover over links before clicking to see the actual URL</li>
                    <li className="p-2 bg-slate-50 rounded">
                      Be cautious with attachments, especially those with double extensions or macros
                    </li>
                    <li className="p-2 bg-slate-50 rounded">Verify email authentication (SPF/DKIM) when suspicious</li>
                    <li className="p-2 bg-slate-50 rounded">
                      When in doubt, contact the sender through a different channel to verify
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-2">
            <Button onClick={onRestart} className="w-full max-w-[300px]">
              <RefreshCw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
