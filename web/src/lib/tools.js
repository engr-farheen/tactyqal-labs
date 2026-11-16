// Data and scoring for the free startup tools. Pure functions, no DOM: used by the website and by the unit tests.

/** @typedef {[category: string, text: string]} Question */
/** @typedef {[minPercent: number, label: string, summary: string]} Band */
/** @typedef {{ slug: string, name: string, icon: string, minutes: number, blurb: string, about: string }} ToolBase */
/** @typedef {ToolBase & { type: 'quiz', scale: string[], cats: Record<string, string>, q: Question[], bands: Band[] }} QuizTool */
/** @typedef {ToolBase & { type: 'generator' }} GeneratorTool */
/** @typedef {QuizTool | GeneratorTool} Tool */
/** @typedef {{ interest?: unknown, audience?: unknown, model?: unknown }} IdeaInput */
/** @typedef {{ title: string, tagline: string, step: string, tags: string[] }} Idea */
/** @typedef {{ pct: number, band: { label: string, summary: string }, breakdown: { name: string, pct: number, tip: string }[], priorities: { name: string, pct: number, tip: string }[], strengths: { name: string, pct: number, tip: string }[] }} QuizResult */
const S4 = ['Not yet', 'Just started', 'Mostly', 'Fully'];
/** @param {...[string, string]} s  label and summary for each of the four score bands, best first
 * @returns {Band[]} */
const bands = (...s) => [[80, ...s[0]], [60, ...s[1]], [35, ...s[2]], [0, ...s[3]]];

