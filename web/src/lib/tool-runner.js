import { scoreQuiz, generateIdeas, GEN } from './tools';

// Framework-free widget: renders a tool (quiz or generator) into `root` using DOM nodes and text only (no HTML strings from data).
function h(tag, props = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid.nodeType ? kid : document.createTextNode(kid));
  return el;
}
async function copyText(text, btn) {
  const old = btn.textContent;
  try { await navigator.clipboard.writeText(text); btn.textContent = 'Copied!'; } catch { btn.textContent = 'Copy not allowed'; }
  setTimeout(() => { btn.textContent = old; }, 1600);
}
const DEFAULT_SCALE = ['Not yet', 'Just started', 'Mostly', 'Fully'];

/** @param {HTMLElement} root @param {import('./tools').Tool} tool @param {{ bookUrl?: string, onNavigate?: (state: string) => void }} [options]
 * @returns {() => void} cleanup function */
export function mountTool(root, tool, { bookUrl = '#', onNavigate } = {}) {
  let stopped = false;
  const show = (node) => { root.replaceChildren(node); node.querySelector('[data-focus]')?.focus({ preventScroll: true }); };

  /** @param {import('./tools').QuizTool} tool */
  function quiz(tool) {
    const scale = tool.scale || DEFAULT_SCALE, n = tool.q.length, answers = Array(n).fill(null);
    let i = 0;
    const advance = () => { if (answers[i] === null) return; if (i < n - 1) { i++; question(); } else result(); };
    const pick = (v) => { answers[i] = v; setTimeout(() => { if (!stopped && answers[i] === v) advance(); }, 300); };
    function question() {
      const pct = Math.round((i / n) * 100);
      show(h('div', { class: 'tq' },
        h('div', { class: 'tq-top' }, h('span', { class: 'tq-count' }, `Question ${i + 1} of ${n}`), h('span', { class: 'tq-cat' }, tool.q[i][0])),
        h('div', { class: 'tq-bar', role: 'progressbar', 'aria-label': 'Progress', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': pct }, h('i', { style: `width:${pct}%` })),
        h('fieldset', {}, h('legend', { class: 'tq-q', tabindex: '-1', 'data-focus': true }, tool.q[i][1]),
          h('div', { class: 'tq-opts' }, scale.map((label, v) => h('label', { class: 'tq-opt' },
            h('input', { type: 'radio', name: `q${i}`, value: v, checked: answers[i] === v, onchange: () => pick(v) }), h('span', {}, label))))),
        h('div', { class: 'tq-nav' },
          i > 0 ? h('button', { type: 'button', class: 'btn btn-line', onclick: () => { i--; question(); } }, h('span', {}, 'Back')) : h('span'),
          answers[i] !== null ? h('button', { type: 'button', class: 'btn btn-dark', onclick: advance }, h('span', {}, i === n - 1 ? 'See my result' : 'Next')) : h('span', { class: 'tq-hint' }, 'Choose an answer to continue'))));
    }
    function result() {
      const r = scoreQuiz(tool, answers);
      const ring = h('div', { class: 'ring', role: 'img', 'aria-label': `Score ${r.pct} percent` });
      ring.innerHTML = '<svg viewBox="0 0 120 120" aria-hidden="true"><circle class="rb" cx="60" cy="60" r="52"/><circle class="rf" cx="60" cy="60" r="52" pathLength="100"/></svg><b>0%</b>'; // static markup only
      const rows = r.breakdown.map((c) => h('div', { class: 'tr-row' }, h('span', {}, c.name), h('div', { class: 'tr-track' }, h('i', { style: `--w:${c.pct}%` })), h('b', {}, `${c.pct}%`)));
      const text = `${tool.name}: ${r.pct}% (${r.band.label}). ${r.priorities.length ? 'Work on: ' + r.priorities.map((p) => p.name).join(' and ') + '. ' : ''}Try it free at Tactyqal Labs.`;
      const copyBtn = h('button', { type: 'button', class: 'btn btn-line', onclick: (e) => copyText(text, e.currentTarget.firstChild) }, h('span', {}, 'Copy my result'));
      show(h('div', { class: 'tr' },
        h('div', { class: 'tr-head' }, ring, h('div', {}, h('p', { class: 'tr-kicker' }, 'Your result'), h('h2', { class: 'tr-band', tabindex: '-1', 'data-focus': true }, r.band.label), h('p', { class: 'tr-sum' }, r.band.summary))),
        h('div', { class: 'tr-bars' }, rows),
        r.strengths.length ? h('p', { class: 'tr-str' }, h('b', {}, 'Strengths: '), r.strengths.map((s) => s.name).join(', ')) : null,
        r.priorities.length ? h('div', { class: 'tr-tips' }, h('h3', {}, 'Your top priorities'), r.priorities.map((p) => h('div', { class: 'tr-tip' }, h('b', {}, `${p.name} · ${p.pct}%`), h('p', {}, p.tip)))) : null,
        h('div', { class: 'tr-actions' },
          h('button', { type: 'button', class: 'btn btn-dark', onclick: () => { answers.fill(null); i = 0; question(); } }, h('span', {}, 'Retake')), copyBtn,
          h('a', { class: 'btn btn-lime', href: bookUrl, target: '_blank', rel: 'noopener noreferrer' }, h('span', {}, 'Talk to a mentor, free')))));
      requestAnimationFrame(() => requestAnimationFrame(() => {
        ring.querySelector('.rf').style.strokeDashoffset = String(100 - r.pct);
        root.querySelectorAll('.tr-track i').forEach((el) => el.classList.add('go'));
        const num = ring.querySelector('b'), t0 = performance.now();
        const tick = (t) => { const k = Math.min(1, (t - t0) / 1200); num.textContent = `${Math.round(r.pct * (1 - Math.pow(1 - k, 3)))}%`; if (k < 1 && !stopped) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      }));
      onNavigate?.('result');
    }
    question();
  }

  function generator() {
    let seed = (Date.now() % 100000) + 1;
    const opt = (v) => (typeof v === 'string' ? v : v.label);
    const sel = (name, label, opts) => h('label', { class: 'tg-f' }, h('span', {}, label),
      h('select', { name }, h('option', { value: '' }, 'Surprise me'), Object.entries(opts).map(([k, v]) => h('option', { value: k }, opt(v)))));
    const out = h('div', { class: 'tg-out', 'aria-live': 'polite' });
    const form = h('form', { class: 'tg-form', onsubmit: (e) => { e.preventDefault(); run(); } },
      sel('interest', 'I care about', GEN.interests), sel('audience', 'For', GEN.audiences), sel('model', 'As a', GEN.models),
      h('button', { class: 'btn btn-lime', type: 'submit' }, h('span', {}, 'Generate ideas')));
    function run() {
      seed++;
      const f = new FormData(form), ideas = generateIdeas({ interest: f.get('interest'), audience: f.get('audience'), model: f.get('model') }, seed);
      out.replaceChildren(...ideas.map((idea, k) => h('article', { class: 'tg-card', style: `--i:${k}` },
        h('h3', {}, idea.title), h('p', { class: 'tg-pitch' }, idea.tagline), h('p', { class: 'tg-step' }, h('b', {}, 'First step: '), idea.step),
        h('div', { class: 'tg-tags' }, idea.tags.map((t) => h('span', {}, t))),
        h('button', { type: 'button', class: 'tg-copy', onclick: (e) => copyText(`${idea.title}: ${idea.tagline} First step: ${idea.step}`, e.currentTarget) }, 'Copy idea'))),
        h('div', { class: 'tg-more' }, h('button', { type: 'button', class: 'btn btn-line', onclick: run }, h('span', {}, 'Shuffle again')),
          h('a', { class: 'btn btn-dark', href: bookUrl, target: '_blank', rel: 'noopener noreferrer' }, h('span', {}, 'Get mentor feedback on an idea'))));
    }
    root.replaceChildren(h('div', { class: 'tg' }, form, out));
    run();
  }

  root.replaceChildren();
  if (tool.type === 'generator') generator(); else quiz(tool);
  return () => { stopped = true; root.replaceChildren(); };
}
