"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResumeForm } from "./resume-form"
import { ResumePreview } from "./resume-preview"
import { ImportFromText } from "./resume-text-import"
import { DocumentUploadSmart } from "./smart-upload"

export function ResumeStudio() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Resume Studio</CardTitle>
          <CardDescription>Build, import, and refine your LinkedIn‑ready resume.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="form">
            <TabsList className="w-full">
              <TabsTrigger value="form" className="flex-1">
                Form
              </TabsTrigger>
              <TabsTrigger value="import" className="flex-1">
                Import
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex-1">
                Upload file
              </TabsTrigger>
            </TabsList>
            <TabsContent value="form" className="mt-4">
              <ResumeForm />
            </TabsContent>
            <TabsContent value="import" className="mt-4">
              <ImportFromText />
            </TabsContent>
            <TabsContent value="upload" className="mt-4">
              <DocumentUploadSmart />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ResumePreview />
    </div>
  )
}