/** @type {Tool[]} */
export const TOOLS = /** @type {Tool[]} */ ([
  { slug: 'startup-idea-generator', name: 'Startup Idea Generator', icon: 'bulb', type: 'generator', minutes: 1,
    blurb: 'Pick an interest and an audience and get six fresh startup ideas, each with a first step.',
    about: 'Great startups begin with a real problem for a specific group of people. This generator combines a topic you care about with an audience and a business model, then gives you ideas to test, not to build yet.' },
  { slug: 'fundability-assessment', name: 'Fundability Assessment', icon: 'trend', type: 'quiz', minutes: 2, scale: S4,
    blurb: 'See how ready your startup is for investors across team, traction, market and pitch.',
    about: 'Investors look for four things: a capable team, proof that people want the product, a big enough market and a clear story. Answer honestly to see where you stand.',
    cats: {
      Team: 'Add the missing skill: a builder if you sell, a seller if you build. Investors back teams, not only ideas.',
      Traction: 'Get 10 people to use or pre-order before you raise. Small proof beats a big plan.',
      Market: 'Size your market bottom-up (customers x price) and list three competitors with your difference.',
      Pitch: 'Practise a 30-second pitch and write a one-page plan for how every rupee of funding will be used.' },
    q: [['Team', 'Our founders cover both building the product and selling it.'], ['Team', 'Every founder is committed, full-time or with an agreed plan.'],
      ['Traction', 'Real users have tried our product and given feedback.'], ['Traction', 'People have paid, pre-ordered or joined a waiting list.'],
      ['Market', 'We can size our market with numbers, not guesses.'], ['Market', 'We know our competitors and why customers would choose us.'],
      ['Pitch', 'We can explain what we do in 30 seconds.'], ['Pitch', 'We know how much money we need and what it will be used for.']],
    bands: bands(['Investor-ready', 'Your team, proof and story are strong. Start talking to investors and keep collecting evidence.'],
      ['Promising', 'You have solid foundations. Close the gaps below and you will pitch with confidence.'],
      ['Building momentum', 'There is potential, but investors will want more proof. Focus on the priorities below first.'],
      ['Too early to raise', 'That is normal at the start. Spend the next weeks talking to customers and building a first version.']) },
  { slug: 'team-evaluation-tool', name: 'Team Evaluation Tool', icon: 'users', type: 'quiz', minutes: 2, scale: S4,
    blurb: 'Check whether your team has the skills, commitment and communication to succeed.',
    about: 'Most startups fail because of people problems, not product problems. This quick check shows how healthy your team is today.',
    cats: {
      Skills: 'List the skills you need to launch. Fill each gap with a teammate, a mentor or a short course.',
      Commitment: 'Agree weekly hours in writing and decide what happens if someone leaves.',
      Communication: 'Hold a 20-minute weekly check-in. Share wins, blockers and one thing to improve.',
      Roles: 'Give each person two or three clear responsibilities and decide who has the final say.' },
    q: [['Skills', 'Between us we have the skills to launch: product, design and selling.'], ['Skills', 'When we get stuck we know who can solve it, inside or outside the team.'],
      ['Commitment', 'Everyone puts in the hours we agreed, consistently.'], ['Commitment', 'We have agreed what happens if someone wants to leave.'],
      ['Communication', 'We meet regularly and everyone speaks openly.'], ['Communication', 'We can disagree on ideas and still stay respectful.'],
      ['Roles', 'Each person owns clear tasks and knows what is expected.'], ['Roles', 'We decide things quickly and know who has the final say.']],
    bands: bands(['High-performing team', 'You are well set up. Keep the weekly rhythm and revisit roles as you grow.'],
      ['Solid team', 'Good foundations with a few gaps. Fix the priorities below and you will move faster.'],
      ['Team under strain', 'Some basics are missing. Talk openly about the priorities below this week.'],
      ['Needs a reset', 'Pause and agree roles, hours and expectations before building more.']) },
  { slug: 'pitch-deck-analyzer', name: 'Pitch Deck Analyzer', icon: 'deck', type: 'quiz', minutes: 2, scale: ['Missing', 'Weak', 'Good', 'Strong'],
    blurb: 'Rate each slide of your deck and find out which ones to improve before you pitch.',
    about: 'Open your deck and rate each slide honestly. The analyzer shows which part of your story is weakest so you know what to fix first.',
    cats: {
      Story: 'Open with one painful problem and a real example, then show the simplest version of your solution.',
      Market: 'Back your market size with a source, compare yourself fairly with competitors and show how you earn money.',
      Proof: 'Lead with numbers: users, revenue or pilots. Add one line on why this team is right.',
      Close: 'End with a clear ask (amount and use) and a 12-month roadmap.' },
    q: [['Story', 'Problem slide: one clear pain point with a real example'], ['Story', 'Solution slide: a simple explanation of how you fix it'], ['Story', 'Product slide: screenshots or a short demo'],
      ['Market', 'Market slide: a size with a source'], ['Market', 'Competition slide: an honest comparison and your edge'], ['Market', 'Business model slide: how you make money'],
      ['Proof', 'Traction slide: users, revenue or pilots'], ['Proof', 'Team slide: why you are the right people'],
      ['Close', 'The ask: how much you need and what it is for'], ['Close', 'Vision slide: roadmap and where you are heading']],
    bands: bands(['Pitch-ready deck', 'Your story flows and every key slide is strong. Rehearse it out loud.'],
      ['Nearly there', 'A good deck with a few weak slides. Improve the priorities below and rehearse.'],
      ['Needs work', 'Key slides are missing or thin. Fix the priorities below before sending it to anyone.'],
      ['Start with the basics', 'Build the core story first: problem, solution, market and ask.']) },
  { slug: 'top-10-traits-for-business-success', name: 'Top 10 Traits For Business Success', icon: 'star', type: 'quiz', minutes: 3, scale: ['Rarely', 'Sometimes', 'Often', 'Almost always'],
    blurb: 'Rate yourself on ten founder traits and see your strengths and growth areas.',
    about: 'Successful founders are not born, they build habits. Rate yourself honestly on ten traits and see which to use and which to train.',
    cats: {
      Resilience: 'Treat each setback as data. Write down what happened and one change for next time.',
      Curiosity: 'Ask five why-questions about anything you use today. Read or watch one new thing weekly.',
      Discipline: 'Pick one daily task and do it for 30 days. Track it on a calendar.',
      Communication: 'Explain your idea to a friend in one minute. Ask what was unclear and improve it.',
      Creativity: 'Write ten solutions to a problem, including silly ones. Keep the best two.',
      Leadership: 'Lead a small project. Share the goal, assign tasks and thank people publicly.',
      'Calculated risk-taking': 'Before a big decision write the worst case and how to recover. Then test small.',
      Adaptability: 'Review your plan every two weeks and drop what is not working without guilt.',
      Ownership: 'Replace "it was their fault" with "what could I have done differently?"',
      'Customer empathy': 'Interview three people about a problem. Listen without suggesting solutions.' },
    q: [['Resilience', 'I keep going after a setback instead of giving up.'], ['Curiosity', 'I ask questions and love learning how things work.'], ['Discipline', 'I finish what I start, even when no one is checking.'],
      ['Communication', 'I can explain my ideas clearly to different people.'], ['Creativity', 'I come up with new ways to solve problems.'], ['Leadership', 'People are happy to follow when I take charge.'],
      ['Calculated risk-taking', 'I try new things after thinking through what could go wrong.'], ['Adaptability', 'I change my plan quickly when the facts change.'],
      ['Ownership', 'I take responsibility instead of blaming others.'], ['Customer empathy', 'I understand how other people feel about a problem.']],
    bands: bands(['Founder mindset', 'You show most of the traits that build companies. Pick one growth area and keep stretching.'],
      ['Strong foundations', 'A great base. Training your lowest two traits will make a big difference.'],
      ['Growing founder', 'You have strengths to build on. Work on the priorities below one habit at a time.'],
      ['Just getting started', 'Every trait here can be trained. Start with one small habit this week.']) },
  { slug: 'cofounder-compatibility-test', name: 'Cofounder Compatibility Test', icon: 'heart', type: 'quiz', minutes: 2, scale: ['Not aligned', 'Unsure', 'Mostly aligned', 'Fully aligned'],
    blurb: 'Answer about you and your cofounder to see how aligned you are, and what to discuss.',
    about: 'Think of your cofounder (or the person you may start with) and answer for both of you. The result shows where you are aligned and which conversations to have early.',
    cats: {
      Vision: 'Write down where each of you wants the company in five years, then compare.',
      Commitment: 'Agree weekly hours and a minimum time commitment, and write it down.',
      'Money & equity': 'Discuss equity, investment and pay openly and put the agreement in writing.',
      'Working style': 'Share how you each like to work and handle conflict. Agree how to raise issues early.' },
    q: [['Vision', 'We want the same outcome: lifestyle business, fast growth or social impact.'], ['Vision', 'We agree on who our customer is and what to build first.'],
      ['Commitment', 'We can give a similar number of hours each week.'], ['Commitment', 'We are both ready to stay for at least a year.'],
      ['Money & equity', 'We have talked openly about equity split and who invests what.'], ['Money & equity', 'We agreed how salaries and profits will be handled.'],
      ['Working style', 'Our strengths complement each other instead of overlapping.'], ['Working style', 'We handle conflict by talking early, not avoiding it.']],
    bands: bands(['Great match', 'You are strongly aligned. Put your agreements in writing and start building.'],
      ['Good match', 'You agree on most things. Discuss the priorities below to avoid surprises later.'],
      ['Needs conversations', 'Important topics are unclear. Talk through the priorities below before committing.'],
      ['Not yet aligned', 'There are big gaps. Have honest conversations first, or consider other partners.']) },
  { slug: 'problem-solution-fit', name: 'Problem-Solution Fit', icon: 'target', type: 'quiz', minutes: 2, scale: S4,
    blurb: 'Test whether your idea solves a painful problem for people who will really use it.',
    about: 'A startup works when a real problem meets a better solution. Rate your idea on the problem, the customer, the solution and the proof.',
    cats: {
      Problem: 'Write the problem in one sentence without naming your product. Ask if people say "yes, exactly".',
      Customer: 'Define one specific customer group and talk to ten of them this week.',
      Solution: 'Compare your idea with how people solve it today and list three clear advantages.',
      Proof: 'Build the smallest test: a mock-up, a waiting list or a pre-order, and measure real reactions.' },
    q: [['Problem', 'The problem is painful and happens often for the people we target.'], ['Problem', 'We can describe it in one sentence without mentioning our product.'],
      ['Customer', 'We know exactly who has this problem and where to find them.'], ['Customer', 'We have talked to at least ten of them.'],
      ['Solution', 'Our solution is clearly better than how they solve it today.'], ['Solution', 'People understand what we do within ten seconds.'],
      ['Proof', 'Someone has tried an early version and wants more.'], ['Proof', 'People are willing to pay, or give their time, to use it.']],
    bands: bands(['Strong fit', 'Your idea matches a real need. Focus on growth and keep listening to users.'],
      ['Promising fit', 'The idea shows potential. Strengthen the priorities below with real conversations.'],
      ['Fit not proven', 'You have hypotheses, not evidence yet. Test the priorities below before building more.'],
      ['Back to discovery', 'Spend time with customers first. Come back when you can describe their problem in their words.']) },
  { slug: 'landing-page-assessment', name: 'Website Landing Page Assessment', icon: 'layout', type: 'quiz', minutes: 2, scale: S4,
    blurb: 'Score your landing page on message, conversion, trust and experience.',
    about: 'A landing page has one job: turn a visitor into a customer or a lead. Open your page and answer honestly to see what to fix first.',
    cats: {
      Message: 'Rewrite the headline so a stranger knows what you offer in five seconds. Lead with benefits.',
      Conversion: 'Keep one main button above the fold and cut the form to the fields you really need.',
      Trust: 'Add real testimonials, numbers and a visible contact or team section.',
      Experience: 'Test on a phone. Compress images, use readable text and remove pop-ups that block content.' },
    q: [['Message', 'Visitors understand what we offer from the headline alone.'], ['Message', 'We explain benefits for the visitor, not only features.'],
      ['Conversion', 'One clear main button appears at the top of the page.'], ['Conversion', 'The form asks only for what we really need.'],
      ['Trust', 'We show proof: testimonials, results, logos or numbers.'], ['Trust', 'Contact details and a real person or team are visible.'],
      ['Experience', 'The page loads fast and looks good on a phone.'], ['Experience', 'Text is easy to read and nothing blocks the content.']],
    bands: bands(['Conversion-ready', 'Your page is clear, trustworthy and fast. Start A/B testing small changes.'],
      ['Good page', 'Solid, with room to grow. Fix the priorities below to lift conversions.'],
      ['Leaking visitors', 'Visitors are probably leaving. Work through the priorities below first.'],
      ['Needs a rebuild', 'Start with a clear headline, one button and real proof, then improve from there.']) },
]);

