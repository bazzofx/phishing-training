"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Inbox,
  Mail,
  AlertCircle,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Paperclip,
  Search,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useGameContext, inboxEmails } from "./game-context"
import EmailLink from "./email-link"
import EmailAttachment from "./email-attachment"
import EmailHeaders from "./email-headers"
import ParticleEffect from "./particle-effect"

interface InboxPhaseProps {
  onComplete: (score: number) => void
}

export default function InboxPhase({ onComplete }: InboxPhaseProps) {
  const { addPoints, updateInboxResults, addMissedFlag } = useGameContext()
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)
  const [processedEmails, setProcessedEmails] = useState<Record<string, string>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [showParticles, setShowParticles] = useState(false)
  const [particlePosition, setParticlePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleSelectEmail = (emailId: string) => {
    setSelectedEmail(emailId)
    setShowFeedback(processedEmails[emailId] ? true : false)
    setShowParticles(false)
  }

  const handleAction = (action: "open" | "delete" | "report") => {
    const email = inboxEmails.find((e) => e.id === selectedEmail)
    if (!email) return

    let isActionCorrect = false

    if (email.isPhishing && action === "report") {
      isActionCorrect = true
    } else if (!email.isPhishing && action === "open") {
      isActionCorrect = true
    } else if (email.isPhishing && action === "delete") {
      // Deleting phishing is better than opening, but not as good as reporting
      isActionCorrect = true
    }

    setIsCorrect(isActionCorrect)
    setShowFeedback(true)

    // Defer state updates to avoid updating during render
    setTimeout(() => {
      if (isActionCorrect) {
        addPoints(action === "report" && email.isPhishing ? 15 : 10)
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
      } else if (email.redFlags) {
        // Add missed flags if the answer was wrong
        email.redFlags.forEach((flag) => addMissedFlag(flag))
      }

      // Mark email as processed
      setProcessedEmails((prev) => ({
        ...prev,
        [email.id]: action,
      }))
    }, 0)
  }

  const handleBackToInbox = () => {
    setSelectedEmail(null)
    setShowFeedback(false)
    setShowParticles(false)
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case "open":
        return "Opened"
      case "delete":
        return "Deleted"
      case "report":
        return "Reported"
      default:
        return ""
    }
  }

  const getActionColor = (action: string, isPhishing: boolean) => {
    if (isPhishing && action === "report") return "bg-green-100 text-green-700"
    if (isPhishing && action === "delete") return "bg-amber-100 text-amber-700"
    if (isPhishing && action === "open") return "bg-red-100 text-red-700"
    if (!isPhishing && action === "open") return "bg-green-100 text-green-700"
    if (!isPhishing && action === "delete") return "bg-red-100 text-red-700"
    if (!isPhishing && action === "report") return "bg-amber-100 text-amber-700"
    return "bg-slate-100 text-slate-700"
  }

  const filteredEmails = inboxEmails.filter(
    (email) =>
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const allEmailsProcessed = Object.keys(processedEmails).length === inboxEmails.length

  const handleComplete = () => {
    updateInboxResults(correctAnswers, inboxEmails.length)
    onComplete(correctAnswers * 15) // Pass the score (15 points per correct answer)
  }

  const currentEmail = inboxEmails.find((e) => e.id === selectedEmail)

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-4 relative">
      <ParticleEffect
        x={particlePosition.x}
        y={particlePosition.y}
        type={isCorrect ? "success" : "error"}
        isActive={showParticles}
        onComplete={() => {}}
      />

      <div className="w-full max-w-[1200px] mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <Inbox className="w-6 h-6 text-blue-500 mr-2" />
          <h2 className="text-xl font-bold">Inbox Defender</h2>
        </div>
        <div className="text-sm text-slate-500">
          {Object.keys(processedEmails).length} of {inboxEmails.length} emails processed
        </div>
      </div>

      <div className="w-full max-w-[1200px] flex">
        {/* Email List (1/3 of the screen) */}
        <div className="w-1/3 pr-4">
          <Card className="shadow-lg h-[70vh] flex flex-col relative overflow-hidden">
            {/* Decorative border */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-[50px] h-[50px] border-t-2 border-l-2 border-blue-200 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-[50px] h-[50px] border-t-2 border-r-2 border-blue-200 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-[50px] h-[50px] border-b-2 border-l-2 border-blue-200 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-[50px] h-[50px] border-b-2 border-r-2 border-blue-200 rounded-br-lg" />
            </div>

            <div className="p-3 border-b relative z-10">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search emails..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-grow relative z-10">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  className={`p-3 border-b cursor-pointer hover:bg-slate-50 transition-colors duration-150 ${
                    selectedEmail === email.id ? "bg-slate-100" : ""
                  } ${processedEmails[email.id] ? "opacity-70 bg-slate-50" : ""}`}
                  onClick={() => handleSelectEmail(email.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium truncate">{email.sender}</div>
                    <div className="text-xs text-slate-400 whitespace-nowrap">{email.date}</div>
                  </div>
                  <div className="text-sm font-medium truncate">{email.subject}</div>
                  <div className="text-xs text-slate-500 truncate">{email.preview}</div>
                  <div className="flex items-center mt-1">
                    {email.attachments && email.attachments.length > 0 && (
                      <Paperclip className="h-3 w-3 text-slate-400 mr-1" />
                    )}
                    {processedEmails[email.id] && (
                      <Badge
                        variant="outline"
                        className={`text-xs ml-auto ${getActionColor(processedEmails[email.id], email.isPhishing)}`}
                      >
                        {getActionLabel(processedEmails[email.id])}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {allEmailsProcessed && (
              <div className="p-3 border-t relative z-10">
                <Button
                  onClick={handleComplete}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600"
                >
                  Complete Inbox Phase
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Email Content (2/3 of the screen) */}
        <div className="w-2/3" ref={cardRef}>
          <Card className="shadow-lg h-[70vh] flex flex-col relative overflow-hidden">
            {/* Decorative border */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-[50px] h-[50px] border-t-2 border-l-2 border-blue-200 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-[50px] h-[50px] border-t-2 border-r-2 border-blue-200 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-[50px] h-[50px] border-b-2 border-l-2 border-blue-200 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-[50px] h-[50px] border-b-2 border-r-2 border-blue-200 rounded-br-lg" />
            </div>

            {!selectedEmail ? (
              <div className="flex items-center justify-center h-full text-slate-400 flex-col relative z-10">
                <Mail className="h-12 w-12 mb-2" />
                <p>Select an email to view</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedEmail + (showFeedback ? "-feedback" : "")}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full relative z-10"
                >
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center">
                      <Button variant="ghost" size="sm" className="p-0 mr-2" onClick={handleBackToInbox}>
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <div>
                        <h3 className="font-bold text-lg">{currentEmail?.subject}</h3>
                      </div>
                    </div>
                    {!showFeedback && (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600"
                          onClick={() => handleAction("open")}
                          disabled={processedEmails[selectedEmail!] !== undefined}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Open
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-slate-600"
                          onClick={() => handleAction("delete")}
                          disabled={processedEmails[selectedEmail!] !== undefined}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-amber-600"
                          onClick={() => handleAction("report")}
                          disabled={processedEmails[selectedEmail!] !== undefined}
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Report
                        </Button>
                      </div>
                    )}
                  </div>
                  {/* Email Headers */}
                  {currentEmail?.headers && (
                    <EmailHeaders
                      headers={currentEmail.headers}
                      senderEmail={currentEmail.senderEmail}
                      isPhishing={currentEmail.isPhishing}
                    />
                  )}
                  {/* Feedback section */}
                  {showFeedback && (
                    <div
                      className={`mt-4 p-3 rounded-md ${
                        isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        {isCorrect ? <CheckCircle className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />}
                        <span className="font-medium">{isCorrect ? "Good decision!" : "Not the best choice!"}</span>
                      </div>
                      <p className="text-sm">{currentEmail?.explanation}</p>

                      {currentEmail?.isPhishing && currentEmail.redFlags && (
                        <div className="mt-3">
                          <div className="flex items-center mb-1">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            <span className="font-medium">Red Flags:</span>
                          </div>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            {currentEmail.redFlags.map((flag, index) => (
                              <li key={index}>{flag}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-3 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className={isCorrect ? "text-green-700" : "text-red-700"}
                          onClick={handleBackToInbox}
                        >
                          Back to Inbox
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="p-4 overflow-y-auto flex-grow">
                    <div className="mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{currentEmail?.sender}</div>
                          <div className="text-sm text-slate-500">{currentEmail?.senderEmail}</div>
                        </div>
                        <div className="text-sm text-slate-400">{currentEmail?.date}</div>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    {/* Email body with interactive links */}
                    <div className="whitespace-pre-line mb-4">
                      {(() => {
                        if (!currentEmail) return null

                        // If the email has no links, just return the body text
                        if (!currentEmail.links || currentEmail.links.length === 0) {
                          return currentEmail.body
                        }

                        // If the email has links, replace the link text with the EmailLink component
                        let bodyWithLinks = currentEmail.body
                        currentEmail.links.forEach((link) => {
                          bodyWithLinks = bodyWithLinks.replace(link.text, `[LINK:${link.text}:LINK]`)
                        })

                        // Split by the link placeholders and map to components
                        const parts = bodyWithLinks.split(/(\[LINK:.*?:LINK\])/)
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

                    {processedEmails[selectedEmail!] && !showFeedback && (
                      <div
                        className={`mt-4 p-3 rounded-md ${
                          (currentEmail?.isPhishing && processedEmails[selectedEmail!] === "report") ||
                          (!currentEmail?.isPhishing && processedEmails[selectedEmail!] === "open")
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <AlertCircle className="w-5 h-5 mr-2" />
                          <span className="font-medium">You've already taken action on this email</span>
                        </div>
                        <p className="text-sm">
                          You marked this email as "{getActionLabel(processedEmails[selectedEmail!])}".
                          {currentEmail?.explanation && (
                            <>
                              <br />
                              <br />
                              {currentEmail.explanation}
                            </>
                          )}
                        </p>
                      </div>
                    )}

                    {/* Attachments section */}
                    {currentEmail?.attachments && currentEmail.attachments.length > 0 && (
                      <div className="mt-4 mb-4">
                        <div className="flex items-center mb-2">
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
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
