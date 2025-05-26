"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowRight, CheckCircle, AlertTriangle, LinkIcon, Mail, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { useGameContext } from "./game-context"
import { labChallenges } from "@/data/lab-challenges"
import ParticleEffect from "./particle-effect"

export default function SecurityLab({ onComplete }: { onComplete: (score: number) => void }) {
  const [activeTab, setActiveTab] = useState("url-analyzer")
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [urlInput, setUrlInput] = useState("")
  const [urlAnalysis, setUrlAnalysis] = useState<any>(null)
  const [headerInput, setHeaderInput] = useState("")
  const [headerAnalysis, setHeaderAnalysis] = useState<any>(null)
  const [completed, setCompleted] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [particlePosition, setParticlePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const { addPoints, updateLabResults, addMissedFlag } = useGameContext()

  const currentChallenge = labChallenges[currentChallengeIndex]

  const handleSubmitAnswer = () => {
    if (!userAnswer) return

    const correct = userAnswer === currentChallenge.correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)

    if (correct) {
      addPoints(15)

      // Set particle position to center of card
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        setParticlePosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        })
        setShowParticles(true)
      }
    } else {
      // Add missed flag for incorrect answers
      addMissedFlag(currentChallenge.skill)
    }
  }

  const handleNextChallenge = () => {
    setShowParticles(false)

    if (currentChallengeIndex < labChallenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1)
      setUserAnswer(null)
      setShowFeedback(false)
    } else {
      // Calculate lab results
      const correctAnswers = labChallenges.filter((_, index) => {
        const challengeResult = index < currentChallengeIndex || (index === currentChallengeIndex && isCorrect)
        return challengeResult
      }).length

      updateLabResults(correctAnswers, labChallenges.length)
      setCompleted(true)
      onComplete(correctAnswers * 15) // Pass the score (15 points per correct challenge)
    }
  }

  const analyzeUrl = () => {
    if (!urlInput) return

    try {
      // Simple URL analysis logic
      const url = new URL(urlInput.startsWith("http") ? urlInput : `http://${urlInput}`)

      const analysis = {
        protocol: url.protocol,
        hostname: url.hostname,
        pathname: url.pathname,
        searchParams: Object.fromEntries(url.searchParams.entries()),
        suspicious: false,
        reasons: [] as string[],
      }

      // Check for suspicious patterns
      if (url.protocol === "http:") {
        analysis.suspicious = true
        analysis.reasons.push("Uses insecure HTTP protocol instead of HTTPS")
      }

      if (url.hostname.includes("ip-") || /\d+\.\d+\.\d+\.\d+/.test(url.hostname)) {
        analysis.suspicious = true
        analysis.reasons.push("Uses IP address instead of domain name")
      }

      // Check for typosquatting (common brand names with slight modifications)
      const typosquattingPatterns = [
        { brand: "paypal", pattern: /paypa[l1]|pay-?pal|payp[a@]l/i },
        { brand: "microsoft", pattern: /micr[o0]s[o0]ft|micro-soft|msft/i },
        { brand: "amazon", pattern: /amaz[o0]n|am[a@]z[o0]n|a-?mazon/i },
        { brand: "apple", pattern: /[a@]ppl[e3]|ap-?ple/i },
        { brand: "google", pattern: /g[o0][o0]gl[e3]|go-?ogle/i },
        { brand: "facebook", pattern: /f[a@]c[e3]b[o0][o0]k|face-?book/i },
      ]

      for (const { brand, pattern } of typosquattingPatterns) {
        if (pattern.test(url.hostname) && !url.hostname.includes(brand + ".com")) {
          analysis.suspicious = true
          analysis.reasons.push(`Possible typosquatting of ${brand}.com`)
          break
        }
      }

      // Check for suspicious subdomains
      if (url.hostname.split(".").length > 2) {
        const subdomains = url.hostname.split(".")
        const domain = subdomains.slice(-2).join(".")
        const subdomain = subdomains.slice(0, -2).join(".")

        const suspiciousSubdomainPatterns = [/secure/i, /login/i, /account/i, /banking/i, /verify/i, /auth/i, /signin/i]

        for (const pattern of suspiciousSubdomainPatterns) {
          if (pattern.test(subdomain)) {
            analysis.suspicious = true
            analysis.reasons.push(`Suspicious subdomain containing security-related terms (${subdomain})`)
            break
          }
        }

        // Check for brand names in subdomains that don't match the domain
        const brandInSubdomain = typosquattingPatterns.find(
          ({ brand }) => subdomain.toLowerCase().includes(brand) && !domain.toLowerCase().includes(brand),
        )

        if (brandInSubdomain) {
          analysis.suspicious = true
          analysis.reasons.push(`Contains ${brandInSubdomain.brand} in subdomain but different main domain`)
        }
      }

      if (url.hostname.includes("-") || (url.hostname.includes(".") && url.hostname.split(".").length > 3)) {
        analysis.suspicious = true
        analysis.reasons.push("Complex or unusual domain structure")
      }

      if (url.pathname.toLowerCase().includes("login") || url.pathname.toLowerCase().includes("signin")) {
        analysis.suspicious = true
        analysis.reasons.push("Path contains authentication-related keywords")
      }

      if (url.searchParams.has("redirect") || url.searchParams.has("url") || url.searchParams.has("link")) {
        analysis.suspicious = true
        analysis.reasons.push("Contains redirection parameters")
      }

      // Check for unusual TLDs for well-known brands
      const wellKnownDomains = [
        { name: "google", tlds: ["com", "co.uk", "ca", "de", "fr"] },
        { name: "microsoft", tlds: ["com", "net", "org"] },
        { name: "apple", tlds: ["com"] },
        { name: "amazon", tlds: ["com", "co.uk", "ca", "de", "fr"] },
        { name: "facebook", tlds: ["com", "net"] },
        { name: "paypal", tlds: ["com", "co.uk", "me"] },
      ]

      for (const { name, tlds } of wellKnownDomains) {
        const domainParts = url.hostname.split(".")
        const tld = domainParts[domainParts.length - 1]
        const secondLevel = domainParts[domainParts.length - 2]

        if (secondLevel === name && !tlds.includes(tld)) {
          analysis.suspicious = true
          analysis.reasons.push(
            `Unusual TLD (.${tld}) for ${name} - official domains use ${tlds.map((t) => `.${t}`).join(", ")}`,
          )
        }
      }

      setUrlAnalysis(analysis)
    } catch (error) {
      setUrlAnalysis({
        error: "Invalid URL format. Please enter a valid URL.",
        suspicious: true,
        reasons: ["Invalid URL format"],
      })
    }
  }

  const analyzeHeader = () => {
    if (!headerInput) return

    // Simple header analysis logic
    const lines = headerInput.split("\n").filter((line) => line.trim())

    const analysis = {
      from: "",
      returnPath: "",
      replyTo: "",
      receivedChain: [] as string[],
      dkim: "",
      spf: "",
      messageId: "",
      xMailer: "",
      suspicious: false,
      reasons: [] as string[],
    }

    lines.forEach((line) => {
      const lowerLine = line.toLowerCase()
      if (lowerLine.startsWith("from:")) {
        analysis.from = line.substring(5).trim()
      } else if (lowerLine.startsWith("return-path:")) {
        analysis.returnPath = line.substring(12).trim()
      } else if (lowerLine.startsWith("reply-to:")) {
        analysis.replyTo = line.substring(9).trim()
      } else if (lowerLine.startsWith("received:")) {
        analysis.receivedChain.push(line.substring(9).trim())
      } else if (lowerLine.includes("dkim=")) {
        analysis.dkim = lowerLine.includes("dkim=pass") ? "pass" : "fail"
      } else if (lowerLine.includes("spf=")) {
        analysis.spf = lowerLine.includes("spf=pass") ? "pass" : "fail"
      } else if (lowerLine.startsWith("message-id:")) {
        analysis.messageId = line.substring(11).trim()
      } else if (lowerLine.startsWith("x-mailer:")) {
        analysis.xMailer = line.substring(9).trim()
      }
    })

    // Check for suspicious patterns
    if (analysis.from && analysis.returnPath && !analysis.from.includes(analysis.returnPath.replace(/[<>]/g, ""))) {
      analysis.suspicious = true
      analysis.reasons.push("From address doesn't match Return-Path (potential spoofing)")

      // Extract domains for comparison
      const fromDomain = analysis.from.match(/@([^>]+)/)
      const returnPathDomain = analysis.returnPath.match(/@([^>]+)/)

      if (fromDomain && returnPathDomain && fromDomain[1] !== returnPathDomain[1]) {
        analysis.reasons.push(
          `From domain (${fromDomain[1]}) doesn't match Return-Path domain (${returnPathDomain[1]})`,
        )
      }
    }

    if (analysis.replyTo && analysis.from && !analysis.replyTo.includes(analysis.from.replace(/[<>]/g, ""))) {
      analysis.suspicious = true
      analysis.reasons.push("Reply-To doesn't match From address")

      // Extract domains for comparison
      const fromDomain = analysis.from.match(/@([^>]+)/)
      const replyToDomain = analysis.replyTo.match(/@([^>]+)/)

      if (fromDomain && replyToDomain && fromDomain[1] !== replyToDomain[1]) {
        analysis.reasons.push(`From domain (${fromDomain[1]}) doesn't match Reply-To domain (${replyToDomain[1]})`)
      }
    }

    if (analysis.dkim === "fail" || analysis.spf === "fail") {
      analysis.suspicious = true
      analysis.reasons.push(
        `Failed email authentication (${analysis.dkim === "fail" ? "DKIM" : ""}${analysis.dkim === "fail" && analysis.spf === "fail" ? " and " : ""}${analysis.spf === "fail" ? "SPF" : ""})`,
      )
    }

    // Check for suspicious X-Mailer values
    if (analysis.xMailer) {
      const suspiciousMailers = ["PHPMailer", "Mass Mailer", "Bulk Mailer"]
      for (const mailer of suspiciousMailers) {
        if (analysis.xMailer.includes(mailer)) {
          analysis.suspicious = true
          analysis.reasons.push(`Suspicious X-Mailer value (${mailer})`)
          break
        }
      }
    }

    // Check for suspicious Message-ID patterns
    if (analysis.messageId) {
      // Extract domain from Message-ID
      const messageIdDomain = analysis.messageId.match(/@([^>]+)/)
      const fromDomain = analysis.from.match(/@([^>]+)/)

      if (messageIdDomain && fromDomain && messageIdDomain[1] !== fromDomain[1]) {
        analysis.suspicious = true
        analysis.reasons.push(`Message-ID domain (${messageIdDomain[1]}) doesn't match From domain (${fromDomain[1]})`)
      }

      // Check for random-looking Message-IDs
      if (
        analysis.messageId.includes("random") ||
        /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/.test(analysis.messageId)
      ) {
        analysis.suspicious = true
        analysis.reasons.push("Message-ID has suspicious random-looking pattern")
      }
    }

    setHeaderAnalysis(analysis)
  }

  const correctAnswers = labChallenges.filter((_, index) => {
    const challengeResult = index < currentChallengeIndex || (index === currentChallengeIndex && isCorrect)
    return challengeResult
  }).length

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <ParticleEffect
        x={particlePosition.x}
        y={particlePosition.y}
        type={isCorrect ? "success" : "error"}
        isActive={showParticles}
        onComplete={() => {}}
      />

      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Phase 3: Security Lab
        </h2>
        <p className="text-gray-600">Master advanced techniques to identify forged emails and malicious URLs.</p>
      </div>

      {!completed ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="url-analyzer" className="flex items-center">
              <LinkIcon className="mr-2 h-4 w-4" />
              URL Analyzer
            </TabsTrigger>
            <TabsTrigger value="header-inspector" className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Header Inspector
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Challenges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url-analyzer" className="mt-0">
            <Card className="shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[50px] h-[50px] border-t-2 border-l-2 border-blue-200 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-[50px] h-[50px] border-t-2 border-r-2 border-blue-200 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-[50px] h-[50px] border-b-2 border-l-2 border-blue-200 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-[50px] h-[50px] border-b-2 border-r-2 border-blue-200 rounded-br-lg" />
              </div>

              <CardHeader className="relative z-10">
                <CardTitle>URL Security Analyzer</CardTitle>
                <CardDescription>Analyze URLs to identify phishing attempts and security risks</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="url-input">Enter a URL to analyze:</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="url-input"
                        placeholder="e.g., https://suspicious-site.com/login"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                      />
                      <Button
                        onClick={analyzeUrl}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Analyze
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                    <h4 className="font-medium text-blue-700 mb-2">Example URLs to Try</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-left justify-start h-auto py-1 text-xs"
                        onClick={() => setUrlInput("https://paypa1.com/account/verify")}
                      >
                        <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
                        paypa1.com (typosquatting)
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-left justify-start h-auto py-1 text-xs"
                        onClick={() => setUrlInput("http://bank-of-america.secure-login.com/signin")}
                      >
                        <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
                        Fake subdomain
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-left justify-start h-auto py-1 text-xs"
                        onClick={() => setUrlInput("https://accounts.google.com.verify-identity.tk/login")}
                      >
                        <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
                        Domain suffix manipulation
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-left justify-start h-auto py-1 text-xs"
                        onClick={() => setUrlInput("https://drive.google.com/file/d/1a2b3c/view?usp=sharing")}
                      >
                        <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                        Legitimate Google Drive URL
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-left justify-start h-auto py-1 text-xs"
                        onClick={() => setUrlInput("http://93.184.216.34/login.php")}
                      >
                        <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
                        IP address instead of domain
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-left justify-start h-auto py-1 text-xs"
                        onClick={() => setUrlInput("https://www.amazon.com/dp/B08N5M7S6K/")}
                      >
                        <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                        Legitimate Amazon product URL
                      </Button>
                    </div>
                  </div>

                  {urlAnalysis && (
                    <div className="mt-4 space-y-4">
                      {urlAnalysis.error ? (
                        <div className="p-4 rounded-md bg-red-50 border border-red-200">
                          <div className="flex items-start">
                            <AlertTriangle className="text-red-500 h-5 w-5 mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium text-red-700">{urlAnalysis.error}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label className="text-sm text-gray-500">Protocol</Label>
                              <div
                                className={`p-2 rounded text-sm ${urlAnalysis.protocol === "http:" ? "bg-red-50 text-red-700" : "bg-gray-50"}`}
                              >
                                {urlAnalysis.protocol}
                                {urlAnalysis.protocol === "http:" && (
                                  <div className="text-xs mt-1 flex items-center">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Insecure protocol
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-sm text-gray-500">Hostname</Label>
                              <div
                                className={`p-2 rounded text-sm ${urlAnalysis.suspicious ? "bg-amber-50" : "bg-gray-50"}`}
                              >
                                {urlAnalysis.hostname}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-sm text-gray-500">Path</Label>
                              <div className="p-2 bg-gray-50 rounded text-sm">{urlAnalysis.pathname || "/"}</div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-sm text-gray-500">Query Parameters</Label>
                              <div className="p-2 bg-gray-50 rounded text-sm">
                                {Object.keys(urlAnalysis.searchParams).length > 0
                                  ? Object.entries(urlAnalysis.searchParams).map(([key, value]) => (
                                      <div key={key}>
                                        <span className="font-medium">{key}:</span> {value as string}
                                      </div>
                                    ))
                                  : "None"}
                              </div>
                            </div>
                          </div>

                          <div
                            className={`p-4 rounded-md ${urlAnalysis.suspicious ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}
                          >
                            <div className="flex items-start">
                              {urlAnalysis.suspicious ? (
                                <AlertTriangle className="text-red-500 h-5 w-5 mr-2 mt-0.5" />
                              ) : (
                                <CheckCircle className="text-green-500 h-5 w-5 mr-2 mt-0.5" />
                              )}
                              <div>
                                <p
                                  className={`font-medium ${urlAnalysis.suspicious ? "text-red-700" : "text-green-700"}`}
                                >
                                  {urlAnalysis.suspicious ? "Potentially Malicious URL" : "URL Appears Safe"}
                                </p>
                                {urlAnalysis.suspicious && urlAnalysis.reasons.length > 0 && (
                                  <div className="mt-2">
                                    <p className="font-medium text-sm">Suspicious indicators:</p>
                                    <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                                      {urlAnalysis.reasons.map((reason, index) => (
                                        <li key={index}>{reason}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                        <h4 className="font-medium text-blue-700 mb-2">URL Security Tips</h4>
                        <ul className="space-y-1 pl-5 list-disc text-sm">
                          <li>Check for HTTPS (secure connection) before entering sensitive information</li>
                          <li>Verify the domain name is correct (watch for typos like "paypa1.com" vs "paypal.com")</li>
                          <li>Be wary of URLs with IP addresses instead of domain names</li>
                          <li>Hover over links before clicking to see the actual destination</li>
                          <li>Use URL shortener expanders to see the full destination of shortened links</li>
                          <li>
                            Look for unusual subdomains or domain patterns (e.g., legitimate-site.malicious-site.com)
                          </li>
                          <li>Check for excessive use of hyphens or numbers in domain names</li>
                          <li>Be suspicious of domains with unusual TLDs (Top-Level Domains) for well-known brands</li>
                        </ul>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                        <h4 className="font-medium text-slate-700 mb-2">Understanding URL Components</h4>
                        <div className="text-sm space-y-2">
                          <p>
                            <span className="font-medium">Protocol:</span> https:// or http:// - Always look for HTTPS
                            for secure connections
                          </p>
                          <p>
                            <span className="font-medium">Subdomain:</span> mail.example.com - "mail" is the subdomain
                          </p>
                          <p>
                            <span className="font-medium">Domain:</span> example.com - The main website identifier
                          </p>
                          <p>
                            <span className="font-medium">Path:</span> /account/login - Specific page or resource on the
                            website
                          </p>
                          <p>
                            <span className="font-medium">Query Parameters:</span> ?id=123&source=email - Additional
                            data passed to the page
                          </p>
                          <p>
                            <span className="font-medium">Fragment:</span> #section2 - Specific section within the page
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="header-inspector" className="mt-0">
            <Card className="shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[50px] h-[50px] border-t-2 border-l-2 border-blue-200 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-[50px] h-[50px] border-t-2 border-r-2 border-blue-200 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-[50px] h-[50px] border-b-2 border-l-2 border-blue-200 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-[50px] h-[50px] border-b-2 border-r-2 border-blue-200 rounded-br-lg" />
              </div>

              <CardHeader className="relative z-10">
                <CardTitle>Email Header Inspector</CardTitle>
                <CardDescription>Analyze email headers to detect spoofing and forgery attempts</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="header-input">Paste email headers to analyze:</Label>
                    <textarea
                      id="header-input"
                      className="w-full min-h-[150px] p-3 border rounded-md"
                      placeholder="From: sender@example.com
Return-Path: <different@attacker.com>
Reply-To: reply@example.com
Received: from mail.example.com
DKIM-Signature: v=1; a=rsa-sha256; d=example.com; s=selector;
Authentication-Results: spf=fail"
                      value={headerInput}
                      onChange={(e) => setHeaderInput(e.target.value)}
                    />
                    <Button
                      onClick={analyzeHeader}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Analyze Headers
                    </Button>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                    <h4 className="font-medium text-blue-700 mb-2">Example Headers to Try</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-left justify-start h-auto py-1 text-xs"
                        onClick={() =>
                          setHeaderInput(`From: support@paypal.com
Return-Path: <phishing@attacker.net>
Reply-To: support@paypal.com
Received: from mail.attacker.net (192.168.1.1)
DKIM-Signature: v=1; a=rsa-sha256; d=attacker.net; s=selector;
Authentication-Results: spf=fail;
Content-Type: text/html; charset=UTF-8
MIME-Version: 1.0`)
                        }
                      >
                        <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
                        Spoofed PayPal email (mismatched Return-Path)
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-left justify-start h-auto py-1 text-xs"
                        onClick={() =>
                          setHeaderInput(`From: notifications@mail.instagram.com
Return-Path: <notifications@mail.instagram.com>
Reply-To: notifications@mail.instagram.com
Received: from mail-sor-f41.google.com
DKIM-Signature: v=1; a=rsa-sha256; d=mail.instagram.com; s=selector;
Authentication-Results: spf=pass; dkim=pass;
Content-Type: multipart/alternative; boundary="boundary-string"
MIME-Version: 1.0`)
                        }
                      >
                        <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                        Legitimate Instagram notification
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-left justify-start h-auto py-1 text-xs"
                        onClick={() =>
                          setHeaderInput(`From: security@microsoft.com
Return-Path: <admin@mail-srv42.hostingprovider.net>
Reply-To: security-alert@microsoft-verify.com
Received: from unknown-ip-address (103.242.16.182)
Message-ID: <random-string-1686651300@mail-srv42.hostingprovider.net>
X-Mailer: PHPMailer 5.2.9
Content-Type: multipart/mixed; boundary=--boundary-string
MIME-Version: 1.0`)
                        }
                      >
                        <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
                        Spoofed Microsoft security alert
                      </Button>
                    </div>
                  </div>

                  {headerAnalysis && (
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-sm text-gray-500">From</Label>
                          <div className="p-2 bg-gray-50 rounded text-sm">{headerAnalysis.from || "Not found"}</div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-gray-500">Return-Path</Label>
                          <div
                            className={`p-2 rounded text-sm ${headerAnalysis.suspicious ? "bg-amber-50 text-amber-700" : "bg-gray-50"}`}
                          >
                            {headerAnalysis.returnPath || "Not found"}
                            {headerAnalysis.suspicious &&
                              headerAnalysis.from &&
                              headerAnalysis.returnPath &&
                              !headerAnalysis.from.includes(headerAnalysis.returnPath.replace(/[<>]/g, "")) && (
                                <div className="text-xs mt-1 flex items-center">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Doesn't match From address
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-gray-500">Reply-To</Label>
                          <div
                            className={`p-2 rounded text-sm ${headerAnalysis.replyTo && headerAnalysis.from && !headerAnalysis.replyTo.includes(headerAnalysis.from.replace(/[<>]/g, "")) ? "bg-amber-50 text-amber-700" : "bg-gray-50"}`}
                          >
                            {headerAnalysis.replyTo || "Not found"}
                            {headerAnalysis.replyTo &&
                              headerAnalysis.from &&
                              !headerAnalysis.replyTo.includes(headerAnalysis.from.replace(/[<>]/g, "")) && (
                                <div className="text-xs mt-1 flex items-center">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Doesn't match From address
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm text-gray-500">Authentication</Label>
                          <div className="p-2 bg-gray-50 rounded text-sm">
                            <div>
                              DKIM:{" "}
                              <span className={headerAnalysis.dkim === "pass" ? "text-green-600" : "text-red-600"}>
                                {headerAnalysis.dkim || "Unknown"}
                              </span>
                            </div>
                            <div>
                              SPF:{" "}
                              <span className={headerAnalysis.spf === "pass" ? "text-green-600" : "text-red-600"}>
                                {headerAnalysis.spf || "Unknown"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`p-4 rounded-md ${headerAnalysis.suspicious ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}
                      >
                        <div className="flex items-start">
                          {headerAnalysis.suspicious ? (
                            <AlertTriangle className="text-red-500 h-5 w-5 mr-2 mt-0.5" />
                          ) : (
                            <CheckCircle className="text-green-500 h-5 w-5 mr-2 mt-0.5" />
                          )}
                          <div>
                            <p
                              className={`font-medium ${headerAnalysis.suspicious ? "text-red-700" : "text-green-700"}`}
                            >
                              {headerAnalysis.suspicious
                                ? "Potentially Forged Email"
                                : "Email Headers Appear Legitimate"}
                            </p>
                            {headerAnalysis.suspicious && headerAnalysis.reasons.length > 0 && (
                              <div className="mt-2">
                                <p className="font-medium text-sm">Suspicious indicators:</p>
                                <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                                  {headerAnalysis.reasons.map((reason, index) => (
                                    <li key={index}>{reason}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                        <h4 className="font-medium text-blue-700 mb-2">Email Header Security Tips</h4>
                        <ul className="space-y-1 pl-5 list-disc text-sm">
                          <li>Check if the From address matches the Return-Path</li>
                          <li>Verify DKIM and SPF authentication results</li>
                          <li>Be suspicious if Reply-To differs from the sender</li>
                          <li>Examine the Received chain to trace the email's journey</li>
                          <li>Look for inconsistencies in domain names across headers</li>
                          <li>Check the Message-ID format - legitimate emails typically have consistent formats</li>
                          <li>Be wary of unusual X-Mailer values like PHPMailer (often used in phishing)</li>
                          <li>Verify that the sending server's IP address belongs to the claimed organization</li>
                        </ul>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                        <h4 className="font-medium text-slate-700 mb-2">Understanding Email Authentication</h4>
                        <div className="text-sm space-y-2">
                          <p>
                            <span className="font-medium">SPF (Sender Policy Framework):</span> Verifies that the
                            sending server is authorized to send email for the domain
                          </p>
                          <p>
                            <span className="font-medium">DKIM (DomainKeys Identified Mail):</span> Adds a digital
                            signature to verify the email wasn't altered in transit
                          </p>
                          <p>
                            <span className="font-medium">DMARC (Domain-based Message Authentication):</span> Combines
                            SPF and DKIM to provide clear policies for handling authentication failures
                          </p>
                          <p>
                            <span className="font-medium">Return-Path:</span> Specifies where bounced emails should be
                            sent, should match the sending domain
                          </p>
                          <p>
                            <span className="font-medium">Received Chain:</span> Shows the path an email took to reach
                            you, with timestamps and server information
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges" className="mt-0">
            <Card className="shadow-lg relative overflow-hidden" ref={cardRef}>
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[50px] h-[50px] border-t-2 border-l-2 border-blue-200 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-[50px] h-[50px] border-t-2 border-r-2 border-blue-200 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-[50px] h-[50px] border-b-2 border-l-2 border-blue-200 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-[50px] h-[50px] border-b-2 border-r-2 border-blue-200 rounded-br-lg" />
              </div>

              <CardHeader className="relative z-10">
                <CardTitle>Security Challenges</CardTitle>
                <CardDescription>Test your knowledge with real-world security scenarios</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                    <h3 className="font-medium text-lg mb-2">{currentChallenge.title}</h3>
                    <div className="mb-4">{currentChallenge.description}</div>

                    {currentChallenge.image && (
                      <div className="mb-4 border border-gray-200 rounded-md overflow-hidden">
                        <img
                          src={currentChallenge.image || "/placeholder.svg"}
                          alt={currentChallenge.title}
                          className="w-full object-contain"
                        />
                      </div>
                    )}

                    {!showFeedback && (
                      <RadioGroup value={userAnswer || ""} onValueChange={setUserAnswer} className="mt-4">
                        {currentChallenge.options.map((option) => (
                          <div key={option.value} className="flex items-start space-x-2 p-2 rounded hover:bg-gray-100">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <Label htmlFor={option.value} className="cursor-pointer flex-1">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}

                    {showFeedback && (
                      <div
                        className={`mt-4 p-4 rounded-md ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                      >
                        <div className="flex items-start">
                          {isCorrect ? (
                            <CheckCircle className="text-green-500 h-5 w-5 mr-2 mt-0.5" />
                          ) : (
                            <AlertTriangle className="text-red-500 h-5 w-5 mr-2 mt-0.5" />
                          )}
                          <div>
                            <p className={`font-medium ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                              {isCorrect ? "Correct!" : "Incorrect"}
                            </p>
                            <p className="text-sm mt-1">{currentChallenge.explanation}</p>
                            {currentChallenge.tip && (
                              <p className="text-sm mt-2">
                                <span className="font-medium">Tip:</span> {currentChallenge.tip}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2">
                    {!showFeedback ? (
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={!userAnswer}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Submit Answer
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNextChallenge}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {currentChallengeIndex < labChallenges.length - 1 ? "Next Challenge" : "Complete Lab"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-full flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md border border-gray-200 relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-[100px] h-[100px] border-t-2 border-l-2 border-blue-300 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-[100px] h-[100px] border-t-2 border-r-2 border-blue-300 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-[100px] h-[100px] border-b-2 border-l-2 border-blue-300 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-[100px] h-[100px] border-b-2 border-r-2 border-blue-300 rounded-br-xl" />
          </div>

          <CheckCircle className="h-16 w-16 text-green-500 mb-4 relative z-10" />
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 relative z-10">
            Security Lab Complete!
          </h3>
          <p className="text-gray-600 text-center mb-6 relative z-10">
            You've completed all phases of the Phish Defender training. Let's see your final results!
          </p>
          <Button
            onClick={() => onComplete(correctAnswers * 15)}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 relative z-10"
          >
            View Final Results
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </div>
  )
}
