# Video walkthrough script (about 4 minutes)

**Tools:** Loom (easiest), OBS Studio, or the screen recorder built into Windows or macOS. Record at 1080p, microphone on, notifications off. Upload to YouTube as **Unlisted** or use the Loom share link, and open it once in a private window to confirm it plays without login.

**Before you press record:** wake the API (open `/api/health`), open these tabs in order: live website, `/blog`, API `/docs`, API `/admin`, GitHub repo, and the terminal in the project folder.

---

### 0:00 to 0:25 | Intro (face or title slide)
> "Hi, I'm **[your name]**. This is my submission for the Tactyqal Labs Full Stack Developer Intern hire-a-thon. I built both tasks: a redesigned Next.js homepage and a blog backend with a PostgreSQL database and a full CRUD API. I'll show the live demo first and then the code."

### 0:25 to 1:30 | Task 1: homepage (live website tab)
Scroll slowly from top to bottom.
> "The old site was dense and hard to scan, so I rebuilt it as a story for parents. The headline states the promise in one line. The hero shows real student apps with proof points: a 13-year-old at ₹1,00,000 a month, a 16-year-old at ₹9,000 in the first week."

- Move the mouse over the hero: "The cards float and react to the mouse."
- Scroll to **Success stories**: "Every box has an illustration under the real screenshot, so nothing ever looks empty."
- Scroll to **Program** and **Why us**: "Scroll-driven animations are plain CSS, no JavaScript, and they respect the reduced-motion setting."
- Scroll to the contact section and submit the form: "The form is a React server action that saves the request in PostgreSQL." Show the thank-you animation, and later the request in `/admin`.
- Press **Ctrl+K** (or tap the magnifier) and search "pitch": "One search box finds pages, tools and, through the API's PostgreSQL full-text search, blog articles."
- On the phone view open the menu and point out the animated underline, numbered rows and the highlighted current section.
- Click the sun/moon button: "The site has a light and a dark theme; it remembers the choice and follows the system setting."
- Scroll to **Free tools** and open one: "These are real tools, not links to the old site. This one scores eight answers and shows an animated result with priorities." Finish a quiz and click Retake or Copy my result.
- Open the phone view (browser dev tools, 390 px wide): "Fully responsive, with a mobile menu."

### 1:30 to 2:10 | Blog pages (SEO and server rendering)
- Click a blog card, then show the article page.
- Right-click, **View page source**, and search for the article title.
> "This is server rendered, so the content is in the HTML that Google receives. Each article has its own title, description, Open Graph tags and JSON-LD, and there is a sitemap."
- Go to `/blog`, search for a word, and show pagination if you have more than 9 posts.

### 2:10 to 3:10 | Task 2: backend (API docs and admin tabs)
- Open `/docs`: "The API is documented with Swagger, generated from an OpenAPI spec."
- Click **Authorize**, paste the token. Run **POST /api/posts** with a title and content, status `published`. Show the `201` response with the generated slug, excerpt and read time.
- Switch to the website `/blog` and reload: "The new post is already on the site." (If it is not there yet, wait up to a minute: responses are cached for 60 seconds. Mention this.)
- Run **GET /api/posts?q=...** to show full-text search. Run **DELETE** to remove the demo post.
- Open `/admin`: "A small admin UI to create, edit, publish and delete posts, and to see consultation requests from the website form."

### 3:10 to 3:50 | Code and quality (GitHub repo tab, then terminal)
> "The repo has two folders: `web` for Next.js and `api` for Express and PostgreSQL."
- Open `api/src/schema.sql`: "One posts table with a status constraint, array tags, and a generated full-text search column with indexes."
- Open `api/src/app.js`: "Validation with zod on every input, parameterised SQL, constant-time token check, consistent error format."
- In the terminal run `cd api && npm test`: "15 API tests pass, also against a real PostgreSQL 16. The repo also has unit tests, 32 Playwright browser tests, lint, a type check, and GitHub Actions CI that runs all of it."
- Mention `api/scripts/import-wordpress.js`: "A re-runnable importer that migrates the existing WordPress posts."

### 3:50 to 4:15 | Close
> "What I'd do next: per-user authentication, image uploads, a rich-text editor, and a scheduled sync with WordPress during the migration. Thanks for watching. The live URL and the GitHub link are in my submission."

---

**Tips:** Speak slowly and pause on each screen. If something fails on camera, say what happened and move on; do not restart. Keep the video under 5 minutes.
