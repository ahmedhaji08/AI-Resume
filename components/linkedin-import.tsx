"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Linkedin, Sparkles, Users, TrendingUp, MessageSquare, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useResumeStore } from "@/store/resume-store"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function EnhancedLinkedinImport() {
  const { toast } = useToast()
  const [profileUrl, setProfileUrl] = useState("")
  const [pasted, setPasted] = useState("")
  const [loading, setLoading] = useState(false)
  const { setResume } = useResumeStore()

  async function parseFromText() {
    if (!pasted.trim()) {
      toast({ title: "No content", description: "Please paste some LinkedIn content first.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const { parseResumeFromText } = await import("@/lib/resume-parser")
      const r = parseResumeFromText(pasted)
      setResume(r)
      toast({
        title: "LinkedIn data parsed successfully!",
        description: "Your resume has been updated with the imported data.",
      })
    } catch (error) {
      toast({
        title: "Parsing failed",
        description: "There was an error parsing your LinkedIn data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function enhanceWithAI() {
    if (!pasted.trim()) {
      toast({ title: "No content", description: "Please paste LinkedIn content first.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      // Simulate AI enhancement
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const enhanced =
        pasted + "\n\nAI Enhancement: Added quantified achievements and optimized keywords for ATS compatibility."
      setPasted(enhanced)

      toast({
        title: "Content enhanced with AI!",
        description: "Your LinkedIn content has been optimized for better resume impact.",
      })
    } catch (error) {
      toast({
        title: "Enhancement failed",
        description: "AI enhancement is temporarily unavailable. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function saveProfileUrl() {
    if (!profileUrl) {
      toast({ title: "No URL", description: "Please enter a LinkedIn profile URL.", variant: "destructive" })
      return
    }

    if (!profileUrl.includes("linkedin.com")) {
      toast({ title: "Invalid URL", description: "Please enter a valid LinkedIn profile URL.", variant: "destructive" })
      return
    }

    toast({
      title: "Profile URL saved",
      description: "LinkedIn OAuth integration coming soon for automatic data fetching.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Service Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 transition-all duration-300 hover:scale-105 hover:shadow-lg dark:from-blue-950/20 dark:to-blue-900/20">
          <CardContent className="p-4 text-center">
            <Linkedin className="mx-auto mb-2 h-8 w-8 text-blue-600" />
            <h3 className="font-semibold">Profile Import</h3>
            <p className="text-xs text-muted-foreground">Import your complete LinkedIn profile</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 transition-all duration-300 hover:scale-105 hover:shadow-lg dark:from-green-950/20 dark:to-green-900/20">
          <CardContent className="p-4 text-center">
            <TrendingUp className="mx-auto mb-2 h-8 w-8 text-green-600" />
            <h3 className="font-semibold">Skills Analysis</h3>
            <p className="text-xs text-muted-foreground">AI-powered skills optimization</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 transition-all duration-300 hover:scale-105 hover:shadow-lg dark:from-purple-950/20 dark:to-purple-900/20">
          <CardContent className="p-4 text-center">
            <Users className="mx-auto mb-2 h-8 w-8 text-purple-600" />
            <h3 className="font-semibold">Network Insights</h3>
            <p className="text-xs text-muted-foreground">Leverage your professional network</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="enhance">AI Enhancement</TabsTrigger>
          <TabsTrigger value="insights">Profile Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Linkedin className="h-5 w-5 text-blue-600" />
                  LinkedIn Profile URL
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="url">Profile URL</Label>
                  <div className="mt-2 flex gap-2">
                    <Input
                      id="url"
                      placeholder="https://www.linkedin.com/in/your-handle"
                      value={profileUrl}
                      onChange={(e) => setProfileUrl(e.target.value)}
                      className="transition-all duration-300 focus:scale-[1.02]"
                    />
                    <Button
                      variant="outline"
                      onClick={saveProfileUrl}
                      className="transition-all duration-300 hover:scale-105 bg-transparent"
                    >
                      <Linkedin className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>

                <Alert>
                  <MessageSquare className="h-4 w-4" />
                  <AlertDescription>
                    OAuth integration coming soon for automatic profile fetching. Currently supports manual import.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Manual Import
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="paste">Paste LinkedIn Content</Label>
                  <Textarea
                    id="paste"
                    rows={8}
                    value={pasted}
                    onChange={(e) => setPasted(e.target.value)}
                    placeholder="Paste your LinkedIn profile sections here (About, Experience, Education, Skills, etc.)..."
                    className="transition-all duration-300 focus:scale-[1.02]"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={parseFromText}
                    disabled={loading}
                    className="flex-1 transition-all duration-300 hover:scale-105"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {loading ? "Parsing..." : "Parse & Import"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={enhanceWithAI}
                    disabled={loading}
                    className="transition-all duration-300 hover:scale-105 bg-transparent"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Enhance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="enhance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-600" />
                AI-Powered Enhancement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">Available Enhancements:</h4>
                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-start">
                      <TrendingUp className="mr-2 h-3 w-3" />
                      Quantify Achievements
                    </Badge>
                    <Badge variant="outline" className="w-full justify-start">
                      <Eye className="mr-2 h-3 w-3" />
                      ATS Optimization
                    </Badge>
                    <Badge variant="outline" className="w-full justify-start">
                      <MessageSquare className="mr-2 h-3 w-3" />
                      Professional Tone
                    </Badge>
                    <Badge variant="outline" className="w-full justify-start">
                      <Users className="mr-2 h-3 w-3" />
                      Industry Keywords
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Enhancement Options:</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start transition-all duration-300 hover:scale-105 bg-transparent"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Enhance Summary
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start transition-all duration-300 hover:scale-105 bg-transparent"
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Optimize Experience
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start transition-all duration-300 hover:scale-105 bg-transparent"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Improve Skills
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Profile Strength
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Completeness</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className="h-2 w-[85%] rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500" />
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm">ATS Score</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className="h-2 w-[92%] rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Network Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Connections</span>
                    <Badge variant="secondary">500+</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Industry Reach</span>
                    <Badge variant="secondary">High</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Engagement Rate</span>
                    <Badge variant="secondary">7.2%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Tips Section */}
      <Card className="border-dashed">
        <CardContent className="p-6">
          <h4 className="mb-3 font-medium">💡 Pro Tips for LinkedIn Import:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Copy sections like About, Experience, Education, Projects, and Skills from your profile
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Use the AI enhancement to add metrics and quantify your achievements
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Export to DOCX and upload back to LinkedIn's resume builder for consistency
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Regular updates ensure your resume stays current with your LinkedIn profile
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
