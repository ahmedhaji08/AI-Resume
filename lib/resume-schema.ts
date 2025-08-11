export type Contact = {
  fullName: string
  email?: string
  phone?: string
  location?: string
  website?: string
  github?: string
  linkedin?: string
}

export type Education = {
  degree: string
  school: string
  location?: string
  start?: string
  end?: string
  grade?: string
}

export type Experience = {
  title: string
  company: string
  location?: string
  start?: string
  end?: string
  bullets: string[]
}

export type Project = {
  name: string
  period?: string
  summary?: string
  bullets?: string[]
  tech?: string[]
}

export type Resume = {
  contact: Contact
  summary?: string
  skills?: string[]
  education: Education[]
  experience: Experience[]
  projects: Project[]
}
