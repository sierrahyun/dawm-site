/* shell: header, nav, search, modal, toast, popups, render loop */
const UI = { view: null, timers: [], prefs: {} };
const ICON = {
  search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  bell: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
  cam: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  send: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
  x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  prev: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
  next: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>'
};

function clearTimers() { UI.timers.forEach(t => clearInterval(t)); UI.timers = []; }
function every(ms, fn) { UI.timers.push(setInterval(fn, ms)); }

function navHTML(r) {
  const base = [['home', '홈'], ['dict', '성분사전'], ['community', '피부타입 커뮤니티'], ['ranking', '제품 랭킹'], ['recommend', '제품 추천']];
  const mine = [['myroom', 'My room'], ['routine', '내 루틴'], ['naum', '나움'], ['neighbors', '이웃']];
  const isOn = k => r === k || r.startsWith(k + '-') || (k === 'dict' && (r.startsWith('ing-') || r.startsWith('article-') || r.startsWith('concept-'))) || (k === 'community' && r.startsWith('room-')) || (k === 'neighbors' && r.startsWith('neighbor-'));
  let h = base.map(([k, t]) => `<a href="#${k}" class="${isOn(k) ? 'on' : ''}">${t}</a>`).join('');
  if (me() && myCode()) {
    const fresh = !UI.unlocked; UI.unlocked = true;
    h += '<span class="sep" aria-hidden="true"></span>' + mine.map(([k, t], i) => `<a href="#${k}" class="mine ${fresh ? 'unlock' : ''} ${isOn(k) ? 'on' : ''}" style="animation-delay:${0.25 + i * 0.12}s">${t}</a>`).join('');
  }
  return h;
}

function shell() {
  const r = current();
  const u = me();
  document.body.classList.toggle('member', !!(u && u.code));
  document.body.dataset.route = r.split('-')[0];
  const top = u && u.code
    ? `안녕하세요 ${esc(u.name)}님 · 오늘은 ${isRetinolDay() ? '레티놀 바르는 날' : '레티놀 쉬는 날'}이에요 <a href="#routine">루틴 보기</a>`
    : u ? `${esc(u.name)}님, 스킨코드 진단을 마치면 나만의 다움과 나움이 열려요 <a href="#diagnosis">진단 시작</a>`
      : `로그인과 스킨코드 진단을 마치면 나만의 다움과 나움이 열려요 <a href="#login">로그인하고 진단 시작</a>`;
  const right = u
    ? `<div style="position:relative"><button class="iconbtn" data-act="noti" aria-label="알림">${ICON.bell}${u.code ? '<span class="dot"></span>' : ''}</button></div>
       <div style="position:relative"><button class="chipme" data-act="profile"><span class="ava" aria-hidden="true"></span>${esc(u.name)}${u.code ? ' · ' + u.code : ''}</button></div>`
    : `<a href="#login" class="btn">로그인</a><a href="#login" class="btn dark hide-m">회원가입</a>`;
  $('#top').innerHTML = `<div class="topbar">${top}</div>`;
  $('#hdr').innerHTML = `
  <div class="wrap hrow">
    <a href="#home" class="word" aria-label="다움 홈">dawm</a>
    <div class="search">
      <label>${ICON.search}<span class="sr">제품 또는 성분 검색</span>
        <input id="q" type="search" autocomplete="off" placeholder="${u && u.code ? '제품·성분 검색 — 내 피부 기준으로 보여드려요' : '제품·성분 검색 (예: 히알루론산, 레티놀, 토리든)'}"></label>
      <div class="suggest" id="sug" role="listbox"></div>
    </div>
    <div class="hright">${right}</div>
  </div>
  <div class="wrap"><nav class="main" aria-label="주요 메뉴">${navHTML(r)}</nav></div>`;
  const tabs = u && u.code
    ? [['home', '홈'], ['dict', '성분'], ['myroom', 'My room', 1], ['community', '커뮤니티'], ['naum', '나움']]
    : [['home', '홈'], ['dict', '성분사전'], ['community', '커뮤니티'], ['ranking', '랭킹'], [u ? 'diagnosis' : 'login', u ? '진단' : '로그인']];
  $('#tabs').innerHTML = tabs.map(([k, t, c]) => `<a href="#${k}" class="${r === k ? 'on' : ''} ${c ? 'center' : ''}">${c ? '<span class="orb" aria-hidden="true"></span>' : ''}${t}</a>`).join('');
}

