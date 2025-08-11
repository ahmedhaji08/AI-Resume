"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Linkedin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useResumeStore } from "@/store/resume-store"

export function LinkedinImport() {
  const { toast } = useToast()
  const [profileUrl, setProfileUrl] = useState("")
  const [pasted, setPasted] = useState("")
  const { setResume } = useResumeStore()

  async function parseFromText() {
    const { parseResumeFromText } = await import("@/lib/resume-parser")
    const r = parseResumeFromText(pasted)
    setResume(r)
    toast({ title: "LinkedIn data parsed", description: "Form and preview updated." })
  }

  function noteUrl() {
    if (!profileUrl) return
    toast({ title: "Profile URL saved", description: "For production, enable LinkedIn OAuth to fetch data." })
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="space-y-4 p-6">
          <div>
            <Label htmlFor="url">LinkedIn profile URL (optional)</Label>
            <div className="mt-2 flex gap-2">
              <Input
                id="url"
                placeholder="https://www.linkedin.com/in/your-handle"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
              />
              <Button variant="outline" onClick={noteUrl}>
                <Linkedin className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              This demo supports pasted LinkedIn content and file uploads. OAuth can be added for live fetches.
            </p>
          </div>
          <div>
            <Label htmlFor="paste">Paste LinkedIn export or profile content</Label>
            <Textarea
              id="paste"
              rows={10}
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              placeholder="Paste your LinkedIn data here..."
            />
          </div>
          <Button onClick={parseFromText}>
            <FileText className="mr-2 h-4 w-4" />
            Parse & Fill
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <Label className="text-sm font-medium text-zinc-700">Tips</Label>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-600">
            <li>Copy sections like About, Experience, Education, Projects, and Skills from your profile.</li>
            <li>After parsing, review bullets and add metrics for maximum impact.</li>
            <li>Export to DOCX and upload to LinkedIn’s resume tool.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
