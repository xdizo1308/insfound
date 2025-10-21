import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

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

async function checkCacheForUrl(url: string) {
  return null
}

async function enqueueAnalyzeJob(payload: any) {
  const jobId = uuidv4()
  JOBS[jobId] = { status: "queued", payload, createdAt: Date.now() }
  return jobId
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, async: asyncFlag } = body || {}

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing or invalid 'url' in body." }, { status: 400 })
    }

    if (isPrivateUrl(url)) {
      return NextResponse.json({ error: "Private or invalid URL not allowed." }, { status: 400 })
    }

    const cached = await checkCacheForUrl(url)
    if (cached) {
      return NextResponse.json({ ...cached, cached: true })
    }

    const jobId = await enqueueAnalyzeJob({ url })

    if (asyncFlag === false) {
      return NextResponse.json({ id: jobId, status: "queued-sync", note: "Worker must process job" })
    } else {
      return NextResponse.json({ jobId, status: "queued" }, { status: 202 })
    }
  } catch (err) {
    console.error("analyze error", err)
    return NextResponse.json({ error: "Failed to enqueue analyze job." }, { status: 500 })
  }
}
