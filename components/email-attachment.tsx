"use client"

import { useState } from "react"
import { FileText, FileSpreadsheet, FileIcon as FilePresentation, AlertTriangle, File } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface EmailAttachmentProps {
  name: string
  type: string
  size: string
  isSuspicious: boolean
  suspiciousReason?: string
}

export default function EmailAttachment({ name, type, size, isSuspicious, suspiciousReason }: EmailAttachmentProps) {
  const [isHovering, setIsHovering] = useState(false)

  const getFileIcon = () => {
    if (name.endsWith(".pdf") || name.includes(".pdf.")) return <FileText className="w-5 h-5 text-red-500" />
    if (
      name.endsWith(".docx") ||
      name.endsWith(".doc") ||
      name.endsWith(".docm") ||
      name.includes(".docx.") ||
      name.includes(".doc.")
    )
      return <FileText className="w-5 h-5 text-blue-500" />
    if (
      name.endsWith(".xlsx") ||
      name.endsWith(".xls") ||
      name.endsWith(".xlsm") ||
      name.includes(".xlsx.") ||
      name.includes(".xls.")
    )
      return <FileSpreadsheet className="w-5 h-5 text-green-500" />
    if (
      name.endsWith(".pptx") ||
      name.endsWith(".ppt") ||
      name.endsWith(".pptm") ||
      name.includes(".pptx.") ||
      name.includes(".ppt.")
    )
      return <FilePresentation className="w-5 h-5 text-orange-500" />
    return <File className="w-5 h-5 text-slate-500" />
  }

  const hasMacros = name.endsWith(".docm") || name.endsWith(".xlsm") || name.endsWith(".pptm")
  const hasDoubleExtension =
    name.includes(".pdf.") || name.includes(".docx.") || name.includes(".doc.") || name.includes(".xlsx.")

  return (
    <TooltipProvider>
      <Tooltip open={isHovering}>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center p-2 rounded-md border ${
              isSuspicious ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50"
            } max-w-fit cursor-pointer`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {getFileIcon()}
            <div className="ml-2">
              <div className="text-sm font-medium flex items-center">
                {name}
                {isSuspicious && <AlertTriangle className="ml-1 w-4 h-4 text-amber-500" />}
              </div>
              <div className="text-xs text-slate-500">{size}</div>
            </div>
            {hasMacros && (
              <Badge variant="outline" className="ml-2 text-amber-600 border-amber-200">
                Macros
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[700px] p-2 z-[100] mt-[-150px]">
          <div className="text-xs">
            {isSuspicious ? (
              <div className="text-amber-600">
                <div className="font-semibold flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" /> Suspicious Attachment
                </div>
                <div className="mt-1">{suspiciousReason}</div>
              </div>
            ) : (
              <div className="text-green-600">This appears to be a legitimate attachment.</div>
            )}
            {hasMacros && !isSuspicious && (
              <div className="mt-1 text-amber-600">
                <span className="font-semibold">Note:</span> This file contains macros. Only open if you trust the
                sender and were expecting this file.
              </div>
            )}
            {hasDoubleExtension && (
              <div className="mt-1 text-red-600">
                <span className="font-semibold">Warning:</span> This file has a double extension, which is often used to
                disguise executable files.
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
