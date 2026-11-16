# Tactyqal Labs: homepage redesign and blog backend

[![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/ci.yml)

Two apps in one repo.

| Folder | What it is | Stack |
|---|---|---|
| `web/` | Task 1: redesigned, responsive, animated homepage plus server-rendered blog pages | Next.js 16 (App Router), React 19 |
| `api/` | Task 2: blog backend with CRUD API, Swagger docs, admin UI and a WordPress importer | Node, Express 5, PostgreSQL, zod |

## Run it locally

```bash
# terminal 1: API (http://localhost:4000, no database setup needed)
cd api && npm install && npm start

# terminal 2: website (http://localhost:3000)
cd web && npm install && cp .env.example .env.local && npm run dev
```

Or run everything with Docker: `docker compose up --build`.

- Website: `http://localhost:3000` and `/blog`
- API docs (Swagger UI): `http://localhost:4000/docs`
- Blog admin: `http://localhost:4000/admin` (local token: `dev-admin-token`)

Without `DATABASE_URL` the API uses PGlite, which is real PostgreSQL running in-process, and seeds sample posts on first run. For production see [DEPLOY.md](DEPLOY.md).

## Content and images

All copy (success stories, program, FAQ, pricing, contact details, blog excerpts and read times) comes from the live tactyqal.com page. The app screenshots, blog covers, testimonial portraits and video thumbnail in `web/public/img/` were cropped from screenshots of that site, so every box shows a real image. Each blog post also keeps a `source_url` pointing to the original article, and the article page links to it.

**Image quality.** Every image slot lists its sources best-first: the page asks for the original full-resolution file on tactyqal.com (or YouTube's `maxresdefault` thumbnail) and falls back to the local copy in `web/public/img` if that fails. To self-host the originals, run `cd web && npm run images:hd` once on a machine with internet access; it downloads and optimises them into `public/img`.

**How the local images were improved.** Because the original files could not be downloaded in the build environment, the local copies were rebuilt from screenshots with JPEG de-noising, a 2x super-resolution model (FSRCNN) and light sharpening. They are cleaner than plain resizing but cannot be true HD; the originals are used first whenever the browser can reach them.

**Video.** The "Startup Ideas 101" lesson uses a click-to-load YouTube player (privacy-enhanced `youtube-nocookie.com` embed starting at 1:45), so no video code loads until the visitor presses play.

## Task 1: web

- `/` homepage, `/blog` list with search and pagination, `/blog/[slug]` article pages.
- Server components fetch the blog from the API on the server, so the HTML that search engines receive already contains the content. Includes per-page metadata, Open Graph tags, JSON-LD `Article` data, `sitemap.xml` and `robots.txt`.
- **Contact form**: a real form (name, email, optional phone and message) built with a React server action. It posts to `POST /api/leads`, shows validation errors without losing what the visitor typed, and ends with an animated confirmation. A floating "Book Free Consultation" bar follows the visitor and hides itself while the form is on screen.
- **Design**: forest green, lime, coral and marigold palette (no blue or purple), animated phone mockup in the hero, rotating offer seal, scrolling app marquee, a rocket that flies along the 8-week timeline as you scroll.
- **Eight working tools** at `/tools` and `/tools/<name>` (idea generator, fundability, team evaluation, pitch deck analyzer, top 10 traits, cofounder compatibility, problem-solution fit, landing page assessment). They run on the site, score with a tested pure-function engine (`src/lib/tools.js`), and show an animated result with strengths, priorities and tips. Nothing leaves the visitor's browser. Tool pages are statically generated.
- **Navigation.** Desktop links have an animated underline, tap/hover colour feedback and a scroll-spy that highlights the section you are reading. On mobile the menu is a full-height panel with numbered rows, staggered entrance, animated arrows, a hamburger-to-X morph, scroll lock, Escape and outside-click to close, and a booking button at the bottom.
- **Site search (Ctrl/Cmd+K or the magnifier).** A keyboard-driven palette searches pages and tools instantly and blog articles through the API's PostgreSQL full-text search. Article pages also have a share button and related articles.
- **Light and dark theme.** Follows the system setting on the first visit, remembers the visitor's choice, and is applied before first paint so there is no flash. Both themes pass the accessibility audit.
- If the API is down or asleep the homepage still renders, with an empty-state message in the blog section.
- Only four small client components: header (menu and scroll progress), count-up numbers, hero parallax and the video that plays when visible. Scroll reveals use CSS scroll-driven animations (`animation-timeline: view()`), so they need no JavaScript, and browsers without support simply show the content.
- Cards tilt in 3D with a moving highlight, buttons have a cursor-following glow, magnetic lean, click ripple and confetti on the main calls to action. All motion respects `prefers-reduced-motion`. Illustrations are inline SVG and sit underneath the real screenshots from tactyqal.com, so every box looks complete even if an image fails to load.

## Task 2: api

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/posts` | public | `page`, `limit` (max 50), `q` (full-text), `category`, `tag`. Published only. `status=all\|draft` needs the token. |
| GET | `/api/posts/:slug` | public | Drafts return 404 unless the token is sent. |
| POST | `/api/posts` | admin | Slug, excerpt and read time are generated (a `read_minutes` value can be supplied). Optional `source_url` and a `cover_image` that is a full URL or a `/path` served by the website. |
| PUT / PATCH | `/api/posts/:id` | admin | Partial updates. The slug never changes, so URLs stay stable. |
| DELETE | `/api/posts/:id` | admin | 204 on success. |
| POST | `/api/leads` | public | Consultation request. Validated, honeypot-protected and rate limited (5 per IP per 10 minutes). |
| GET / PATCH | `/api/leads`, `/api/leads/:id` | admin | List requests; change status to new, contacted or closed. Also shown in `/admin`. |
| GET | `/api/categories`, `/api/health`, `/api/openapi.json` | public | |

Errors share one shape: `{ "error": { "code", "message", "details?" } }`.

**Schema** (`api/src/schema.sql`): one `posts` table with a `status` check constraint, `TEXT[]` tags with a GIN index, a generated `tsvector` column with a GIN index for search, and a composite index on `(status, published_at)` for the listing query.

**Security**: parameterised SQL everywhere, zod validation on every input, constant-time token comparison, Helmet headers, a request size limit, and the API refuses to start in production without `ADMIN_TOKEN`. Article bodies are rendered as React text nodes, so stored content cannot inject HTML.

### Import the existing WordPress blog

```bash
cd api
npm run import:wp -- --url https://tactyqal.com/blog --dry-run   # preview, writes nothing
npm run import:wp -- --url https://tactyqal.com/blog             # import
npm run import:wp -- --file export.json                          # or from a saved REST response
```

It reads `/wp-json/wp/v2/posts`, converts the HTML to the blog's text format, keeps categories, tags, author, cover image and publish date, and is safe to re-run: posts are matched by slug and updated, never duplicated.

## Testing and CI

| Layer | What | Command |
|---|---|---|
| API | 15 tests: CRUD, validation, search, drafts, leads, rate limits, WordPress importer, OpenAPI. Run on embedded PostgreSQL and on a real PostgreSQL 16 (`TEST_DATABASE_URL`). | `cd api && npm test` |
| Tools engine | 5 unit tests for scoring, bands and the idea generator | `cd web && npm test` |
| Static checks | ESLint (Next.js rules) and a strict `tsc` check of the typed core (`src/lib`, JSDoc types) | `cd web && npm run lint && npm run typecheck` |
| Browser | 32 Playwright tests on desktop and a phone viewport: sections, image loading, navigation, theme, search, 8 tools, blog, 404s, contact form saved to the API, axe accessibility in both themes | `cd web && npm run e2e` |

`.github/workflows/ci.yml` runs all of the above on every push and pull request (API on two databases, web, then e2e). Dependabot keeps dependencies current. TypeScript was not adopted for the components (the brief lists JavaScript); the typed core is checked in CI and can be widened step by step.

## Verification

- All suites above pass locally. Writing the browser tests found and fixed a real SEO bug: unknown article URLs returned HTTP 200 instead of 404 because of a route-level loading UI.
- OpenAPI spec validated with swagger-parser. `npm audit` reports 0 known vulnerabilities in both apps.
- Every rendered page was validated with html-validate (the only remaining note is React's own `action=""` on the server-action form) and audited with axe-core in light and dark themes.
- Homepage: all images load, all internal links and anchors resolve, no console errors, no horizontal overflow at 360, 390 and 768 px.

## Security notes

Admin writes need a bearer token compared in constant time, with failed attempts rate limited; the lead form has a honeypot and a rate limit; all SQL is parameterised; inputs are validated with zod; the website sends `nosniff`, referrer, frame and permissions headers; article and tool text is rendered as text, never as HTML.

## Known limits

Single shared admin token (no per-user accounts), no image uploads (cover images are URLs), and the importer was tested against a fixture because the live WordPress site could not be reached from the build environment.
