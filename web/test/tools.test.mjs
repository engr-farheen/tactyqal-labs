import test from 'node:test';
import assert from 'node:assert/strict';
import { TOOLS, GEN, bySlug, scoreQuiz, generateIdeas } from '../src/lib/tools.js';

const quizzes = TOOLS.filter((t) => t.type === 'quiz');

test('there are 8 tools with unique slugs and complete data', () => {
  assert.equal(TOOLS.length, 8);
  assert.equal(new Set(TOOLS.map((t) => t.slug)).size, 8);
  for (const t of TOOLS) assert.ok(t.name && t.blurb && t.about && t.icon && t.minutes, t.slug);
  assert.ok(bySlug('pitch-deck-analyzer'));
});
test('every quiz question maps to a category with a tip, and bands cover 0-100', () => {
  for (const t of quizzes) {
    assert.ok(t.q.length >= 8, t.slug);
    for (const [cat] of t.q) assert.ok(t.cats[cat], `${t.slug}: missing tip for ${cat}`);
    assert.equal(t.bands[t.bands.length - 1][0], 0, `${t.slug}: lowest band must start at 0`);
    for (let i = 1; i < t.bands.length; i++) assert.ok(t.bands[i - 1][0] > t.bands[i][0], `${t.slug}: bands must descend`);
  }
});
test('scoring: all zeros, all max and a mix', () => {
  for (const t of quizzes) {
    const lo = scoreQuiz(t, t.q.map(() => 0)), hi = scoreQuiz(t, t.q.map(() => 3));
    assert.equal(lo.pct, 0); assert.equal(lo.band.label, t.bands[t.bands.length - 1][1]); assert.equal(lo.priorities.length, 2);
    assert.equal(hi.pct, 100); assert.equal(hi.band.label, t.bands[0][1]); assert.equal(hi.priorities.length, 0);
  }
  const t = /** @type {import('../src/lib/tools.js').QuizTool} */ (bySlug('fundability-assessment'));
  const r = scoreQuiz(t, [3, 3, 0, 0, 2, 2, 3, 3]);
  assert.equal(r.pct, 67);
  assert.equal(r.priorities[0].name, 'Traction');
  assert.deepEqual(r.breakdown.map((c) => c.name), ['Team', 'Traction', 'Market', 'Pitch']);
});
test('scoring rejects invalid answers', () => {
  const t = quizzes[0];
  assert.throws(() => scoreQuiz(t, [1, 2]));
  assert.throws(() => scoreQuiz(t, t.q.map(() => 4)));
  assert.throws(() => scoreQuiz(t, t.q.map(() => 1.5)));
});
test('idea generator: six unique, deterministic ideas that respect the selection', () => {
  const a = generateIdeas({ interest: 'food', audience: 'students', model: 'app' }, 7), b = generateIdeas({ interest: 'food', audience: 'students', model: 'app' }, 7);
  assert.deepEqual(a, b);
  assert.equal(a.length, 6);
  assert.equal(new Set(a.map((i) => i.title)).size, 6);
  for (const i of a) { assert.match(i.tagline, /^A mobile app that helps students /); assert.ok(GEN.interests.food.problems.some((p) => i.tagline.includes(p))); }
  assert.notDeepEqual(generateIdeas({}, 1), generateIdeas({}, 2));
});
