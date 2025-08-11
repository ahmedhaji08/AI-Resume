"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ResumeStudio } from "./resume-studio"
import { LinkedinImport } from "./linkedin-import"
import { Separator } from "@/components/ui/separator"

export function UserPanel() {
  const [activeTab, setActiveTab] = useState("resume")

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Panel</CardTitle>
        <CardDescription>Build your resume, import LinkedIn, or upload a file. Export DOCX/PDF.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex w-full flex-wrap">
            <TabsTrigger value="resume" className="flex-1">
              Resume Studio
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex-1">
              LinkedIn Import
            </TabsTrigger>
          </TabsList>
          <Separator className="my-4" />
          <TabsContent value="resume">
            <ResumeStudio />
          </TabsContent>
          <TabsContent value="linkedin">
            <LinkedinImport />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