/** @param {string} slug @returns {Tool | undefined} */
export const bySlug = (slug) => TOOLS.find((t) => t.slug === slug);

/** answers: array of 0..3 (one per question). Returns percentage, band, per-category breakdown, priorities and strengths.
 * @param {QuizTool} tool @param {number[]} answers @returns {QuizResult} */
export function scoreQuiz(tool, answers) {
  const n = tool.q.length;
  if (answers.length !== n || answers.some((a) => !Number.isInteger(a) || a < 0 || a > 3)) throw new Error('Invalid answers');
  const pct = Math.round((answers.reduce((a, b) => a + b, 0) / (n * 3)) * 100);
  /** @type {Record<string, { s: number, m: number }>} */
  const groups = {};
  tool.q.forEach(([cat], i) => { const g = (groups[cat] ??= { s: 0, m: 0 }); g.s += answers[i]; g.m += 3; });
  const breakdown = Object.entries(groups).map(([name, g]) => ({ name, pct: Math.round((g.s / g.m) * 100), tip: tool.cats[name] }));
  const [, label, summary] = tool.bands.find(([min]) => pct >= min) ?? tool.bands[tool.bands.length - 1];
  const sorted = [...breakdown].sort((a, b) => a.pct - b.pct);
  return { pct, band: { label, summary }, breakdown, priorities: sorted.filter((c) => c.pct < 100).slice(0, 2), strengths: [...sorted].reverse().filter((c) => c.pct >= 67).slice(0, 3) };
}

