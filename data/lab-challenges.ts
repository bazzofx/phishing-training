export const labChallenges = [
  {
    id: "lc1",
    title: "Spot the Phishing URL",
    description: "Which of these URLs is most likely to be a phishing attempt?",
    options: [
      { value: "a", label: "https://www.amazon.com/account/settings" },
      { value: "b", label: "https://accounts-google.com/signin" },
      { value: "c", label: "https://www.bankofamerica.com/login" },
      { value: "d", label: "https://www.dropbox.com/s/file?dl=0" },
    ],
    correctAnswer: "b",
    explanation:
      "The URL 'accounts-google.com' is a fake domain designed to look like Google's. Legitimate Google URLs would use 'accounts.google.com' (note the dot instead of hyphen). This is a common phishing technique called domain spoofing.",
    tip: "Always check the domain name carefully. Attackers often use hyphens, extra words, or slight misspellings to create convincing fake domains.",
    skill: "Identifying spoofed domains",
    image: "/suspicious-google-login.png",
  },
  {
    id: "lc2",
    title: "Analyze the Email Header",
    description: "Review this email header snippet. What security issue does it reveal?",
    options: [
      { value: "a", label: "The email uses an unencrypted connection" },
      { value: "b", label: "The From address doesn't match the Return-Path (email spoofing)" },
      { value: "c", label: "The email failed DKIM verification" },
      { value: "d", label: "The email contains a suspicious attachment" },
    ],
    correctAnswer: "b",
    explanation:
      "When the From address doesn't match the Return-Path, it's a strong indicator of email spoofing. Legitimate emails typically have matching From and Return-Path addresses, while attackers often forge the From field to impersonate trusted senders.",
    tip: "Email headers contain valuable security information. The Return-Path shows where replies will actually go, which can reveal spoofing attempts.",
    skill: "Detecting email spoofing",
    image: "/email-header-mismatch.png",
  },
  {
    id: "lc3",
    title: "Secure vs. Insecure Links",
    description: "A colleague sent you a link to update your company profile. Which security issue should concern you?",
    options: [
      { value: "a", label: "The link uses HTTP instead of HTTPS" },
      { value: "b", label: "The link contains your username in the URL" },
      { value: "c", label: "The link redirects through to another website" },
      { value: "d", label: "All of the above" },
    ],
    correctAnswer: "d",
    explanation:
      "All three issues are security concerns. HTTP connections aren't encrypted, exposing your data. Including usernames in URLs can lead to information disclosure. URL shorteners hide the actual destination, which could be malicious.",
    tip: "Before clicking any link, check for HTTPS, avoid links with personal information in the URL, and be cautious with shortened URLs that hide the true destination.",
    skill: "Evaluating link security",
    image: "/insecure-http-warning.png",
  },
  {
    id: "lc4",
    title: "Deceptive Attachment",
    description: "You received an email with an attachment. Which file is most likely to contain malware?",
    options: [
      { value: "a", label: "Quarterly Report.pdf" },
      { value: "b", label: "Comany Photo.jpg" },
      { value: "c", label: "Monthly Summary.pdf.exe" },
      { value: "d", label: "Meeting Notes.one" },
    ],
    correctAnswer: "c",
    explanation:
      "The file 'invoice.docx.exe' is deceptive - it appears to be a Word document but is actually an executable (.exe) file. Attackers often use double extensions to trick users into thinking a file is a harmless document when it's actually malware.",
    tip: "Always check the full file extension before opening attachments. Windows may hide known extensions by default, so enable the option to view file extensions in your file explorer.",
    skill: "Identifying malicious attachments",
    image: "/suspicious-double-extension.png",
  },
  {
    id: "lc5",
    title: "Potential dangerous websites",
    description: "You visit your bank's website and see a potential malicious website warning in your browser. What should you do?",
    options: [
      { value: "a", label: "Proceed anyway - these warnings are common and usually nothing to worry about" },
      { value: "b", label: "Add a security exception and continue to the website" },
      { value: "c", label: "Try refreshing the page a few times to see if the warning disappears" },
      { value: "d", label: "Check if you have typed the url of correclty on the browser" },
    ],
    correctAnswer: "d",
    explanation:
      "Certificate warnings on banking sites are serious security concerns that could indicate a man-in-the-middle attack. The safest action is to stop and contact your bank through a verified channel like their official phone number to confirm if there's an issue with their website.",
    tip: "Never ignore certificate warnings, especially on financial websites. These warnings mean your connection isn't secure and could be intercepted by attackers.",
    skill: "Responding to security warnings",
    image: "/dangerous-link.png",
  }
]
