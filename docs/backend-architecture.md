# Insfound — Backend Architecture

## Goal
When a user submits a site URL or pastes copy, the backend should fetch and extract the page's key text (title, hero, H1, main paragraphs), take a screenshot, compute embeddings for semantic search, index into a vector DB, and return ranked inspiration results quickly.

---

## High-level components
- **Frontend (Vercel)** — Next.js / React UI and serverless endpoints for light tasks.
- **API Server** — Express or serverless functions to handle orchestration and requests.
- **Worker / Crawler** — Playwright-based worker (Docker) that performs heavy tasks (screenshots, extraction).
- **Queue** — BullMQ + Redis for reliable job scheduling and retries.
- **Vector DB** — Pinecone or pgvector (Postgres + pgvector) for ANN search.
- **Relational DB** — Postgres (metadata, users, saves).
- **Storage** — S3 / DigitalOcean Spaces for screenshots and assets.
- **Embeddings & LLM** — OpenAI (embedding + generation).

---

## API contracts

### POST /api/analyze
**Request**
\`\`\`json
{ "url": "https://example.com", "async": true }
\`\`\`

**Sync response**
\`\`\`json
{
  "id":"uuid",
  "title":"Example title",
  "hero_text":"Grow fast",
  "screenshot_url":"https://.../hero.png",
  "status":"done"
}
\`\`\`

**Async response**
\`\`\`json
{ "jobId":"job-uuid", "status":"queued" }
\`\`\`

### GET /api/search

**Request** (query params or JSON)
\`\`\`json
{ "copy":"My headline", "industry":"Marketing", "styles":["minimal"], "k":12 }
\`\`\`

**Response**
\`\`\`json
[
  {
    "site_id":"uuid",
    "url":"https://...",
    "title":"...",
    "hero_text":"...",
    "screenshot_url":"https://...",
    "score":0.87
  }
]
\`\`\`

---

## Worker flow (analyze job)

1. **Validate URL** — Block localhost/private addresses.
2. **Check DB cache** — TTL 24–72h. If cached, return cached record.
3. **If not cached, enqueue job to worker.**

### Worker (Playwright):
1. Load page (networkidle or timeout).
2. Capture hero screenshot (desktop hero crop).
3. Extract document.title, meta[name=description], first h1, and heuristics for hero text.
4. (Optional) Detect components: CTAs, forms, pricing, testimonials.
5. Create an embedding for the combined extracted text via OpenAI embeddings.
6. Upload screenshot to S3 and persist site record in Postgres.
7. Upsert vector into vector DB (Pinecone / pgvector).
8. Mark job done and emit result.

---

## Search & ranking

1. Build query embedding for copy + industry + styles.
2. Run ANN top-K search (Pinecone / pgvector).
3. Re-rank results:

\`\`\`
score = 0.6 * embedding_sim
      + 0.15 * industry_match
      + 0.10 * style_tag_match
      + 0.10 * popularity_norm
      - 0.05 * stale_penalty
\`\`\`

4. Return results with score and matched_by.

---

## Tech recommendations

- **Node.js + TypeScript**
- **Express** for local dev; serverless functions for small endpoints
- **BullMQ + Redis** for queue
- **Playwright** in Docker for screenshots (Render / Fly)
- **Pinecone** or **pgvector** for vector search
- **Postgres** for metadata (Supabase or RDS)
- **S3 / Spaces** for storage
- **OpenAI** for embeddings and generation

---

## Security, cost & legal

- Store OPENAI_API_KEY only server-side (Vercel env or worker env).
- Respect robots.txt and rate limits.
- Sanitize any HTML from LLM before rendering; use a sandboxed iframe.
- Monitor and limit OpenAI usage (per-user quotas) to control costs.

---

## Deployment notes

- **Frontend + light APIs:** Vercel
- **Worker (Playwright):** Render / Fly / DigitalOcean (Docker)
- **DB:** Supabase or RDS
- **Vector DB:** Pinecone (managed) or pgvector (self-hosted)
- Add environment variables: OPENAI_API_KEY, DATABASE_URL, REDIS_URL, S3_*

---

## Minimal local quickstart

1. Add .env (gitignored) with required variables.
2. Run API server: \`npm run dev\`
3. Run worker: \`node worker/index.js\` (or run Docker)
4. POST to /api/analyze and poll job status.
