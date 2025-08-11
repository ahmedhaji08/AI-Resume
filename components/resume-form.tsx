"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Wand2, Upload, Save, AlertCircle } from "lucide-react"
import { useResumeStore } from "@/store/resume-store"
import type { Education, Experience, Project, Resume } from "@/lib/resume-schema"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ResumeForm() {
  const { resume, setResume, patch } = useResumeStore()
  const [pending, setPending] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const { toast } = useToast()

  function updateContact<K extends keyof Resume["contact"]>(k: K, v: Resume["contact"][K]) {
    setResume({ ...resume, contact: { ...resume.contact, [k]: v } })
  }

  function pushEducation() {
    const next: Education = { degree: "", school: "" }
    setResume({ ...resume, education: [...resume.education, next] })
  }
  function updateEducation(i: number, field: keyof Education, val: any) {
    const ed = [...resume.education]
    ed[i] = { ...ed[i], [field]: val }
    setResume({ ...resume, education: ed })
  }
  function removeEducation(i: number) {
    const ed: Education[] = resume.education.filter((_: Education, idx: number) => idx !== i)
    setResume({ ...resume, education: ed })
  }

  function pushExperience() {
    const next: Experience = { title: "", company: "", bullets: [] }
    setResume({ ...resume, experience: [...resume.experience, next] })
  }
  function updateExperience(i: number, field: keyof Experience, val: any) {
    const ex = [...resume.experience]
    ex[i] = { ...ex[i], [field]: val }
    setResume({ ...resume, experience: ex })
  }
  function updateExperienceBullets(i: number, text: string) {
    const bullets = text
      .split(/\n/)
      .map((b) => b.replace(/^•\s?/, "").trim())
      .filter(Boolean)
    updateExperience(i, "bullets", bullets)
  }
  function removeExperience(i: number) {
    const ed: Education[] = resume.education.filter((_: Education, idx: number) => idx !== i)
    setResume({ ...resume, education: ed })
  }

  function pushProject() {
    const next: Project = { name: "", summary: "" }
    setResume({ ...resume, projects: [...resume.projects, next] })
  }
  function updateProject(i: number, field: keyof Project, val: any) {
    const pr = [...resume.projects]
    pr[i] = { ...pr[i], [field]: val }
    setResume({ ...resume, projects: pr })
  }
  function removeProject(i: number) {
    const ed: Education[] = resume.education.filter((_: Education, idx: number) => idx !== i)
    setResume({ ...resume, education: ed })
  }

  async function enhanceSummary() {
    setPending(true)
    setAiError(null)
    try {
      interface GenerateResumeRequestBody {
        fullName: string
        title: string
        summary: string
        skills?: string
        experience: string
        targetRole: string
      }

      const res: Response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: resume.contact.fullName,
          title: "",
          summary: resume.summary,
          skills: resume.skills?.join(", "),
          experience: resume.experience
            .map((e: Experience) => `${e.title} at ${e.company}: ${e.bullets.slice(0, 3).join(" | ")}`)
            .join("\n"),
          targetRole: "",
        } as GenerateResumeRequestBody),
      })
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 402 && data.needsCredits) {
          setAiError(
            "XAI API credits required. Please add credits at console.x.ai or set OPENAI_API_KEY in your Vercel project settings to use OpenAI instead.",
          )
        } else if (data.error) {
          setAiError(data.error)
        } else {
          setAiError("Failed to enhance summary. Please try again.")
        }
        return
      }

      // naive: take first 6 lines from generated SUMMARY
      const text: string = data.text || ""
      const part = extractSummaryFromText(text)
      patch({ summary: part || resume.summary })
      toast({ title: "Enhanced!", description: "Your summary has been improved with AI." })
    } catch (e: any) {
      console.error(e)
      setAiError("Network error. Please check your connection and try again.")
    } finally {
      setPending(false)
    }
  }

  // Save to DB
  async function saveToDb() {
    setPending(true)
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content: resume, template: "linkedin-clean" }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Please sign in to save your resume. Click the user menu in the top right to sign in.")
        }
        throw new Error(data?.error || "Failed to save")
      }
      toast({ title: "Saved", description: "Your resume is saved in your account." })
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "resume_saved", details: { resumeId: data?.resume?.id } }),
      })
    } catch (e: any) {
      toast({ title: "Could not save", description: e?.message || "Please try again.", variant: "destructive" })
    } finally {
      setPending(false)
    }
  }

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div>
          <h3 className="text-lg font-semibold">Contact</h3>
          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                value={resume.contact.fullName}
                onChange={(e) => updateContact("fullName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={resume.contact.email || ""}
                onChange={(e) => updateContact("email", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={resume.contact.phone || ""}
                onChange={(e) => updateContact("phone", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={resume.contact.linkedin || ""}
                onChange={(e) => updateContact("linkedin", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={resume.contact.github || ""}
                onChange={(e) => updateContact("github", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={resume.contact.website || ""}
                onChange={(e) => updateContact("website", e.target.value)}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Profile Summary</h3>
            <Button variant="outline" size="sm" onClick={enhanceSummary} disabled={pending}>
              <Wand2 className="mr-2 h-4 w-4" />
              {pending ? "Enhancing..." : "Enhance with AI"}
            </Button>
          </div>

          {aiError && (
            <Alert className="mt-3" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{aiError}</AlertDescription>
            </Alert>
          )}

          <Textarea
            className="mt-3"
            rows={5}
            value={resume.summary || ""}
            onChange={(e) => patch({ summary: e.target.value })}
            placeholder="Concise overview, areas of focus, quantified wins."
          />
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold">Skills</h3>
          <Input
            className="mt-3"
            value={(resume.skills || []).join(", ")}
            onChange={(e) =>
              patch({
                skills: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            placeholder="e.g., React, Next.js, PostgreSQL, Machine Learning"
          />
        </div>

        <Separator />

        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Education</h3>
            <Button variant="outline" size="sm" onClick={pushEducation}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
          <div className="mt-3 space-y-4">
            {resume.education.map((ed: Education, i: number) => (
              <div key={i} className="grid grid-cols-1 gap-3 rounded border p-3 md:grid-cols-3">
              <div>
                <Label>Degree</Label>
                <Input value={ed.degree} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEducation(i, "degree", e.target.value)} />
              </div>
              <div>
                <Label>School</Label>
                <Input value={ed.school} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEducation(i, "school", e.target.value)} />
              </div>
              <div>
                <Label>Grade</Label>
                <Input value={ed.grade || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEducation(i, "grade", e.target.value)} />
              </div>
              <div>
                <Label>Start</Label>
                <Input value={ed.start || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEducation(i, "start", e.target.value)} />
              </div>
              <div>
                <Label>End</Label>
                <Input value={ed.end || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEducation(i, "end", e.target.value)} />
              </div>
              <div className="flex items-end justify-end">
                <Button
                variant="outline"
                size="icon"
                onClick={() => removeEducation(i)}
                aria-label="Remove education"
                >
                <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Experience</h3>
            <Button variant="outline" size="sm" onClick={pushExperience}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
          <div className="mt-3 space-y-4">
            {resume.experience.map((ex: Experience, i: number) => (
              <div key={i} className="grid grid-cols-1 gap-3 rounded border p-3 md:grid-cols-3">
              <div>
                <Label>Title</Label>
                <Input value={ex.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExperience(i, "title", e.target.value)} />
              </div>
              <div>
                <Label>Company</Label>
                <Input value={ex.company} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExperience(i, "company", e.target.value)} />
              </div>
              <div>
                <Label>Dates</Label>
                <Input
                value={[ex.start, ex.end].filter(Boolean).join(" – ")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const [start, end] = e.target.value.split("–").map((x) => x.trim())
                  updateExperience(i, "start", start)
                  updateExperience(i, "end", end)
                }}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Bullets (one per line)</Label>
                <Textarea
                rows={5}
                value={(ex.bullets || []).join("\n")}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateExperienceBullets(i, e.target.value)}
                placeholder="Start with action verbs and include metrics..."
                />
              </div>
              <div className="flex items-end justify-end">
                <Button
                variant="outline"
                size="icon"
                onClick={() => removeExperience(i)}
                aria-label="Remove experience"
                >
                <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Projects</h3>
            <Button variant="outline" size="sm" onClick={pushProject}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
          <div className="mt-3 space-y-4">
            {resume.projects.map((pr: Project, i: number) => (
              <div key={i} className="grid grid-cols-1 gap-3 rounded border p-3 md:grid-cols-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={pr.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateProject(i, "name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Period</Label>
                  <Input
                    value={pr.period || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateProject(i, "period", e.target.value)}
                  />
                </div>
                <div className="md:col-span-3">
                  <Label>Summary</Label>
                  <Textarea
                    rows={3}
                    value={pr.summary || ""}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateProject(i, "summary", e.target.value)}
                  />
                </div>
                <div className="flex items-end justify-end md:col-span-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeProject(i)}
                    aria-label="Remove project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <ImportActions onSave={saveToDb} saving={pending} />
      </CardContent>
    </Card>
  )
}

function extractSummaryFromText(t: string) {
  const idx = t.toUpperCase().indexOf("SUMMARY")
  if (idx >= 0) {
    const after = t.slice(idx + "SUMMARY".length).trim()
    return after.split(/\n{2,}/)[0].trim()
  }
  return t.split(/\n{2,}/)[0].trim()
}

function ImportActions({ onSave, saving }: { onSave: () => Promise<void>; saving: boolean }) {
  const { setResume } = useResumeStore()
  const demoText = `MOHD AHMED HAJI 
ahaji0558@gmail.com              Ahmed Haji             ahmedhaji08        9059862287 
 
PROFILE SUMMARY 
I'm a passionate and dedicated Information Techology student at MJCET with strong interests in web development, artificial intelligence, and problem-solving. I have hands-on experience building full-stack web applications using React.js, Next.js, Node.js, PostgreSQL, and Prisma. I enjoy working on innovative projects that enhance user experience and solve real-world problems, like my recent project C.A.S.E., which streamlines academic operations through a centralized digital platform. I’m currently exploring machine learning and AI, and I'm eager to contribute to forward-thinking tech teams where I can learn, grow, and build impactful solutions. 
 
EDUCATION 
Bachelor of Engineering in Information Technology. 
Muffakham Jah College of Engineering & Technology, Hyderabad 
Aug 2021 – June 2025 (Expected) 
Previous Sem CGPA- 8.71 
 
Board of Intermediate Education (I & II year) 
St. Mathews Junior College, Hyderabad 
June 2018 – March 2020 
Percentage: 70.0% 
 
Secondary School Certificate (SSC) 
New Rosary Convent High School, Hyderabad 
GPA: 7.7/10 
 
WORK EXPERIENCE 
Internship: YBI Foundation Virtual - Python Programming              Oct 2024 – Nov 2024 
• Completed a 1-month Python internship at YBI Foundation, focusing on machine learning and classification techniques. 
• Built a Handwritten Digit Recognition model using Scikit-learn and a Random Forest classifier. 
• Pre-processed and normalized image data to enhance model training and performance. 
• Evaluated model accuracy using train-test split, confusion matrix, and classification report with visual insights via Matplotlib. 
 
Wipro Talent-Next Course - Java Full Stack              May 2024 – Sept 2024 
• Completed a 4-month Java Full Stack Development course from Wipro Talent-Next with end-to-end application development training. 
• Gained hands-on experience in Core Java, JDBC, Servlets, JSP, and Spring Framework for backend development. 
• Built responsive UIs using HTML, CSS, JavaScript, and Bootstrap with a focus on user interaction and design. 
• Integrated frontend and backend using MVC architecture through real-world projects to enhance problem-solving skills. 
 
PROJECTS 
HealthCare Chatbot                  May 2024 – Aug 2024  
Designed and developed a healthcare chatbot aimed at facilitating preliminary medical diagnostics through a secure and user-friendly graphical interface. Integrated a Random Forest classifier trained on medical data to predict potential health conditions based on user-input symptoms. Leveraged machine learning and GUI frameworks to deliver real-time diagnostic insights, enhancing accessibility and user engagement in early health assessments. 
 
Centralized Academic System for Excellence       Dec 2024 – Present 
C.A.S.E. is an integrated web-based platform designed to simplify and enhance college operations by providing seamless access to information for students, faculty, and administrators. It offers a centralized portal for managing student details, including personal information, academic performance, and assignment records, while a real-time faculty dashboard displays essential details and availability for efficient communication. An AI-powered chatbot ensures 24/7 assistance by addressing student queries related to attendance, marks, and faculty information, reducing administrative tasks. 
 
SKILLS 
Programming language: Java, Python, C, Machine Learning. 
Front-End: HTML, CSS, JavaScript, React.js, TypeScript. 
Back-End: Node.js, Next.js. 
Database: PostgreSQL.`

  async function importDemo() {
    const { parseResumeFromText } = await import("@/lib/resume-parser")
    const r = parseResumeFromText(demoText)
    setResume(r)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={importDemo}>
        <Upload className="mr-2 h-4 w-4" />
        Import Demo Resume
      </Button>
      <Button onClick={onSave} disabled={saving} variant="outline">
        <Save className="mr-2 h-4 w-4" />
        {saving ? "Saving..." : "Save to Account"}
      </Button>
    </div>
  )
}