/** @type {{ interests: Record<string, { label: string, stem: string, problems: string[] }>, audiences: Record<string, string>, models: Record<string, { label: string, a: string }> }} */
export const GEN = {
  interests: {
    education: { label: 'Education', stem: 'Learn', problems: ['learn exam topics faster', 'practise speaking with confidence', 'plan their study time'] },
    health: { label: 'Health', stem: 'Well', problems: ['build healthy daily habits', 'track sleep and stress', 'find simple home workouts'] },
    food: { label: 'Food', stem: 'Food', problems: ['cut food waste at home', 'plan affordable healthy meals', 'discover local home cooks'] },
    climate: { label: 'Climate', stem: 'Eco', problems: ['reduce their plastic use', 'save electricity and water', 'recycle the right way'] },
    gaming: { label: 'Gaming', stem: 'Play', problems: ['find teammates who match their style', 'learn new games quickly', 'run small tournaments'] },
    fashion: { label: 'Fashion', stem: 'Style', problems: ['swap and reuse clothes', 'find outfits for their budget', 'get custom designs made'] },
    finance: { label: 'Money', stem: 'Money', problems: ['save pocket money smartly', 'split shared expenses fairly', 'learn investing basics'] },
    pets: { label: 'Pets', stem: 'Pet', problems: ['find trusted pet care', 'adopt pets from shelters', 'track their pet\'s health'] },
    travel: { label: 'Travel', stem: 'Trip', problems: ['plan low-cost trips', 'find safe local guides', 'share trip costs'] },
    creativity: { label: 'Creativity', stem: 'Craft', problems: ['sell their art online', 'find collaborators', 'grow their audience'] },
  },
  audiences: { students: 'Students', parents: 'Busy parents', shops: 'Small local shops', farmers: 'Farmers', seniors: 'Senior citizens', creators: 'Young creators' },
  models: { app: { label: 'Mobile app', a: 'A mobile app' }, marketplace: { label: 'Marketplace', a: 'An online marketplace' }, subscription: { label: 'Subscription', a: 'A monthly subscription service' },
    ai: { label: 'AI assistant', a: 'An AI assistant' }, community: { label: 'Community', a: 'A community platform' } },
};
const SUFFIX = ['ly', 'ify', 'Hub', 'Nest', 'Mate', 'Loop', 'Spark'];
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/** Deterministic for a given seed. Returns six ideas with unique names. Empty selections are chosen at random.
 * @param {IdeaInput} [input] @param {number} [seed] @returns {Idea[]} */
