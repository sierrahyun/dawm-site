/* member pages: home, my room (editable widgets), routine, neighbors, 나움 chat */
function tod() {
  const o = UI.prefs.tod; if (o && o !== 'auto') return o;
  const h = new Date().getHours(); return h >= 5 && h <= 10 ? 'morning' : h <= 16 && h >= 11 ? 'day' : h >= 17 && h <= 20 ? 'evening' : 'night';
}
const TOD = {
  morning: { ko: '아침', hi: '좋은 아침이에요', bg: 'linear-gradient(160deg,#FFF6E4 0%,#FBE3BE 45%,#F4D3A6 100%)', fg: '#3A2E24', beam: 'repeating-linear-gradient(115deg,rgba(255,255,255,0) 0 90px,rgba(255,250,230,.55) 90px 140px,rgba(255,255,255,0) 140px 240px)' },
  day: { ko: '낮', hi: '좋은 오후예요', bg: 'linear-gradient(160deg,#FFFDF8 0%,#F6EEDF 60%,#EFE3CF 100%)', fg: '#3A2E24', beam: 'repeating-linear-gradient(105deg,rgba(255,255,255,0) 0 120px,rgba(255,255,255,.5) 120px 150px,rgba(255,255,255,0) 150px 260px)' },
  evening: { ko: '저녁', hi: '좋은 저녁이에요', bg: 'linear-gradient(160deg,#F7D7B5 0%,#E7AE84 45%,#B97A63 100%)', fg: '#3A1F14', lamp: true },
  night: { ko: '밤', hi: '편안한 밤이에요', bg: 'linear-gradient(160deg,#2B2432 0%,#3A2E3A 50%,#4A3A36 100%)', fg: '#F5EADB', lamp: true, stars: true }
};
function itemInfo(s) {
  if (s.pid) { const p = D.prodById[s.pid]; return p ? { name: p.name, brand: p.brand, cat: p.cat, tex: p.texture, p } : null; }
  return { name: s.name, brand: s.brand, cat: s.cat || '크림', tex: '', sub: s.sub };
}
function naumLine() {
  const t = tod(), r = isRetinolDay(), oi = ointment(), on = oi ? oi.name.replace(' 크림', '') : '';
  if (t === 'morning') return '좋은 아침이에요. 오늘은 무기자차 선크림 꼭 챙겨요. 어제 밤 레티노이드가 있었다면 더더욱요.';
  if (t === 'day') return '오후엔 T존 번들거림이 올라올 시간이에요. 노세범 파우더로 가볍게 눌러주면 충분해요.';
  if (r) return `오늘은 레티놀 데이예요. 세안 후 피부를 완전히 말리고 완두콩 한 알만큼.${oi ? ` ${on}는 아침에 바르고, 밤엔 레티놀만 발라요.` : ''}`;
  return `오늘은 레티놀 쉬는 날이에요. 진정 위주로 가볍게 마무리해요.${oi ? ` ${on}는 트러블·붉은 부위에 얇게.` : ''}`;
}
function routineSteps(when) {
  const order = ['토너·패드', '앰플·세럼', '의약품', '크림', '선케어', '색조'];
  const ret = isRetinolDay();
  const L = st().shelf.map(s => ({ s, i: itemInfo(s) })).filter(x => x.i && (when === 'AM' ? /AM|낮/.test(x.s.when || '') : /PM/.test(x.s.when || '')));
  const out = L.filter(x => {
    const ids = itemIngs(x.s);
    if (when === 'PM' && ids.includes('retinol')) return ret;
    return true;
  }).sort((a, b) => order.indexOf(a.i.cat) - order.indexOf(b.i.cat)).map(x => {
    const ids = itemIngs(x.s); let note = x.s.when || '';
    if (ids.includes('retinol')) note = '완두콩 한 알 · 눈가·입가 피하기';
    if (x.s.cat === '의약품') note = when === 'AM' ? '트러블·붉은 부위에 얇게 · 처음 1~2주는 따끔할 수 있어요' : ret ? '오늘은 레티놀 데이 → 밤엔 건너뛰고 아침에만' : '트러블·붉은 부위에 얇게';
    return { name: x.i.name, brand: x.i.brand, cat: x.i.cat, tex: x.i.tex, note, pid: x.s.pid };
  });
  return [{ name: when === 'AM' ? '미온수 세안' : '저자극 세안', brand: '', cat: '', note: when === 'AM' ? '물 세안 또는 약산성 클렌저' : '선크림을 발랐다면 꼼꼼히' }].concat(out);
}
function stepsHTML(L) {
  return L.map((x, i) => `<div class="shelf-item"><span class="rank" style="font-size:20px;width:20px">${i + 1}</span>${x.cat ? bottle(x.cat, x.tex, x.pid).replace('pvis', 'mini') : '<span class="mini" style="background:var(--soft)"></span>'}<span style="flex:1;min-width:0"><b style="font-size:14px">${esc(x.name)}</b><br><span class="small muted">${esc(x.note)}</span></span></div>`).join('');
}

