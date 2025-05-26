"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface EmailHeadersProps {
  headers: {
    returnPath: string
    spf: "pass" | "fail" | "neutral" | "none"
    dkim: "pass" | "fail" | "none"
    receivedFrom: string
    messageId: string
    xMailer?: string
    contentType: string
    mimeVersion: string
  }
  senderEmail: string
  isPhishing: boolean
}

export default function EmailHeaders({ headers, senderEmail, isPhishing }: EmailHeadersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getAuthIcon = (status: string) => {
    if (status === "pass") return <CheckCircle className="w-4 h-4 text-green-500" />
    if (status === "fail") return <XCircle className="w-4 h-4 text-red-500" />
    return <AlertCircle className="w-4 h-4 text-amber-500" />
  }

  const getAuthBadge = (status: string) => {
    if (status === "pass")
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Pass
        </Badge>
      )
    if (status === "fail")
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Fail
        </Badge>
      )
    if (status === "neutral")
      return (
        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
          Neutral
        </Badge>
      )
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
        None
      </Badge>
    )
  }

  const isReturnPathSuspicious = !headers.returnPath.includes(senderEmail.split("@")[1])

  return (
    <div className="mt-2 border rounded-md">
      <Button
        variant="ghost"
        className="w-full flex justify-between items-center p-3 h-auto"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <span className="font-medium text-sm">Email Headers</span>
          {isPhishing && <AlertCircle className="ml-2 w-4 h-4 text-amber-500" />}
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>

      {isExpanded && (
        <div className="p-3 text-sm space-y-3 bg-slate-50">
          <div className="grid grid-cols-3 gap-2">
            <div className="font-medium">Authentication</div>
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center">
                  {getAuthIcon(headers.spf)} <span className="ml-1">SPF:</span>
                </span>
                {getAuthBadge(headers.spf)}
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  {getAuthIcon(headers.dkim)} <span className="ml-1">DKIM:</span>
                </span>
                {getAuthBadge(headers.dkim)}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-2">
            <div className="font-medium">Return-Path</div>
            <div className={`col-span-2 break-all ${isReturnPathSuspicious ? "text-red-600 font-medium" : ""}`}>
              {headers.returnPath}
              {isReturnPathSuspicious && (
                <div className="text-xs mt-1 text-red-600">
                  <AlertCircle className="inline-block w-3 h-3 mr-1" />
                  Doesn't match sender domain ({senderEmail.split("@")[1]})
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-2">
            <div className="font-medium">Received From</div>
            <div className="col-span-2 break-all">{headers.receivedFrom}</div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-2">
            <div className="font-medium">Message-ID</div>
            <div className="col-span-2 break-all">{headers.messageId}</div>
          </div>

          {headers.xMailer && (
            <>
              <Separator />
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">X-Mailer</div>
                <div className="col-span-2">{headers.xMailer}</div>
              </div>
            </>
          )}

          <Separator />

          <div className="grid grid-cols-3 gap-2">
            <div className="font-medium">Content-Type</div>
            <div className="col-span-2">{headers.contentType}</div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="font-medium">MIME-Version</div>
            <div className="col-span-2">{headers.mimeVersion}</div>
          </div>
        </div>
      )}
    </div>
  )
}
