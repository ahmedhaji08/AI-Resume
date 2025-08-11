"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FileUp, Trash } from "lucide-react"

type FileEntry = { id: string; name: string; size: number; type: string }

export function DocumentUpload() {
  const [files, setFiles] = useState<FileEntry[]>([])

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files
    if (!f || !f.length) return
    const next: FileEntry[] = []
    Array.from(f).forEach((file) => {
      next.push({ id: crypto.randomUUID(), name: file.name, size: file.size, type: file.type })
    })
    setFiles((cur) => [...cur, ...next])
    try {
      const key = "demo_docs"
      const raw = localStorage.getItem(key)
      const docs = raw ? (JSON.parse(raw) as any[]) : []
      localStorage.setItem(key, JSON.stringify([...docs, ...next]))
    } catch {}
    // We keep content in memory only for privacy in demo.
  }

  function clear() {
    setFiles([])
    try {
      localStorage.removeItem("demo_docs")
    } catch {}
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <Label htmlFor="files">Upload documents</Label>
          <input
            id="files"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            multiple
            onChange={onSelect}
            className="block w-full rounded border p-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-800"
          />
          <p className="text-xs text-zinc-500">Supported: PDF, DOC, DOCX, TXT</p>
        </div>

        <div className="rounded border">
          <div className="flex items-center justify-between border-b px-3 py-2 text-sm">
            <span className="font-medium">Uploaded</span>
            <Button size="sm" variant="outline" onClick={clear}>
              <Trash className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
          <ul className="max-h-56 overflow-auto p-3 text-sm">
            {files.length === 0 && <li className="text-zinc-500">{"No files yet."}</li>}
            {files.map((f) => (
              <li key={f.id} className="flex items-center justify-between border-b py-2 last:border-0">
                <div className="flex items-center gap-2">
                  <FileUp className="h-4 w-4" />
                  <span>{f.name}</span>
                </div>
                <span className="text-zinc-500">{(f.size / 1024).toFixed(1)} KB</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
