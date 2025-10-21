import { type NextRequest, NextResponse } from "next/server"

// Mock storage - replace with vector DB logic (Pinecone / pgvector)
const mockResults = [
  {
    id: "1",
    url: "https://example.com/minimalist",
    title: "Minimalist SaaS Landing",
    description: "Clean, modern SaaS landing page with bold typography",
    screenshot: "/minimalist-saas-landing.jpg",
    industry: "SaaS",
    styles: ["minimalist", "modern"],
    score: 0.92,
  },
  {
    id: "2",
    url: "https://example.com/bold",
    title: "Bold Typography Hero",
    description: "Eye-catching hero section with large, bold text",
    screenshot: "/bold-typography-hero.jpg",
    industry: "Creative",
    styles: ["bold", "typography"],
    score: 0.88,
  },
  {
    id: "3",
    url: "https://example.com/elegant",
    title: "Elegant Portfolio",
    description: "Sophisticated portfolio website with elegant design",
    screenshot: "/elegant-portfolio.jpg",
    industry: "Portfolio",
    styles: ["elegant", "sophisticated"],
    score: 0.85,
  },
  {
    id: "4",
    url: "https://example.com/ecommerce",
    title: "Modern E-commerce",
    description: "Contemporary e-commerce design with smooth interactions",
    screenshot: "/modern-ecommerce.jpg",
    industry: "E-commerce",
    styles: ["modern", "interactive"],
    score: 0.83,
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const copy = searchParams.get("copy")
    const industry = searchParams.get("industry")
    const styles = searchParams.get("styles")
    const k = Number.parseInt(searchParams.get("k") || "12", 10)

    // Filter results based on query
    let results = mockResults

    if (industry) {
      results = results.filter((r) => r.industry.toLowerCase().includes(industry.toLowerCase()))
    }

    if (styles) {
      const styleList = styles.split(",").map((s) => s.trim().toLowerCase())
      results = results.filter((r) => r.styles.some((s) => styleList.includes(s.toLowerCase())))
    }

    // Return top K results
    return NextResponse.json(results.slice(0, k))
  } catch (err) {
    console.error("search error", err)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
