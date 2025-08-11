"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, Globe, Github, Linkedin } from "lucide-react"
import { useResumeStore } from "@/store/resume-store"
import {saveAs} from "file-saver"
import { Document, Packer, Paragraph, HeadingLevel, AlignmentType } from "docx"
import { useRef } from "react"

export function ResumePreview() {
  const { resume } = useResumeStore()
  const printRef = useRef<HTMLDivElement>(null)

  function formatLine() {
    const c = resume.contact
    const parts = [
      c.email ? ` ${c.email}` : null,
      c.phone ? ` ${c.phone}` : null,
      c.linkedin ? ` ${c.linkedin}` : null,
      c.github ? ` ${c.github}` : null,
      c.website ? ` ${c.website}` : null,
    ].filter(Boolean)
    return parts.join("  |  ")
  }

  async function exportDocx() {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: resume.contact.fullName || "Your Name",
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: formatLine(),
              alignment: AlignmentType.CENTER,
            }),
            ...(resume.summary
              ? [
                  new Paragraph({ text: "" }),
                  new Paragraph({ text: "Profile Summary", heading: HeadingLevel.HEADING_2 }),
                  new Paragraph(resume.summary || ""),
                ]
              : []),
            ...(resume.skills?.length
              ? [
                  new Paragraph({ text: "" }),
                  new Paragraph({ text: "Skills", heading: HeadingLevel.HEADING_2 }),
                  new Paragraph(resume.skills.join(", ")),
                ]
              : []),
            ...(resume.education.length
              ? [
                  new Paragraph({ text: "" }),
                  new Paragraph({ text: "Education", heading: HeadingLevel.HEADING_2 }),
                  ...resume.education.flatMap((e) => [
                    new Paragraph({ text: `${e.degree} — ${e.school}` }),
                    new Paragraph({
                      text: [e.start, e.end].filter(Boolean).join(" – ") + (e.grade ? ` | ${e.grade}` : ""),
                    }),
                  ]),
                ]
              : []),
            ...(resume.experience.length
              ? [
                  new Paragraph({ text: "" }),
                  new Paragraph({ text: "Work Experience", heading: HeadingLevel.HEADING_2 }),
                  ...resume.experience.flatMap((ex) => [
                    new Paragraph({
                      text: `${ex.title} — ${ex.company} ${[ex.start, ex.end].filter(Boolean).join(" – ")}`,
                    }),
                    ...ex.bullets.map((b) => new Paragraph({ text: "• " + b })),
                  ]),
                ]
              : []),
            ...(resume.projects.length
              ? [
                  new Paragraph({ text: "" }),
                  new Paragraph({ text: "Projects", heading: HeadingLevel.HEADING_2 }),
                  ...resume.projects.flatMap((p) => [
                    new Paragraph({ text: `${p.name}${p.period ? ` — ${p.period}` : ""}` }),
                    new Paragraph({ text: p.summary || "" }),
                  ]),
                ]
              : []),
          ],
        },
      ],
    })
    const blob = await Packer.toBlob(doc)
    saveAs(blob, `${resume.contact.fullName || "resume"}.docx`)
  }

  function printPDF() {
    if (!printRef.current) return
    window.print()
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Preview — LinkedIn Clean</h3>
          <div className="flex gap-2">
            <Button variant="outline" onClick={printPDF}>
              Export PDF (Print)
            </Button>
            <Button onClick={exportDocx}>Export DOCX</Button>
          </div>
        </div>
        <div
          ref={printRef}
          className="mx-auto w-full max-w-[820px] rounded border bg-white p-8 text-sm leading-6 print:rounded-none print:border-0 print:p-0"
        >
          <header className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{resume.contact.fullName || "Your Name"}</h1>
            <p className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-zinc-600">
              {resume.contact.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {resume.contact.email}
                </span>
              )}
              {resume.contact.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {resume.contact.phone}
                </span>
              )}
              {resume.contact.linkedin && (
                <span className="flex items-center gap-1">
                  <Linkedin className="h-3.5 w-3.5" />
                  {resume.contact.linkedin}
                </span>
              )}
              {resume.contact.github && (
                <span className="flex items-center gap-1">
                  <Github className="h-3.5 w-3.5" />
                  {resume.contact.github}
                </span>
              )}
              {resume.contact.website && (
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" />
                  {resume.contact.website}
                </span>
              )}
            </p>
          </header>

          {resume.summary && (
            <>
              <SectionTitle>Profile Summary</SectionTitle>
              <p className="text-zinc-800">{resume.summary}</p>
            </>
          )}

          {resume.skills && resume.skills.length > 0 && (
            <>
              <SectionTitle>Skills</SectionTitle>
              <p className="text-zinc-800">{resume.skills.join(", ")}</p>
            </>
          )}

          {resume.education.length > 0 && (
            <>
              <SectionTitle>Education</SectionTitle>
              <div className="space-y-3">
                {resume.education.map((e, i) => (
                  <div key={i}>
                    <div className="font-medium">{e.degree}</div>
                    <div className="text-xs text-zinc-600">
                      {e.school}
                      {e.start || e.end ? ` — ${[e.start, e.end].filter(Boolean).join(" – ")}` : ""}
                      {e.grade ? ` | ${e.grade}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {resume.experience.length > 0 && (
            <>
              <SectionTitle>Work Experience</SectionTitle>
              <div className="space-y-4">
                {resume.experience.map((ex, i) => (
                  <div key={i}>
                    <div className="font-medium">
                      {ex.title} — {ex.company}{" "}
                      {ex.start || ex.end ? `(${[ex.start, ex.end].filter(Boolean).join(" – ")})` : ""}
                    </div>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {ex.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}

          {resume.projects.length > 0 && (
            <>
              <SectionTitle>Projects</SectionTitle>
              <div className="space-y-3">
                {resume.projects.map((p, i) => (
                  <div key={i}>
                    <div className="font-medium">
                      {p.name} {p.period ? `(${p.period})` : ""}
                    </div>
                    {p.summary && <p className="text-zinc-800">{p.summary}</p>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 flex items-center gap-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">{children}</h3>
      <Separator className="grow" />
    </div>
  )
}