function render() {
  clearTimers();
  closeMenus();
  shell();
  const r = current();
  let fn = routes[r];
  let arg = null;
  if (!fn) {
    const m = r.match(/^(ing|product|room|article|neighbor|concept)-(.+)$/);
    if (m) { fn = routes[m[1]]; arg = m[2]; }
  }
  if (!fn) fn = routes.home;
  const v = $('#view');
  v.style.animation = 'none'; void v.offsetWidth; v.style.animation = '';
  v.innerHTML = '';
  fn(v, arg);
  window.scrollTo(0, 0);
  maybePopups(r);
}

/* ---------- search suggest ---------- */
const norm = s => String(s || '').toLowerCase().replace(/[\s\-·()]/g, '');
function searchAll(q) {
  const qq = norm(q); if (!qq) return { c: [], p: [], i: [] };
  const exact = D.ing.filter(x => norm(x.ko) === qq || x.inci.some(e => norm(e) === qq));
  const c = D.con.filter(x => x.aliases.some(a => norm(a).includes(qq) || (norm(a).length >= 3 && qq.includes(norm(a)))) || norm(x.name).includes(qq) || x.members.some(m => exact.some(e => e.id === m.id))).slice(0, 4);
  const i = exact.concat(D.ing.filter(x => !exact.includes(x) && (norm(x.ko).includes(qq) || x.inci.some(e => norm(e).includes(qq)) || norm(x.role).includes(qq)))
    .sort((a, b) => (a.tier > b.tier ? 1 : a.tier < b.tier ? -1 : a.ko.length - b.ko.length))).slice(0, 8);
  const p = D.prod.filter(x => norm(x.name + x.brand + x.tag).includes(qq)).slice(0, 6);
  return { c, p, i };
}
function bindSearch() {
  document.addEventListener('input', e => {
    if (e.target.id !== 'q') return;
    const { c, p, i } = searchAll(e.target.value); const s = $('#sug');
    if (!p.length && !i.length && !c.length) { s.classList.toggle('on', !!e.target.value.trim()); s.innerHTML = '<div class="noti muted">검색 결과가 없어요. 영문(INCI)으로도 찾아보세요.</div>'; return; }
    const ex = i.length && norm(i[0].ko) === norm(e.target.value);
    const conH = c.length ? '<h6>개념 · 비교해서 보기</h6>' + c.map(x => `<button data-go="concept-${x.id}"><span class="tag gold">개념</span><span><b>${esc(x.name)}</b> <span class="muted small">${x.members.length}개 성분 비교</span></span></button>`).join('') : '';
    s.innerHTML = (ex ? '' : conH) + (i.length ? '<h6>성분</h6>' + i.map(x => `<button data-go="ing-${x.id}"><span class="tag">${esc(x.group)}</span><span><b>${esc(x.ko)}</b> <span class="muted small">${esc(x.inci[0])}</span></span></button>`).join('') : '')
      + (ex ? conH : '') + (p.length ? '<h6>제품</h6>' + p.map(x => `<button data-go="product-${x.id}">${bottle(x.cat, x.texture, x.id).replace('pvis', 'mini')}<span><span class="muted small">${esc(x.brand)}</span><br><b>${esc(x.name)}</b></span></button>`).join('') : '');
    s.classList.add('on');
  });
  document.addEventListener('keydown', e => {
    if (e.target.id === 'q' && e.key === 'Enter') { const b = $('#sug button'); if (b) b.click(); }
    if (e.key === 'Escape') { closeModal(); closeMenus(); $('#sug') && $('#sug').classList.remove('on'); }
  });
  document.addEventListener('click', e => { if (!e.target.closest('.search')) { const s = $('#sug'); if (s) s.classList.remove('on'); } });
}

/* ---------- modal / toast / menus ---------- */
function modal(html, onMount) {
  closeModal();
  const bg = document.createElement('div'); bg.className = 'modalbg'; bg.id = 'mbg';
  bg.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
  bg.addEventListener('click', e => { if (e.target === bg) closeModal(); });
  document.body.appendChild(bg);
  if (onMount) onMount(bg.firstChild);
  const f = bg.querySelector('input,button'); if (f) f.focus();
}
function closeModal() { const m = $('#mbg'); if (m) m.remove(); }
function toast(t, ms = 3200) {
  const el = document.createElement('div'); el.className = 'toast'; el.innerHTML = `<span class="orb" style="width:18px;height:18px;animation:none" aria-hidden="true"></span>${t}`;
  $('#toasts').appendChild(el); setTimeout(() => el.remove(), ms);
}
function closeMenus() { $$('.menu').forEach(m => m.remove()); }
function openMenu(anchor, html) {
  const open = anchor.parentElement.querySelector('.menu'); closeMenus(); if (open) return;
  const m = document.createElement('div'); m.className = 'menu'; m.innerHTML = html; anchor.parentElement.appendChild(m);
}
function notifications() {
  const list = [];
  if (isRetinolDay()) list.push(['오늘은 레티놀 데이', '세안 후 피부를 말리고 완두콩 한 알만큼. 아젤리아는 아침에만.']);
  else list.push(['오늘은 레티놀 쉬는 날', '장벽 회복 위주로 가볍게 마무리해요.']);
  if (ointment() && hasOnShelf(id => id === 'retinol')) list.push(['아젤리아 + 레티놀', '레티놀 데이엔 아젤리아를 아침에만 발라 자극을 나눠요.']);
  list.push(['하람님이 방명록을 남겼어요', '“방 분위기 너무 좋다! 선반 구경하고 감”']);
  list.push(['#초민감피부들모여라에서 내 선반 제품이 언급됐어요', '@하이드로수딩크림']);
  return list;
}

