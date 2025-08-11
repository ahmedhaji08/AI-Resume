import type { NextRequest } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { openai } from "@ai-sdk/openai"
import { aiProvider } from "@/lib/env"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      fullName = "Candidate",
      title = "",
      summary = "",
      skills = "",
      experience = "",
      targetRole = "",
    } = body || {}

    const system =
      "You are an expert resume writer. Write concise, ATS-friendly content with quantified impact, bullet points, and US professional tone. Use sections: Summary, Skills, Experience, Education (placeholder), Certifications (if applicable). Avoid jargon and fluff. Format plain text."

    const prompt = `
Compose a complete resume.

Candidate: ${fullName}
Title: ${title}
Target Role: ${targetRole}

Summary (use and improve):
${summary}

Skills (comma separated):
${skills}

Experience highlights (structure into bullets with metrics):
${experience}
`.trim()

    const provider = aiProvider()
    const hasXai = provider === "xai"
    const hasOpenAI = provider === "openai"

    if (hasXai || hasOpenAI) {
      const model = hasXai ? xai("grok-3") : openai("gpt-4o")
      try {
        const { text, finishReason, usage } = await generateText({
          model,
          system,
          prompt,
        })
        return Response.json({ text, mode: provider, finishReason, usage })
      } catch (aiError: any) {
        console.error("AI API Error:", aiError)

        // Handle specific XAI credit issues
        if (aiError.statusCode === 403 && aiError.responseBody?.includes("credits")) {
          return Response.json(
            {
              error:
                "XAI API credits required. Please add credits at console.x.ai or switch to OpenAI by setting OPENAI_API_KEY instead.",
              needsCredits: true,
              provider: "xai",
            },
            { status: 402 },
          )
        }

        // Handle other API errors
        return Response.json(
          {
            error: `${provider.toUpperCase()} API error: ${aiError.message || "Failed to generate"}`,
            provider,
          },
          { status: 500 },
        )
      }
    }

    // Mock fallback (no keys configured)
    const mock = `
${fullName.toUpperCase()}
${title || "Professional"}

SUMMARY
• ${summary || "Impact-driven professional with a track record of delivering measurable outcomes."}
• Targeting: ${targetRole || "—"}

SKILLS
• ${skills || "Strategy, Communication, Collaboration"}

EXPERIENCE
• ${experience || "Company — Role — 20XX–20YY: Delivered results with data and cross-functional teams."}

EDUCATION
• Your Degree — University (Year)

CERTIFICATIONS
• Available upon request
`.trim()

    return Response.json({ text: mock, mode: "mock" })
  } catch (e: any) {
    console.error(e)
    return new Response(JSON.stringify({ error: "Failed to generate" }), { status: 500 })
  }
}

/**
Note:
- This route uses the AI SDK to generate text and prefers xAI's grok-3 if XAI_API_KEY is set, or OpenAI if OPENAI_API_KEY is set. [^1]
- No runtime edge flag is used as recommended when working with the AI SDK in API routes. [^1]
*/
