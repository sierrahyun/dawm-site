/* ================= INGREDIENT NETWORK =================
   mountNet(el, { cid, focus, mode })
   mode 'net'   : concept network spreads out from the centre
   mode 'focus' : the ingredient first, the network faded behind it; click to zoom out */
const NET = (() => {
  const NS = 'http://www.w3.org/2000/svg', W = 960, H = 700, CX = 480, CY = 350;
  const FAM = ['#2E8C7A', '#C98A1E', '#7065C9', '#C25784', '#6B8E3A'];
  const REL = { no: { c: '#C93A3A', w: '주의', i: '×' }, must: { c: '#2B64B0', w: '다음 단계', i: '→' }, with: { c: '#8C877E', w: '함께', i: '+' } };
  const easeOut = t => 1 - Math.pow(1 - t, 3), easeBack = t => { const c = 1.5; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  const relType = t => /피하|겹치지|빼기|나눠/.test(t) ? 'no' : /필수|꼭|다음/.test(t) ? 'must' : 'with';
  const rOf = v => { if (v == null) return 9; if (/강함/.test(v)) return 14; if (/약~중간/.test(v)) return 9.5; if (/중간/.test(v)) return 11.5; if (/약/.test(v)) return 7.5; return 10; };
  const famKey = v => v.split(/[\s(]/)[0];
  const short = s => s.length > 10 ? s.slice(0, 9) + '…' : s;
  const tint = (hex, a) => { const n = parseInt(hex.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255; return `rgb(${Math.round(255 - (255 - r) * a)},${Math.round(255 - (255 - g) * a)},${Math.round(255 - (255 - b) * a)})`; };
  const pc = id => D.prod.filter(p => p.ing.includes(id)).length;

  function data(cid) {
    const c = D.conById[cid];
    return { id: c.id, name: c.name, sum: c.sum, cols: c.cols, rel: (c.rel || []).filter(r => D.conById[r.id]),
      m: c.members.filter(m => D.ingById[m.id]).map(m => ({ id: m.id, ko: shortName(m.id), v: m.v, db: pc(m.id) > 0 })) };
  }

  function mount(el, opt) {
    if (el._net) el._net.dead = true;
    const s = el._net = { el, cid: opt.cid, nodes: [], rels: [], state: 'in', t0: 0, mode: 'net', fnode: null, cam: { x: 0, y: 0, w: W }, camA: null,
      op: { world: { v: 1, f: 1, t: 1 }, hero: { v: 0, f: 0, t: 0 }, t0: 0 }, dead: false };
    el.innerHTML = `<div class="dnet"><div class="dn-top"><div class="dn-legend"></div><button class="dn-replay" type="button">모션 다시 보기</button></div>
      <div class="dn-crumb"></div><div class="dn-stage"><svg class="dn-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(D.conById[opt.cid].name)} 성분 네트워크"></svg><div class="dn-tip"></div><div class="dn-card"></div></div></div>`;
    s.svg = el.querySelector('svg'); s.tip = el.querySelector('.dn-tip'); s.card = el.querySelector('.dn-card'); s.crumb = el.querySelector('.dn-crumb');
    el.querySelector('.dn-replay').onclick = () => { if (s.mode === 'focus' && s.fnode) { build(s, s.cid, true); focusOn(s, s.fnode.m.id, true, true); } else build(s, s.cid, false); };
    build(s, opt.cid, opt.mode === 'focus');
    if (opt.mode === 'focus' && opt.focus) focusOn(s, opt.focus, true, true);
    else if (opt.focus) s.pulseId = opt.focus;
    requestAnimationFrame(t => frame(s, t));
    return s;
  }

  function build(s, cid, instant) {
    const cur = s.cur = data(cid), svg = s.svg, mk = (t, a = {}, p = svg) => { const e = document.createElementNS(NS, t); for (const k in a) if (a[k] !== '') e.setAttribute(k, a[k]); p && p.appendChild(e); return e; };
    s.cid = cid; svg.innerHTML = ''; s.nodes = []; s.rels = []; s.hero = null; s.fnode = null; s.mk = mk;
    const si = cur.cols.findIndex(c => /강도/.test(c));
    const keys = [...new Set(cur.m.map(m => famKey(m.v[0])))];
    const grouped = keys.length >= 2 && keys.length <= 5 && keys.length < cur.m.length;
    s.world = mk('g'); const gE = mk('g', {}, s.world), gR = mk('g', {}, s.world), gN = mk('g', {}, s.world);
    s.ripple = mk('circle', { cx: CX, cy: CY, r: 58, fill: 'none', stroke: 'currentColor', 'stroke-width': 1, opacity: 0 }, gE);
    const groups = grouped ? keys.map((k, i) => ({ k, col: FAM[i % FAM.length], list: cur.m.filter(m => famKey(m.v[0]) === k) })) : cur.m.map(m => ({ k: null, col: '#1F1D1A', list: [m] }));
    const R = cur.rel.slice(0, 4), seq = [], every = R.length ? groups.length / R.length : 1e9; let ri = 0;
    groups.forEach((g, i) => { seq.push({ t: 'g', g }); if (ri < R.length && (i + 1) >= Math.round(every * (ri + 1) - every / 2)) seq.push({ t: 'r', r: R[ri++] }); });
    while (ri < R.length) seq.push({ t: 'r', r: R[ri++] });
    const wOf = x => x.t === 'r' ? (grouped ? 1.7 : 1.1) : (grouped ? x.g.list.length + .5 : 1);
    const tot = seq.reduce((a, x) => a + wOf(x), 0); let ang = -Math.PI / 2 - wOf(seq[0]) / tot * Math.PI;
    const many = cur.m.length > 9;
    seq.forEach(x => { const span = wOf(x) / tot * Math.PI * 2; x.a0 = ang; x.a1 = ang + span; x.mid = ang + span / 2; ang += span; });
    const cg = s.centerG = mk('g', { class: 'dn-node' }, gN);
    mk('circle', { r: 58, class: 'dn-bg', 'stroke-width': 2, stroke: 'currentColor' }, cg);
    mk('circle', { r: 51, fill: 'none', stroke: 'currentColor', 'stroke-width': .6, opacity: .5 }, cg);
    mk('text', { y: -2, 'text-anchor': 'middle', 'font-size': cur.name.length > 7 ? 15 : 17, 'font-weight': 700, class: 'dn-ink' }, cg).textContent = cur.name;
    mk('text', { y: 18, 'text-anchor': 'middle', 'font-size': 12, class: 'dn-mut' }, cg).textContent = `${cur.m.length}개 성분` + (grouped ? ` · ${keys.length}계열` : '');
    const add = o => { s.nodes.push(o); return o; };
    const member = (m, a, rr, parent, delay, color) => {
      const x = CX + Math.cos(a) * rr * 1.22, y = CY + Math.sin(a) * rr * .98;
      const v = si >= 0 ? m.v[si] : null, rad = rOf(v), g = mk('g', { class: 'dn-node', opacity: 0 }, gN);
      const edge = mk('line', { stroke: color, 'stroke-width': 1.6, opacity: 0 }, gE);
      const ring = mk('circle', { r: rad + 7, fill: 'none', stroke: color, 'stroke-width': 1.4, class: 'dn-pulse', style: 'display:none' }, g);
      mk('circle', { r: rad, stroke: color, 'stroke-width': 1.8, class: m.db ? '' : 'dn-bg', fill: m.db ? color : '', 'stroke-dasharray': m.db ? '' : '3 2.2' }, g);
      mk('text', { 'font-size': 13, 'font-weight': m.db ? 600 : 400, class: m.db ? 'dn-ink' : 'dn-faint' }, g).textContent = short(m.ko);
      if (v) mk('text', { 'font-size': 11, class: 'dn-faint' }, g).textContent = v;
      const o = add({ g, edge, ring, parent, x1: x, y1: y, delay, dur: 480, ease: easeBack, m, color, rad });
      label(o, a);
      g.addEventListener('mouseenter', () => hover(s, o, true)); g.addEventListener('mouseleave', () => hover(s, o, false));
      g.addEventListener('click', () => { if (s.mode === 'net' && s.state === 'idle') { dim(s, false); focusOn(s, m.id, false); } });
    };
    let gi = 0, mi = 0;
    seq.forEach(x => {
      if (x.t === 'g') {
        const gr = x.g;
        if (grouped) {
          const hx = CX + Math.cos(x.mid) * 128 * 1.22, hy = CY + Math.sin(x.mid) * 128 * .98, col = gr.col;
          const g = mk('g', { opacity: 0 }, gN), lw = gr.k.length * 15 + 44;
          mk('rect', { x: -lw / 2, y: -14, width: lw, height: 28, rx: 14, fill: tint(col, .16), stroke: col, 'stroke-width': 1.4 }, g);
          mk('text', { x: -lw / 2 + 12, y: 5, 'font-size': 13, 'font-weight': 700, fill: col }, g).textContent = gr.k;
          mk('text', { x: lw / 2 - 11, y: 5, 'text-anchor': 'end', 'font-size': 12, fill: col }, g).textContent = gr.list.length;
          const edge = mk('line', { stroke: col, 'stroke-width': 3, opacity: 0, 'stroke-linecap': 'round' }, gE);
          const hub = add({ g, edge, parent: null, x1: hx, y1: hy, delay: 260 + gi * 110, dur: 420, ease: easeOut, hub: true, color: col });
          const n = gr.list.length, pad = (x.a1 - x.a0) * (n > 1 ? .06 : 0);
          gr.list.forEach((m, j) => { const a = n === 1 ? x.mid : x.a0 + pad + (x.a1 - x.a0 - 2 * pad) * (j + .5) / n; member(m, a, (n > 6 ? 236 : 250) + (n > 6 ? [0, 62, 30][j % 3] : 0), hub, hub.delay + 330 + j * 70, col); });
          gi++;
        } else { member(gr.list[0], x.mid, 230 + (many && mi % 2 ? 50 : 0), null, 300 + mi * 60, 'currentColor'); mi++; }
      } else {
        const r = x.r, ty = relType(r.t), RR = REL[ty], ca = Math.cos(x.mid), sa = Math.sin(x.mid);
        const bw = Math.max(150, r.t.length * 12.5 + 30);
        let bx = CX + ca * 370, by = CY + sa * 300; bx = Math.max(bw / 2 + 4, Math.min(W - bw / 2 - 4, bx)); by = Math.max(32, Math.min(H - 32, by));
        const path = mk('path', { d: `M${CX + ca * 62},${CY + sa * 61} L${bx},${by}`, fill: 'none', stroke: RR.c, 'stroke-width': ty === 'with' ? 1.8 : 2.4, opacity: .9 }, gR);
        const len = path.getTotalLength(); path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
        const mid = path.getPointAtLength(len * .5);
        const badge = mk('g', { opacity: 0 }, gR); mk('circle', { cx: mid.x, cy: mid.y, r: 11, class: 'dn-bg', stroke: RR.c, 'stroke-width': 1.6 }, badge);
        mk('text', { x: mid.x, y: mid.y + 4.5, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: RR.c }, badge).textContent = RR.i;
        const box = mk('a', { class: 'dn-node', href: '#concept-' + r.id, opacity: 0 }, gR);
        mk('rect', { x: bx - bw / 2, y: by - 28, width: bw, height: 56, rx: 12, class: 'dn-bg', stroke: RR.c, 'stroke-width': 1.6 }, box);
        mk('text', { x: bx, y: by - 5, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, class: 'dn-ink' }, box).textContent = D.conById[r.id].name;
        mk('text', { x: bx, y: by + 15, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 600, fill: RR.c }, box).textContent = RR.w + ' · ' + r.t;
        box.addEventListener('mouseenter', () => { if (s.state !== 'idle' || s.mode !== 'net') return; dim(s, true); [path, box, badge, s.centerG].forEach(e => e.style.opacity = 1); path.setAttribute('stroke-width', 3.4); });
        box.addEventListener('mouseleave', () => { dim(s, false); path.setAttribute('stroke-width', ty === 'with' ? 1.8 : 2.4); });
        s.rels.push({ path, len, badge, box, k: s.rels.length });
      }
    });
    const last = Math.max(...s.nodes.map(n => n.delay + n.dur)); s.rels.forEach(r => { r.delay = last - 150 + r.k * 140; r.dur = 650; });
    legend(s, grouped ? keys : null, si);
    s.state = 'in'; s.t0 = instant ? performance.now() - 99999 : performance.now();
    s.cam = { x: 0, y: 0, w: W }; s.camA = null; setOp(s, 1, 0, true); s.mode = 'net'; s.card.classList.remove('on'); s.crumb.innerHTML = '';
  }
  function label(o, a) {
    const t = o.g.querySelectorAll('text'), ca = Math.cos(a), sa = Math.sin(a), anc = ca > .35 ? 'start' : ca < -.35 ? 'end' : 'middle';
    const lx = anc === 'middle' ? 0 : Math.sign(ca) * (o.rad + 7), ly = anc === 'middle' ? (sa < 0 ? -(o.rad + 20) : o.rad + 16) : 4;
    t.forEach((e, i) => { e.setAttribute('x', lx); e.setAttribute('y', ly + i * 14); e.setAttribute('text-anchor', anc); });
  }
  function legend(s, keys, si) {
    let h = '';
    if (keys) h += keys.map((k, i) => `<span><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="${FAM[i % 5]}"/></svg>${esc(k)}</span>`).join('');
    h += `<span><svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="currentColor"/></svg>DB 제품 있음</span><span><svg width="12" height="12"><circle cx="6" cy="6" r="4.6" fill="none" stroke="currentColor" stroke-dasharray="2.5 2"/></svg>아직 없음</span>`;
    if (si >= 0) h += `<span><svg width="26" height="14"><circle cx="5" cy="7" r="3.5" fill="#8C877E"/><circle cx="18" cy="7" r="6.5" fill="#8C877E"/></svg>클수록 강함</span>`;
    if (s.cur.rel.length) h += Object.values(REL).map(r => `<span style="color:${r.c}"><b style="font-size:14px">${r.i}</b>${r.w}</span>`).join('');
    s.el.querySelector('.dn-legend').innerHTML = h;
  }
  function dim(s, on) { s.svg.querySelectorAll('.dn-node,line,path').forEach(e => { e.style.transition = 'opacity .2s'; e.style.opacity = on ? .15 : ''; }); if (!on) s.tip.classList.remove('on'); }
  function hover(s, o, on) {
    if (s.state !== 'idle' || s.mode !== 'net') return;
    if (!on) { dim(s, false); return; }
    dim(s, true); [o.g, o.edge, o.parent && o.parent.g, o.parent && o.parent.edge, s.centerG].forEach(e => { if (e) e.style.opacity = 1; });
    s.tip.innerHTML = `<b>${esc(D.ingById[o.m.id].ko)}</b>` + s.cur.cols.map((c, i) => `<div class="r"><span>${esc(c)}</span><span>${esc(o.m.v[i] || '')}</span></div>`).join('') + `<div class="r dn-hint"><span></span><span>눌러서 자세히</span></div>`;
    const b = s.svg.getBoundingClientRect(), k = b.width / W; let x = o.x1 * k + 16, y = o.y1 * k - 10; if (x > b.width - 230) x = o.x1 * k - 236;
    s.tip.style.left = x + 'px'; s.tip.style.top = y + 'px'; s.tip.classList.add('on');
  }
  function setOp(s, w, h, instant) { const o = s.op; o.world.f = instant ? w : o.world.v; o.world.t = w; o.hero.f = instant ? h : o.hero.v; o.hero.t = h; o.t0 = performance.now(); if (instant) { o.world.v = w; o.hero.v = h; } }
  function camTo(s, t, dur, instant) { if (instant) { Object.assign(s.cam, t); s.camA = null; return; } s.camA = { from: { ...s.cam }, to: t, t0: performance.now(), dur: dur || 800 }; }
  function narrow(s) { return s.el.clientWidth < 720; }
  function focusCam(s, o) { const k = narrow(s) ? 1.6 : 1.85, w = W / k, h = H / k; return { x: o.x1 - (narrow(s) ? .5 : .27) * w, y: o.y1 - .5 * h, w }; }
  function makeHero(s, o) {
    const mk = s.mk; if (s.hero) s.hero.remove(); s.hero = mk('g', { opacity: 0 }); s.fnode = o; const c = o.color;
    if (o.parent) mk('line', { class: 'hl dn-flow', 'data-a': 'p', stroke: c, 'stroke-width': 1.2, 'stroke-dasharray': '4 4', opacity: .6 }, s.hero);
    mk('line', { class: 'hl dn-flow', 'data-a': 'n', stroke: c, 'stroke-width': 1.2, 'stroke-dasharray': '4 4', opacity: .6 }, s.hero);
    const g = mk('g', { class: 'hn' }, s.hero), rad = Math.max(16, o.rad * 1.6);
    mk('circle', { r: rad + 9, fill: 'none', stroke: c, 'stroke-width': 1, class: 'dn-pulse' }, g);
    mk('circle', { r: rad, stroke: c, 'stroke-width': 2, class: o.m.db ? '' : 'dn-bg', fill: o.m.db ? c : '', 'stroke-dasharray': o.m.db ? '' : '4 3' }, g);
    const hint = mk('g', { class: 'dn-node hint' }, s.hero), lab = '성분 네트워크에서 보기', lw = lab.length * 6.4 + 22;
    mk('rect', { x: -lw / 2, y: -9, width: lw, height: 18, rx: 9, class: 'dn-bg', stroke: c, 'stroke-width': .8 }, hint);
    mk('text', { x: 0, y: 3.2, 'text-anchor': 'middle', 'font-size': 8, 'font-weight': 600, class: 'dn-ink' }, hint).textContent = lab;
    hint.addEventListener('click', () => zoomOut(s));
  }
  function showCard(s, o) {
    const i = D.ingById[o.m.id], n = pc(i.id), others = i.concepts.filter(id => id !== s.cid && D.conById[id]);
    s.card.innerHTML = `<div class="kick">성분 · ${esc(i.group)}</div><h3>${esc(i.ko)}</h3><div class="inci">${esc(i.inci[0])}</div><div class="role">${esc(i.role)}</div>${i.desc ? `<p>${esc(i.desc)}</p>` : ''}
      <div class="rows">${s.cur.cols.map((c, k) => `<div><span>${esc(c)}</span><b>${esc(o.m.v[k] || '-')}</b></div>`).join('')}</div>
      <div class="db">${n ? `다움 DB에 이 성분이 든 제품 <b>${n}개</b> · <a href="#ing-${i.id}">자세히 보기</a>` : `아직 다움 DB 제품에는 없어요 · <a href="#ing-${i.id}">자세히 보기</a>`}</div>
      <div class="nets"><button type="button" class="go">성분 네트워크에서 보기 →</button>${others.length ? `<div class="also">다른 연결 ${others.map(id => `<a href="#concept-${id}">${esc(D.conById[id].name)}</a>`).join('')}</div>` : ''}</div>`;
    s.card.querySelector('.go').onclick = () => zoomOut(s);
    s.card.classList.add('on');
  }
  function focusOn(s, id, instant, entry) {
    const o = s.nodes.find(x => x.m && x.m.id === id); if (!o) return;
    s.mode = 'focus'; s.tip.classList.remove('on'); makeHero(s, o); camTo(s, focusCam(s, o), 850, instant); setOp(s, .2, 1, instant); showCard(s, o);
    if (entry) { s.op.world.f = 0; s.op.hero.f = 0; s.op.t0 = performance.now(); }
    s.crumb.innerHTML = `<button type="button">성분 네트워크</button><span>›</span><b>${esc(D.ingById[id].ko)}</b>`;
    s.crumb.querySelector('button').onclick = () => zoomOut(s);
    s.el.classList.add('focusing');
  }
  function zoomOut(s) { if (s.mode !== 'focus') return; s.mode = 'net'; s.card.classList.remove('on'); camTo(s, { x: 0, y: 0, w: W }, 900); setOp(s, 1, 0); s.crumb.innerHTML = ''; s.el.classList.remove('focusing'); }

  function frame(s, now) {
    if (s.dead || !document.body.contains(s.svg)) return;
    const t = now - s.t0;
    const cp = Math.min(1, t / 450); s.centerG.setAttribute('transform', `translate(${CX},${CY}) scale(${.55 + .45 * easeBack(cp)})`); s.centerG.setAttribute('opacity', Math.min(1, cp * 2));
    const rp = Math.min(1, t / 1100); s.ripple.setAttribute('r', 58 + rp * 230); s.ripple.setAttribute('opacity', (1 - rp) * .35);
    let done = true;
    s.nodes.forEach(o => {
      const p = Math.max(0, Math.min(1, (t - o.delay) / o.dur)); if (p < 1) done = false;
      const sx = o.parent ? o.parent.cx : CX, sy = o.parent ? o.parent.cy : CY, e = o.ease(p);
      let fx = 0, fy = 0; if (s.state === 'idle' && !o.hub) { const k = now / 1000 + o.x1 * .01; fx = Math.sin(k * 1.1) * 1.6; fy = Math.cos(k * .9) * 1.6; }
      o.cx = sx + (o.x1 - sx) * e + fx; o.cy = sy + (o.y1 - sy) * e + fy;
      o.g.setAttribute('transform', `translate(${o.cx},${o.cy}) scale(${.3 + .7 * Math.min(1, p * 1.4)})`); o.g.setAttribute('opacity', p > 0 ? Math.min(1, p * 2.2) : 0);
      o.edge.setAttribute('x1', sx); o.edge.setAttribute('y1', sy); o.edge.setAttribute('x2', o.cx); o.edge.setAttribute('y2', o.cy); o.edge.setAttribute('opacity', p > 0 ? (o.hub ? .9 : .55) : 0);
      if (o.ring) o.ring.style.display = s.pulseId === (o.m && o.m.id) && p >= 1 ? '' : 'none';
    });
    s.rels.forEach(r => { const p = Math.max(0, Math.min(1, (t - r.delay) / r.dur)); if (p < 1) done = false; r.path.style.strokeDashoffset = r.len * (1 - easeOut(p)); r.badge.setAttribute('opacity', p > .5 ? 1 : 0); r.box.setAttribute('opacity', Math.max(0, (p - .6) / .4)); });
    if (s.state === 'in' && done) s.state = 'idle';
    if (s.camA) { const a = s.camA, p = Math.min(1, (now - a.t0) / a.dur), e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; ['x', 'y', 'w'].forEach(k => s.cam[k] = a.from[k] + (a.to[k] - a.from[k]) * e); if (p >= 1) s.camA = null; }
    s.svg.setAttribute('viewBox', `${s.cam.x} ${s.cam.y} ${s.cam.w} ${s.cam.w * H / W}`);
    const p = Math.min(1, (now - s.op.t0) / 600), e = easeOut(p); for (const k of ['world', 'hero']) { const o = s.op[k]; o.v = o.f + (o.t - o.f) * e; }
    s.world.setAttribute('opacity', s.op.world.v); if (s.hero) s.hero.setAttribute('opacity', s.op.hero.v);
    if (s.hero && s.fnode) {
      const f = s.fnode, hn = s.hero.querySelector('.hn'); hn.setAttribute('transform', `translate(${f.cx},${f.cy})`);
      const hi = s.hero.querySelector('.hint'); if (hi) { const dx = CX - f.cx, dy = CY - f.cy, L = Math.hypot(dx, dy) || 1, d = Math.min(L - 20, s.cam.w * .15); hi.setAttribute('transform', `translate(${f.cx + dx / L * d},${f.cy + dy / L * d})`); }
      s.hero.querySelectorAll('.hl').forEach(l => { const par = f.parent || { cx: CX, cy: CY }, a = l.dataset.a === 'p' ? par : f, b = l.dataset.a === 'p' ? { cx: CX, cy: CY } : par; l.setAttribute('x1', a.cx); l.setAttribute('y1', a.cy); l.setAttribute('x2', b.cx); l.setAttribute('y2', b.cy); });
    }
    requestAnimationFrame(n => frame(s, n));
  }
  return { mount };
})();