/* ---------- popups ---------- */
function maybePopups(r) {
  $$('.popup').forEach(p => p.remove());
  const seen = st().seen;
  if (r === 'home' && !myCode() && !seen.diag) {
    setTimeout(() => {
      if (current() !== 'home' || myCode() || st().seen.diag) return;
      const p = document.createElement('div'); p.className = 'popup diag';
      p.innerHTML = `<button class="x" data-act="closepop" data-k="diag" aria-label="닫기">${ICON.x}</button>
        <div style="display:flex;gap:14px;align-items:center"><span class="orb" style="width:52px;height:52px"></span>
        <div><div class="serif" style="font-size:18px;color:#9A6F38">Nawoom is coming</div><b style="font-size:17px">진단하면 나움이 찾아와요</b></div></div>
        <p class="muted" style="margin:12px 0 16px">16문항, 3분이면 내 스킨코드와 피부 수호천사 나움이 생겨요. 이후 모든 제품을 내 피부 기준으로 읽어줘요.</p>
        <a class="btn dark" style="width:100%" href="#${me() ? 'diagnosis' : 'login'}" data-act="closepop" data-k="diag">스킨코드 진단 시작</a>`;
      document.body.appendChild(p);
    }, 2500);
  }
  if ((r === 'home' || r === 'ranking') && !seen.ad && !myCode()) {
    setTimeout(() => {
      if (st().seen.ad || !['home', 'ranking'].includes(current())) return;
      const p = document.createElement('div'); p.className = 'popup ad';
      p.innerHTML = `<button class="x" data-act="closepop" data-k="ad" aria-label="닫기">${ICON.x}</button>
        <span class="tag" style="background:#D7F06A;color:#0F4C4A">AD · 가상 브랜드</span>
        <div style="font-family:var(--serif);font-size:30px;margin:10px 0 0;color:#D7F06A">LUMA</div>
        <b style="font-size:18px">물처럼 스며드는 데일리 선세럼</b>
        <p style="opacity:.85;margin:8px 0 16px">무기자차 × 히알루론산. 첫 구매 30% 할인 쿠폰.</p>
        <button class="btn" data-act="closepop" data-k="ad">쿠폰 받기</button>`;
      document.body.appendChild(p);
    }, 9000);
  }
}

/* ---------- delegated actions ---------- */
const ACT = {};
function act(name, fn) { ACT[name] = fn; }
function bindActions() {
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); $('#sug') && $('#sug').classList.remove('on'); const q = $('#q'); if (q) q.value = ''; go(g.dataset.go); return; }
    const a = e.target.closest('[data-act]');
    if (a && ACT[a.dataset.act]) { ACT[a.dataset.act](a, e); }
    if (!e.target.closest('.menu') && !e.target.closest('[data-act="noti"]') && !e.target.closest('[data-act="profile"]')) closeMenus();
  });
}
act('closepop', a => { st().seen[a.dataset.k] = 1; S.save(); a.closest('.popup') && a.closest('.popup').remove(); });
act('close', () => closeModal());
act('noti', a => openMenu(a, notifications().map(([t, d]) => `<div class="noti"><b>${esc(t)}</b><span class="muted">${esc(d)}</span></div>`).join('')));
act('profile', a => openMenu(a, `
  ${myCode() ? `<div class="noti"><b>${esc(me().name)} · ${myCode()}</b><span class="muted">${codeWords(myCode())} · ${typeName(myCode())}</span></div>` : ''}
  <a href="#myroom">My room</a><a href="#diagnosis">스킨코드 다시 진단</a>
  <button data-act="logout">로그아웃</button><button data-act="resetdemo" class="muted">데모 데이터 초기화</button>`));
act('logout', () => { st().user = null; UI.unlocked = false; S.save(); toast('로그아웃했어요'); go('home'); });
act('resetdemo', () => { S.reset(); UI.unlocked = false; toast('처음 상태로 돌아왔어요'); go('home'); });
