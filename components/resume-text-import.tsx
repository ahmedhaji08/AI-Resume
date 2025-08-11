"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useResumeStore } from "@/store/resume-store"

export function ImportFromText() {
  const [raw, setRaw] = useState("")
  const { setResume } = useResumeStore()

  async function parse() {
    const { parseResumeFromText } = await import("@/lib/resume-parser")
    const r = parseResumeFromText(raw)
    setResume(r)
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <Label htmlFor="raw">Paste your resume or LinkedIn export</Label>
        <Textarea
          id="raw"
          rows={14}
          placeholder="Paste your resume here (supports headings like Profile Summary, Education, Work Experience, Projects, Skills)..."
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
        />
        <div className="flex justify-end">
          <Button onClick={parse}>Parse & Fill</Button>
        </div>
      </CardContent>
    </Card>
  )
}
