import { Router } from "express"
import { v4 as uuidv4 } from "uuid"

const router = Router()

// Simple in-memory jobs store for MVP (replace with BullMQ + Redis in production)
const JOBS: Record<string, any> = {}

function isPrivateUrl(url: string) {
  try {
    const u = new URL(url)
    const host = u.hostname
    if (/^(localhost|127\.0\.0\.1)$/.test(host)) return true
    if (/^10\./.test(host)) return true
    if (/^192\.168\./.test(host)) return true
    if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)) return true
    return false
  } catch {
    return true
  }
}

// stub: check DB cache by URL (replace with real DB)
async function checkCacheForUrl(url: string) {
  return null
}

// stub: enqueue job (replace with BullMQ)
async function enqueueAnalyzeJob(payload: any) {
  const jobId = uuidv4()
  JOBS[jobId] = { status: "queued", payload, createdAt: Date.now() }
  return jobId
}

router.post("/analyze", async (req, res) => {
  try {
    const { url, async: asyncFlag } = req.body || {}
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'url' in body." })
    }
    if (isPrivateUrl(url)) {
      return res.status(400).json({ error: "Private or invalid URL not allowed." })
    }

    // Check cache (DB) first
    const cached = await checkCacheForUrl(url)
    if (cached) {
      return res.json({ ...cached, cached: true })
    }

    const jobId = await enqueueAnalyzeJob({ url })

    if (asyncFlag === false) {
      // dev convenience: do not actually process synchronously here
      return res.json({ id: jobId, status: "queued-sync", note: "Worker must process job" })
    } else {
      return res.status(202).json({ jobId, status: "queued" })
    }
  } catch (err) {
    console.error("analyze error", err)
    return res.status(500).json({ error: "Failed to enqueue analyze job." })
  }
})

export default router
