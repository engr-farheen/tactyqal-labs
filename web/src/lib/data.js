export const BOOK = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3JlaCrNitoPs8Bdr-FUP0cRfFI-MopSIH2azaPNDpRk56h6drYLbXSh-mDc9sfEZAQUKGdsUXs?gv=true';
export const IMG = 'https://www.tactyqal.com/application/assets/img/apps/';
export const NAV = [['/#success', 'Success stories', 'success'], ['/#program', 'Program', 'program'], ['/#why', 'Why us', 'why'], ['/tools', 'Tools', 'tools'], ['/blog', 'Blog', 'blog'], ['/#pricing', 'Pricing', 'pricing'], ['/#faq', 'FAQ', 'faq'], ['/#contact', 'Contact', 'contact']];
export const TAGS = ['1:1 Mentoring', 'Idea to full-stack app', 'No coding', 'Admissions to the best colleges', 'Grants', 'Media coverage'];
// [name, chip, description (as on tactyqal.com), image file in /img/apps]
export const STORIES = [
  ['KrishiDrishti', 'AI · AgriTech', 'AI-powered soil analysis & crop recommendation app that can impact millions of local farmers in India.', 'krishidrishti'],
  ['Elenor Vegan Handbags', 'Started at 16 · ₹9,000 in week one', 'Corporate gifting platform that sells vegan handbags, started by a 16 year old and generated INR 9,000 in the first week.', 'elenor'],
  ['One Last Chapter', 'Started at 13 · ₹1,00,000 a month', 'Book subscription service for kids. Started by a 13-year old and is generating INR 100,000 month revenue.', 'olc'],
  ['Paws of Promise', 'Pet adoption', 'App for virtual pet adoption that connects pet lovers with pets from shelters.', 'paws'],
  ['AudioNova', 'AI · Media', 'AI music/video production company', 'audionova'],
  ['Converza', 'Spanish learning app', 'Language learning app featuring Luna the friendly AI language learning bot', 'converza'],
];
export const STEPS = [['Week 1–2', 'Ideation & market research', 'bulb'], ['Week 3–4', 'Design & prototyping', 'layout'], ['Week 5–6', 'Full-stack development', 'code'], ['Week 7–8', 'Launch & marketing', 'rocket']];
export const WHY = [
  ['user', '1:1 personalized mentoring', 'Every student gets dedicated, expert guidance. No group classes.'], ['layers', 'Full-stack app with no-code', 'Build real apps using modern no-code tools and platforms.'],
  ['trend', 'Proven track record', '50+ successful students, real revenue, and top university admits.'], ['cap', 'University admission edge', 'Stand out in applications with real-world projects and achievements.'],
  ['coin', 'Revenue generation', 'Students learn to build, launch, and monetize their own apps.'], ['heart', 'Lifelong support', 'From ideation to launch, students master the full journey.'],
  ['mic', 'Pitch & presentation skills', 'Learn to pitch, present, and launch on Product Hunt.'], ['bulb', 'Startup ideas 101', 'Identify and validate profitable startup ideas, taught by our founder.'],
];
export const QUOTES = [
  ['Aarav Sharma', 'I had to struggle to find a tech cofounder', 'aarav'], ['Isha Patel', 'Now I feel independent and can build anything I want', 'isha'], ['Rohan Verma', "It's the future", 'rohan'],
  ['Simran Kaur', "I can focus on the creative side and don't have to worry about whether it can be built", 'simran'], ['Devansh Mehta', 'I went on from having no idea to launching my app', 'devansh'], ['Priya Nair', 'My impact app was only in my head till I built it', 'priya'],
];
export const PERKS = ['Personal 1:1 live sessions', '1 hour each', 'Expert guidance'];
export const AVATAR = ['#C8F135', '#FFB800', '#FF9EB5', '#DDF3E4', '#FF5A36', '#E7F8A8'];
export const INCLUDED = ['8 weeks of 1:1 mentoring', 'Full-stack app development', 'Product Hunt launch', 'Pitch deck creation', 'Marketing strategy', 'Ongoing support'];
export const FAQS = [
  ['What if my teen has no coding experience?', 'No problem! Our program is designed for beginners. We use no-code tools and guide students step-by-step.'],
  ['How do you guarantee university admissions?', 'We help students build standout projects that strengthen their university applications.'],
  ['What kind of apps do students typically build?', 'Apps range from AI-powered tools, e-commerce platforms, subscription services, to social good projects. We help students pick ideas that excite them.'],
  ['How much time commitment is required?', 'About 2-3 hours per week, including 1 hour of live mentoring and independent work.'],
  ['What is the success rate?', '100% of our students launch a working app and achieve their goals.'],
  ['Can my teen generate real revenue?', 'Yes! Many of our students have generated real revenue and even won grants & media coverage.'],
  ['What universities have your students gotten into?', 'Our alumni have been admitted to top universities in the US, UK, including Ivy League.'],
  ['What ongoing support do you provide?', 'We offer ongoing support, alumni community, and guidance even after the program ends.'],
];

// Image sources, best quality first: the original file on tactyqal.com, then the local copy in /public/img.
const APPS = 'https://www.tactyqal.com/application/assets/img/apps/';
const APP_FILE = { krishidrishti: 'krishidrishti1.png', elenor: 'elenor1.png', olc: 'olc1.png', paws: 'pop1.png', audionova: 'audionova1.png', converza: 'converza1.png' };
export const appImg = (f) => [APPS + APP_FILE[f], `/img/apps/${f}.jpg`];
const PORTRAIT = { aarav: 'men/65', isha: 'women/68', rohan: 'men/66', simran: 'women/69', devansh: 'men/67', priya: 'women/70' };
export const portrait = (f) => [`https://randomuser.me/api/portraits/${PORTRAIT[f]}.jpg`, `/img/people/${f}.jpg`];
export const BLOG_KEYS = ['pitch', 'team', 'fail', 'nocode', 'food', 'genz'];
