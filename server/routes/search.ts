import { Router } from "express"
import OpenAI from "openai"

const router = Router()
const OPENAI_KEY = process.env.OPENAI_API_KEY || ""
const openai = OPENAI_KEY ? new OpenAI({ apiKey: OPENAI_KEY }) : null

// stubbed storage.searchInspirations - replace with vector DB logic (Pinecone / pgvector)
const storage = {
  async searchInspirations(filters: any) {
    return [
      {
        site_id: "sample-1",
        url: "https://example.com",
        title: "Sample result",
        hero_text: "Grow your business",
        screenshot_url: "/samples/sample1.png",
        score: 0.87,
        matched_by: "stub",
      },
    ]
  },
}

async function makeEmbedding(text: string) {
  if (!openai) return null
  const resp = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  })
  return resp?.data?.[0]?.embedding ?? null
}

router.get("/search", async (req, res) => {
  try {
    const { copy, industry, styles, k } = req.query
    const filters: any = {}
    if (industry) filters.industry = String(industry)
    if (styles) filters.styles = Array.isArray(styles) ? styles : [String(styles)]
    const topK = Number.parseInt(String(k || "12"), 10)

    if (copy && openai) {
      const text = `USER_COPY: ${String(copy)}\nINDUSTRY: ${filters.industry || ""}\nSTYLES:${(filters.styles || []).join(",")}`
      const emb = await makeEmbedding(text)
      // TODO: use `emb` to query Pinecone / pgvector and fetch topK results.
      const results = await storage.searchInspirations(filters)
      return res.json(results)
    } else {
      const results = await storage.searchInspirations(filters)
      return res.json(results)
    }
  } catch (err) {
    console.error("search error", err)
    return res.status(500).json({ error: "Search failed" })
  }
})

export default router
