import type { Resume, Education, Experience, Project } from "./resume-schema"

// Basic heuristics parser for typical headings and bullet markers.
// Designed to parse text pasted from LinkedIn-style/ATS PDFs and the sample provided by the user.
export function parseResumeFromText(input: string): Resume {
  const text = normalize(input)
  const lines = text.split("\n").map((l) => l.trim())

  // Extract contact block from first 3-6 lines
  const contact: Resume["contact"] = { fullName: "" }
  const firstBlock = lines.slice(0, 8).join(" ")
  const email = firstBlock.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0]
  const phone = firstBlock.match(/(\+?\d[\d\s-]{7,}\d)/)?.[0]
  const linkedin = firstBlock.match(/(linkedin\.com\/in\/[A-Za-z0-9-_]+)/i)?.[0]
  const github = firstBlock.match(/(github\.com\/[A-Za-z0-9-_]+)/i)?.[0]

  // Name guess: first non-empty line that's not an email/phone header
  const nameLine = lines.find((l) => l && !l.toLowerCase().includes("email") && !l.toLowerCase().includes("phone"))
  contact.fullName = nameLine || ""
  contact.email = email || undefined
  contact.phone = phone || undefined
  contact.linkedin = linkedin || undefined
  contact.github = github || undefined

  // Sections split
  const sections = splitSections(text)

  const summary = sections.get("profile summary") || sections.get("summary") || sections.get("about") || ""

  const skillsRaw =
    sections.get("skills") ||
    sections.get("technical skills") ||
    sections.get("core skills") ||
    sections.get("skills & tools") ||
    ""

  const skills = splitSkills(skillsRaw)

  const education = parseEducation(sections.get("education") || "")
  const experience = parseExperience(sections.get("work experience") || sections.get("experience") || "")
  const projects = parseProjects(sections.get("projects") || "")

  return {
    contact,
    summary: summary.trim(),
    skills,
    education,
    experience,
    projects,
  }
}

function normalize(s: string) {
  return s
    .replace(/\t/g, " ")
    .replace(/\u2022/g, "•")
    .replace(/\r/g, "")
    .replace(/[ \u00A0]+/g, " ")
    .trim()
}

function splitSections(s: string) {
  const map = new Map<string, string>()
  const re =
    /^\s*(PROFILE SUMMARY|SUMMARY|ABOUT|EDUCATION|WORK EXPERIENCE|EXPERIENCE|PROJECTS?|SKILLS(?: & TOOLS)?|CERTIFICATIONS?)\s*$/gim
  const lastIndex = 0
  const lastTitle = "_start"
  let match: RegExpExecArray | null
  const indices: { title: string; index: number }[] = []
  while ((match = re.exec(s))) {
    indices.push({ title: match[1].toUpperCase(), index: match.index })
  }
  indices.push({ title: "_end", index: s.length })
  for (let i = 0; i < indices.length - 1; i++) {
    const title = indices[i].title
    const start = indices[i].index + title.length
    const end = indices[i + 1].index
    const content = s.slice(start, end).trim()
    if (title !== "_start") {
      map.set(title.toLowerCase(), content)
    } else {
      map.set("_preamble", s.slice(0, indices[0].index).trim())
    }
  }
  return map
}

function splitSkills(s: string): string[] {
  if (!s.trim()) return []
  // bullets or commas or lines
  const items = s
    .split(/\n|•|·|,|;/)
    .map((x) => x.trim())
    .filter(Boolean)
  // Some lines like "Programming language: Java, Python" -> split by colon and flatten
  const expanded: string[] = []
  for (const it of items) {
    const parts = it.split(":")
    if (parts.length > 1) {
      expanded.push(parts.slice(1).join(":").trim())
    } else {
      expanded.push(it)
    }
  }
  return expanded
}

function parseEducation(s: string): Education[] {
  if (!s.trim()) return []
  const blocks = s.split(/\n{2,}/).map((b) => b.trim())
  const result: Education[] = []
  for (const b of blocks) {
    const lines = b
      .split(/\n/)
      .map((l) => l.trim())
      .filter(Boolean)
    if (!lines.length) continue
    const degree = lines[0]
    const school = lines[1] || ""
    // Try to find dates and grade
    const dates = b.match(
      /([A-Za-z]{3,}\s?\d{4}|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s?\d{4}|20\d{2}|20\d{2}\s?[–-]\s?(20\d{2}|Present|Expected))/g,
    )
    const gradeMatch = b.match(/(CGPA|GPA|Percentage)\s*[:-]?\s*([0-9./]+)/i)
    result.push({
      degree,
      school,
      start: guessStart(dates),
      end: guessEnd(dates),
      grade: gradeMatch ? `${gradeMatch[1]} ${gradeMatch[2]}` : undefined,
    })
  }
  return result
}

function parseExperience(s: string): Experience[] {
  if (!s.trim()) return []
  const chunks = s.split(/\n{2,}/).map((c) => c.trim())
  const result: Experience[] = []
  for (const c of chunks) {
    const lines = c
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
    if (!lines.length) continue
    // First line: role/company (try to split by hyphen or " - ")
    const first = lines[0]
    let title = first
    let company = ""
    const sep = first.match(/\s[-–]\s/)
    if (sep) {
      const [a, b] = first.split(sep[0])
      title = a.trim()
      company = b.trim()
    } else {
      // Look for Internship / Foundation patterns
      const atIdx = first.indexOf(" - ")
      if (atIdx > 0) {
        title = first.slice(0, atIdx).trim()
        company = first.slice(atIdx + 3).trim()
      }
    }
    const dateLine = lines.find((l) => /\b(20\d{2}|Present)\b/i.test(l))
    const dates = dateLine?.match(/([A-Za-z]{3,}\s?\d{4}|20\d{2}|Present)/g) || []
    const bullets = lines
      .slice(1)
      .filter((l) => l.startsWith("•") || l.startsWith("-") || /^[A-Z]/.test(l))
      .map((l) => l.replace(/^•|-/, "").trim())
      .filter(Boolean)
    result.push({
      title: title || "Intern",
      company: company || "",
      start: guessStart(dates),
      end: guessEnd(dates),
      bullets,
    })
  }
  return result
}

function parseProjects(s: string): Project[] {
  if (!s.trim()) return []
  const chunks = s.split(/\n{2,}/).map((c) => c.trim())
  const result: Project[] = []
  for (const c of chunks) {
    const lines = c
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
    if (!lines.length) continue
    const nameLine = lines[0]
    const dateMatch = nameLine.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s?\d{4}\b.*$/i)
    result.push({
      name: nameLine.replace(/\s{2,}.*/, "").trim(),
      period: dateMatch ? dateMatch[0] : undefined,
      summary: lines.slice(1).join(" ").trim(),
    })
  }
  return result
}

function guessStart(dates?: string[] | null) {
  if (!dates || dates.length === 0) return undefined
  return dates[0]
}
function guessEnd(dates?: string[] | null) {
  if (!dates || dates.length === 0) return undefined
  return dates[dates.length - 1]
}
