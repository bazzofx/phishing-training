import { AlertTriangle, FileText, Link2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GameTips() {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
          Security Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="links">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="links" className="flex items-center">
              <Link2 className="w-4 h-4 mr-2" />
              Links
            </TabsTrigger>
            <TabsTrigger value="attachments" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Attachments
            </TabsTrigger>
          </TabsList>
          <TabsContent value="links" className="pt-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>
                  <strong>Always hover</strong> over links before clicking to see the actual destination URL
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>
                  Check if the URL <strong>matches the organization</strong> the email claims to be from
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>
                  Watch for <strong>misspelled domains</strong> (e.g., paypa1.com instead of paypal.com)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>
                  Be suspicious of <strong>URL shorteners</strong> or links that redirect multiple times
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>
                  Legitimate organizations rarely ask you to <strong>click links to log in</strong> - type the URL
                  directly instead
                </span>
              </li>
            </ul>
          </TabsContent>
          <TabsContent value="attachments" className="pt-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>
                  Be wary of <strong>unexpected attachments</strong>, even from known senders
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>
                  <strong>Double extensions</strong> (e.g., invoice.pdf.exe) are a red flag - the file is actually an
                  executable
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>
                  Files with <strong>macro extensions</strong> (.docm, .xlsm, .pptm) can contain malicious code
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>
                  <strong>Scan attachments</strong> with antivirus software before opening them
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>
                  If in doubt, <strong>contact the sender directly</strong> through a different channel to verify
                </span>
              </li>
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
