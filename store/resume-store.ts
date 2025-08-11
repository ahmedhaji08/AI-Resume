"use client"

import { create } from "zustand"
import type { Resume } from "@/lib/resume-schema"

type State = {
  resume: Resume
}

type Actions = {
  setResume: (r: Resume) => void
  patch: (partial: Partial<Resume>) => void
  reset: () => void
}

const initial: Resume = {
  contact: { fullName: "" },
  summary: "",
  skills: [],
  education: [],
  experience: [],
  projects: [],
}

export const useResumeStore = create<State & Actions>((set) => ({
  resume: initial,
  setResume: (r) => set({ resume: r }),
  patch: (partial) => set((s) => ({ resume: { ...s.resume, ...partial } })),
  reset: () => set({ resume: initial }),
}))