export function generateIdeas(input = {}, seed = 1) {
  const str = (/** @type {unknown} */ v) => (typeof v === 'string' ? v : '');
  const interest = str(input.interest), audience = str(input.audience), model = str(input.model);
  const r = rng(seed), pick = (obj) => { const k = Object.keys(obj); return k[Math.floor(r() * k.length)]; };
  /** @type {Set<string>} */
  const used = new Set();
  /** @type {Idea[]} */
  const out = [];
  for (let k = 0; k < 6; k++) {
    const it = GEN.interests[interest] ? interest : pick(GEN.interests);
    const au = GEN.audiences[audience] ? audience : pick(GEN.audiences);
    const mo = GEN.models[model] ? model : Object.keys(GEN.models)[(k + Math.floor(r() * 5)) % 5];
    const I = GEN.interests[it], problem = I.problems[(k + Math.floor(r() * 3)) % 3], who = GEN.audiences[au].toLowerCase();
    let title, s = Math.floor(r() * SUFFIX.length);
    do { title = I.stem + SUFFIX[s % SUFFIX.length]; s++; } while (used.has(title) && s < 40);
    used.add(title);
    out.push({ title, tagline: `${GEN.models[mo].a} that helps ${who} ${problem}.`, step: `This week, ask ten ${who} how they ${problem} today and what annoys them most.`, tags: [I.label, GEN.audiences[au], GEN.models[mo].label] });
  }
  return out;
}
