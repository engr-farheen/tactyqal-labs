import { migrate, query } from './db.js';
import { createPost } from './posts.js';

// Original covers on tactyqal.com (full quality). The website falls back to its local copies in web/public/img/blog.
const COVERS = { pitch: 'blog-ele.png', team: 'blog-startup.png', fail: 'blog-fail.png', nocode: '50-No-Code-Startup-Ideas-You-Can-Build-Without-Programming-Skills.webp', food: '30-startup-ideas-for-food-waste-problems.jpg', genz: '50-Startup-Ideas-for-Generation-Z-Entrepreneurs.jpg' };
const L = (f) => `https://www.tactyqal.com/application/assets/images/${COVERS[f]}`;
const posts = [
  { title: 'The elevator pitch for business entrepreneurs', category: 'Pitching', tags: ['pitch', 'fundraising'], cover_image: L('pitch'), at: '2024-05-01', read_minutes: 3,
    excerpt: 'An elevator pitch is the fastest way to describe what your startup...', source_url: 'https://www.tactyqal.com/blog/elevator-pitch-with-examples-for-business-entrepreneurs/',
    content: `An elevator pitch answers one question in about thirty seconds: why should anyone care?\n\n## Start with the problem\n\nName who has the problem and how often it hurts them. A farmer who guesses at soil health every season is a better opening than "we use AI".\n\n## Finish with an ask\n\nEnd with one next step: a demo, an intro, or ten minutes of feedback. A pitch without an ask is just a speech.` },
  { title: 'How to build a tech startup team?', category: 'Teams', tags: ['team', 'cofounders'], cover_image: L('team'), at: '2024-04-20', read_minutes: 4,
    excerpt: 'In the early days, the fewer employees, the better. Managing people takes up a lot of time...', source_url: 'https://www.tactyqal.com/blog/how-to-build-a-tech-startup-team-2/',
    content: `In the early days, fewer people means faster decisions. Add a teammate only when a specific job is blocking you.\n\n## Look for complements\n\nIf you design and sell, find someone who builds. If you build, find someone who talks to customers.\n\n## Test before you commit\n\nWork on a small project together for two weeks before you share equity.` },
  { title: '11 reasons why startups fail at the idea stage', category: 'Startups', tags: ['validation', 'ideas'], cover_image: L('fail'), at: '2024-04-10', read_minutes: 3,
    excerpt: 'The default state of a startup is failure and there are many...', source_url: 'https://www.tactyqal.com/blog/11-reasons-why-startups-fail-at-idea-stage/',
    content: `Most ideas fail quietly, before a single line of code is written.\n\n## The common causes\n\nNo real customer, a problem that is only mildly annoying, and a solution built before anyone was asked.\n\n## The fix\n\nTalk to ten people who have the problem. If none of them would pay or switch, change the idea, not the pitch.` },
  { title: '50 No-code startup app ideas', category: 'No-code', tags: ['no-code', 'ideas'], cover_image: L('nocode'), at: '2025-07-09', read_minutes: 5,
    excerpt: 'Find a list of 50 unique ideas you can explore for your startup...', source_url: 'https://tactyqal.com/blog/50-no-code-startup-ideas-to-build-without-programming-skills/',
    content: `You can launch a real product without writing code. Tools for databases, forms, payments and automations now cover most first versions.\n\n## Pick a narrow audience\n\nA booking app for one type of local business beats a booking app for everyone.\n\n## Ship in weeks\n\nBuild the smallest version that one real person can use, then improve it from their feedback.` },
  { title: '30 Startup ideas to solve food waste problems', category: 'Impact', tags: ['impact', 'ideas'], cover_image: L('food'), at: '2024-03-15', read_minutes: 4,
    excerpt: 'Food waste is a massive problem. Every year, we throw away one-third of all food...', source_url: 'https://tactyqal.com/blog/30-startup-ideas-for-solving-food-waste-problems/',
    content: `Around a third of all food produced is thrown away, which makes waste a large and measurable problem to solve.\n\n## Where to look\n\nFarms and storage, restaurants and grocers, and homes all lose food for different reasons. Choose one and learn it deeply.\n\n## Start with data\n\nA simple tracker that shows what gets thrown away is often the first useful product.` },
  { title: '50 Startup ideas for Gen-Z Entrepreneurs', category: 'Startups', tags: ['gen-z', 'ideas'], cover_image: L('genz'), at: '2024-03-05', read_minutes: 6,
    excerpt: 'Looking at the opportunities ahead, Generation Z entrepreneurs has advantages..', source_url: 'https://tactyqal.com/blog/50-startup-ideas-for-generation-z-entrepreneurs/',
    content: `Young founders understand their peers better than any adult can, and that is a real advantage.\n\n## Build for people you know\n\nStudy tools, creator tools and local services are all problems you can see from the inside.\n\n## Use your age\n\nSchools, clubs and communities make a friendly first group of users.` },
];

export async function seedIfEmpty() {
  const { rows } = await query('SELECT count(*)::int AS n FROM posts');
  if (rows[0].n) return false;
  for (const { at, ...p } of posts) await createPost({ ...p, status: 'published' }, new Date(at).toISOString());
  await createPost({ title: 'Draft: how our students validate ideas in week one', status: 'draft',
    content: 'Outline in progress. Drafts stay hidden from the public blog until published.' });
  return true;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await migrate();
  console.log((await seedIfEmpty()) ? 'Seeded.' : 'Posts already exist; nothing to do.');
  process.exit(0);
}
