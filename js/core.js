/* 다움 DAWM — core: data, store, router, matching engine, helpers */
const D = { ing: [], prod: [], sc: null, com: null, ingById: {}, prodById: {}, prodByTag: {}, ingByInci: {} };
const KEY = 'dawm.v1';
let mem = null; // in-memory fallback when storage is unavailable

const DEFAULT_STATE = () => ({
  user: null,               // {id,name,code,answers,diagnosedAt}
  shelf: [
    { pid: 'estra-hydro-soothing', when: 'AM·PM' },
    { pid: 'estra-theracne-toner', when: 'AM·PM' },
    { pid: 'estra-uv365-mineral', when: 'AM' },
    { pid: 'iope-retinol-expert', when: 'PM · 레티놀 데이' },
    { custom: true, name: '아젤리아 크림', brand: '여드름 연고 · 의약품', sub: '아젤라익애씨드 20%', ing: ['azelaic-acid'], cat: '의약품', when: 'AM·PM · 트러블·붉은 부위' },
    { pid: 'innisfree-nosebum-powder', when: '낮 수정' }
  ],
  drawer: [
    { custom: true, name: '인스타 광고 진정 앰플', brand: '브랜드 미상', ing: ['parfum', 'alcohol'], note: '바르고 이틀 뒤 볼이 붉게 올라옴', sus: ['parfum', 'alcohol'] },
    { pid: 'belif-aquabomb', note: '시원했지만 따가움', sus: ['essential-oils', 'limonene'] },
    { pid: 'physiogel-dmt-cream', note: '턱에 좁쌀', sus: ['coconut-oil'] }
  ],
  layout: [
    { id: 'naum', size: 'm' }, { id: 'tonight', size: 'm' }, { id: 'retinol', size: 'm' },
    { id: 'shelf', size: 'l' }, { id: 'drawer', size: 'm' },
    { id: 'diary', size: 'm' }, { id: 'condition', size: 'm' }, { id: 'guestbook', size: 'm' }
  ],
  retinolDays: [1, 4],      // 0=일 ... 6=토
  diary: [
    { d: '2026-11-19', t: '오늘 세안 후에 안 당겼다. 사소한 게 고마운 날.' },
    { d: '2026-11-18', t: '지윤이랑 늦게까지 통화. 웃다가 하루가 끝났다.' }
  ],
  condition: { '2026-11-18': '편안', '2026-11-19': '붉음' },
  neighbors: [
    { id: 'n1', name: '지윤', code: 'DSNT', since: '2026-10-02' },
    { id: 'n2', name: '하람', code: 'OSPT', since: '2026-10-21' },
    { id: 'n3', name: '도아', code: 'ORNW', since: '2026-11-08' }
  ],
  guestbook: [
    { from: '지윤', t: '신현아 저번에 추천해준 수딩크림 나도 정착했어 🌿', d: '2026-11-19' },
    { from: '하람', t: '방 분위기 너무 좋다! 선반 구경하고 감', d: '2026-11-17' }
  ],
  myMsgs: {},
  seen: {}
});

const S = {
  state: null,
  load() {
    let raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { raw = mem; }
    try { this.state = raw ? Object.assign(DEFAULT_STATE(), JSON.parse(raw)) : DEFAULT_STATE(); }
    catch (e) { this.state = DEFAULT_STATE(); }
    // 연고 교체(아다팔렌 → 아젤리아) 이전 저장분 정리
    this.state.shelf = this.state.shelf.map(s => (s.custom && (s.ing || []).includes('adapalene') && s.name === '여드름 연고') ? DEFAULT_STATE().shelf[4] : s);
  },
  save() {
    const raw = JSON.stringify(this.state);
    try { localStorage.setItem(KEY, raw); } catch (e) { mem = raw; }
  },
  reset() { this.state = DEFAULT_STATE(); this.save(); }
};
const st = () => S.state;
const me = () => S.state.user;
const myCode = () => (me() && me().code) || null;

/* ---------- helpers ---------- */
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const won = n => n.toLocaleString('ko-KR') + '원';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const todayStr = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const DOW = ['일', '월', '화', '수', '목', '금', '토'];
const AXN = { O: '지성', D: '건성', S: '민감', R: '저항', P: '색소', N: '비색소', W: '주름·탄력', T: '탄탄' };
const codeWords = c => c ? c.split('').map(l => AXN[l]).join('·') : '';
const typeName = c => (D.sc && D.sc.names[c]) || '';

