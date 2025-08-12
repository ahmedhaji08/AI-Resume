"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ResumeStudio } from "./resume-studio"
import { EnhancedLinkedinImport } from "./linkedin-import"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { FileText, Linkedin, Sparkles, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useResumeStore } from "@/store/resume-store"

export function EnhancedUserPanel() {
  const [activeTab, setActiveTab] = useState("resume")
  const { resume } = useResumeStore()

  const completionPercentage = calculateCompletionPercentage(resume)

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 transition-all duration-300 hover:border-primary/40">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Resume Progress</h3>
              <p className="text-sm text-muted-foreground">Complete your profile to unlock AI features</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{completionPercentage}%</div>
              <div className="h-2 w-24 rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Panel */}
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI-Powered Resume Builder
              </CardTitle>
              <CardDescription>Build, enhance, and export your professional resume with AI assistance</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="transition-all duration-300 hover:scale-105 bg-transparent"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="transition-all duration-300 hover:scale-105 bg-transparent"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-2">
              <TabsTrigger value="resume" className="flex items-center gap-2 transition-all duration-300">
                <FileText className="h-4 w-4" />
                Resume Studio
                {completionPercentage > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {completionPercentage}%
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="linkedin" className="flex items-center gap-2 transition-all duration-300">
                <Linkedin className="h-4 w-4" />
                LinkedIn Services
                <Badge variant="outline" className="ml-1 text-xs">
                  Enhanced
                </Badge>
              </TabsTrigger>
            </TabsList>

            <Separator className="my-6" />

            <TabsContent value="resume" className="space-y-6">
              <ResumeStudio />
            </TabsContent>

            <TabsContent value="linkedin" className="space-y-6">
              <EnhancedLinkedinImport />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function calculateCompletionPercentage(resume: any): number {
  let completed = 0
  const total = 7

  if (resume.contact?.fullName) completed++
  if (resume.contact?.email) completed++
  if (resume.summary) completed++
  if (resume.skills?.length > 0) completed++
  if (resume.education?.length > 0) completed++
  if (resume.experience?.length > 0) completed++
  if (resume.projects?.length > 0) completed++

  return Math.round((completed / total) * 100)
}
