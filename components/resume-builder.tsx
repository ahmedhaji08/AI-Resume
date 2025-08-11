"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Download, Wand2 } from "lucide-react"

type ResumeForm = {
  fullName: string
  title: string
  summary: string
  skills: string
  experience: string
  targetRole: string
}

export function ResumeBuilder() {
  const [form, setForm] = useState<ResumeForm>({
    fullName: "",
    title: "",
    summary: "",
    skills: "",
    experience: "",
    targetRole: "",
  })
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  function onChange<K extends keyof ResumeForm>(key: K, val: ResumeForm[K]) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function generate() {
    setLoading(true)
    setResult("")
    try {
      const res = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setResult(data.text ?? "")
      toast({ title: "Resume generated", description: data.mode ? `Mode: ${data.mode}` : undefined })
      // Persist a simple "user" for admin demo
      addDemoUserActivity(form.fullName || "Anonymous", "resume_generated")
    } catch (e: any) {
      console.error(e)
      toast({ title: "Generation failed", description: "Please try again.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  function downloadTxt() {
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${form.fullName || "resume"}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="space-y-4 p-6">
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <Label htmlFor="title">Professional title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => onChange("title", e.target.value)}
              placeholder="Senior Data Analyst"
            />
          </div>
          <div>
            <Label htmlFor="summary">Professional summary</Label>
            <Textarea
              id="summary"
              value={form.summary}
              onChange={(e) => onChange("summary", e.target.value)}
              placeholder="3–4 lines outlining achievements & focus."
            />
          </div>
          <div>
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input
              id="skills"
              value={form.skills}
              onChange={(e) => onChange("skills", e.target.value)}
              placeholder="SQL, Python, Power BI, A/B testing"
            />
          </div>
          <div>
            <Label htmlFor="experience">Experience highlights</Label>
            <Textarea
              id="experience"
              value={form.experience}
              onChange={(e) => onChange("experience", e.target.value)}
              placeholder="Company, role, impact, metrics."
            />
          </div>
          <div>
            <Label htmlFor="targetRole">Target role</Label>
            <Input
              id="targetRole"
              value={form.targetRole}
              onChange={(e) => onChange("targetRole", e.target.value)}
              placeholder="Analytics Manager"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={generate} disabled={loading}>
              <Wand2 className="mr-2 h-4 w-4" />
              {loading ? "Generating..." : "Generate with AI"}
            </Button>
            <Button variant="outline" onClick={downloadTxt} disabled={!result}>
              <Download className="mr-2 h-4 w-4" />
              Export .txt
            </Button>
            <Badge variant="secondary" className="ml-auto">
              ATS‑friendly
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card aria-live="polite">
        <CardContent className="p-6">
          <Label className="text-sm font-medium text-zinc-700">AI Output</Label>
          <div className="mt-3 h-[520px] overflow-auto rounded border bg-white p-4 text-sm leading-relaxed">
            {result ? (
              <pre className="whitespace-pre-wrap">{result}</pre>
            ) : (
              <span className="text-zinc-500">{"Your AI‑generated resume will appear here."}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function addDemoUserActivity(name: string, action: string) {
  try {
    const key = "demo_users"
    const raw = localStorage.getItem(key)
    const users = raw ? (JSON.parse(raw) as any[]) : []
    const id = crypto.randomUUID()
    users.push({ id, name, action, ts: Date.now() })
    localStorage.setItem(key, JSON.stringify(users))
  } catch {}
}
