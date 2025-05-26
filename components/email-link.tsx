"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EmailLinkProps {
  text: string
  displayUrl: string
  actualUrl: string
  isSuspicious: boolean
}

export default function EmailLink({ text, displayUrl, actualUrl, isSuspicious }: EmailLinkProps) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <TooltipProvider>
      <Tooltip open={isHovering}>
        <TooltipTrigger asChild>
          <span
            className={`inline-flex items-center ${
              isSuspicious ? "text-blue-600" : "text-blue-500"
            } hover:underline cursor-pointer`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={(e) => e.preventDefault()}
          >
            {text} <ExternalLink className="ml-1 w-3 h-3" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[300px] p-2">
          <div className="text-xs">
            <div className="font-semibold mb-1">Link destination:</div>
            <div className={`${isSuspicious ? "text-red-500" : "text-green-600"} break-all`}>{actualUrl}</div>
            {isSuspicious && displayUrl !== actualUrl && (
              <div className="mt-1 text-amber-600">
                <span className="font-semibold">Warning:</span> The actual URL doesn't match the displayed URL (
                {displayUrl})
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