const CAT_COLOR = { '토너·패드': ['#EAF2F6', '#BFD6E2'], '앰플·세럼': ['#FBEBDD', '#E9C29A'], '크림': ['#F4EFE8', '#D8CBB8'], '선케어': ['#F3F6E6', '#CBD69A'], '색조': ['#F6E8E6', '#DDB3AA'], '의약품': ['#EEF0F5', '#B9C1D6'] };
function bottle(cat, tex) {
  const c = CAT_COLOR[cat] || CAT_COLOR['크림'];
  let shape;
  if (tex === '쿠션' || tex === '파우더') shape = `<rect x="8" y="58" width="44" height="26" rx="10" fill="${c[1]}"/><rect x="8" y="52" width="44" height="10" rx="5" fill="#fff" opacity=".7"/>`;
  else if (cat === '크림') shape = `<rect x="6" y="50" width="48" height="34" rx="9" fill="${c[1]}"/><rect x="4" y="42" width="52" height="12" rx="5" fill="#fff" opacity=".85"/>`;
  else if (cat === '앰플·세럼') shape = `<rect x="16" y="34" width="28" height="50" rx="7" fill="${c[1]}"/><rect x="24" y="18" width="12" height="18" rx="3" fill="#fff" opacity=".85"/><circle cx="30" cy="15" r="6" fill="#fff" opacity=".85"/>`;
  else if (cat === '의약품') shape = `<path d="M18 30h24v50a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z" fill="${c[1]}"/><rect x="22" y="20" width="16" height="12" rx="2" fill="#fff" opacity=".85"/>`;
  else shape = `<rect x="14" y="28" width="32" height="56" rx="8" fill="${c[1]}"/><rect x="20" y="18" width="20" height="12" rx="3" fill="#fff" opacity=".85"/>`;
  return `<span class="pvis" style="background:${c[0]}"><svg viewBox="0 0 60 88" aria-hidden="true">${shape}</svg></span>`;
}
function img(name, fallback) {
  // background with optional photo (img/<name>.jpg) layered over a gradient fallback
  return `background-image:url('img/${name}.jpg'),${fallback}`;
}

/* ---------- data loading ---------- */
async function loadData() {
  const get = p => fetch(p).then(r => { if (!r.ok) throw new Error(p); return r.json(); });
  const [ing, prod, sc, com] = await Promise.all([get('data/ingredients.json'), get('data/products.json'), get('data/skincode.json'), get('data/community.json')]);
  Object.assign(D, { ing, prod, sc, com });
  ing.forEach(i => { D.ingById[i.id] = i; i.inci.forEach(x => D.ingByInci[x.toLowerCase()] = i.id); });
  prod.forEach(p => { D.prodById[p.id] = p; D.prodByTag[p.tag] = p; });
}

/* ---------- skin code ---------- */
function scoreQuiz(answers) {
  const sums = {};
  D.sc.questions.forEach((q, i) => { sums[q.axis] = (sums[q.axis] || 0) + (answers[i] || 0); });
  const code = D.sc.axes.map(a => (sums[a.key] >= 6 ? a.hi : a.lo)).join('');
  return { code, sums };
}

/* ---------- matching engine ----------
   score = 60 + Σ position-weighted (+ good axis match, − caution axis match) − personal suspects  (0~100) */
function itemIngs(item) {
  if (item.pid) return D.prodById[item.pid] ? D.prodById[item.pid].ing : [];
  return item.ing || [];
}
function suspects() {
  const s = new Set();
  (st().drawer || []).forEach(d => (d.sus || []).forEach(x => s.add(x)));
  return s;
}
function analyze(ingIds, code, opts = {}) {
  const letters = code ? code.split('') : [];
  const sus = opts.noPersonal ? new Set() : (me() ? suspects() : new Set());
  let score = 60; const good = [], warn = [], personal = [];
  const seen = new Set();
  ingIds.forEach((id, idx) => {
    if (seen.has(id)) return; seen.add(id);
    const ing = D.ingById[id]; if (!ing) return;
    const w = idx < 5 ? 1 : idx < 15 ? 0.6 : 0.35;
    const g = letters.filter(l => ing.good.includes(l));
    const c = letters.filter(l => ing.caution.includes(l));
    const filler = ['제형·기타', '보존·안정'].includes(ing.group);
    if (c.length) { score -= 7 * w * c.length; warn.push({ ing, axes: c }); }
    else if (g.length && !filler) { score += 5 * w * g.length; good.push({ ing, axes: g }); }
    if (sus.has(id)) { score -= 12; personal.push(ing); }
  });
  score = Math.max(5, Math.min(98, Math.round(score)));
  return { score, good, warn, personal };
}
const productScore = (p, code) => analyze(p.ing, code).score;
const scClass = s => s >= 75 ? 'sc-hi' : s >= 55 ? 'sc-mid' : 'sc-lo';

/* parse a pasted ingredient list (Korean or INCI) into ingredient ids */
function parseIngredients(text) {
  const parts = text.split(/[,\n·]/).map(s => s.trim()).filter(Boolean);
  const ids = [], unknown = [];
  const koIndex = {};
  D.ing.forEach(i => { koIndex[i.ko.replace(/\s/g, '')] = i.id; i.ko.split(/[·()]/).forEach(k => { const kk = k.replace(/\s/g, ''); if (kk.length > 1 && !koIndex[kk]) koIndex[kk] = i.id; }); });
  parts.forEach(p => {
    const k = p.replace(/\s/g, '').replace(/\d+(\.\d+)?%$/, '');
    const id = D.ingByInci[p.toLowerCase()] || koIndex[k];
    if (id) ids.push(id); else unknown.push(p);
  });
  return { ids, unknown };
}

/* ---------- schedule ---------- */
function isRetinolDay(d = new Date()) { return (st().retinolDays || []).includes(d.getDay()); }
function hasOnShelf(pred) { return st().shelf.some(s => itemIngs(s).some(pred)); }
function ointment() { return st().shelf.find(s => s.cat === '의약품'); }

/* ---------- router ---------- */
const routes = {};
function route(name, fn) { routes[name] = fn; }
function go(name) { if (location.hash === '#' + name) render(); else location.hash = name; }
function current() { return (location.hash || '#home').slice(1) || 'home'; }
