"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Email = {
  id: string
  sender: string
  senderEmail: string
  subject: string
  preview: string
  body: string
  date: string
  isPhishing: boolean
  redFlags?: string[]
  explanation?: string
  attachments?: {
    name: string
    type: string
    size: string
    isSuspicious: boolean
    suspiciousReason?: string
  }[]
  links?: {
    text: string
    displayUrl: string
    actualUrl: string
    isSuspicious: boolean
  }[]
  headers?: {
    returnPath: string
    spf: "pass" | "fail" | "neutral" | "none"
    dkim: "pass" | "fail" | "none"
    receivedFrom: string
    messageId: string
    xMailer?: string
    contentType: string
    mimeVersion: string
  }
}

type GameContextType = {
  score: number
  addPoints: (points: number) => void
  quickfireResults: { correct: number; total: number }
  updateQuickfireResults: (correct: number, total: number) => void
  inboxResults: { correct: number; total: number }
  updateInboxResults: (correct: number, total: number) => void
  labResults: { correct: number; total: number }
  updateLabResults: (correct: number, total: number) => void
  missedFlags: string[]
  addMissedFlag: (flag: string) => void
  timeSpent: number
  updateTimeSpent: (time: number) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [score, setScore] = useState(0)
  const [quickfireResults, setQuickfireResults] = useState({ correct: 0, total: 0 })
  const [inboxResults, setInboxResults] = useState({ correct: 0, total: 0 })
  const [labResults, setLabResults] = useState({ correct: 0, total: 0 })
  const [missedFlags, setMissedFlags] = useState<string[]>([])
  const [timeSpent, setTimeSpent] = useState(0)

  const addPoints = (points: number) => {
    setScore((prev) => prev + points)
  }

  const updateQuickfireResults = (correct: number, total: number) => {
    setQuickfireResults({ correct, total })
  }

  const updateInboxResults = (correct: number, total: number) => {
    setInboxResults({ correct, total })
  }

  const updateLabResults = (correct: number, total: number) => {
    setLabResults({ correct, total })
  }

  const addMissedFlag = (flag: string) => {
    setMissedFlags((prev) => [...prev, flag])
  }

  const updateTimeSpent = (time: number) => {
    setTimeSpent((prev) => prev + time)
  }

  return (
    <GameContext.Provider
      value={{
        score,
        addPoints,
        quickfireResults,
        updateQuickfireResults,
        inboxResults,
        updateInboxResults,
        labResults,
        updateLabResults,
        missedFlags,
        addMissedFlag,
        timeSpent,
        updateTimeSpent,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGameContext() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider")
  }
  return context
}

export const quickfireEmails: Email[] = [
  {
    id: "qf1",
    sender: "PayPal",
    senderEmail: "security@paypa1.com",
    subject: "Your account has been limited!",
    preview:
      "We've noticed some suspicious activity on your account. Please verify your information immediately to avoid...",
    body: "Dear valued customer, We've noticed some suspicious activity on your account. Please verify your information immediately to avoid account suspension. Click the link below to confirm your details:",
    date: "Today, 10:23 AM",
    isPhishing: true,
    redFlags: [
      "Urgent language",
      "Suspicious domain (paypa1 instead of paypal)",
      "Generic greeting",
      "Double extension file",
      "Suspicious link URL",
    ],
    explanation:
      "This is a phishing email. Notice the sender's email uses 'paypa1.com' (with the number 1) instead of 'paypal.com'. The urgent language is designed to make you act without thinking. The link appears to go to PayPal but actually goes to a malicious site.",
    links: [
      {
        text: "Verify Account Now",
        displayUrl: "https://www.paypa1.com/verify",
        actualUrl: "https://www.paypa1-secure.com/login.php",
        isSuspicious: true,
      },
    ],
    attachments: [
      {
        name: "Invoice.pdf.exe",
        type: "application/octet-stream",
        size: "1.2 MB",
        isSuspicious: true,
        suspiciousReason: "Double extension (.pdf.exe) - executable file disguised as a PDF",
      },
    ],
  },
  {
    id: "qf2",
    sender: "Microsoft 365",
    senderEmail: "noreply@microsoft.com",
    subject: "Your subscription is expiring soon",
    preview:
      "Your Microsoft 365 subscription will expire in 7 days. To continue using your services without interruption...",
    body: "Hello, Your Microsoft 365 subscription will expire in 7 days. To continue using your services without interruption, please renew your subscription from your account dashboard. Thank you for choosing Microsoft 365.",
    date: "Yesterday, 4:15 PM",
    isPhishing: false,
    explanation:
      "This is a legitimate email. The sender domain is correct, there's no urgent call to action, and it directs you to your account dashboard rather than providing a suspicious link.",
  },
  {
    id: "qf3",
    sender: "Amazon",
    senderEmail: "order-update@amazon.com",
    subject: "Your Amazon order #302-5839274-2983 has shipped",
    preview: "Your package has been shipped and is on its way. Estimated delivery date: Thursday, June 15...",
    body: "Hello, Your order #302-5839274-2983 has shipped and is on its way. Estimated delivery date: Thursday, June 15. You can track your package at any time by visiting Your Orders on Amazon.com. Thank you for shopping with us!",
    date: "Jun 12, 2:30 PM",
    isPhishing: false,
    explanation:
      "This is a legitimate email from Amazon. It includes specific order details, doesn't create urgency, and directs you to the official Amazon website.",
  },
  {
    id: "qf4",
    sender: "Netflix",
    senderEmail: "info@netf1ix-payments.com",
    subject: "Update your payment information",
    preview:
      "We're having trouble with your current payment method. To avoid service interruption, please update your...",
    body: "Dear Customer, We're having trouble with your current payment method. To avoid service interruption, please update your payment information immediately by clicking here:",
    date: "Jun 10, 9:45 AM",
    isPhishing: true,
    redFlags: [
      "Suspicious domain (netf1ix-payments.com)",
      "Generic greeting",
      "Creates urgency",
      "Suspicious link URL",
    ],
    explanation:
      "This is a phishing email. The domain 'netf1ix-payments.com' is not an official Netflix domain. Netflix would direct you to their official website, not a separate payment site. The link appears to go to Netflix but actually redirects to a phishing site.",
    links: [
      {
        text: "Update Payment Method",
        displayUrl: "https://www.netflix.com/account",
        actualUrl: "https://netf1ix-payments.com/update-billing.php",
        isSuspicious: true,
      },
    ],
  },
  {
    id: "qf5",
    sender: "HR Department",
    senderEmail: "hr@securecorp-inc.com",
    subject: "Important: Employee Benefits Update",
    preview:
      "Please review the attached document regarding changes to your employee benefits package effective next month...",
    body: "Dear Team Member, Please review the attached document regarding changes to your employee benefits package effective next month. If you have any questions, please contact the HR department. Thank you, HR Department",
    date: "Jun 8, 11:20 AM",
    isPhishing: false,
    explanation:
      "This appears to be a legitimate email from your company's HR department. The domain matches your company, and the content is relevant to all employees without creating false urgency.",
  },
  {
    id: "qf6",
    sender: "DocuSign",
    senderEmail: "dse@docusign.net",
    subject: "Document Ready for Signature",
    preview:
      "John Smith has sent you a document to review and sign. Please click the Review Document button to review and sign...",
    body: "DocuSign Electronic Signature Service\nJohn Smith has sent you a document to review and sign.\nPlease click the Review Document button to review and sign the document.\n[Review Document]",
    date: "Jun 7, 3:45 PM",
    isPhishing: false,
    explanation:
      "This is a legitimate email from DocuSign. The domain 'docusign.net' is one of DocuSign's official domains, and the format matches their standard notification emails.",
  },
  {
    id: "qf7",
    sender: "Apple",
    senderEmail: "no-reply@apple-invoice.com",
    subject: "Your receipt from Apple",
    preview: "Receipt for your recent purchase of iCloud+ subscription. Order ID: 9876543210...",
    body: "Dear Customer,\n\nThank you for your purchase.\nOrder ID: 9876543210\nDate: June 5, 2023\nProduct: iCloud+ (50GB)\nAmount: $0.99\n\nIf you did not make this purchase, please click here to dispute the charge:",
    date: "Jun 5, 10:15 AM",
    isPhishing: true,
    redFlags: [
      "Suspicious domain (apple-invoice.com instead of apple.com)",
      "Suspicious link",
      "Suspicious attachment",
    ],
    explanation:
      "This is a phishing email. Apple always sends receipts from apple.com domains, not third-party domains like 'apple-invoice.com'. The attachment is suspicious as it has a double extension (.pdf.exe) which is a common tactic to disguise executable files as documents.",
    links: [
      {
        text: "Dispute Charge",
        displayUrl: "https://support.apple.com/billing",
        actualUrl: "https://apple-invoice.com/dispute.php",
        isSuspicious: true,
      },
    ],
    attachments: [
      {
        name: "Receipt_9876543210.pdf.exe",
        type: "application/octet-stream",
        size: "1.2 MB",
        isSuspicious: true,
        suspiciousReason: "Double extension (.pdf.exe) - executable file disguised as a PDF",
      },
    ],
  },
  {
    id: "qf8",
    sender: "Google Security",
    senderEmail: "security-noreply@google.com",
    subject: "Security alert: New sign-in on Windows",
    preview: "New sign-in on Windows. We noticed a new sign-in to your Google Account on a Windows device...",
    body: "Google Security Alert\nNew sign-in on Windows\n\nWe noticed a new sign-in to your Google Account on a Windows device. If this was you, you don't need to do anything. If not, we'll help you secure your account.\n\n[Check Activity]",
    date: "Jun 3, 8:30 PM",
    isPhishing: false,
    explanation:
      "This is a legitimate security alert from Google. The domain is correct, and Google does send these types of notifications when new devices access your account.",
  },
  {
    id: "qf9",
    sender: "IT Support",
    senderEmail: "support@it-helpdesk-portal.com",
    subject: "Urgent: Password Reset Required",
    preview:
      "Due to a security breach, all employees must reset their passwords immediately. Click here to reset your password...",
    body: "ATTENTION ALL EMPLOYEES\n\nDue to a security breach, all employees must reset their passwords immediately. Failure to do so within 24 hours will result in account lockout.\n\n[Reset Password Now]",
    date: "Jun 2, 4:10 PM",
    isPhishing: true,
    redFlags: [
      "Suspicious domain",
      "Creates extreme urgency",
      "Threatens negative consequences",
      "Generic message to all employees",
    ],
    explanation:
      "This is a phishing email. Your IT department would use official company email domains, not a generic 'it-helpdesk-portal.com' domain. Also, legitimate password reset communications typically don't create such extreme urgency.",
  },
  {
    id: "qf10",
    sender: "LinkedIn",
    senderEmail: "messages-noreply@linkedin.com",
    subject: "John Smith has sent you a message",
    preview:
      "Hi there, I came across your profile and was impressed by your experience. I'd like to discuss a potential opportunity...",
    body: 'LinkedIn\n\nJohn Smith has sent you a message:\n\n"Hi there, I came across your profile and was impressed by your experience. I\'d like to discuss a potential opportunity at our company. Could we connect for a brief chat?"\n\n[View Message]',
    date: "Jun 1, 1:25 PM",
    isPhishing: false,
    explanation:
      "This is a legitimate email from LinkedIn. The domain 'linkedin.com' is correct, and the format matches LinkedIn's standard notification emails.",
  },
]

export const inboxEmails: Email[] = [
  {
    id: "in1",
    sender: "Chase Bank",
    senderEmail: "secure-message@chase.com",
    subject: "Important: Your account statement is ready",
    preview: "Your Chase account statement for May 2023 is now available. Please log in to your account to view...",
    body: "Dear Valued Customer,\n\nYour Chase account statement for May 2023 is now available. Please log in to your account to view your statement.\n\nTo ensure the security of your account, always access your account through chase.com or the Chase mobile app.\n\nThank you for banking with Chase.\n\nChase Customer Service",
    date: "Jun 15, 9:30 AM",
    isPhishing: false,
    explanation:
      "This is a legitimate email from Chase Bank. It directs you to log in through the official website rather than providing a direct link, which is a security best practice. The email headers show that SPF and DKIM checks passed, and the return path matches the sender domain.",
    links: [
      {
        text: "chase.com",
        displayUrl: "https://www.chase.com",
        actualUrl: "https://www.chase.com",
        isSuspicious: false,
      },
    ],
    headers: {
      returnPath: "bounce-back@chase.com",
      spf: "pass",
      dkim: "pass",
      receivedFrom: "mail-server.chase.com (10.242.16.182)",
      messageId: "<1686823800.16543.2983@mail-server.chase.com>",
      contentType: "multipart/alternative; boundary=--boundary-string",
      mimeVersion: "1.0",
    },
  },
  {
    id: "in2",
    sender: "Microsoft Teams",
    senderEmail: "msteams@email.teams.microsoft.com",
    subject: "You missed a Teams meeting: Weekly Project Update",
    preview:
      "You missed a Teams meeting that occurred on June 14, 2023 at 3:00 PM. Meeting title: Weekly Project Update...",
    body: "Microsoft Teams\n\nYou missed a Teams meeting\n\nWeekly Project Update\nWednesday, June 14, 2023\n3:00 PM - 4:00 PM\n\nOrganizer: Sarah Johnson\n\n[Join conversation] [View meeting details]",
    date: "Jun 14, 4:05 PM",
    isPhishing: false,
    explanation:
      "This is a legitimate notification from Microsoft Teams. The domain is correct, and the format matches standard Teams notifications. The email headers confirm this with passing SPF and DKIM checks.",
    headers: {
      returnPath: "no-reply@email.teams.microsoft.com",
      spf: "pass",
      dkim: "pass",
      receivedFrom: "mail-eopbgr110122.outbound.protection.outlook.com (40.107.91.122)",
      messageId: "<CY4PR01MB7592A8B4D9C8F0D69BC1D3B4A3782@CY4PR01MB7592.prod.exchangelabs.com>",
      contentType: "multipart/alternative; boundary=--boundary-string",
      mimeVersion: "1.0",
    },
  },
  {
    id: "in3",
    sender: "Dropbox",
    senderEmail: "no-reply@dropboxmail.com",
    subject: "David shared 'Q2 Financial Report' with you",
    preview: "David (david@securecorp-inc.com) has shared 'Q2 Financial Report' with you. Click here to view...",
    body: "Dropbox\n\nDavid (david@securecorp-inc.com) has shared 'Q2 Financial Report' with you\n\n[View folder]\n\nEnjoy!\nThe Dropbox Team",
    date: "Jun 14, 11:45 AM",
    isPhishing: false,
    explanation:
      "This is a legitimate email from Dropbox. The domain 'dropboxmail.com' is one of Dropbox's official sending domains for notifications. The link goes to the actual Dropbox domain and the attachment is a legitimate Excel file. The email headers show proper authentication.",
    links: [
      {
        text: "View folder",
        displayUrl: "https://www.dropbox.com/sh/abc123",
        actualUrl: "https://www.dropbox.com/sh/abc123",
        isSuspicious: false,
      },
    ],
    attachments: [
      {
        name: "Q2_Financial_Report.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: "2.4 MB",
        isSuspicious: false,
      },
    ],
    headers: {
      returnPath: "bounces+12345@dropboxmail.com",
      spf: "pass",
      dkim: "pass",
      receivedFrom: "mta-219.sfo.dropboxmail.com (63.146.102.219)",
      messageId: "<01020189a7b9c123-45678901-2345-6789-0123-456789012345-000000@us-west-2.amazonses.com>",
      contentType: "multipart/mixed; boundary=--boundary-string",
      mimeVersion: "1.0",
    },
  },
  {
    id: "in4",
    sender: "IT Department",
    senderEmail: "it-support@securecorp-inc.com",
    subject: "ACTION REQUIRED: Install Security Update",
    preview:
      "All employees must install the latest security update by end of day. Please follow the instructions below...",
    body: "Dear Colleague,\n\nOur security team has released an important update that must be installed on all company devices by end of day today.\n\nPlease follow these steps:\n1. Save all your work\n2. Click the 'Check for Updates' option in your system settings\n3. Install all available updates\n4. Restart your computer\n\nIf you have any issues, please contact the IT helpdesk.\n\nThank you,\nIT Department",
    date: "Jun 14, 10:20 AM",
    isPhishing: false,
    explanation:
      "This is a legitimate email from your company's IT department. The domain matches your company, and the instructions direct you to use system settings rather than clicking external links. The email headers confirm it originated from your company's mail server.",
    headers: {
      returnPath: "it-support@securecorp-inc.com",
      spf: "pass",
      dkim: "pass",
      receivedFrom: "mail.securecorp-inc.com (192.168.1.10)",
      messageId: "<20230614102045.12345@securecorp-inc.com>",
      contentType: "text/plain; charset=UTF-8",
      mimeVersion: "1.0",
    },
  },
  {
    id: "in5",
    sender: "Adobe Document Cloud",
    senderEmail: "message@adobesign.com",
    subject: "Document completed: 'Vendor Agreement'",
    preview:
      "The document 'Vendor Agreement' has been completed by all parties. You can view the completed document...",
    body: "Adobe Sign\n\nHello,\n\nThe document 'Vendor Agreement' has been completed by all parties.\n\nThis is an automated email from Adobe Sign.",
    date: "Jun 13, 3:50 PM",
    isPhishing: false,
    explanation:
      "This is a legitimate email from Adobe Sign. The domain 'adobesign.com' is Adobe's official domain for their e-signature service. The link goes to the actual Adobe domain and the attachment is a legitimate PDF document. The email headers show proper authentication.",
    links: [
      {
        text: "View completed document",
        displayUrl: "https://documentcloud.adobe.com/link/abc123",
        actualUrl: "https://documentcloud.adobe.com/link/abc123",
        isSuspicious: false,
      },
    ],
    attachments: [
      {
        name: "Vendor_Agreement_Signed.pdf",
        type: "application/pdf",
        size: "1.8 MB",
        isSuspicious: false,
      },
    ],
    headers: {
      returnPath: "message@adobesign.com",
      spf: "pass",
      dkim: "pass",
      receivedFrom: "mta-216.adobesign.com (66.235.61.216)",
      messageId: "<01020189a7b9c123-45678901-2345-6789-0123-456789012345-000000@us-west-2.amazonses.com>",
      contentType: "multipart/mixed; boundary=--boundary-string",
      mimeVersion: "1.0",
    },
  },
  {
    id: "in6",
    sender: "Office 365 Service",
    senderEmail: "office365@microsoft-verify.com",
    subject: "Your Office 365 password will expire today",
    preview:
      "Your Office 365 password will expire in 8 hours. To continue using Office 365 without interruption, please update...",
    body: "ATTENTION: Your Office 365 password will expire today\n\nYour Office 365 password will expire in 8 hours. To continue using Office 365 without interruption, please update your password immediately.\n\nIf you do not update your password, your account will be locked and you will lose access to your emails and documents.\n\nThank you,\nOffice 365 Support Team",
    date: "Jun 13, 9:15 AM",
    isPhishing: true,
    redFlags: [
      "Suspicious domain (microsoft-verify.com instead of microsoft.com)",
      "Creates urgency",
      "Threatens negative consequences",
      "Suspicious link URL",
      "Suspicious attachment with macros",
      "SPF authentication failure",
      "Return path doesn't match sender domain",
    ],
    explanation:
      "This is a phishing email. Microsoft would never use a domain like 'microsoft-verify.com' for official communications. Password expiration notices would come from your IT department or through the Office 365 portal itself. The attachment contains macros (.docm) which can execute malicious code when opened. The email headers reveal that the email actually originated from a different domain than claimed, and SPF authentication failed.",
    links: [
      {
        text: "Update Password Now",
        displayUrl: "https://login.microsoftonline.com",
        actualUrl: "https://microsoft-verify.com/reset-pw.php",
        isSuspicious: true,
      },
    ],
    attachments: [
      {
        name: "Password_Reset_Instructions.docm",
        type: "application/vnd.ms-word.document.macroEnabled.12",
        size: "756 KB",
        isSuspicious: true,
        suspiciousReason: "Document with macros (.docm) - can contain malicious code",
      },
    ],
    headers: {
      returnPath: "admin@mail-srv42.hostingprovider.net",
      spf: "fail",
      dkim: "none",
      receivedFrom: "unknown-ip-address (103.242.16.182)",
      messageId: "<random-string-1686651300@mail-srv42.hostingprovider.net>",
      xMailer: "PHPMailer 5.2.9",
      contentType: "multipart/mixed; boundary=--boundary-string",
      mimeVersion: "1.0",
    },
  },
  {
    id: "in7",
    sender: "Zoom",
    senderEmail: "no-reply@zoom.us",
    subject: "Cloud Recording: Project Discussion is now available",
    preview: "Your cloud recording is now available. Topic: Project Discussion. Date: Jun 12, 2023...",
    body: "Hi there,\n\nYour cloud recording is now available.\n\nTopic: Project Discussion\nDate: Jun 12, 2023\nMeeting Recording: [View Recording]\n\nThank you for using Zoom!\nThe Zoom Team",
    date: "Jun 12, 5:30 PM",
    isPhishing: false,
    explanation:
      "This is a legitimate email from Zoom. The domain 'zoom.us' is Zoom's official domain, and the format matches their standard notification emails. The email headers confirm this with passing SPF and DKIM checks.",
    links: [
      {
        text: "View Recording",
        displayUrl: "https://zoom.us/rec/share/abc123",
        actualUrl: "https://zoom.us/rec/share/abc123",
        isSuspicious: false,
      },
    ],
    headers: {
      returnPath: "no-reply@zoom.us",
      spf: "pass",
      dkim: "pass",
      receivedFrom: "zoommail.zoom.us (192.168.10.10)",
      messageId: "<01020189a7b9c123-45678901-2345-6789-0123-456789012345-000000@amazonses.com>",
      contentType: "multipart/alternative; boundary=--boundary-string",
      mimeVersion: "1.0",
    },
  },
  {
    id: "in8",
    sender: "UPS Delivery",
    senderEmail: "ups-tracking@delivery-status.net",
    subject: "UPS Shipment 1Z9999999999999999 Delivery Exception",
    preview: "Your package has encountered a delivery exception. Action is required to complete the delivery...",
    body: "UPS Delivery Notification\n\nYour package with tracking number 1Z9999999999999999 has encountered a delivery exception.\n\nReason: Address information is incorrect.\n\nAction Required: Please confirm your delivery address by clicking the link below within 24 hours, or your package will be returned to sender.\n\nThank you for choosing UPS.",
    date: "Jun 12, 11:40 AM",
    isPhishing: true,
    redFlags: [
      "Suspicious domain (delivery-status.net instead of ups.com)",
      "Creates urgency",
      "Requests personal information",
      "Suspicious link URL",
      "Suspicious attachment with double extension",
      "SPF authentication failure",
      "Return path doesn't match sender domain",
      "DKIM signature missing",
    ],
    explanation:
      "This is a phishing email. UPS sends delivery notifications from ups.com domains, not third-party domains like 'delivery-status.net'. Also, UPS would typically direct you to their official website rather than asking you to click a link to confirm your address. The attachment has a double extension (.docx.exe) which is a common tactic to disguise executable files as documents. The email headers reveal that the email actually originated from a suspicious IP address, and both SPF and DKIM authentication failed.",
    links: [
      {
        text: "Confirm Delivery Address",
        displayUrl: "https://www.ups.com/tracking",
        actualUrl: "https://delivery-status.net/confirm.php?id=12345",
        isSuspicious: true,
      },
    ],
    attachments: [
      {
        name: "Delivery_Information.docx.exe",
        type: "application/octet-stream",
        size: "3.2 MB",
        isSuspicious: true,
        suspiciousReason: "Double extension (.docx.exe) - executable file disguised as a document",
      },
    ],
    headers: {
      returnPath: "tracking@mail.delivery-status.net",
      spf: "fail",
      dkim: "none",
      receivedFrom: "unknown-server (45.132.192.45)",
      messageId: "<random-string-1686565200@mail.delivery-status.net>",
      xMailer: "PHPMailer 5.2.9",
      contentType: "multipart/mixed; boundary=--boundary-string",
      mimeVersion: "1.0",
    },
  },
  {
    id: "in9",
    sender: "Slack",
    senderEmail: "notifications@slack.com",
    subject: "New message from Sarah in #general",
    preview: "Sarah: Has everyone submitted their weekly reports? The deadline is today at 5 PM...",
    body: "Slack\n\nNew message from Sarah in #general\n\nSarah: Has everyone submitted their weekly reports? The deadline is today at 5 PM.\n\n[Reply in Slack]",
    date: "Jun 12, 10:05 AM",
    isPhishing: false,
    explanation:
      "This is a legitimate notification from Slack. The domain 'slack.com' is correct, and the format matches standard Slack notifications. The email headers confirm this with passing SPF and DKIM checks.",
    links: [
      {
        text: "Reply in Slack",
        displayUrl: "https://securecorp-inc.slack.com/archives/C01234ABCDE/p1686565500",
        actualUrl: "https://securecorp-inc.slack.com/archives/C01234ABCDE/p1686565500",
        isSuspicious: false,
      },
    ],
    headers: {
      returnPath: "bounces+12345@slack.com",
      spf: "pass",
      dkim: "pass",
      receivedFrom: "mail-eopbgr110122.outbound.slack.com (40.107.91.122)",
      messageId: "<01020189a7b9c123-45678901-2345-6789-0123-456789012345-000000@amazonses.com>",
      contentType: "multipart/alternative; boundary=--boundary-string",
      mimeVersion: "1.0",
    },
  },
  {
    id: "in10",
    sender: "Internal Audit",
    senderEmail: "internal-audit@securecorp-inc.com",
    subject: "Confidential: Expense Report Review",
    preview: "Please review the attached expense report discrepancies that require your immediate attention...",
    body: "Dear Colleague,\n\nOur internal audit team has identified some discrepancies in recent expense reports that require your immediate attention.\n\nPlease review the attached document and respond with an explanation for the highlighted items by end of day tomorrow.\n\nThank you for your cooperation.\n\nInternal Audit Team",
    date: "Jun 11, 2:15 PM",
    isPhishing: true,
    redFlags: [
      "Forged sender email",
      "Return path doesn't match sender domain",
      "SPF authentication failure",
      "DKIM signature missing",
      "Creates urgency",
      "Suspicious attachment",
    ],
    explanation:
      "This is a sophisticated phishing email that appears to come from your company's internal audit team. However, the email headers reveal that it actually originated from an external server, not your company's mail server. The SPF check failed, indicating the sender is not authorized to send from your company's domain. This is a common tactic in business email compromise attacks.",
    attachments: [
      {
        name: "Expense_Discrepancies.xlsm",
        type: "application/vnd.ms-excel.sheet.macroEnabled.12",
        size: "1.5 MB",
        isSuspicious: true,
        suspiciousReason: "Excel file with macros (.xlsm) - can contain malicious code",
      },
    ],
    headers: {
      returnPath: "audit@mail-srv15.hostingcompany.com",
      spf: "fail",
      dkim: "none",
      receivedFrom: "unknown-server (91.234.55.18)",
      messageId: "<random-string-1686489300@mail-srv15.hostingcompany.com>",
      xMailer: "Microsoft Outlook 16.0",
      contentType: "multipart/mixed; boundary=--boundary-string",
      mimeVersion: "1.0",
    },
  },
]