/* ================= MEMBER HOME ================= */
function memberHome(v) {
  const u = me(), code = u.code, t = TOD[tod()];
  const shelfIds = new Set(st().shelf.map(s => s.pid));
  const picks = D.prod.filter(p => !shelfIds.has(p.id)).map(p => ({ p, s: productScore(p, code) })).sort((a, b) => b.s - a.s).slice(0, 4);
  const yesterday = st().shelf.find(s => s.pid === 'estra-hydro-soothing') ? '하이드로 수딩크림' : (itemInfo(st().shelf[0]) || {}).name;
  const posts = D.com.rooms.flatMap(r => r.msgs.map(m => ({ r, m }))).filter(x => x.m[1] === code).slice(0, 4);
  v.innerHTML = `
  <section class="sunwrap"><div class="sun" style="width:46%;height:160%;left:4%;top:-50%;background:radial-gradient(closest-side,rgba(255,226,180,.9),rgba(255,226,180,0))"></div><div class="leaf"></div>
   <div class="wrap greet" style="position:relative">
    <div class="rise" style="flex:1 1 340px;min-width:0;display:flex;align-items:center;gap:16px"><span class="orb" style="width:48px;height:48px"></span>
      <div><h1 style="margin:0;font-weight:400;letter-spacing:-.03em;font-size:clamp(20px,2vw,25px);line-height:1.35">${t.hi}, ${esc(u.name)}님</h1>
      <p style="margin:4px 0 0;font-size:14px;color:var(--muted)"><b style="color:var(--accent);font-weight:500">나움</b> · ${esc(naumLine())}</p></div></div>
    <form class="rise" data-form="ask" style="flex:1.3 1 460px;min-width:0;animation-delay:.15s">
      <div class="askbar"><a class="rbtn" href="#naum" aria-label="사진으로 물어보기">${ICON.cam}</a><label style="flex:1;display:flex;min-width:0"><span class="sr">나움에게 질문</span><input name="q" placeholder="나움에게 물어보기 · 매장에서 찍은 사진도 OK"></label><button class="rbtn dark" aria-label="보내기">${ICON.send}</button></div>
      <div class="chips" style="gap:6px;margin-top:10px">${['오늘 나이트 루틴 짜줘', '레티놀이랑 연고 같이 써도 돼?', '요즘 볼이 자주 붉어져'].map(q => `<a class="chip" style="height:32px;font-size:13px" href="#naum" data-act="asknaum" data-q="${q}">${q}</a>`).join('')}</div>
    </form></div></section>
  <div class="wrap"><div class="fbk"><span class="orb" style="width:28px;height:28px;animation:none"></span><span style="flex:1;min-width:200px"><b>어제 바른 ${esc(yesterday)}, 잘 맞았나요?</b> <span class="small muted">기록할수록 나움이 더 정확해져요</span></span>
    <span class="chips">${['잘 맞았어요', '애매해요', '안 맞았어요'].map(x => `<button class="chip" data-act="fb" data-v="${x}">${x}</button>`).join('')}</span></div></div>
  <section class="blk" style="padding-bottom:10px"><div class="wrap">${carousel('car')}</div></section>
  <section class="blk"><div class="wrap grid g3" style="align-items:start">
    <div class="card"><div class="shead" style="margin-bottom:6px"><h2 class="h2" style="font-size:17px">오늘 밤 루틴</h2><span class="tag ${isRetinolDay() ? 'gold' : ''}">${isRetinolDay() ? '레티놀 데이' : '레티놀 쉬는 날'}</span></div>${stepsHTML(routineSteps('PM'))}<a class="btn sm" href="#routine" style="margin-top:10px">루틴 전체</a></div>
    <div class="card"><div class="shead" style="margin-bottom:6px"><h2 class="h2" style="font-size:17px">${esc(u.name)}님께 맞을 제품</h2><a href="#recommend">더보기</a></div>
      ${picks.map(x => `<a class="shelf-item" href="#product-${x.p.id}" style="text-decoration:none">${bottle(x.p.cat, x.p.texture, x.p.id).replace('pvis', 'mini')}<span style="flex:1;min-width:0"><span class="small muted">${esc(x.p.brand)}</span><br><b style="font-size:14px">${esc(x.p.name)}</b></span><b class="${scClass(x.s)}">${x.s}</b></a>`).join('')}</div>
    <div class="card"><div class="shead" style="margin-bottom:6px"><h2 class="h2" style="font-size:17px">나이트 리추얼</h2><a href="#myroom">My room</a></div>
      <p class="small muted" style="margin:0 0 8px">감사 일기 ${st().diary.length}일째 · 오늘 ${st().diary.some(d => d.d === todayStr()) ? '작성 완료' : '아직이에요'}</p>
      <div class="cal">${weekDays().map(d => `<button disabled class="${d.ret ? 'ret' : ''} ${d.today ? 'today' : ''}">${d.dow}<br>${st().diary.some(x => x.d === d.str) ? '✎' : '·'}</button>`).join('')}</div>
      <a class="btn sm gold" href="#myroom" style="margin-top:14px">오늘 일기 쓰기</a></div>
  </div></section>
  <section class="blk" style="padding-top:0"><div class="wrap">
    <div class="shead"><h2 class="h2">${code} 방 새 소식</h2><a href="#room-type-${code}">입장하기 →</a></div>
    <div class="grid g2">${(posts.length ? posts : D.com.rooms[0].msgs.slice(0, 4).map(m => ({ r: D.com.rooms[0], m }))).map(x => `<div class="card feedcard" role="link" tabindex="0" data-href="#room-${x.r.id}"><div class="small muted">${esc(x.r.name)} · ${esc(x.m[0])} · ${esc(x.m[1])}</div><div style="margin-top:6px">${mentionHTML(x.m[3])}</div></div>`).join('')}</div>
  </div></section>`;
  startCarousel();
  if (!UI.greeted) { UI.greeted = true; setTimeout(() => toast(isRetinolDay() ? '오늘은 레티놀 데이예요 · 아젤리아는 아침에만' : '오늘은 레티놀 쉬는 날이에요 🌙'), 900); }
}
function weekDays() {
  const now = new Date(), out = [];
  for (let k = 0; k < 7; k++) { const d = new Date(now); d.setDate(now.getDate() - now.getDay() + k); const str = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); out.push({ dow: DOW[k], k, str, ret: st().retinolDays.includes(k), today: k === now.getDay() }); }
  return out;
}
FORMS.ask = (f, fd) => { const q = (fd.get('q') || '').trim(); if (q) UI.pendingAsk = q; go('naum'); };
act('asknaum', a => { UI.pendingAsk = a.dataset.q; });
act('fb', a => { st().condition[todayStr()] = a.dataset.v === '안 맞았어요' ? '붉음' : '편안'; S.save(); toast(a.dataset.v === '안 맞았어요' ? '기록했어요. 서랍에 넣을지 나움이 물어볼게요' : '기록했어요. 고마워요!'); a.closest('.fbk').style.display = 'none'; });

