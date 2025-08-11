"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { CheckCircle2 } from "lucide-react"
import { useResumeStore } from "@/store/resume-store"

export function DocumentUploadSmart() {
  const [status, setStatus] = useState<string>("")
  const { setResume } = useResumeStore()

  async function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setStatus(`Reading ${f.name}...`)
    try {
      let text = ""
      if (f.type === "text/plain" || f.name.endsWith(".txt")) {
        text = await f.text()
      } else if (f.type === "application/pdf" || f.name.endsWith(".pdf")) {
        text = await readPdf(f)
      } else if (
        f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        f.name.endsWith(".docx")
      ) {
        text = await readDocx(f)
      } else {
        setStatus("Unsupported file type. Please upload PDF, DOCX, or TXT.")
        return
      }
      const { parseResumeFromText } = await import("@/lib/resume-parser")
      const r = parseResumeFromText(text)
      setResume(r)
      setStatus("Parsed and filled form successfully.")
    } catch (err) {
      console.error(err)
      setStatus("Failed to parse file. Try TXT or paste content in the Import tab.")
    }
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <Label htmlFor="files">Upload your resume file (PDF, DOCX, TXT)</Label>
        <input
          id="files"
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={onSelect}
          className="block w-full rounded border p-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-800"
        />
        {status && (
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{status}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

async function readPdf(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist")
  ;(pdfjsLib as any).GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"

  const data = new Uint8Array(await file.arrayBuffer())
  const pdf = await (pdfjsLib as any).getDocument({ data }).promise
  let text = ""
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const strings = content.items.map((it: any) => it.str)
    text += strings.join(" ") + "\n"
  }
  return text
}

async function readDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth/mammoth.browser")
  const arrayBuffer = await file.arrayBuffer()
  const result = await (mammoth as any).extractRawText({ arrayBuffer })
  return String(result.value || "")
}
