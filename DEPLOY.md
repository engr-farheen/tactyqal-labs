# Deploy guide: GitHub, live website, live API (free, about 30 minutes)

You will finish with three links to submit: **GitHub repo**, **live website**, and (optional but recommended) **video**. The API and admin page get their own link too.

```
Visitor ──> Vercel (website, /web) ──> Render (API, /api) ──> Neon (PostgreSQL)
```

Free-tier limits change, so check each provider's pricing page if something looks different.

## 0. Accounts (all free, sign in with GitHub where offered)
GitHub (github.com), Neon (neon.tech), Render (render.com), Vercel (vercel.com).

## 1. Put the code on GitHub

1. Unzip `tactyqal-labs.zip`. You should see the folders `api`, `web`, `.github` and the files `README.md`, `render.yaml`.
2. On github.com click **+ → New repository**. Name: `tactyqal-labs`. Choose **Public**. Do **not** tick "Add a README" or ".gitignore". Click **Create repository**.
3. **Option A, with Git** (install from git-scm.com). Open a terminal inside the unzipped folder and run:
   ```bash
   git init -b main
   git add .
   git commit -m "Tactyqal Labs: Next.js website and PostgreSQL blog API"
   git remote add origin https://github.com/<your-username>/tactyqal-labs.git
   git push -u origin main
   ```
   When asked to sign in, use the browser prompt (or a Personal Access Token as the password).
4. **Option B, no commands:** install GitHub Desktop, choose *File → Add local repository*, pick the folder, then *Publish repository* (untick "Keep this code private").
5. Check on github.com: you see `api`, `web`, `.github`, no `node_modules` folder, and the README renders.
6. Open the **Actions** tab. The CI workflow runs by itself (API tests on two databases, lint, type check, build, browser tests). It turns green after a few minutes.
7. In `README.md`, replace `OWNER/REPO` in the badge line with `<your-username>/tactyqal-labs` and commit the change.

## 2. Database (Neon)

1. neon.tech → sign up → **Create project** (any name, choose a region near you).
2. On the dashboard click **Connect**, copy the **connection string**. It looks like `postgresql://user:password@ep-xxxx.neon.tech/neondb?sslmode=require`. Keep it private.

## 3. API (Render)

**Fastest: Blueprint.**
1. render.com → **New → Blueprint** → connect GitHub → select your repo. Render reads `render.yaml`.
2. When asked for `DATABASE_URL`, paste the Neon string. Click **Apply**.
3. Wait until the service says **Live**. Open the service → **Environment** and copy the generated `ADMIN_TOKEN` (you need it for the admin page).

**Manual alternative:** New → Web Service → your repo → Root Directory `api`, Build `npm install`, Start `npm start`, then add environment variables `NODE_ENV=production`, `PGSSL=true`, `TRUST_PROXY=1`, `DATABASE_URL=<Neon string>`, `ADMIN_TOKEN=<long random string>`.

Test (replace the host with yours):
- `https://<api>.onrender.com/api/health` shows `{"ok":true}`
- `https://<api>.onrender.com/docs` shows Swagger UI
- `https://<api>.onrender.com/admin` is the admin page: sign in with the token

On first start the API fills an empty database with the sample blog posts, so the website has articles immediately. To use your real WordPress posts instead, see step 6.

Free Render services sleep when idle, so the first request can take about a minute. Open `/api/health` a minute before a demo or recording. The website still renders while the API wakes up.

## 4. Website (Vercel)

1. vercel.com → **Add New → Project** → import the same repo.
2. Set **Root Directory** to `web`. The framework should read **Next.js**.
3. Add environment variables:
   - `API_URL` = `https://<api>.onrender.com`
   - `SITE_URL` = your final Vercel address, for example `https://tactyqal-labs.vercel.app` (you can add it after the first deploy)
4. Click **Deploy**. When it finishes, open the link.
5. If you added `SITE_URL` afterwards: **Deployments → ⋯ → Redeploy**.

## 5. Check everything

- [ ] The website opens on your phone. The blog section shows 6 articles.
- [ ] `/tools` works, and a quiz gives a result.
- [ ] The dark/light button and Ctrl+K search work.
- [ ] Submit the contact form, then open the API `/admin`, sign in, and see the request under **Consultation requests**.
- [ ] `/docs` on the API loads, and **Authorize** with your token lets you create a post.
- [ ] The Actions tab on GitHub is green.

## 6. Optional: import the real WordPress posts

1. Open `https://tactyqal.com/blog/wp-json/wp/v2/posts` in a browser. If you see JSON, the importer will work (use the right path if the blog lives elsewhere).
2. On your computer:
   ```bash
   cd api && npm install
   DATABASE_URL="<neon string>" PGSSL=true npm run import:wp -- --url https://tactyqal.com/blog --dry-run
   DATABASE_URL="<neon string>" PGSSL=true npm run import:wp -- --url https://tactyqal.com/blog
   ```
   (On Windows PowerShell set the variables first: `$env:DATABASE_URL="..."; $env:PGSSL="true"`.)
3. Refresh the website. New content shows within about a minute.

## 7. Video (3 to 4 minutes)

Follow `VIDEO_SCRIPT.md`. Record with Loom or OBS, upload to YouTube as **Unlisted** (or use the Loom link), and open the link in a private window to confirm it plays without login.

## 8. What to submit

- Live website URL
- GitHub repository URL
- Video link
- Optional note for reviewers (copy and adapt): *"Task 1: Next.js (App Router) homepage redesign with a light/dark theme, search, eight working tools and server-rendered blog pages. Task 2: Express + PostgreSQL blog API with Swagger docs, admin UI, a WordPress importer and a consultation-lead endpoint. 15 API tests (also run on real PostgreSQL), 5 unit tests, 32 Playwright browser tests, lint, type-check and CI. Live API docs at /docs, admin at /admin."*

## Troubleshooting

| Problem | Fix |
|---|---|
| Blog section says "Articles will appear here" | `API_URL` is wrong or the API is asleep. Open `<API_URL>/api/health`, wait, reload. |
| Render build or start fails | Open the logs. Usually `ADMIN_TOKEN` or `DATABASE_URL` is missing (the API refuses to start in production without a token). |
| `self-signed certificate` or SSL error | Keep `PGSSL=true` and `?sslmode=require` in the Neon string. |
| 401 when creating a post or opening admin | The token does not match `ADMIN_TOKEN` on Render. Repeated wrong tokens are rate limited (429); wait 10 minutes. |
| Changed an environment variable, nothing happens | Redeploy; Render and Vercel read variables only on a new deploy. |
| Contact form says "could not reach our server" | The API is asleep or `API_URL` is wrong. |
| Git asks for a password and rejects it | GitHub needs a Personal Access Token instead of a password, or use GitHub Desktop. |