/* ================= MY ROOM ================= */
const WIDGETS = {
  naum: { t: '나움 한마디', r: () => `<div style="display:flex;gap:12px;align-items:flex-start"><span class="orb" style="width:40px;height:40px"></span><p style="margin:0">${esc(naumLine())}</p></div><a class="btn sm" href="#naum" style="margin-top:14px">나움과 이야기하기</a>` },
  tonight: { t: '오늘 밤 루틴', r: () => stepsHTML(routineSteps('PM')) },
  retinol: { t: '레티놀 캘린더', r: () => `<p class="small muted" style="margin:0 0 10px">요일을 눌러 레티놀 바르는 밤을 정해요</p><div class="cal">${weekDays().map(d => `<button data-act="retday" data-k="${d.k}" class="${d.ret ? 'ret' : ''} ${d.today ? 'today' : ''}" aria-pressed="${d.ret}">${d.dow}<br>${d.ret ? 'R' : '쉼'}</button>`).join('')}</div><p class="small" style="margin:12px 0 0">${isRetinolDay() ? '오늘은 <b>레티놀 데이</b>' : '오늘은 <b>쉬는 날</b>'} · 주 ${st().retinolDays.length}회${st().retinolDays.length > 3 ? ' <span class="tag warn">민감(S)이라 주 2~3회 권장</span>' : ''}</p>` },
  shelf: { t: '선반 · 지금 쓰는 제품', r: () => st().shelf.map((s, k) => { const i = itemInfo(s); if (!i) return ''; const sc = s.pid ? productScore(i.p, myCode()) : null; return `<div class="shelf-item">${bottle(i.cat, i.tex, i.p && i.p.id).replace('pvis', 'mini')}<a ${s.pid ? `href="#product-${s.pid}"` : `href="#ing-${(s.ing || [])[0]}"`} style="flex:1;min-width:0;text-decoration:none"><span class="small muted">${esc(i.brand)}${i.sub ? ' · ' + esc(i.sub) : ''}</span><br><b style="font-size:14px">${esc(i.name)}</b> <span class="tag">${esc(s.when || '')}</span>${s.cat === '의약품' ? ' <span class="tag warn">의약품</span>' : ''}</a>${sc != null ? `<b class="${scClass(sc)}" style="font-size:15px">${sc}</b>` : ''}<button class="rbtn" style="width:32px;height:32px" data-act="unshelf" data-k="${k}" aria-label="${esc(i.name)} 선반에서 빼기">${ICON.x}</button></div>`; }).join('') + `<button class="btn sm" data-act="addshelf" style="margin-top:10px">+ 제품 담기</button>` },
  drawer: { t: '서랍 · 안 맞았던 제품', r: () => st().drawer.map((s, k) => { const i = itemInfo(s); if (!i) return ''; return `<div class="shelf-item" style="align-items:flex-start">${bottle(i.cat, i.tex, i.p && i.p.id).replace('pvis', 'mini')}<span style="flex:1;min-width:0"><b style="font-size:14px">${esc(i.name)}</b> <span class="small muted">${esc(i.brand)}</span><br><span class="small">${esc(s.note || '')}</span><br>${(s.sus || []).map(id => `<a class="tag warn" href="#ing-${id}">의심 · ${esc(D.ingById[id].ko.split('(')[0])}</a>`).join(' ')}</span><button class="rbtn" style="width:32px;height:32px" data-act="undrawer" data-k="${k}" aria-label="기록 지우기">${ICON.x}</button></div>`; }).join('') + `<p class="small muted" style="margin:8px 0 0">의심 성분은 모든 제품 점수에 반영돼요.</p><button class="btn sm" data-act="adddrawer" style="margin-top:8px">+ 안 맞았던 제품 기록</button>` },
  diary: { t: '나이트 리추얼 · 감사 일기', r: () => { const today = st().diary.find(d => d.d === todayStr()); return `<form data-form="diary"><label class="sr" for="dtx">오늘 감사한 일</label><textarea id="dtx" name="t" class="input" placeholder="오늘 고마웠던 일 하나를 적어요">${today ? esc(today.t) : ''}</textarea><button class="btn sm gold" style="margin-top:8px">${today ? '고쳐 쓰기' : '저장'}</button></form>${st().diary.filter(d => d.d !== todayStr()).slice(0, 2).map(d => `<p class="small" style="margin:10px 0 0"><span class="muted">${d.d.slice(5)}</span> ${esc(d.t)}</p>`).join('')}`; } },
  condition: { t: '오늘 피부 컨디션', r: () => { const c = st().condition, T = todayStr(); const days = []; for (let k = 6; k >= 0; k--) { const d = new Date(); d.setDate(d.getDate() - k); const s = ymd(d); days.push([DOW[d.getDay()], c[s]]); } return `<div class="chips">${['편안', '당김', '번들', '붉음', '트러블'].map(x => `<button class="chip ${c[T] === x ? 'on' : ''}" data-act="cond" data-v="${x}">${x}</button>`).join('')}</div><div class="cal" style="margin-top:14px">${days.map(([w, v]) => `<button disabled style="${v === '붉음' || v === '트러블' ? 'background:#FBE9DF' : v ? 'background:#E7F1EA' : ''}">${w}<br>${v ? esc(v) : '·'}</button>`).join('')}</div>`; } },
  guestbook: { t: '방명록', r: () => st().guestbook.slice(0, 3).map(g => `<div class="shelf-item" style="align-items:flex-start"><span class="ava"></span><span><b class="small">${esc(g.from)}</b> <span class="small muted">${g.d.slice(5)}</span><br><span class="small">${esc(g.t)}</span></span></div>`).join('') + '<a class="btn sm" href="#neighbors" style="margin-top:10px">이웃 방 놀러가기</a>' },
  skincode: { t: '내 스킨코드', r: () => `<div class="code" style="font-size:56px">${myCode()}</div><div>${esc(typeName(myCode()))}</div><div class="small muted">${codeWords(myCode())} · ${me().diagnosedAt || ''} 진단</div><a class="btn sm" href="#diagnosis" style="margin-top:12px">다시 진단하기</a>` },
  neighbors: { t: '이웃', r: () => st().neighbors.map(n => `<a class="shelf-item" href="#neighbor-${n.id}" style="text-decoration:none"><span class="ava"></span><span style="flex:1"><b class="small">${esc(n.name)}</b> <span class="tag">${n.code}</span></span><span class="small muted">놀러가기 →</span></a>`).join('') + '<button class="btn sm" data-act="pair" style="margin-top:10px">폰 맞대고 이웃 맺기</button>' }
};
UI.editRoom = false;
route('myroom', v => {
  if (!myCode()) { go(me() ? 'diagnosis' : 'login'); return; }
  const T = TOD[tod()], L = st().layout;
  const hidden = Object.keys(WIDGETS).filter(id => !L.some(w => w.id === id));
  v.innerHTML = `<section class="blk" style="padding-top:20px"><div class="wrap">
    <div class="room-hero" style="background:${T.bg};--rfg:${T.fg}">
      <div class="bgimg" style="${img('myroom-' + tod(), 'none')};background-size:cover"></div>
      ${T.beam ? `<div class="beam leaf" style="background:${T.beam}"></div>` : ''}${T.lamp ? '<div class="lamp"></div>' : ''}<div class="scrim"></div>
      <div style="position:relative;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center">
        <div><div class="serif" style="font-size:20px;opacity:.8">${esc(me().name)}'s room</div><div style="font-size:26px;font-weight:300;letter-spacing:-.03em">${T.hi}, ${esc(me().name)}님</div></div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="tag" style="background:rgba(255,255,255,.75);color:#3A2E24" id="clock"></span><span class="tag" style="background:rgba(255,255,255,.75);color:#3A2E24">오늘 방문 3</span>
          <div class="todsel" role="group" aria-label="시간대">${['auto', 'morning', 'day', 'evening', 'night'].map(k => `<button data-act="tod" data-k="${k}" class="${(UI.prefs.tod || 'auto') === k ? 'on' : ''}">${k === 'auto' ? '실시간' : TOD[k].ko}</button>`).join('')}</div></div>
      </div>
      <div style="position:relative;display:flex;gap:14px;align-items:flex-end;margin-top:70px"><span class="orb" style="width:64px;height:64px"></span><div class="say">${esc(naumLine())}</div></div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:22px;gap:10px;flex-wrap:wrap">
      <h2 class="h2">내 방 위젯</h2>
      <div style="display:flex;gap:8px">${UI.editRoom ? `<button class="btn sm" data-act="wreset">기본 배치로</button><button class="btn sm gold" data-act="wedit">완료</button>` : `<button class="btn sm" data-act="wedit">방 꾸미기</button>`}</div>
    </div>
    ${UI.editRoom ? `<p class="small muted" style="margin:6px 0 0">위젯을 끌어서 옮기거나 ↑↓로 순서를, ⇔로 크기를 바꿔요. ×로 숨기고, 아래에서 다시 추가할 수 있어요.</p>` : ''}
    <div class="widgets ${UI.editRoom ? 'editing' : ''}" id="wgrid">${L.map((w, k) => WIDGETS[w.id] ? `<div class="w ${w.size === 'l' ? 'l' : ''}" data-k="${k}" ${UI.editRoom ? 'draggable="true"' : ''}>
      <div class="wtools"><button data-act="wmove" data-k="${k}" data-d="-1" aria-label="앞으로">↑</button><button data-act="wmove" data-k="${k}" data-d="1" aria-label="뒤로">↓</button><button data-act="wsize" data-k="${k}" aria-label="크기 바꾸기">⇔</button><button data-act="wdel" data-k="${k}" aria-label="숨기기">×</button></div>
      <h4>${esc(WIDGETS[w.id].t)}</h4><div class="wbody">${WIDGETS[w.id].r()}</div></div>` : '').join('')}</div>
    ${UI.editRoom ? `<h3 class="h2" style="font-size:16px;margin:24px 0 10px">위젯 추가</h3><div class="gallery">${hidden.length ? hidden.map(id => `<button data-act="wadd" data-id="${id}"><b>+ ${esc(WIDGETS[id].t)}</b></button>`).join('') : '<span class="muted small">모든 위젯이 방에 있어요.</span>'}</div>` : ''}
  </div></section>`;
  const tick = () => { const c = $('#clock'); if (c) c.textContent = new Date().toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' }) + ' · ' + T.ko; };
  tick(); every(30000, tick);
  if (UI.editRoom) bindDrag();
});
function bindDrag() {
  let from = null;
  $$('#wgrid .w').forEach(el => {
    el.addEventListener('dragstart', e => { from = +el.dataset.k; el.classList.add('drag'); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', String(from)); } catch (x) { } });
    el.addEventListener('dragend', () => el.classList.remove('drag'));
    el.addEventListener('dragover', e => { e.preventDefault(); el.classList.add('over'); });
    el.addEventListener('dragleave', () => el.classList.remove('over'));
    el.addEventListener('drop', e => { e.preventDefault(); const to = +el.dataset.k; if (from == null || from === to) return; const L = st().layout; const [w] = L.splice(from, 1); L.splice(to, 0, w); S.save(); render(); });
  });
}
act('wedit', () => { UI.editRoom = !UI.editRoom; render(); if (!UI.editRoom) toast('방 배치를 저장했어요'); });
act('wmove', a => { const L = st().layout, k = +a.dataset.k, j = k + +a.dataset.d; if (j < 0 || j >= L.length) return; [L[k], L[j]] = [L[j], L[k]]; S.save(); render(); });
act('wsize', a => { const w = st().layout[+a.dataset.k]; w.size = w.size === 'l' ? 'm' : 'l'; S.save(); render(); });
act('wdel', a => { st().layout.splice(+a.dataset.k, 1); S.save(); render(); });
act('wadd', a => { st().layout.push({ id: a.dataset.id, size: 'm' }); S.save(); render(); });
act('wreset', () => { st().layout = DEFAULT_STATE().layout; S.save(); render(); });
act('tod', a => { UI.prefs.tod = a.dataset.k; render(); });
act('retday', a => { const k = +a.dataset.k, R = st().retinolDays, i = R.indexOf(k); i < 0 ? R.push(k) : R.splice(i, 1); R.sort(); S.save(); render(); });
act('cond', a => { st().condition[todayStr()] = a.dataset.v; S.save(); render(); if (['붉음', '트러블'].includes(a.dataset.v)) toast('기록했어요. 오늘은 새 제품 대신 진정 위주로 가요'); });
act('unshelf', a => { const s = st().shelf.splice(+a.dataset.k, 1)[0]; S.save(); render(); toast(`${(itemInfo(s) || {}).name} 을(를) 선반에서 뺐어요`); });
act('undrawer', a => { st().drawer.splice(+a.dataset.k, 1); S.save(); render(); });
FORMS.diary = (f, fd) => { const t = (fd.get('t') || '').trim(); if (!t) return; const D2 = st().diary, x = D2.find(d => d.d === todayStr()); x ? x.t = t : D2.unshift({ d: todayStr(), t }); S.save(); render(); toast('오늘의 감사 일기를 저장했어요 ✎'); };

/* add-to-shelf / drawer modals */
function pickerHTML(kind) {
  return `<h3 class="h2" style="margin-bottom:6px">${kind === 'shelf' ? '선반에 제품 담기' : '안 맞았던 제품 기록'}</h3>
  <div class="search" style="margin:12px 0"><label>${ICON.search}<input id="pk" placeholder="다움 DB에서 제품 찾기"></label></div><div id="pkl" style="max-height:260px;overflow:auto"></div>
  <details style="margin-top:14px"><summary class="small" style="cursor:pointer">DB에 없는 제품 직접 입력 (연고·해외 제품 등)</summary>
   <form data-form="custom" data-kind="${kind}" style="margin-top:10px"><label class="field"><span>제품 이름</span><input class="input" name="name" required></label>
   <label class="field"><span>전성분 또는 주요 성분 (쉼표로 구분, 선택)</span><textarea class="input" name="ing" placeholder="예: 아젤라익애씨드 / Water, Glycerin, Niacinamide ..."></textarea></label>
   ${kind === 'drawer' ? '<label class="field"><span>어땠나요?</span><input class="input" name="note" placeholder="예: 이틀 뒤 볼이 붉어짐"></label>' : '<label class="field"><span>언제 쓰나요?</span><select class="input" name="when"><option>AM·PM</option><option>PM</option><option>AM</option><option>PM · 트러블 부위만</option></select></label>'}
   <button class="btn dark">추가</button></form></details>`;
}
function bindPicker(kind) {
  const draw = () => { const q = ($('#pk').value || '').replace(/\s/g, '').toLowerCase(); const L = D.prod.filter(p => (p.brand + p.name + p.tag).replace(/\s/g, '').toLowerCase().includes(q)).slice(0, 12); $('#pkl').innerHTML = L.map(p => `<button class="shelf-item" style="width:100%;background:none;border:0;border-bottom:1px solid var(--line);text-align:left" data-act="pick" data-kind="${kind}" data-id="${p.id}">${bottle(p.cat, p.texture, p.id).replace('pvis', 'mini')}<span style="flex:1"><span class="small muted">${esc(p.brand)}</span><br><b style="font-size:14px">${esc(p.name)}</b></span><b class="${scClass(productScore(p, myCode()))}">${productScore(p, myCode())}</b></button>`).join(''); };
  draw(); $('#pk').addEventListener('input', draw);
}
act('addshelf', () => modal(pickerHTML('shelf'), () => bindPicker('shelf')));
act('adddrawer', () => modal(pickerHTML('drawer'), () => bindPicker('drawer')));
function guessSuspects(ids) {
  const code = myCode() || '';
  return ids.filter(id => { const i = D.ingById[id]; return i && (code.split('').some(l => i.caution.includes(l)) || i.tags.includes('fragrance') || i.tags.includes('allergen')); }).slice(0, 3);
}
act('pick', a => {
  const p = D.prodById[a.dataset.id];
  if (a.dataset.kind === 'shelf') { if (!st().shelf.some(s => s.pid === p.id)) st().shelf.push({ pid: p.id, when: p.cat === '선케어' || p.cat === '색조' ? 'AM' : 'AM·PM' }); toast(`${p.name} 을(를) 선반에 담았어요`); }
  else { st().drawer.push({ pid: p.id, note: '', sus: guessSuspects(p.ing) }); st().shelf = st().shelf.filter(s => s.pid !== p.id); toast('서랍에 기록했어요. 의심 성분을 점수에 반영할게요'); }
  S.save(); closeModal(); render();
});
FORMS.custom = (f, fd) => {
  const { ids } = parseIngredients(fd.get('ing') || ''); const name = fd.get('name').trim(); if (!name) return;
  if (f.dataset.kind === 'shelf') st().shelf.push({ custom: true, name, brand: '직접 입력', ing: ids, cat: ['adapalene', 'benzoyl-peroxide', 'azelaic-acid'].some(x => ids.includes(x)) ? '의약품' : '크림', when: fd.get('when') });
  else st().drawer.push({ custom: true, name, brand: '직접 입력', ing: ids, note: fd.get('note') || '', sus: guessSuspects(ids) });
  S.save(); closeModal(); render(); toast(ids.length ? `성분 ${ids.length}개를 인식했어요` : '추가했어요');
};
act('toshelf', a => { const id = a.dataset.id; if (!st().shelf.some(s => s.pid === id)) { st().shelf.push({ pid: id, when: 'AM·PM' }); S.save(); toast('선반에 담았어요'); render(); } });
act('todrawer', a => { const p = D.prodById[a.dataset.id]; st().drawer.push({ pid: p.id, note: '', sus: guessSuspects(p.ing) }); st().shelf = st().shelf.filter(s => s.pid !== p.id); S.save(); toast('서랍에 기록했어요'); render(); });

/* ================= ROUTINE ================= */
route('routine', v => {
  if (!myCode()) { go(me() ? 'diagnosis' : 'login'); return; }
  v.innerHTML = `<section class="blk"><div class="wrap">
    <div class="serif" style="font-size:18px;color:var(--accent)">My routine</div><h1 class="h1" style="margin-bottom:18px">내 루틴</h1>
    <div class="grid g3" style="align-items:start">
      <div class="card"><h2 class="h2" style="font-size:17px;margin-bottom:6px">아침</h2>${stepsHTML(routineSteps('AM'))}</div>
      <div class="card"><h2 class="h2" style="font-size:17px;margin-bottom:6px">오늘 밤 <span class="tag ${isRetinolDay() ? 'gold' : ''}">${isRetinolDay() ? '레티놀 데이' : '쉬는 날'}</span></h2>${stepsHTML(routineSteps('PM'))}</div>
      <div class="card"><h2 class="h2" style="font-size:17px;margin-bottom:10px">레티놀 캘린더</h2>${WIDGETS.retinol.r()}
        ${ointment() ? `<div class="card" style="margin-top:14px;background:var(--soft);padding:14px"><b class="small">${esc(ointment().name)}와 레티놀을 함께 쓰는 중</b><p class="small" style="margin:4px 0 0">둘 다 쓸 수는 있지만 같은 밤에 겹치면 민감(S) 피부는 따가움이 커질 수 있어요. 레티놀 데이엔 아젤리아를 아침에만 바르는 식으로 나눠요. 의사·약사 안내와 설명서가 우선이에요.</p></div>` : ''}</div>
    </div><p class="small muted" style="margin-top:14px">루틴은 My room 선반의 제품과 사용 시간으로 자동으로 짜여요. 선반을 바꾸면 루틴도 바뀌어요.</p></div></section>`;
});

/* ================= NEIGHBORS ================= */
const NB_SHELF = { n1: ['estra-atobarrier-cream', 'illiyoon-ceramide-cream', 'estra-uv365-mineral'], n2: ['laneige-waterbank-cream', 'estra-cera-ha-ampoule', 'hera-black-cushion'], n3: ['iope-retinol-expert', 'laneige-cream-skin', 'sulwhasoo-fcas'] };
route('neighbors', v => {
  if (!myCode()) { go(me() ? 'diagnosis' : 'login'); return; }
  v.innerHTML = `<section class="blk"><div class="wrap">
    <div class="serif" style="font-size:18px;color:var(--accent)">Neighbors</div><h1 class="h1" style="margin-bottom:6px">이웃</h1>
    <p class="muted" style="margin:0 0 20px">이웃의 방에 놀러가 선반을 구경하고 방명록을 남겨요.</p>
    <button class="btn gold" data-act="pair" style="margin-bottom:20px">폰 맞대고 이웃 맺기</button>
    <div class="grid g3">${st().neighbors.map(n => `<a class="card" href="#neighbor-${n.id}" style="text-decoration:none"><div style="display:flex;gap:12px;align-items:center"><span class="ava" style="width:48px;height:48px"></span><div><b>${esc(n.name)}</b><div class="small muted">${n.code} · ${esc(typeName(n.code))}</div></div></div><p class="small muted" style="margin:12px 0 0">${n.since}부터 이웃 · 놀러가기 →</p></a>`).join('')}</div></div></section>`;
});
route('neighbor', (v, id) => {
  const n = st().neighbors.find(x => x.id === id); if (!n) { go('neighbors'); return; }
  const T = TOD[tod()];
  const shelf = (NB_SHELF[id] || D.prod.map(p => p.id).sort((a, b) => productScore(D.prodById[b], n.code) - productScore(D.prodById[a], n.code)).slice(0, 3)).map(x => D.prodById[x]);
  const book = (st().nbook || {})[id] || [];
  v.innerHTML = `<section class="blk" style="padding-top:20px"><div class="wrap">
    <a href="#neighbors" class="small muted">← 이웃</a>
    <div class="room-hero" style="background:${T.bg};--rfg:${T.fg};margin-top:12px;min-height:220px">${T.lamp ? '<div class="lamp"></div>' : ''}${T.stars ? '<div class="stars"></div>' : ''}
      <div style="position:relative"><div class="serif" style="font-size:20px;opacity:.8">${esc(n.name)}'s room</div><div style="font-size:26px;font-weight:300">${esc(n.name)}님의 방 · ${n.code}</div></div></div>
    <div class="grid g2" style="margin-top:20px;align-items:start">
      <div class="card"><h2 class="h2" style="font-size:17px;margin-bottom:6px">${esc(n.name)}님의 선반</h2>${shelf.map(p => `<a class="shelf-item" href="#product-${p.id}" style="text-decoration:none">${bottle(p.cat, p.texture, p.id).replace('pvis', 'mini')}<span style="flex:1"><span class="small muted">${esc(p.brand)}</span><br><b style="font-size:14px">${esc(p.name)}</b></span><span class="small">나에게 <b class="${scClass(productScore(p, myCode()))}">${productScore(p, myCode())}</b></span></a>`).join('')}</div>
      <div class="card"><h2 class="h2" style="font-size:17px;margin-bottom:10px">방명록 남기기</h2>
        <form data-form="nbook" data-id="${id}"><label class="sr" for="nb">방명록</label><textarea id="nb" class="input" name="t" placeholder="${esc(n.name)}님에게 한마디"></textarea><button class="btn sm gold" style="margin-top:8px">남기기</button></form>
        ${book.map(b => `<p class="small" style="margin:12px 0 0"><b>${esc(me().name)}</b> <span class="muted">${b.d.slice(5)}</span> ${esc(b.t)}</p>`).join('')}</div>
    </div></div></section>`;
});
FORMS.nbook = (f, fd) => { const t = (fd.get('t') || '').trim(); if (!t) return; const B = st().nbook = st().nbook || {}; (B[f.dataset.id] = B[f.dataset.id] || []).unshift({ t, d: todayStr() }); S.save(); render(); toast('방명록을 남겼어요'); };
act('pair', () => {
  modal(`<h3 class="h2">폰 맞대고 이웃 맺기</h3><p class="muted small">두 폰을 가까이 대면 서로의 방이 이어져요. (시연 화면 · 실제 근거리 통신은 앱 버전에서 연결)</p><div class="pair" aria-hidden="true"><i></i><i></i></div><p class="small" id="pairmsg" style="text-align:center">상대의 폰을 찾고 있어요…</p>`, () => {
    setTimeout(() => {
      const m = $('#pairmsg'); if (!m) return;
      const n = { id: 'n' + (st().neighbors.length + 1) + Date.now() % 1000, name: '소이', code: 'DSNW', since: todayStr() };
      if (!st().neighbors.some(x => x.name === '소이')) { st().neighbors.push(n); S.save(); }
      m.innerHTML = '<b>소이님(DSNW)과 이웃이 되었어요!</b><br><button class="btn sm gold" data-act="close" style="margin-top:10px">확인</button>';
    }, 2600);
  });
});

/* ================= 나움 CHAT ================= */
route('naum', v => {
  if (!myCode()) { go(me() ? 'diagnosis' : 'login'); return; }
  if (!st().chat || !st().chat.length) st().chat = [{ w: 'naum', t: `${me().name}님, 나움이에요. 제품명이나 전성분을 보내주면 ${myCode()} 기준으로 읽어드릴게요. 매장에서 찍은 사진도 올려주세요.` }];
  v.innerHTML = `<div class="chat">
    <div style="display:flex;gap:12px;align-items:center;padding:10px 0 14px;border-bottom:1px solid var(--line)"><span class="orb" style="width:44px;height:44px"></span><div><b>나움</b><div class="small muted">${esc(me().name)}님의 피부 수호천사 · ${myCode()} 기록 기준</div></div></div>
    <div id="chatlog">${st().chat.map(msgHTML).join('')}</div>
    <p class="small muted" style="text-align:center;margin-top:20px">나움은 성분 데이터로 안내하는 시연용 도우미예요. 의약품·피부 질환은 피부과 진료가 우선이에요.</p>
  </div>
  <form class="composer" data-form="chat"><div class="askbar">
    <label class="rbtn" style="cursor:pointer" aria-label="사진 올리기">${ICON.cam}<input type="file" accept="image/*" id="chatimg" class="sr"></label>
    <label style="flex:1;display:flex;min-width:0"><span class="sr">메시지</span><input name="q" id="chatin" autocomplete="off" placeholder="제품명, 전성분, 고민을 적어주세요"></label>
    <button class="rbtn dark" aria-label="보내기">${ICON.send}</button></div>
    <div class="chips" style="max-width:820px;margin:8px auto 0;gap:6px">${['오늘 나이트 루틴 짜줘', '아쿠아밤 나한테 맞을까?', '레티놀이랑 연고 같이 써도 돼?', '나한테 맞는 선크림 추천'].map(q => `<button type="button" class="chip" style="height:32px;font-size:13px;background:var(--bg)" data-act="chatq" data-q="${q}">${q}</button>`).join('')}</div>
  </form>`;
  $('#chatimg').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => { pushChat({ w: 'me', img: r.result }); setTimeout(() => pushChat({ w: 'naum', t: '사진 잘 받았어요! 사진 속 성분표 글자를 읽는 기능(OCR)은 배포 버전에서 연결할 예정이에요. 지금은 패키지의 제품명이나 전성분을 그대로 복사해 보내주면 바로 판정해 드릴게요.' }), 600); }; r.readAsDataURL(f);
  });
  scrollChat();
  if (UI.pendingAsk) { const q = UI.pendingAsk; UI.pendingAsk = null; setTimeout(() => sendChat(q), 300); }
});
function msgHTML(m) {
  if (m.w === 'me') return `<div class="msg me"><div class="bub">${m.img ? `<img class="up" src="${m.img}" alt="올린 사진">` : esc(m.t)}</div></div>`;
  return `<div class="msg naum"><span class="orb" style="width:30px;height:30px;animation:none"></span><div class="bub">${esc(m.t)}${m.card || ''}</div></div>`;
}
function scrollChat() { setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 30); }
function pushChat(m) { const C = st().chat; C.push(m); if (C.length > 40) C.splice(0, C.length - 40); if (!m.img) S.save(); const log = $('#chatlog'); if (log) { log.insertAdjacentHTML('beforeend', msgHTML(m)); scrollChat(); } }
FORMS.chat = (f, fd) => { const q = (fd.get('q') || '').trim(); if (!q) return; $('#chatin').value = ''; sendChat(q); };
act('chatq', a => sendChat(a.dataset.q));
function sendChat(q) { pushChat({ w: 'me', t: q }); setTimeout(() => pushChat(naumReply(q)), 500); }
function verdictCard(title, a) {
  return `<div class="verdict"><div style="display:flex;gap:12px;align-items:center"><b class="${scClass(a.score)}" style="font-size:30px">${a.score}</b><div><b>${esc(title)}</b><div class="small muted">${myCode()} 다움 점수</div></div></div>
  ${a.good.length ? `<div class="small" style="margin-top:8px"><b>좋은 점</b> ${a.good.slice(0, 4).map(g => `<span class="tag good">${esc(g.ing.ko.split('(')[0])}</span>`).join(' ')}</div>` : ''}
  ${a.warn.length ? `<div class="small" style="margin-top:6px"><b>주의</b> ${a.warn.slice(0, 4).map(g => `<span class="tag warn">${esc(g.ing.ko.split('(')[0])}</span>`).join(' ')}</div>` : ''}
  ${a.personal.length ? `<div class="small" style="margin-top:6px"><b>서랍 기록</b> ${a.personal.map(g => `<span class="tag warn">${esc(g.ko.split('(')[0])}</span>`).join(' ')}</div>` : ''}</div>`;
}
function findProduct(q) {
  const n = s => s.replace(/\s/g, '').toLowerCase(); const qq = n(q);
  return D.prod.filter(p => qq.includes(n(p.tag)) || qq.includes(n(p.name)) || (n(p.name).length > 4 && qq.includes(n(p.name).slice(0, 5))))
    .sort((a, b) => n(b.tag).length - n(a.tag).length)[0];
}
function naumReply(q) {
  const code = myCode(), name = me().name;
  const parsed = parseIngredients(q);
  if ((q.match(/,/g) || []).length >= 3 && parsed.ids.length >= 3) {
    const a = analyze(parsed.ids, code);
    return { w: 'naum', t: `성분 ${parsed.ids.length}개를 읽었어요${parsed.unknown.length ? ` (못 읽은 이름 ${parsed.unknown.length}개는 DB 확장 후 반영돼요)` : ''}. ${a.score >= 75 ? '잘 맞을 가능성이 높아요.' : a.score >= 55 ? '무난하지만 주의 성분을 확인해요.' : '지금 피부엔 권하지 않아요.'}`, card: verdictCard('붙여넣은 전성분', a) };
  }
  const p = findProduct(q);
  if (p) {
    const a = analyze(p.ing, code);
    let t = `${p.brand} ${p.name}, ${code} 기준으로 봤어요. `;
    if (a.personal.length) t += `서랍 속 안 맞았던 제품과 같은 의심 성분(${a.personal.map(x => x.ko.split('(')[0]).join(', ')})이 있어요. 쓴다면 귀 뒤에 2~3일 패치 테스트부터 해요.`;
    else if (a.score >= 75) t += '전성분상 잘 맞을 가능성이 높아요.';
    else if (a.warn.length) t += `${a.warn.slice(0, 2).map(x => x.ing.ko.split('(')[0]).join(', ')} 때문에 ${a.warn[0].axes.map(l => AXN[l]).join('·')} 피부엔 자극이 될 수 있어요.`;
    else t += '특별히 걸리는 성분은 없어요.';
    return { w: 'naum', t, card: verdictCard(p.name, a) + `<a class="btn sm" style="margin-top:8px" href="#product-${p.id}">전성분 보기</a>` };
  }
  if (/연고|아젤리아|아젤라|여드름약/.test(q) || (/레티놀/.test(q) && /같이|함께|겹/.test(q))) {
    return { w: 'naum', t: `${name}님 선반의 여드름 연고는 아젤리아(아젤라익애씨드 20%)예요. 레티노이드는 아니라서 레티놀과 함께 써도 되는 조합이에요. 다만 둘 다 초반에 따끔·건조감이 올 수 있어서, 민감(S) 피부는 시간을 나누는 게 편해요.\n\n· 레티놀 데이(${st().retinolDays.map(k => DOW[k]).join('·')}요일): 아젤리아는 아침, 레티놀은 밤\n· 쉬는 날: 아젤리아 아침·저녁, 트러블·붉은 부위에 얇게\n· 아침엔 무기자차 선크림 꼭\n\n따가움이 일주일 넘게 가거나 붓고 화끈거리면 사용을 멈추고 의사·약사에게 확인해 주세요. 설명서와 처방 안내가 가장 우선이에요.` };
  }
  if (/루틴|나이트|저녁|밤/.test(q)) {
    const L = routineSteps('PM');
    return { w: 'naum', t: `오늘은 ${isRetinolDay() ? '레티놀 데이' : '레티놀 쉬는 날'}이에요. 선반 기준으로 짜봤어요.\n\n` + L.map((x, i) => `${i + 1}. ${x.name} — ${x.note}`).join('\n') };
  }
  if (/아침/.test(q)) { const L = routineSteps('AM'); return { w: 'naum', t: '아침 루틴이에요.\n\n' + L.map((x, i) => `${i + 1}. ${x.name} — ${x.note}`).join('\n') }; }
  if (/레티놀/.test(q)) return { w: 'naum', t: `지금은 주 ${st().retinolDays.length}회(${st().retinolDays.map(k => DOW[k]).join('·')})로 잡혀 있어요. 민감(S) 피부는 0.1% 이하로 주 2~3회가 무난해요. 따가움이 3일 넘게 가면 하루 더 쉬어요. My room 레티놀 캘린더에서 요일을 바꿀 수 있어요.` };
  if (/붉|홍조|따가|화끈|가려/.test(q)) {
    const soothe = st().shelf.map(itemInfo).filter(i => i && i.p && i.p.ing.some(x => ['panthenol', 'madecassoside', 'beta-glucan', 'allantoin'].includes(x))).map(i => i.name);
    return { w: 'naum', t: `붉어짐이 잦다면 며칠은 '빼기'부터 해요.\n· 레티놀·각질 제거는 잠시 쉬기\n· 향료·에센셜오일 든 제품 멈추기 (서랍 기록에도 있었어요)\n· 진정 성분 위주로: ${soothe.length ? soothe.join(', ') : '판테놀·병풀 성분 제품'}\n· 뜨거운 물 세안 피하기\n\n일주일 넘게 계속되거나 붓고 화끈거리면 피부과 진료를 받아 보세요. 오늘 컨디션은 My room에 기록해 둘게요.` };
  }
  if (/선크림|자외선|선케어|추천/.test(q)) {
    const cat = /선/.test(q) ? '선케어' : null;
    const L = D.prod.filter(p => (!cat || p.cat === cat || p.ing.includes('zinc-oxide')) && !st().shelf.some(s => s.pid === p.id)).map(p => ({ p, a: analyze(p.ing, code) })).sort((a, b) => b.a.score - a.a.score).slice(0, 3);
    const ad = pickAd(code, p => !cat || p.cat === cat);
    return { w: 'naum', t: `${code} 기준 지금 선반에 없는 제품 중 점수가 높은 순이에요.${ad ? ' 마지막 하나는 광고인데, 같은 기준을 통과한 것만 보여드려요.' : ''}`, card: L.map(x => `<a class="verdict" style="display:flex;gap:10px;align-items:center;text-decoration:none" href="#product-${x.p.id}"><b class="${scClass(x.a.score)}" style="font-size:22px">${x.a.score}</b><span><span class="small muted">${esc(x.p.brand)}</span><br><b class="small">${esc(x.p.name)}</b></span></a>`).join('') + (ad && !L.some(x => x.p.id === ad.pid) ? `<div class="verdict" style="display:flex;gap:10px;align-items:center"><span class="tag ad">AD</span><a href="#product-${ad.pid}" style="flex:1;text-decoration:none"><span class="small muted">${esc(ad.p.brand)} 후원 · 적합도 ${ad.an.score}</span><br><b class="small">${esc(ad.p.name)}</b></a><button class="adwhy" data-act="adwhy" data-pid="${ad.pid}">왜?</button></div>` : '') };
  }
  return { w: 'naum', t: '아직 그 질문은 잘 모르겠어요. 이렇게 물어봐 주세요.\n· 제품명 (예: 워터뱅크블루크림 맞을까?)\n· 전성분 붙여넣기 (쉼표로 구분)\n· 오늘 나이트 루틴 / 레티놀 / 연고 / 붉어짐 / 선크림 추천' };
}
