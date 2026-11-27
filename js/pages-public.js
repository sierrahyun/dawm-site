/* public pages: home, login, diagnosis, dictionary, articles, ranking, recommend, product, community */
const BANNERS = [
  { k: '성분사전 · 히알루론산', t: '저분자? 고분자?<br>알아보자, 히알루론산!', p: '분자 크기에 따라 머무는 곳이 달라요. 전성분 이름표 읽는 법부터 알려드려요.', go: 'article-hyaluronic', cta: '성분사전에서 보기', img: 'banner-hyaluronic', bg: 'linear-gradient(120deg,#EEF5FA 0%,#DCEAF4 55%,#F7FBFD 100%)', label: '히알루론산' },
  { k: '성분사전 · 피부장벽', t: '피부장벽의 세콜지에<br>대한 고찰', p: '세라마이드·콜레스테롤·지방산. 셋이 함께일 때 벽돌 사이 모르타르가 단단해져요.', go: 'article-barrier', cta: '세콜지 읽어보기', img: 'banner-ceramide', bg: 'linear-gradient(120deg,#F7EFE3 0%,#EBDCC4 60%,#FAF5EC 100%)', label: '세콜지' },
  { k: '제품 랭킹 · 건성 기준', t: '건성 김미연을 위한<br>수분앰플 TOP 10', p: '건성(D) 스킨코드로 성분 점수를 매긴 앰플·세럼 순위예요.', go: 'ranking', preset: 'dry-ampoule', cta: '랭킹 보러가기', img: 'banner-ampoule-top10', bg: 'linear-gradient(120deg,#FCEDE3 0%,#F6D9C4 60%,#FFF6EF 100%)', label: '수분앰플 TOP10' },
  { k: '피부타입 커뮤니티', t: '지금 가장 뜨거운 방<br>#초민감피부들모여라', p: '새 제품 하나에도 붉어지는 사람들이 모였어요. 지금 이 방에서 가장 많이 언급된 제품은?', go: 'room-sensitive', cta: '방 구경하기', img: 'banner-community', bg: 'linear-gradient(120deg,#F1EEF8 0%,#E2DCF0 60%,#F8F6FC 100%)', label: '뜨거운 방' },
  { k: 'Sponsored · 가상 브랜드 광고', t: '물처럼 스며드는<br>LUMA 데일리 선세럼', p: '무기자차 × 히알루론산. 백탁 없이 가볍게. (수업용 가상 광고)', ad: true, cta: '자세히', img: 'banner-ad-sunserum', bg: 'linear-gradient(120deg,#EEF3EA 0%,#DCE6D2 60%,#F6F9F3 100%)', label: '광고' }
];
UI.prefs.rank = { tab: 'all', sub: '', type: null, min: 0, max: 130000, preset: null, brand: '' };

function carousel(id) {
  return `<div class="carousel" id="${id}" aria-roledescription="carousel"><div class="track">
    ${BANNERS.map((b, i) => `<div class="slide" aria-label="${i + 1} / ${BANNERS.length}"><div class="bgimg" style="${img(b.img, b.bg)}"></div>
      <div class="txt"><div class="kick">${b.ad ? '<span class="tag ad">AD</span> ' : ''}${esc(b.k)}</div><h3>${b.t}</h3><p>${esc(b.p)}</p>
      <button class="btn dark" data-act="banner" data-i="${i}">${esc(b.cta)} →</button></div></div>`).join('')}</div>
    <div class="cnav"><button data-act="cprev" aria-label="이전 배너">${ICON.prev}</button><span class="cnum"><b>1</b> / ${BANNERS.length}</span><button data-act="cpause" aria-label="자동 넘김 멈춤/재생" class="cpp">❚❚</button><button data-act="cnext" aria-label="다음 배너">${ICON.next}</button></div>
  </div><div class="ctabs">${BANNERS.map((b, i) => `<button class="${i === 0 ? 'on' : ''}" data-act="cgo" data-i="${i}">${esc(b.label)}<i class="cbar"></i></button>`).join('')}</div>`;
}
UI.ci = 0; UI.cHold = false; UI.cStop = false;
const C_MS = 5500;
function cshow(i, manual) {
  const n = BANNERS.length; UI.ci = (i + n) % n; UI.cLast = Date.now();
  const tr = $('.carousel .track'); if (tr) tr.style.transform = `translateX(-${UI.ci * 100}%)`;
  $$('.ctabs button').forEach((s, k) => { s.classList.toggle('on', k === UI.ci); const bar = s.querySelector('.cbar'); if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; } });
  const num = $('.cnum b'); if (num) num.textContent = UI.ci + 1;
}
function startCarousel() {
  const car = $('.carousel'); if (!car) return;
  UI.ci = 0; cshow(0);
  car.addEventListener('mouseenter', () => { UI.cHold = true; car.classList.add('hold'); });
  car.addEventListener('mouseleave', () => { UI.cHold = false; car.classList.remove('hold'); UI.cLast = Date.now(); cshow(UI.ci); });
  car.addEventListener('focusin', () => { UI.cHold = true; });
  car.addEventListener('focusout', () => { UI.cHold = false; });
  let x0 = null;
  car.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; UI.cHold = true; }, { passive: true });
  car.addEventListener('touchend', e => { UI.cHold = false; if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 40) cshow(UI.ci + (dx < 0 ? 1 : -1), true); else UI.cLast = Date.now(); });
  every(300, () => { if (!UI.cHold && !UI.cStop && Date.now() - UI.cLast > C_MS) cshow(UI.ci + 1); });
}
act('cprev', () => cshow(UI.ci - 1, true)); act('cnext', () => cshow(UI.ci + 1, true)); act('cgo', a => cshow(+a.dataset.i, true));
act('cpause', a => { UI.cStop = !UI.cStop; a.textContent = UI.cStop ? '▶' : '❚❚'; $('.carousel').classList.toggle('stopped', UI.cStop); if (!UI.cStop) cshow(UI.ci); });
act('banner', a => {
  const b = BANNERS[+a.dataset.i];
  if (b.ad) { modal(`<span class="tag ad">AD</span><h3 class="h2" style="margin:12px 0 8px">LUMA 데일리 선세럼</h3><p class="muted">수업 프로젝트용 <b>가상 브랜드</b> 광고 예시예요. 실제 서비스에서는 광고 제품도 내 스킨코드 기준 점수와 함께 보여주고, '광고'임을 항상 표시해요.</p><button class="btn dark" data-act="close">닫기</button>`); return; }
  if (b.preset === 'dry-ampoule') Object.assign(UI.prefs.rank, { tab: 'type', sub: '앰플·세럼', type: 'DRNT', preset: 'dry-ampoule', min: 0, max: 130000 });
  go(b.go);
});

function prodRow(p, i, code, extra = '') {
  const s = code ? productScore(p, code) : null;
  const keys = [...new Set(p.ing)].map(id => D.ingById[id]).filter(x => x && x.tier === 'A' && !['제형·기타', '보존·안정', '향·알레르기'].includes(x.group) && !BASE_ING.has(x.id)).slice(0, 3);
  return `<a class="prow" href="#product-${p.id}">${i != null ? `<span class="rank">${i + 1}</span>` : ''}${bottle(p.cat, p.texture, p.id)}
    <span class="pinfo"><span class="b">${esc(p.brand)} · ${esc(p.cat)}</span><span class="n" style="display:block">${esc(p.name)}</span>
    <span class="m">${esc(p.vol)} · ${won(p.price)} <span class="muted">(참고가)</span></span>
    <span class="chips" style="gap:4px;margin-top:6px">${keys.map(k => `<span class="tag">${esc(k.ko.split('(')[0])}</span>`).join('')}${extra}</span></span>
    ${s != null ? `<span class="score"><b class="${scClass(s)}">${s}</b><span>${code} 점수</span></span>` : `<span class="score"><b style="font-size:16px">${(p.pop / 1000).toFixed(1)}k</b><span>저장</span></span>`}</a>`;
}

/* ================= HOME ================= */
route('home', v => {
  if (myCode()) return memberHome(v);
  const top = [...D.prod].sort((a, b) => b.pop - a.pop).slice(0, 5);
  const featured = ['sodium-hyaluronate', 'ceramide-np', 'niacinamide', 'retinol', 'panthenol', 'salicylic-acid', 'zinc-oxide', 'parfum'].map(id => D.ingById[id]);
  const rooms = D.com.rooms.filter(r => r.hot);
  v.innerHTML = `
  <div class="wrap" style="padding-top:22px">${carousel('car')}</div>
  <section class="blk"><div class="wrap">
    <div class="chips">${['클렌징', '토너·패드', '앰플·세럼', '크림', '선케어', '색조'].map(c => `<button class="chip" data-act="catgo" data-c="${c}">${c}</button>`).join('')}<a class="chip" href="#dict">성분으로 찾기</a><a class="chip" href="#community">피부타입별 방</a></div>
  </div></section>
  <section class="blk" style="padding-top:0"><div class="wrap grid g2" style="align-items:start">
    <div><div class="shead"><h2 class="h2">지금 많이 저장한 제품</h2><a href="#ranking">전체 랭킹 →</a></div>
      <div class="grid" style="gap:10px">${top.map((p, i) => prodRow(p, i)).join('')}</div></div>
    <div>
      <div class="shead"><h2 class="h2">조건으로 추천받기</h2><a href="#recommend">자세히 →</a></div>
      <form class="card" data-form="quickrec">
        <div class="grid g2" style="gap:10px">
          <label class="field"><span>카테고리</span><select class="input" name="cat"><option value="">전체</option>${['토너·패드', '앰플·세럼', '크림', '선케어', '색조'].map(c => `<option>${c}</option>`).join('')}</select></label>
          <label class="field"><span>피부타입</span><select class="input" name="type"><option value="">선택 안 함</option>${Object.keys(D.sc.names).map(c => `<option>${c}</option>`).join('')}</select></label>
        </div>
        <label class="field"><span>최대 가격 <b id="qpv">5만원</b></span><input type="range" name="max" min="10000" max="130000" step="5000" value="50000" data-act-input="qpv"></label>
        <button class="btn dark" style="width:100%">추천 보기</button>
      </form>
      <div class="shead" style="margin-top:28px"><h2 class="h2">지금 뜨거운 방</h2><a href="#community">커뮤니티 →</a></div>
      <div class="grid" style="gap:10px">${rooms.slice(0, 3).map(roomCard).join('')}</div>
    </div>
  </div></section>
  <section class="blk" style="background:var(--bg2)"><div class="wrap">
    <div class="shead"><h2 class="h2">성분사전</h2><a href="#dict">272개 성분 전체 보기 →</a></div>
    <div class="grid g4">${featured.map(i => `<a class="card" href="#ing-${i.id}" style="text-decoration:none"><span class="tag">${esc(i.group)}</span><div style="font-weight:600;margin-top:10px">${esc(i.ko)}</div><div class="muted small">${esc(i.inci[0])}</div><div class="small" style="margin-top:8px">${esc(i.role)}</div></a>`).join('')}</div>
  </div></section>`;
  startCarousel();
});
act('catgo', a => { Object.assign(UI.prefs.rank, { tab: a.dataset.c === '선케어' ? 'sun' : a.dataset.c === '색조' ? 'color' : 'skin', sub: ['클렌징', '토너·패드', '앰플·세럼', '크림'].includes(a.dataset.c) ? a.dataset.c : '', preset: null }); go('ranking'); });
document.addEventListener('input', e => {
  if (e.target.dataset.actInput === 'qpv') $('#qpv').textContent = (e.target.value / 10000) + '만원';
});
document.addEventListener('submit', e => {
  const f = e.target; if (!f.dataset.form) return; e.preventDefault();
  const fn = FORMS[f.dataset.form]; if (fn) fn(f, new FormData(f));
});
const FORMS = {};
FORMS.quickrec = (f, fd) => { UI.prefs.rec = { cat: fd.get('cat'), type: fd.get('type') || null, max: +fd.get('max'), tex: [] }; go('recommend'); };

/* ================= LOGIN ================= */
route('login', v => {
  if (me()) { go(myCode() ? 'home' : 'diagnosis'); return; }
  v.innerHTML = `<div class="split">
    <div class="art sunwrap" style="${img('login-bg', 'linear-gradient(160deg,#FBF4E8,#EFE1CB 60%,#E4CFAE)')}">
      <div class="sun" style="width:60%;height:70%;left:10%;top:10%;background:radial-gradient(closest-side,rgba(255,240,210,.9),rgba(255,240,210,0))"></div><div class="leaf"></div>
      <div style="position:absolute;left:40px;bottom:40px;right:40px"><div class="serif" style="font-size:22px;color:#9A6F38">Welcome back</div><div class="h1" style="color:#3A2E24">내 피부를 기억하는<br>단 하나의 뷰티 공간</div></div>
    </div>
    <div class="pane"><form class="box" data-form="login" novalidate>
      <h1 class="h2" style="font-size:26px">로그인</h1><p class="muted" style="margin:6px 0 24px">로그인하면 스킨코드 진단을 시작할 수 있어요.</p>
      <label class="field"><span>아이디</span><input class="input" name="id" autocomplete="username" required></label>
      <label class="field"><span>비밀번호</span><input class="input" type="password" name="pw" autocomplete="current-password" required></label>
      <div class="err" id="lerr" role="alert"></div>
      <button class="btn dark" style="width:100%;height:52px">로그인</button>
      <div class="hint">수업 시연용 테스트 계정 · 아이디 <b>dawmtest</b> / 비밀번호 <b>dawmtest</b><br>실제 회원 인증은 배포 단계에서 연결돼요.</div>
    </form></div></div>`;
});
FORMS.login = (f, fd) => {
  const id = (fd.get('id') || '').trim(), pw = fd.get('pw') || '';
  if (!id || !pw) { $('#lerr').textContent = '아이디와 비밀번호를 입력해 주세요.'; return; }
  if (id === 'dawmtest' && pw === 'dawmtest') {
    st().user = { id, name: '신현', code: null, answers: null }; S.save(); go('diagnosis');
  } else $('#lerr').textContent = '아이디 또는 비밀번호가 맞지 않아요. (테스트 계정: dawmtest / dawmtest)';
};

/* ================= DIAGNOSIS ================= */
UI.quiz = null;
route('diagnosis', v => {
  if (!me()) { go('login'); return; }
  const q = UI.quiz;
  if (!q) {
    v.innerHTML = `<div class="sunwrap" style="${img('diagnosis-bg', 'linear-gradient(180deg,#FFFDF8,#F6EBDA)')};background-size:cover;min-height:calc(100vh - 130px);display:flex;align-items:center">
      <div class="sun" style="width:50%;height:80%;right:0;top:-10%;background:radial-gradient(closest-side,rgba(255,226,180,.9),rgba(255,226,180,0))"></div><div class="leaf"></div>
      <div class="qwrap rise" style="position:relative;text-align:center">
        <span class="orb" style="width:64px;height:64px;display:block;margin:0 auto 18px"></span>
        <div class="serif" style="font-size:20px;color:#9A6F38">Skin code</div>
        <h1 class="h1">${esc(me().name)}님, 반가워요.<br>이제 스킨코드를 찾아볼게요.</h1>
        <p class="muted" style="margin:14px auto 28px;max-width:460px">유분 · 민감 · 색소 · 탄력, 네 단계면 끝나요. 단계마다 4문항씩, 약 2분. 정답은 없으니 요즘 내 피부를 떠올리며 골라주세요.</p>
        <button class="btn dark" style="height:56px;padding:0 34px;font-size:16px" data-act="qstart">피부진단 시작하기</button>
        ${me().code ? `<div style="margin-top:14px"><a href="#home" class="small muted">이전 결과(${me().code})로 돌아가기</a></div>` : ''}
      </div></div>`;
    return;
  }
  const AX = D.sc.axes; if (q.i >= AX.length) return diagResult(v);
  const ax = AX[q.i], qs = D.sc.questions.map((Q, k) => ({ Q, k })).filter(x => x.Q.axis === ax.key);
  const done = qs.every(x => q.ans[x.k] != null);
  v.innerHTML = `<div class="qwrap" style="max-width:820px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px" class="small muted"><span>${q.i + 1} / ${AX.length} · ${esc(ax.name)}</span><button class="btn sm ghost" data-act="qback" ${q.i === 0 ? 'disabled' : ''}>이전</button></div>
    <div class="prog"><i style="width:${(q.i / AX.length) * 100}%"></i></div>
    <div class="steps">${AX.map((a2, k) => `<span class="${k < q.i ? 'done' : k === q.i ? 'on' : ''}">${esc(a2.name)}</span>`).join('')}</div>
    <h2 class="h1 rise" style="font-size:clamp(22px,3vw,30px);margin:26px 0 4px">${esc(ax.name)}에 대해 알려주세요</h2><p class="muted" style="margin:0 0 20px">요즘 내 피부를 떠올리며 가장 가까운 걸 골라요 · 4문항</p>
    ${qs.map((x, n) => `<div class="qblock rise" style="animation-delay:${n * 0.06}s"><div class="qq"><b>${n + 1}</b>${esc(x.Q.q)}</div><div class="qopts">${x.Q.a.map((t, j) => `<button class="qo ${q.ans[x.k] === j ? 'on' : ''}" data-act="qans" data-q="${x.k}" data-k="${j}">${esc(t)}</button>`).join('')}</div></div>`).join('')}
    <button class="btn dark" style="width:100%;height:54px;margin-top:10px" data-act="qnext" ${done ? '' : 'disabled'}>${q.i === AX.length - 1 ? '결과 보기' : '다음'}</button>
  </div>`;
});
act('qstart', () => { UI.quiz = { i: 0, ans: [] }; render(); });
act('qback', () => { if (UI.quiz.i > 0) { UI.quiz.i--; render(); } });
act('qans', a => { const k = +a.dataset.q; UI.quiz.ans[k] = +a.dataset.k; a.parentElement.querySelectorAll('.qo').forEach(b => b.classList.toggle('on', b === a));
  const ax = D.sc.axes[UI.quiz.i].key; const all = D.sc.questions.every((Q, i) => Q.axis !== ax || UI.quiz.ans[i] != null); $('[data-act="qnext"]').disabled = !all;
  const nb = a.closest('.qblock') && a.closest('.qblock').nextElementSibling; if (nb && nb.classList.contains('qblock') && innerWidth < 760) nb.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
act('qnext', () => { UI.quiz.i++; render(); });
function diagResult(v) {
  const { code, sums } = scoreQuiz(UI.quiz.ans);
  const u = me(); const first = !u.code;
  u.code = code; u.answers = UI.quiz.ans; u.sums = sums; u.diagnosedAt = todayStr(); S.save();
  UI.quiz = null; UI.unlocked = false; shell();
  const axes = D.sc.axes;
  const seek = [...new Set(axes.flatMap(a => code.includes(a.hi) ? a.hiSeek : a.loSeek))].slice(0, 8).map(id => D.ingById[id]).filter(Boolean);
  const avoid = [...new Set(axes.flatMap(a => code.includes(a.hi) ? a.hiAvoid : a.loAvoid))].slice(0, 6).map(id => D.ingById[id]).filter(Boolean);
  v.innerHTML = `<div class="sunwrap"><div class="sun" style="width:50%;height:70%;left:25%;top:0;background:radial-gradient(closest-side,rgba(255,226,180,.85),rgba(255,226,180,0))"></div>
  <div class="wrap" style="position:relative;padding:40px 24px 20px;text-align:center">
    <span class="orb" style="width:72px;height:72px;display:block;margin:0 auto 14px"></span>
    <div class="serif" style="font-size:20px;color:#9A6F38">${first ? '나움이 태어났어요' : '스킨코드가 업데이트됐어요'}</div>
    <div class="code rise">${code}</div>
    <div class="h2 rise" style="font-weight:400;margin-top:8px">${esc(typeName(code))} · ${codeWords(code)}</div>
    <p class="muted" style="max-width:560px;margin:14px auto 0">안녕하세요, 저는 ${esc(u.name)}님의 피부 수호천사 <b style="color:#9A6F38">나움</b>이에요. 이제부터 다움의 모든 제품과 성분을 ${code} 기준으로 읽어드릴게요.</p>
  </div></div>
  <div class="wrap grid g2" style="padding-bottom:40px;align-items:start">
    <div class="card">${axes.map(a => { const s = sums[a.key]; const hi = code.includes(a.hi); return `<div class="axisbar"><span>${a.loName}</span><span class="bar"><i style="width:${Math.round(s / 12 * 100)}%"></i></span><span class="r">${a.hiName}</span></div><p class="small" style="margin:0 0 14px"><b>${hi ? a.hiName : a.loName}</b> · ${esc(hi ? a.hiDesc : a.loDesc)}</p>`; }).join('')}</div>
    <div class="card"><h3 class="h2" style="font-size:17px">찾으면 좋은 성분</h3><div class="chips" style="margin:10px 0 20px">${seek.map(i => `<a class="tag good" href="#ing-${i.id}">${esc(i.ko.split('(')[0])}</a>`).join('')}</div>
      <h3 class="h2" style="font-size:17px">조심하면 좋은 성분</h3><div class="chips" style="margin:10px 0 20px">${avoid.length ? avoid.map(i => `<a class="tag warn" href="#ing-${i.id}">${esc(i.ko.split('(')[0])}</a>`).join('') : '<span class="muted small">특별히 피할 성분은 없어요.</span>'}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn gold" href="#home">나만의 다움 열기</a><a class="btn" href="#myroom">My room 가기</a><a class="btn" href="#room-type-${code}">${code} 방 가기</a></div></div>
  </div>`;
}

/* ================= DICTIONARY ================= */
UI.prefs.dict = { q: '', g: '', all: false };
const GROUPS = ['보습', '장벽', '진정', '미백·톤', '주름·탄력', '각질·피지', '자외선차단', '항산화', '향·알레르기', '보존·안정', '의약품 성분', '식물·자연 유래', '제형·기타'];
const SHORT = { 'hyaluronic-acid': '히알루론산', 'sodium-hyaluronate': '소듐 HA', 'potassium-ha': '포타슘 HA', 'hydrolyzed-ha': '저분자 HA', 'hydrolyzed-sodium-ha': '초저분자 HA', 'acetylated-ha': '아세틸 HA', 'ha-crosspolymer': '가교 HA', 'ha-cation': '양이온 HA',
  'pseudo-ceramide': '유사 세라마이드', 'ceramide-np': '세라마이드 NP', 'ceramide-ap': '세라마이드 AP', 'ceramide-eop': '세라마이드 EOP', 'ceramide-ns': '세라마이드 NS', 'fatty-acids': '지방산', 'phytosphingosine': '피토스핑고신',
  'retinyl-palmitate': '레티닐팔미테이트', 'hpr': 'HPR', 'ethyl-ascorbic': '에틸아스코빅', 'ascorbyl-glucoside': '아스코빌글루코사이드', 'map': 'MAP', 'sap': 'SAP', 'ati': '지용성 C(ATIP)', 'ascorbyl-palmitate': '아스코빌팔미테이트', 'ascorbic-acid': '순수 비타민C',
  'lha': 'LHA', 'betaine-salicylate': '베타인살리실레이트', 'asiaticoside': '아시아티코사이드 등', 'glycyrrhizate': '감초 성분', 'essential-oils': '에센셜오일', 'fatty-alcohols': '지방 알코올', 'alcohol': '에탄올', 'ferment': '유산균 발효', 'amino-acids': '아미노산',
  'palmitoyl-peptides': '팔미토일 펩타이드', 'peptide-tetra11': '테트라펩타이드-11', 'peptide-tetra9': '테트라펩타이드-9', 'peptide-hexa8': '헥사펩타이드-8', 'dipeptide2': '다이펩타이드-2', 'collagen': '콜라겐',
  'ethylhexyl-salicylate': '옥티살레이트', 'isoamyl-mc': '아밀록세이트', 'drometrizole': '메르질 XL', 'ensulizole': '엔슐리졸', 'ecamsule': '메르질 SX', 'dhhb': '유비눌 A+', 'bemotrizinol': '티노소브 S', 'avobenzone': '아보벤존', 'octinoxate': '옥티녹세이트', 'ethylhexyl-triazone': '유비눌 T150',
  'titanium-dioxide': '티타늄디옥사이드', 'zinc-oxide': '징크옥사이드', 'benzoyl-peroxide': '벤조일퍼옥사이드', 'tranexamic-acid': '트라넥사믹애씨드', 'b-vitamins': '비타민B군', 'gluconolactone': '글루코노락톤', 'lactobionic': '락토바이오닉', 'houttuynia': '어성초', 'centella': '병풀추출물' };
const shortName = id => SHORT[id] || (D.ingById[id] ? D.ingById[id].ko.split('(')[0] : id);
const prodCount = id => D.prod.filter(p => p.ing.includes(id)).length;
function axisTags(ing, code) {
  if (!code) return [...ing.good].map(l => `<span class="tag good">${AXN[l]}에 좋아요</span>`).join('') + [...ing.caution].map(l => `<span class="tag warn">${AXN[l]} 주의</span>`).join('');
  const g = code.split('').filter(l => ing.good.includes(l)), c = code.split('').filter(l => ing.caution.includes(l));
  return (g.length ? `<span class="tag good">${code}에 좋아요</span>` : '') + (c.length ? `<span class="tag warn">${c.map(l => AXN[l]).join('·')} 주의</span>` : '');
}
/* network graph: concept in the middle, member ingredients on an ellipse, related concepts in the corners */
function networkSVG(con, focus) {
  const W = 800, H = 500, cx = 400, cy = 250, M = con.members, n = M.length;
  const rx = n > 9 ? 255 : 225, ry = n > 9 ? 175 : 160;
  const pos = M.map((m, i) => { const t = -Math.PI / 2 + i * 2 * Math.PI / n; const k = n > 9 && i % 2 ? 0.72 : 1; return [cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k]; });
  const corners = [[92, 46], [708, 46], [92, 454], [708, 454]];
  const pill = (x, y, label, cls, href, sub) => { const w = Math.max(64, label.length * 13 + 26); return `<a href="${href}" class="nn ${cls}"><rect x="${x - w / 2}" y="${y - 17}" width="${w}" height="34" rx="17"/><text x="${x}" y="${y + 5}" text-anchor="middle">${esc(label)}</text>${sub ? `<text class="sub" x="${x}" y="${y + 31}" text-anchor="middle">${esc(sub)}</text>` : ''}</a>`; };
  let edges = '', nodes = '';
  M.forEach((m, i) => { const [x, y] = pos[i]; edges += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" class="e ${m.id === focus ? 'on' : ''}"/>`; nodes += pill(x, y, shortName(m.id), m.id === focus ? 'focus' : prodCount(m.id) ? '' : 'faint', '#ing-' + m.id, m.v[0].length < 12 ? m.v[0] : ''); });
  con.rel.slice(0, 4).forEach((r, i) => { const [x, y] = corners[i]; const rc = D.conById[r.id];
    edges += `<path d="M${cx},${cy} Q${(cx + x) / 2 + (i % 2 ? -40 : 40)},${(cy + y) / 2} ${x},${y}" class="e rel"/>`;
    nodes += `<text class="rl" x="${x}" y="${y + (i < 2 ? 36 : -26)}" text-anchor="middle">${esc(r.t)}</text>`;
    nodes += pill(x, y, rc.name, 'relc', '#concept-' + r.id); });
  nodes += `<a href="#concept-${con.id}" class="nn center"><circle cx="${cx}" cy="${cy}" r="52"/><text x="${cx}" y="${cy + 2}" text-anchor="middle">${esc(con.name.length > 7 ? con.name.split(' ')[0] : con.name)}</text><text class="sub" x="${cx}" y="${cy + 22}" text-anchor="middle">${n}개 성분</text></a>`;
  return `<div class="netwrap"><svg class="net" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(con.name)} 성분 네트워크">${edges}${nodes}</svg></div>`;
}
function compareTable(con, focus) {
  return `<div style="overflow-x:auto"><table class="mw cmp"><tr><th>성분</th>${con.cols.map(c => `<th>${esc(c)}</th>`).join('')}<th>DB 제품</th></tr>${con.members.map(m => { const i = D.ingById[m.id]; const pc = prodCount(m.id);
    return `<tr class="${m.id === focus ? 'on' : ''}"><td><a href="#ing-${m.id}"><b>${esc(shortName(m.id))}</b></a><br><span class="small muted">${esc(i.ko.split('(')[0] !== shortName(m.id) ? i.ko : i.inci[0])}</span></td>${m.v.map(x => `<td>${esc(x)}</td>`).join('')}<td>${pc ? pc + '개' : '<span class="muted">-</span>'}</td></tr>`; }).join('')}</table></div>`;
}
function chainHTML(con, focus) {
  if (!con.chain) return '';
  const fk = focus && D.ingById[focus] ? D.ingById[focus].ko : '';
  return `<div class="chain">${con.chain.map((c, k) => `${k ? '<span class="arr" aria-hidden="true">→</span>' : ''}<span class="${fk && c.startsWith(fk) ? 'on' : ''}">${esc(c)}</span>`).join('')}<span class="small muted" style="margin-left:6px">오른쪽으로 갈수록 강하고 자극도 커요</span></div>`;
}
function conceptCard(c) {
  return `<a class="ccard" href="#concept-${c.id}"><span class="small muted">${esc(c.en)}</span><b>${esc(c.name)}</b><span class="small">${esc(c.sum)}</span>
    <span class="chips" style="gap:4px;margin-top:8px">${c.members.slice(0, 5).map(m => `<span class="tag">${esc(shortName(m.id))}</span>`).join('')}${c.members.length > 5 ? `<span class="tag">+${c.members.length - 5}</span>` : ''}</span></a>`;
}
route('dict', v => {
  const P = UI.prefs.dict, code = myCode();
  v.innerHTML = `<section class="blk"><div class="wrap">
    <div class="serif" style="font-size:18px;color:var(--accent2)">Ingredient dictionary</div><h1 class="h1">성분사전</h1>
    <p class="muted" style="margin:6px 0 18px">개념 ${D.con.length}개 · 성분 ${D.ing.length}개 · 제품 ${D.prod.length}개 전성분 연동${code ? ` · <b style="color:var(--accent)">${code} 기준</b>으로 표시 중` : ''}</p>
    <div class="search" style="max-width:720px;margin-bottom:10px"><label>${ICON.search}<span class="sr">성분 검색</span><input id="dq" value="${esc(P.q)}" placeholder="히알루론산, 레티놀, 비타민C, 시카, 선크림, Niacinamide…"></label></div>
    <div class="chips" style="margin-bottom:26px">${['히알루론산', '레티놀', '비타민C', '세라마이드', '시카', '나이아신아마이드', '자외선', '향료'].map(x => `<button class="chip" data-act="dqs" data-q="${x}">${x}</button>`).join('')}</div>
    <div id="dres"></div></div></section>`;
  dictRender();
  $('#dq').addEventListener('input', e => { P.q = e.target.value; dictRender(); });
});
act('dqs', a => { UI.prefs.dict.q = a.dataset.q; $('#dq').value = a.dataset.q; dictRender(); });
act('dg', a => { UI.prefs.dict.g = a.dataset.g; dictRender(); });
act('dall', () => { UI.prefs.dict.all = !UI.prefs.dict.all; dictRender(); });
function dictRender() {
  const P = UI.prefs.dict, code = myCode(), box = $('#dres'); if (!box) return;
  if (!P.q.trim()) {
    let L = D.ing.filter(i => (P.all || i.tier === 'A') && (!P.g || i.group === P.g));
    box.innerHTML = `<div class="shead"><h2 class="h2">개념으로 탐색</h2><span class="small muted">비슷한 성분끼리 묶어 비교해요</span></div>
      <div class="cgrid">${D.con.map(conceptCard).join('')}</div>
      <div class="grid g2" style="margin:30px 0 8px">
        <a class="card" href="#article-hyaluronic" style="text-decoration:none;${img('banner-hyaluronic', 'linear-gradient(120deg,#EEF5FA,#DCEAF4)')};background-size:cover"><span class="tag">읽을거리</span><b style="display:block;font-size:18px;margin-top:8px;text-shadow:0 0 12px #fff">저분자? 고분자? 알아보자, 히알루론산!</b></a>
        <a class="card" href="#article-barrier" style="text-decoration:none;${img('banner-ceramide', 'linear-gradient(120deg,#F7EFE3,#EBDCC4)')};background-size:cover"><span class="tag">읽을거리</span><b style="display:block;font-size:18px;margin-top:8px;text-shadow:0 0 12px #fff">피부장벽의 세콜지에 대한 고찰</b></a></div>
      <div class="shead" style="margin-top:30px"><h2 class="h2">성분 목록</h2><button class="btn sm ghost" data-act="dall">${P.all ? '해석 성분만 보기' : '보조 성분까지 모두 보기'}</button></div>
      <div class="chips" style="margin-bottom:10px"><button class="chip ${!P.g ? 'on' : ''}" data-act="dg" data-g="">전체</button>${GROUPS.map(g => `<button class="chip ${P.g === g ? 'on' : ''}" data-act="dg" data-g="${g}">${g}</button>`).join('')}</div>
      <div class="small muted">${L.length}개</div>${L.slice(0, 150).map(i => ingRow(i, code)).join('')}`;
    return;
  }
  const { c, i } = searchAll(P.q);
  const more = D.ing.filter(x => !i.includes(x) && norm(x.ko + x.inci.join('') + x.role).includes(norm(P.q))).slice(0, 30);
  const top = c[0], nq = norm(P.q);
  const fi = i.find(x => x.concepts.length && (norm(x.ko) === nq || norm(shortName(x.id)) === nq || x.inci.some(n => norm(n) === nq)));
  box.innerHTML = (fi ? `<div class="shead"><h2 class="h2">'${esc(P.q)}' 성분</h2></div><div class="card" style="padding:18px 22px"><div class="netmount" data-cid="${fi.concepts[0]}" data-focus="${fi.id}" data-mode="focus"></div></div>` : '') + (c.length ? `<div class="shead"><h2 class="h2">'${esc(P.q)}' 관련 개념</h2></div>
      ${top ? `<div class="card" style="padding:22px"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:baseline"><a href="#concept-${top.id}" style="text-decoration:none"><b style="font-size:22px">${esc(top.name)}</b> <span class="muted small">${esc(top.en)}</span></a><a class="btn sm" href="#concept-${top.id}">자세히 →</a></div>
        <p style="margin:8px 0 6px">${esc(top.sum)}</p>${chainHTML(top)}${fi ? '' : `<div class="netmount" data-cid="${top.id}"></div>`}${compareTable(top)}</div>` : ''}
      ${c.length > 1 ? `<div class="cgrid" style="margin-top:14px">${c.slice(1).map(conceptCard).join('')}</div>` : ''}` : '')
    + `<div class="shead" style="margin-top:28px"><h2 class="h2">성분 ${i.length + more.length}개</h2></div>${i.concat(more).map(x => ingRow(x, code)).join('') || '<p class="muted">찾는 성분이 없어요. 영문(INCI)으로도 검색해 보세요.</p>'}`;
  clearTimeout(netTimer); netTimer = setTimeout(() => mountNets(box), 280);
}
function ingRow(i, code) {
  return `<a class="irow" href="#ing-${i.id}"><span style="flex:1;min-width:0"><span class="ko">${esc(i.ko)}</span> <span class="en">${esc(i.inci.slice(0, 2).join(' · '))}</span><br><span class="small">${esc(i.role)}</span>${i.concepts.length ? ' ' + i.concepts.map(c => `<span class="tag gold">${esc(D.conById[c].name)}</span>`).join(' ') : ''}</span>
    <span class="chips" style="gap:4px;justify-content:flex-end">${i.tier === 'A' ? axisTags(i, code) : ''}<span class="tag">${esc(i.group)}</span><span class="tag">제품 ${prodCount(i.id)}</span></span></a>`;
}
route('concept', (v, id) => {
  const c = D.conById[id]; if (!c) { go('dict'); return; }
  const code = myCode();
  const ps = D.prod.map(p => ({ p, n: c.members.filter(m => p.ing.includes(m.id)).length })).filter(x => x.n).sort((a, b) => b.n - a.n || (code ? productScore(b.p, code) - productScore(a.p, code) : b.p.pop - a.p.pop));
  v.innerHTML = `<section class="blk"><div class="wrap" style="max-width:1000px">
    <a href="#dict" class="small muted">← 성분사전</a>
    <div style="margin:14px 0 4px" class="chips"><span class="tag gold">개념</span><span class="tag">${c.members.length}개 성분</span></div>
    <h1 class="h1">${esc(c.name)}</h1><div class="muted">${esc(c.en)}</div>
    <p style="font-size:18px;margin:16px 0 6px"><b>${esc(c.sum)}</b></p>
    <p style="font-size:16px;line-height:1.85;margin:0 0 12px">${esc(c.desc)}</p>
    ${chainHTML(c)}
    <h2 class="h2" style="font-size:18px;margin:26px 0 6px">성분 네트워크</h2>
    <div class="netmount" data-cid="${c.id}"></div>
    <h2 class="h2" style="font-size:18px;margin:10px 0 10px">한눈에 비교</h2>${compareTable(c)}
    ${code ? `<div class="card" style="margin-top:16px;background:var(--soft)"><b style="color:var(--accent)">나움의 한마디 · ${code}</b><p style="margin:6px 0 0">${naumOnConcept(c, code)}</p></div>` : ''}
    <h2 class="h2" style="font-size:18px;margin:30px 0 10px">이 개념의 성분이 든 제품 ${ps.length}개</h2>
    <div class="grid" style="gap:10px">${ps.slice(0, 10).map(x => prodRow(x.p, null, code, `<span class="tag gold">${esc(c.name.split(' ')[0])} ${x.n}종</span>`)).join('') || '<p class="muted">아직 DB에 없어요.</p>'}</div>
  </div></section>`;
  mountNets(v);
});
function mountNets(root) { root.querySelectorAll('.netmount').forEach(el => NET.mount(el, { cid: el.dataset.cid, focus: el.dataset.focus || null, mode: el.dataset.mode || 'net' })); }
let netTimer = null;
function naumOnConcept(c, code) {
  const L = code.split('');
  const good = c.members.filter(m => { const i = D.ingById[m.id]; return L.some(l => i.good.includes(l)) && !L.some(l => i.caution.includes(l)); }).map(m => shortName(m.id));
  const warn = c.members.filter(m => L.some(l => D.ingById[m.id].caution.includes(l))).map(m => shortName(m.id));
  let t = '';
  if (good.length) t += `${good.slice(0, 4).join(', ')}부터 시작하면 좋아요. `;
  if (warn.length) t += `${warn.slice(0, 4).join(', ')}은(는) ${code.includes('S') ? '민감(S)' : '지금'} 피부엔 낮은 농도로 천천히 들여요. `;
  if (c.id === 'retinoid' && ointment()) t += `선반의 ${ointment().name}와 같은 밤엔 겹치지 않게 나눠요.`;
  return t || '지금 피부에 특별히 걸리는 성분은 없어요.';
}
route('ing', (v, id) => {
  const i = D.ingById[id]; if (!i) { v.innerHTML = '<div class="wrap blk">성분을 찾을 수 없어요.</div>'; return; }
  const code = myCode();
  const ps = D.prod.filter(p => p.ing.includes(i.id)).sort((a, b) => code ? productScore(b, code) - productScore(a, code) : b.pop - a.pop);
  const art = i.tags.includes('ha') ? 'hyaluronic' : i.tags.includes('barrier') ? 'barrier' : null;
  const onShelf = me() && st().shelf.some(s => itemIngs(s).includes(i.id));
  const sus = me() && suspects().has(i.id);
  v.innerHTML = `<section class="blk"><div class="wrap" style="max-width:1000px">
    <a href="#dict" class="small muted">← 성분사전</a>
    <div style="margin:14px 0 6px" class="chips"><span class="tag">${esc(i.group)}</span>${i.tier === 'B' ? '<span class="tag">보조 성분 · 국문 참고 표기</span>' : '<span class="tag gold">다움 해석 성분</span>'}${i.tags.includes('drug') ? '<span class="tag warn">의약품 성분</span>' : ''}</div>
    <h1 class="h1">${esc(i.ko)}</h1><div class="muted">${esc(i.inci.join(' · '))}</div>
    <p style="font-size:17px;margin:18px 0 8px"><b>${esc(i.role)}</b></p>
    <p style="font-size:16px;line-height:1.85;margin:0">${esc(i.desc || '제형을 만들거나 안정화하는 보조 성분이에요. 다움 해석표는 계속 확장 중이에요.')}</p>
    ${i.tier === 'A' ? `<div class="chips" style="margin:18px 0">${axisTags(i, null)}</div>` : ''}
    ${ps.length ? `<button type="button" class="btn dark sm jumpprods" style="margin:4px 0 8px">이 성분이 든 제품 ${ps.length}개 보기 ↓</button>` : ''}
    ${code && i.tier === 'A' ? `<div class="card" style="margin:12px 0;background:var(--soft)"><b style="color:var(--accent)">나움의 한마디 · ${code}</b><p style="margin:6px 0 0">${naumOnIngredient(i, code, onShelf, sus)}</p></div>` : ''}
    ${art ? `<a class="btn" href="#article-${art}" style="margin:8px 0 6px">관련 읽을거리 →</a>` : ''}
    ${i.concepts.map(cid => { const c = D.conById[cid]; return `<div class="card" style="margin-top:26px;padding:22px"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:baseline">
      <div><span class="small muted">이 성분이 속한 개념</span><br><a href="#concept-${c.id}" style="text-decoration:none"><b style="font-size:20px">${esc(c.name)}</b></a> <span class="small muted">${esc(c.sum)}</span></div><a class="btn sm" href="#concept-${c.id}">개념 전체 보기 →</a></div>
      ${chainHTML(c, i.id)}<div class="netmount" data-cid="${c.id}" data-focus="${i.id}"></div>${compareTable(c, i.id)}</div>`; }).join('')}
    <h2 class="h2" id="ing-prods" style="font-size:18px;margin:30px 0 12px;scroll-margin-top:120px">이 성분이 든 제품 ${ps.length}개 <span class="small muted" style="font-weight:400">${code ? code + ' 점수 높은 순' : '인기순'}</span></h2>
    <div class="grid" style="gap:10px">${ps.length ? ps.map(p => prodRow(p, null, code, `<span class="tag gold">${p.ing.indexOf(i.id) + 1}번째</span>`)).join('') : '<p class="muted">아직 DB에 이 성분이 든 제품이 없어요.</p>'}</div>
  </div></section>`;
  mountNets(v);
  const jp = () => { const h = v.querySelector('#ing-prods'); if (h) h.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const jb = v.querySelector('.jumpprods'); if (jb) jb.onclick = jp;
  if (window.DAWM_JUMP === 'prods') { window.DAWM_JUMP = null; setTimeout(jp, 120); }
});
function naumOnIngredient(i, code, onShelf, sus) {
  const g = code.split('').filter(l => i.good.includes(l)), c = code.split('').filter(l => i.caution.includes(l));
  let t = '';
  if (sus) t += '서랍 속 안 맞았던 제품에서 의심 성분으로 기록된 성분이에요. 새 제품에 이 이름이 앞쪽에 있으면 패치 테스트부터 해요. ';
  if (c.length) t += `${c.map(l => AXN[l]).join('·')} 피부라 처음엔 낮은 농도로, 하나씩 들여보세요. `;
  if (g.length) t += `${g.map(l => AXN[l]).join('·')} 고민에 도움이 되는 성분이에요. `;
  if (i.tags.includes('retinoid') && ointment()) t += `선반의 ${ointment().name}와 같은 밤에 겹치면 예민해질 수 있어요. 레티놀 데이엔 연고를 아침으로 옮겨요. `;
  if (i.id === 'azelaic-acid' && ointment()) t += '선반의 아젤리아 크림 주성분이에요(20%, 의약품). 붉은기·트러블·자국에 두루 쓰여요. ';
  if (onShelf) t += '지금 선반의 제품에도 들어 있어요.';
  return t || '특별히 신경 쓸 점은 없는 무난한 성분이에요.';
}

/* ================= ARTICLES ================= */
route('article', (v, id) => {
  const code = myCode();
  const withIng = ids => D.prod.filter(p => ids.some(x => p.ing.includes(x)));
  if (id === 'hyaluronic') {
    const H = [['hyaluronic-acid', '히알루로닉애씨드', '고분자(대략 100만 Da 이상)', '피부 표면에 촉촉한 막. 즉각적인 매끈함'], ['sodium-hyaluronate', '소듐하이알루로네이트', '제품마다 다름(대개 중~고분자)', '가장 흔한 형태. 안정적이고 물에 잘 녹음'], ['hydrolyzed-ha', '하이드롤라이즈드하이알루로닉애씨드', '저분자(수천~수만 Da)', '각질층 사이로 스며 속당김 완화'], ['acetylated-ha', '소듐아세틸레이티드하이알루로네이트', '유도체', '피부 친화력·보습 지속력 강화'], ['ha-crosspolymer', '소듐하이알루로네이트크로스폴리머', '가교(그물) 구조', '오래 머무는 보습막'], ['ha-cation', '하이드록시프로필트라이모늄하이알루로네이트', '양이온 유도체', '피부에 잘 달라붙어 씻겨도 남는 보습']];
    const ps = withIng(H.map(h => h[0])).map(p => ({ p, n: H.filter(h => p.ing.includes(h[0])).length })).sort((a, b) => b.n - a.n);
    v.innerHTML = `<div class="sunwrap" style="${img('banner-hyaluronic', 'linear-gradient(120deg,#EEF5FA,#DCEAF4 55%,#F7FBFD)')};background-size:cover"><div class="wrap" style="padding:60px 24px"><span class="tag">성분사전 · 읽을거리</span><h1 class="h1" style="margin-top:12px">저분자? 고분자?<br>알아보자, 히알루론산!</h1></div></div>
    <section class="blk"><div class="wrap article">
      <p>히알루론산은 원래 우리 피부 속에도 있는 당 사슬이에요. 자기 무게의 수백 배 물을 붙잡을 수 있어서 보습 성분의 대표가 됐죠. 그런데 전성분표를 보면 이름이 하나가 아니에요. <b>사슬의 길이(분자량)와 형태</b>가 다르면 머무는 곳과 느낌이 달라지기 때문이에요.</p>
      <h3>이름표로 구별하기</h3>
      <table class="mw"><tr><th>전성분 표기</th><th>크기·형태</th><th>이런 역할</th></tr>${H.map(h => `<tr><td><a href="#ing-${h[0]}">${h[1]}</a></td><td>${h[2]}</td><td>${h[3]}</td></tr>`).join('')}</table>
      <p class="small muted">분자량 범위는 원료사마다 달라서 대략적인 기준이에요. 전성분에는 분자량이 표시되지 않으니, '하이드롤라이즈드'가 붙으면 저분자 쪽이라고 기억하면 쉬워요.</p>
      <h3>그래서 뭘 고르면 될까</h3>
      <p>한 가지보다 <b>크기가 다른 히알루론산을 섞은 제품</b>이 표면과 속을 함께 채워요. 다만 건조한 방에서는 히알루론산이 오히려 피부 속 수분을 끌어올릴 수 있어서, 위에 크림이나 오일로 덮어주는 게 좋아요.${code && code.startsWith('O') ? ' 지성(O)이라면 무거운 크림 대신 가벼운 젤크림으로 덮어도 충분해요.' : ''}</p>
      <h3>다움 DB에서 히알루론산 종류가 많은 제품</h3>
      <div class="grid" style="gap:10px">${ps.slice(0, 6).map(x => prodRow(x.p, null, code, `<span class="tag gold">히알루론산 ${x.n}종</span>`)).join('')}</div>
    </div></section>`;
  } else {
    const trio = ['ceramide-np', 'ceramide-ap', 'pseudo-ceramide', 'cholesterol', 'fatty-acids'];
    const ps = D.prod.map(p => { const c = p.ing.some(x => ['ceramide-np', 'ceramide-ap', 'pseudo-ceramide'].includes(x)), ch = p.ing.includes('cholesterol'), f = p.ing.includes('fatty-acids'); return { p, c, ch, f, n: c + ch + f }; }).filter(x => x.n).sort((a, b) => b.n - a.n);
    v.innerHTML = `<div class="sunwrap" style="${img('banner-ceramide', 'linear-gradient(120deg,#F7EFE3,#EBDCC4 60%,#FAF5EC)')};background-size:cover"><div class="wrap" style="padding:60px 24px"><span class="tag">성분사전 · 읽을거리</span><h1 class="h1" style="margin-top:12px">피부장벽의 세콜지에<br>대한 고찰</h1></div></div>
    <section class="blk"><div class="wrap article">
      <p>각질층은 흔히 <b>벽돌과 모르타르</b>로 비유돼요. 벽돌은 각질세포, 그 사이를 메우는 모르타르가 지질이에요. 이 지질은 대략 <b>세라마이드 약 50%, 콜레스테롤 약 25%, 유리지방산 약 10~20%</b>로 이뤄져 있어요. 줄여서 '세콜지'.</p>
      <h3>왜 셋이 함께여야 할까</h3>
      <p>세라마이드만 잔뜩 바르는 것보다 세 가지를 피부와 비슷한 비율로 함께 줄 때 장벽 회복이 빨랐다는 연구들이 있어요. 하나만 많으면 층이 고르게 쌓이지 않기 때문이에요. 그래서 전성분에서 <a href="#ing-ceramide-np">세라마이드</a>, <a href="#ing-cholesterol">콜레스테롤</a>, <a href="#ing-fatty-acids">스테아릭·팔미틱애씨드 같은 지방산</a>이 함께 보이면 '세콜지 설계'가 된 제품일 가능성이 높아요.</p>
      <h3>유사 세라마이드도 있어요</h3>
      <p><a href="#ing-pseudo-ceramide">하이드록시프로필비스팔미타마이드엠이에이</a>처럼 세라마이드 구조를 본뜬 성분도 장벽 크림에 자주 쓰여요. 안정적이라 고함량 배합이 쉬워요.</p>
      <h3>다움 DB에서 세콜지를 갖춘 제품</h3>
      <div class="grid" style="gap:10px">${ps.slice(0, 8).map(x => prodRow(x.p, null, code, `${x.c ? '<span class="tag good">세</span>' : ''}${x.ch ? '<span class="tag good">콜</span>' : ''}${x.f ? '<span class="tag good">지</span>' : ''}`)).join('')}</div>
    </div></section>`;
  }
});

/* ================= RANKING ================= */
function mentionCounts() {
  const c = {};
  const add = t => (t.match(/@([^\s@,.!?]+)/g) || []).forEach(m => { const p = D.prodByTag[m.slice(1)]; if (p) c[p.id] = (c[p.id] || 0) + 1; });
  D.com.rooms.forEach(r => r.msgs.forEach(m => add(m[3])));
  (UI.liveLog || []).forEach(m => add(m[3]));
  Object.values(st().myMsgs || {}).forEach(arr => arr.forEach(m => add(m.t)));
  return c;
}
route('ranking', v => {
  const P = UI.prefs.rank; if (!P.type) P.type = myCode() || 'OSNT';
  const tabs = [['all', '전체'], ['skin', '스킨케어'], ['sun', '선케어'], ['color', '색조'], ['type', '피부타입별']];
  v.innerHTML = `<section class="blk"><div class="wrap">
    <div class="shead"><div>${P.preset === 'dry-ampoule' ? '<span class="tag gold">배너 기획전</span><h1 class="h1" style="margin-top:8px">건성 김미연을 위한 수분앰플</h1><p class="muted" style="margin:6px 0 0">건성 스킨코드(DRNT) 성분 점수 순 · 현재 DB의 앰플·세럼 전체</p>' : '<div class="serif" style="font-size:18px;color:var(--accent2)">Ranking</div><h1 class="h1">제품 랭킹</h1>'}</div></div>
    <div class="pill-tabs" style="margin-bottom:12px">${tabs.map(([k, t]) => `<button class="chip ${P.tab === k ? 'on' : ''}" data-act="rtab" data-k="${k}">${t}</button>`).join('')}</div>
    <div class="card" style="margin-bottom:16px;display:grid;gap:14px">
      ${P.tab === 'skin' || P.tab === 'type' ? `<div class="chips">${['', '클렌징', '토너·패드', '앰플·세럼', '크림'].map(c => `<button class="chip ${P.sub === c ? 'on' : ''}" data-act="rsub" data-c="${c}">${c || '스킨케어 전체'}</button>`).join('')}</div>` : ''}
      ${P.tab === 'type' ? `<label class="field" style="margin:0;max-width:320px"><span>피부타입</span><select class="input" id="rtype">${Object.keys(D.sc.names).map(c => `<option ${c === P.type ? 'selected' : ''} value="${c}">${c} · ${D.sc.names[c]}${c === myCode() ? ' (나)' : ''}</option>`).join('')}</select></label>` : ''}
      <label class="field" style="margin:0;max-width:320px"><span>브랜드</span><select class="input" id="rbrand"><option value="">전체 브랜드</option>${[...new Set(D.prod.map(p => p.brand))].sort().map(b => `<option ${P.brand === b ? 'selected' : ''}>${esc(b)}</option>`).join('')}</select></label>
      <div><div class="small muted" style="display:flex;justify-content:space-between"><span>가격</span><b id="rpl" style="color:var(--ink)"></b></div>
        <div class="range2"><span class="track"></span><span class="fill" id="rfill"></span>
        <input type="range" id="rmin" min="0" max="130000" step="5000" value="${P.min}" aria-label="최소 가격"><input type="range" id="rmax" min="0" max="130000" step="5000" value="${P.max}" aria-label="최대 가격"></div></div>
    </div>
    <div class="small muted" id="rinfo" style="margin-bottom:8px"></div><div id="radslot"></div>
    <div class="grid" style="gap:10px" id="rlist"></div>
    <p class="small muted" style="margin-top:16px">저장 수·언급 수는 수업 시연용 예시 데이터예요. 피부타입별 순위는 전성분과 스킨코드로 계산한 다움 점수예요. 가격은 참고가예요.</p>
  </div></section>`;
  const upd = () => rankList();
  $('#rmin').addEventListener('input', e => { P.min = Math.min(+e.target.value, P.max - 5000); e.target.value = P.min; upd(); });
  $('#rmax').addEventListener('input', e => { P.max = Math.max(+e.target.value, P.min + 5000); e.target.value = P.max; upd(); });
  $('#rbrand').addEventListener('change', e => { P.brand = e.target.value; upd(); });
  const rt = $('#rtype'); if (rt) rt.addEventListener('change', e => { P.type = e.target.value; P.preset = null; upd(); });
  upd();
});
act('rtab', a => { UI.prefs.rank.tab = a.dataset.k; UI.prefs.rank.preset = null; if (!['skin', 'type'].includes(a.dataset.k)) UI.prefs.rank.sub = ''; render(); });
act('rsub', a => { UI.prefs.rank.sub = a.dataset.c; UI.prefs.rank.preset = null; render(); });
function rankList() {
  const P = UI.prefs.rank, mc = mentionCounts();
  const skin = ['클렌징', '토너·패드', '앰플·세럼', '크림'];
  let L = D.prod.filter(p => p.price >= P.min && p.price <= P.max && (!P.brand || p.brand === P.brand));
  if (P.tab === 'skin' || P.tab === 'type') L = L.filter(p => P.sub ? p.cat === P.sub : (P.tab === 'skin' ? skin.includes(p.cat) : true));
  if (P.tab === 'sun') L = L.filter(p => p.cat === '선케어' || p.ing.some(i => D.ingById[i].tags.includes('uv')) && p.cat !== '색조');
  if (P.tab === 'color') L = L.filter(p => p.cat === '색조');
  if (P.tab === 'type') L.sort((a, b) => productScore(b, P.type) - productScore(a, P.type));
  else L.sort((a, b) => (b.pop + (mc[b.id] || 0) * 150) - (a.pop + (mc[a.id] || 0) * 150));
  const pct = x => x / 130000 * 100;
  $('#rfill').style.left = pct(P.min) + '%'; $('#rfill').style.width = (pct(P.max) - pct(P.min)) + '%';
  $('#rpl').textContent = won(P.min) + ' ~ ' + won(P.max);
  $('#rinfo').textContent = `${L.length}개 제품 · ${P.tab === 'type' ? P.type + ' 다움 점수 순' : '저장 + 커뮤니티 언급 순'}`;
  $('#radslot').innerHTML = adSlot(myCode(), p => L.includes(p));
  $('#rlist').innerHTML = L.length ? L.slice(0, 20).map((p, i) => prodRow(p, i, P.tab === 'type' ? P.type : myCode(), mc[p.id] ? `<span class="tag">언급 ${mc[p.id]}</span>` : '')).join('') : '<p class="muted">이 가격대에는 제품이 없어요. 슬라이더를 넓혀 보세요.</p>';
}

/* ================= RECOMMEND ================= */
UI.prefs.rec = { cat: '', type: null, max: 130000, tex: [] };
route('recommend', v => {
  const P = UI.prefs.rec; if (!P.type && myCode()) P.type = myCode();
  const texs = [...new Set(D.prod.map(p => p.texture))];
  v.innerHTML = `<section class="blk"><div class="wrap">
    <div class="serif" style="font-size:18px;color:var(--accent2)">Recommend</div><h1 class="h1" style="margin-bottom:18px">제품 추천</h1>
    <div class="grid" style="grid-template-columns:minmax(260px,320px) 1fr;gap:20px;align-items:start" id="recgrid">
      <div class="card" style="position:sticky;top:150px">
        <label class="field"><span>카테고리</span><select class="input" id="fcat"><option value="">전체</option>${['클렌징', '토너·패드', '앰플·세럼', '크림', '선케어', '색조'].map(c => `<option ${P.cat === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
        <label class="field"><span>피부타입</span><select class="input" id="ftype"><option value="">선택 안 함</option>${Object.keys(D.sc.names).map(c => `<option ${P.type === c ? 'selected' : ''} value="${c}">${c}${c === myCode() ? ' (나)' : ''}</option>`).join('')}</select></label>
        <label class="field"><span>최대 가격 <b id="fmaxv">${won(P.max)}</b></span><input type="range" id="fmax" min="10000" max="130000" step="5000" value="${P.max}"></label>
        <div class="field"><span>제형</span><div class="chips">${texs.map(t => `<button class="chip ${P.tex.includes(t) ? 'on' : ''}" data-act="ftex" data-t="${t}">${t}</button>`).join('')}</div></div>
      </div>
      <div id="reclist"></div></div></div></section>`;
  $('#fcat').addEventListener('change', e => { P.cat = e.target.value; recList(); });
  $('#ftype').addEventListener('change', e => { P.type = e.target.value || null; recList(); });
  $('#fmax').addEventListener('input', e => { P.max = +e.target.value; $('#fmaxv').textContent = won(P.max); recList(); });
  if (innerWidth < 760) $('#recgrid').style.gridTemplateColumns = '1fr';
  recList();
});
act('ftex', a => { const T = UI.prefs.rec.tex, t = a.dataset.t; const k = T.indexOf(t); k < 0 ? T.push(t) : T.splice(k, 1); a.classList.toggle('on'); recList(); });
function recList() {
  const P = UI.prefs.rec;
  let L = D.prod.filter(p => (!P.cat || p.cat === P.cat) && p.price <= P.max && (!P.tex.length || P.tex.includes(p.texture)));
  const out = L.map(p => ({ p, a: P.type ? analyze(p.ing, P.type) : null })).sort((x, y) => P.type ? y.a.score - x.a.score : y.p.pop - x.p.pop);
  $('#reclist').innerHTML = adSlot(myCode(), p => L.includes(p)) + `<div class="small muted" style="margin-bottom:8px">${out.length}개 · ${P.type ? P.type + ' 기준 다움 점수 순' : '피부타입을 고르면 성분 점수로 정렬돼요'}</div>` +
    (out.length ? out.map(({ p, a }) => `<div style="margin-bottom:10px">${prodRow(p, null, P.type)}${a ? `<div class="small" style="padding:8px 14px 0">${a.good.slice(0, 3).map(g => `<span class="tag good">${esc(g.ing.ko.split('(')[0])}</span>`).join(' ')} ${a.warn.slice(0, 2).map(g => `<span class="tag warn">${esc(g.ing.ko.split('(')[0])}</span>`).join(' ')} ${a.personal.length ? '<span class="tag warn">내 서랍 의심 성분 포함</span>' : ''}</div>` : ''}</div>`).join('') : '<p class="muted">조건에 맞는 제품이 없어요.</p>');
}

/* ================= PRODUCT ================= */
route('product', (v, id) => {
  const p = D.prodById[id]; if (!p) { v.innerHTML = '<div class="wrap blk">제품을 찾을 수 없어요.</div>'; return; }
  const code = myCode() || UI.prefs.pcode || null;
  const a = code ? analyze(p.ing, code) : null;
  const goodSet = new Set(a ? a.good.map(x => x.ing.id) : []), warnSet = new Set(a ? a.warn.map(x => x.ing.id) : []), pSet = new Set(a ? a.personal.map(x => x.id) : []);
  const onShelf = me() && st().shelf.some(s => s.pid === p.id);
  v.innerHTML = `<section class="blk"><div class="wrap" style="max-width:980px">
    <a href="#ranking" class="small muted">← 제품 랭킹</a>
    <div class="grid" style="grid-template-columns:minmax(200px,280px) 1fr;gap:28px;margin-top:16px;align-items:start" id="pgrid">
      <div class="card" style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;background:${(CAT_COLOR[p.cat] || CAT_COLOR['크림'])[0]}">${bottle(p.cat, p.texture, p.id).replace('class="pvis"', 'class="pvis" style="width:70%;height:70%;background:none"')}</div>
      <div><div class="muted">${esc(p.brand)} · ${esc(p.company)}</div><h1 class="h1" style="font-size:clamp(24px,3vw,34px)">${esc(p.name)}</h1>
        <div style="margin:8px 0 16px">${esc(p.cat)} · ${esc(p.texture)} · ${esc(p.vol)} · <b>${won(p.price)}</b> <span class="muted small">(참고가)</span></div>
        ${a ? `<div class="card" style="display:flex;gap:18px;align-items:center;background:var(--soft)"><div class="score" style="min-width:86px"><b class="${scClass(a.score)}" style="font-size:40px">${a.score}</b><span>${code} 다움 점수</span></div>
          <div class="small">${a.good.length ? `<div><b>잘 맞는 이유</b> · ${a.good.slice(0, 4).map(g => esc(g.ing.ko.split('(')[0])).join(', ')}</div>` : ''}${a.warn.length ? `<div style="margin-top:4px"><b style="color:var(--warn)">주의할 점</b> · ${a.warn.slice(0, 4).map(g => esc(g.ing.ko.split('(')[0])).join(', ')}</div>` : ''}${a.personal.length ? `<div style="margin-top:4px"><b style="color:var(--warn)">내 서랍 기록</b> · 안 맞았던 제품의 의심 성분(${a.personal.map(x => esc(x.ko.split('(')[0])).join(', ')})이 들어 있어요</div>` : ''}</div></div>`
          : `<div class="card" style="background:var(--soft)"><b>내 피부 기준 점수 보기</b><p class="small muted" style="margin:4px 0 10px">진단하면 자동으로 보여요. 지금은 피부타입을 골라 미리 볼 수 있어요.</p><select class="input" id="pcode" style="max-width:240px"><option value="">피부타입 선택</option>${Object.keys(D.sc.names).map(c => `<option>${c}</option>`).join('')}</select></div>`}
        ${me() && myCode() ? `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px"><button class="btn ${onShelf ? '' : 'gold'}" data-act="toshelf" data-id="${p.id}">${onShelf ? '선반에 있어요 ✓' : '내 선반에 담기'}</button><button class="btn" data-act="todrawer" data-id="${p.id}">안 맞았어요</button><a class="btn" href="#naum" data-act="asknaum" data-q="${esc(p.tag)} 나한테 맞을까?">나움에게 묻기</a></div>` : ''}
      </div></div>
    ${(() => { const cs = D.con.map(c => ({ c, m: c.members.filter(m => p.ing.includes(m.id)) })).filter(x => x.m.length); return cs.length ? `<h2 class="h2" style="font-size:18px;margin:34px 0 10px">성분 개념 요약</h2><div class="chips">${cs.map(x => `<a class="chip" href="#concept-${x.c.id}"><b>${esc(x.c.name)}</b>&nbsp;${x.m.map(m => esc(shortName(m.id))).join(' · ')}</a>`).join('')}</div>` : ''; })()}
    <h2 class="h2" style="font-size:18px;margin:34px 0 8px">전성분 ${p.inci.length}개</h2>
    <p class="small muted" style="margin:0 0 12px">순서는 함량이 많은 순(1% 이하 성분은 순서 무관). ${a ? '<span class="tag good">초록</span> 잘 맞음 · <span class="tag warn">주황</span> 주의 · 빨간 테두리 = 내 서랍 의심 성분' : ''}</p>
    <div class="inci-list">${p.ing.map((iid, k) => { const i = D.ingById[iid]; const simple = !/[·(]|등/.test(i.ko) && i.ko.length <= 22; const label = simple && (i.inci.length === 1 || p.inci[k].toLowerCase() === i.inci[0].toLowerCase()) ? i.ko : p.inci[k]; return `<a href="#ing-${iid}" class="${goodSet.has(iid) ? 'ig' : ''} ${warnSet.has(iid) ? 'iw' : ''} ${pSet.has(iid) ? 'ip' : ''}" title="${esc(i.ko + ' · ' + p.inci[k])}">${esc(label)}</a>`; }).join('')}</div>
    <h2 class="h2" style="font-size:18px;margin:34px 0 10px">제품 페이지</h2>
    <div class="grid g2"><a class="lp" data-lp="${p.id}" href="${esc(pageUrl(p))}" target="_blank" rel="noopener"><span class="lpbody"><span class="muted small">미리보기를 불러오는 중…</span></span></a>
      <a class="lp" href="https://search.shopping.naver.com/search/all?query=${encodeURIComponent(p.brand + ' ' + p.name)}" target="_blank" rel="noopener"><span class="lpbody"><span><b>구매처 찾기</b><br><span class="small muted">네이버 쇼핑에서 ${esc(p.brand)} ${esc(p.name)} 검색</span></span></span></a></div>
    <p class="small muted" style="margin-top:8px">제품 이미지는 연결된 페이지가 공유용으로 공개한 미리보기 이미지를 그대로 보여주는 거예요. 다움 서버에 저장하지 않고, 눌러서 원래 페이지로 이동해요.</p>
    <p class="small muted" style="margin-top:18px">전성분 출처: <a href="${p.src}" target="_blank" rel="noopener">${esc(p.src.replace('https://', ''))}</a> · 확인일 ${p.checked}. 리뉴얼로 처방이 바뀌었을 수 있어요. 구매 전 패키지 표기를 확인해 주세요.</p>
  </div></section>`;
  if (innerWidth < 760) $('#pgrid').style.gridTemplateColumns = '1fr';
  const pc = $('#pcode'); if (pc) pc.addEventListener('change', e => { UI.prefs.pcode = e.target.value || null; render(); });
});

/* ================= COMMUNITY ================= */
UI.liveLog = []; UI.liveIdx = 0;
function roomCard(r) {
  const m = r.msgs[r.msgs.length - 1];
  return `<a class="roomcard" href="#room-${r.id}"><span class="roomimg" style="${img(r.img, 'linear-gradient(135deg,#F1EEF8,#E2DCF0)')}"></span>
  <span style="flex:1;min-width:0"><b>${esc(r.name)}</b>${r.hot ? '<span class="hot">HOT</span>' : ''}<br><span class="small muted">${r.members.toLocaleString()}명 · ${esc(r.desc)}</span>
  <br><span class="small" style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(m[0])}: ${esc(m[3])}</span></span></a>`;
}
function typeRoom(code) {
  const ax = code.split('');
  const msgs = D.com.rooms.flatMap(r => r.msgs).filter(m => m[1] === code || m[1].split('').filter((l, k) => l === ax[k]).length >= 3).slice(0, 8);
  return { id: 'type-' + code, name: `#${code} 방`, types: code, members: 120 + (code.charCodeAt(0) * 7 + code.charCodeAt(1) * 3) % 400, desc: `${typeName(code)} · ${codeWords(code)}들의 방`, img: 'room-sensitive', hot: false, msgs: msgs.length ? msgs : [['다움', code, 60, `${code} 방이 열렸어요. 첫 이야기를 남겨주세요!`]] };
}
function mentionHTML(t) {
  return esc(t).replace(/@([^\s@,.!?]+)/g, (m, tag) => { const p = D.prodByTag[tag]; return p ? `<a class="mention" href="#product-${p.id}">@${esc(tag)}</a>` : m; });
}
function mrankHTML(roomId) {
  const c = {};
  const add = t => (t.match(/@([^\s@,.!?]+)/g) || []).forEach(m => { const p = D.prodByTag[m.slice(1)]; if (p) c[p.id] = (c[p.id] || 0) + 1; });
  const room = roomId ? roomById(roomId) : null;
  if (room) { room.msgs.forEach(m => add(m[3])); UI.liveLog.filter(m => m[0] === roomId).forEach(m => add(m[3])); ((st().myMsgs || {})[roomId] || []).forEach(m => add(m.t)); }
  else Object.assign(c, mentionCounts());
  const L = Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 7);
  return `<ol>${L.map(([id, n], i) => `<li data-pid="${id}"><span class="rank" style="font-size:20px;width:22px">${i + 1}</span><a href="#product-${id}" style="flex:1;text-decoration:none;font-size:14px">@${esc(D.prodById[id].tag)}</a><b class="small">${n}</b></li>`).join('')}</ol>`;
}
function roomById(id) { return id.startsWith('type-') ? typeRoom(id.slice(5)) : D.com.rooms.find(r => r.id === id); }
function startLive(roomId) {
  every(6500, () => {
    const L = D.com.live; const m = L[UI.liveIdx % L.length]; UI.liveIdx++;
    const msg = [m[0], m[1], m[2], m[3]]; UI.liveLog.push(msg);
    if (roomId && msg[0] !== roomId) return refreshRank(roomId);
    const box = $('#cmsgs');
    if (box) { box.insertAdjacentHTML('beforeend', cmsgHTML([msg[1], msg[2], 0, msg[3]], true)); box.scrollTop = box.scrollHeight; }
    refreshRank(roomId, m[3]);
  });
}
function refreshRank(roomId, text) {
  const el = $('#mrank'); if (!el) return; el.innerHTML = mrankHTML(roomId);
  if (text) { const t = (text.match(/@([^\s@,.!?]+)/) || [])[1]; const p = t && D.prodByTag[t]; if (p) { const li = el.querySelector(`li[data-pid="${p.id}"]`); if (li) { li.classList.add('bump'); setTimeout(() => li.classList.remove('bump'), 1200); } } }
}
function cmsgHTML(m, live) {
  return `<div class="cmsg rise"><span class="ava" style="width:36px;height:36px"></span><div style="min-width:0"><div class="who"><b>${esc(m[0])}</b>${esc(m[1])} · ${live ? '방금' : m[2] + '분 전'}</div><div>${mentionHTML(m[3])}</div></div></div>`;
}
route('community', v => {
  const code = myCode();
  v.innerHTML = `<section class="blk"><div class="wrap">
    <div class="serif" style="font-size:18px;color:var(--accent2)">Skin type community</div><h1 class="h1">피부타입 커뮤니티</h1>
    <p class="muted" style="margin:6px 0 20px">같은 스킨코드끼리 모여요. 대화 속 <b>@제품명</b>은 실시간 언급 랭킹으로 모여요.</p>
    <div class="grid" style="grid-template-columns:1fr minmax(260px,320px);gap:24px;align-items:start" id="cgrid">
      <div>
        <h2 class="h2" style="font-size:18px;margin-bottom:12px">지금 뜨거운 방</h2>
        <div class="grid" style="gap:10px;margin-bottom:30px">${D.com.rooms.map(roomCard).join('')}</div>
        <h2 class="h2" style="font-size:18px;margin-bottom:12px">타입별로 입장하기</h2>
        <div class="typegrid">${Object.keys(D.sc.names).map(c => `<a href="#room-type-${c}" class="${c === code ? 'me' : ''}"><b>${c}</b><span class="small muted">${D.sc.names[c]}${c === code ? ' · 나' : ''}</span></a>`).join('')}</div>
      </div>
      <aside class="card" style="position:sticky;top:150px"><b>실시간 @멘션 랭킹</b><div class="small muted" style="margin-bottom:6px">전체 방 기준 · 새 대화가 오면 바로 반영돼요</div><div class="mrank" id="mrank">${mrankHTML(null)}</div></aside>
    </div></div></section>`;
  if (innerWidth < 900) $('#cgrid').style.gridTemplateColumns = '1fr';
  startLive(null);
});
route('room', (v, id) => {
  const r = roomById(id); if (!r) { go('community'); return; }
  const mine = (st().myMsgs || {})[r.id] || [];
  const live = UI.liveLog.filter(m => m[0] === r.id);
  v.innerHTML = `<section class="blk" style="padding-top:24px"><div class="wrap">
    <a href="#community" class="small muted">← 커뮤니티</a>
    <div class="grid" style="grid-template-columns:1fr minmax(260px,320px);gap:24px;align-items:start;margin-top:12px" id="rgrid">
      <div class="card" style="padding:0;overflow:hidden">
        <div style="display:flex;gap:14px;align-items:center;padding:18px 20px;border-bottom:1px solid var(--line)"><span class="roomimg" style="${img(r.img, 'linear-gradient(135deg,#F1EEF8,#E2DCF0)')};width:52px;height:52px"></span>
          <div><b style="font-size:18px">${esc(r.name)}</b><div class="small muted">${r.members.toLocaleString()}명 · ${esc(r.desc)}</div></div></div>
        <div id="cmsgs" style="padding:8px 20px;max-height:56vh;overflow:auto">${r.msgs.map(m => cmsgHTML(m)).join('')}${live.map(m => cmsgHTML([m[1], m[2], 0, m[3]], true)).join('')}${mine.map(m => cmsgHTML([me() ? me().name : '나', myCode() || '', 0, m.t], true)).join('')}</div>
        <form data-form="post" data-room="${r.id}" style="position:relative;padding:12px;border-top:1px solid var(--line)">
          <div class="ac" id="ac" hidden></div>
          <div class="askbar" style="box-shadow:none"><label style="flex:1;display:flex"><span class="sr">메시지</span><input id="cin" autocomplete="off" placeholder="${me() ? '@를 입력하면 제품을 태그할 수 있어요' : '로그인하면 대화에 참여할 수 있어요'}" ${me() ? '' : 'disabled'} style="flex:1;border:0;background:transparent;outline:none;padding-left:12px"></label>
          ${me() ? `<button class="rbtn dark" aria-label="보내기">${ICON.send}</button>` : '<a class="btn sm dark" href="#login">로그인</a>'}</div>
        </form>
      </div>
      <aside class="card" style="position:sticky;top:150px"><b>이 방의 @멘션 랭킹</b><div class="small muted" style="margin-bottom:6px">실시간</div><div class="mrank" id="mrank">${mrankHTML(r.id)}</div></aside>
    </div></div></section>`;
  if (innerWidth < 900) $('#rgrid').style.gridTemplateColumns = '1fr';
  const box = $('#cmsgs'); box.scrollTop = box.scrollHeight;
  startLive(r.id);
  const cin = $('#cin'); if (cin) bindMention(cin);
});
function bindMention(inp) {
  const ac = $('#ac'); let sel = 0, items = [];
  const close = () => { ac.hidden = true; items = []; };
  inp.addEventListener('input', () => {
    const m = inp.value.slice(0, inp.selectionStart).match(/@([^\s@]*)$/);
    if (!m) return close();
    const q = m[1].toLowerCase();
    items = D.prod.filter(p => (p.tag + p.name + p.brand).toLowerCase().includes(q)).slice(0, 6); sel = 0;
    if (!items.length) return close();
    ac.innerHTML = items.map((p, i) => `<button type="button" data-i="${i}" class="${i === 0 ? 'act' : ''}"><b>@${esc(p.tag)}</b> <span class="small muted">${esc(p.brand)} ${esc(p.name)}</span></button>`).join('');
    ac.hidden = false;
  });
  const pick = i => { const p = items[i]; if (!p) return; const pos = inp.selectionStart; const before = inp.value.slice(0, pos).replace(/@([^\s@]*)$/, '@' + p.tag + ' '); inp.value = before + inp.value.slice(pos); inp.focus(); close(); };
  ac.addEventListener('mousedown', e => { const b = e.target.closest('button'); if (b) { e.preventDefault(); pick(+b.dataset.i); } });
  inp.addEventListener('keydown', e => {
    if (ac.hidden) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length; $$('#ac button').forEach((b, i) => b.classList.toggle('act', i === sel)); }
    if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); pick(sel); }
  });
}
FORMS.post = (f) => {
  const inp = $('#cin'); const t = inp.value.trim(); if (!t) return;
  const id = f.dataset.room; const M = st().myMsgs; (M[id] = M[id] || []).push({ t, d: Date.now() }); S.save();
  $('#cmsgs').insertAdjacentHTML('beforeend', cmsgHTML([me().name, myCode() || '', 0, t], true)); $('#cmsgs').scrollTop = 1e9;
  inp.value = ''; refreshRank(id, t);
};

/* ================= FILMS ================= */
route('films', v => {
  v.innerHTML = `<section class="blk"><div class="wrap" style="max-width:1080px">
    <div class="serif" style="font-size:18px;color:var(--accent2)">Brand films</div><h1 class="h1">다움 브랜드 필름</h1>
    <p class="muted" style="margin:6px 0 26px">서비스를 만들기 전, 다움이 풀려는 문제와 경험을 영상으로 먼저 그려봤어요.</p>
    <div class="grid g2" style="align-items:start">
      <figure class="film"><video controls preload="metadata" playsinline poster="media/poster-film.jpg" src="media/dawm-ai-film.mp4"></video><figcaption><b>AI 영화 · 답을 찾는 밤</b><span class="small muted">광고 속에서 길을 잃은 한 사람이 나만의 답을 만나기까지</span></figcaption></figure>
      <figure class="film"><video controls preload="metadata" playsinline poster="media/poster-motion.jpg" src="media/dawm-motion-graphic.mp4"></video><figcaption><b>모션그래픽 · 나에게 꼭 맞는 뷰티의 답</b><span class="small muted">스킨코드 진단부터 큐레이션까지, 서비스 콘셉트</span></figcaption></figure>
    </div>
    <div style="margin-top:30px;display:flex;gap:8px;flex-wrap:wrap"><a class="btn dark" href="#login">dawmtest로 직접 써보기</a><a class="btn" href="#home">다움 홈</a></div>
    <p class="small muted" style="margin-top:22px">브랜드라면, <a href="#partners" style="color:var(--ink)">다움 파트너스 보기 →</a></p>
  </div></section>`;
});

/* ================= FIT-GATED NATIVE ADS =================
   광고도 같은 성분 기준을 통과해야 노출: 적합도 ≥ 70, 서랍 의심 성분 없음 → 입찰가 × 적합도로 1자리 선정 (시연용 가상 캠페인) */
const ADS = [
  { pid: 'torriden-divein-serum', bid: 820, copy: '저분자부터 가교형까지, 히알루론산 5종으로 속당김까지' },
  { pid: 'anua-heartleaf77-toner', bid: 700, copy: '어성초 77%, 붉어진 날의 첫 단계' },
  { pid: 'cnp-propolis-rescue', bid: 760, copy: '프로폴리스 × 나이아신아마이드 진정 앰플' },
  { pid: 'estra-uv365-mineral', bid: 640, copy: '장벽 성분을 담은 무기자차' },
  { pid: 'clio-mesh-glow-cushion', bid: 720, copy: '히알루론산 7종 글로우 쿠션' }
];
const AD_MIN = 70;
function pickAd(code, filter) {
  if (!code) return null;
  const sus = suspects();
  const c = ADS.map(a => { const p = D.prodById[a.pid]; const an = analyze(p.ing, code); return { ...a, p, an, rank: a.bid * an.score / 100 }; })
    .filter(x => (!filter || filter(x.p)) && x.an.score >= AD_MIN && !x.p.ing.some(i => sus.has(i)) && !st().shelf.some(s => s.pid === x.pid) && !(st().mutedAds || []).includes(x.p.brand))
    .sort((a, b) => b.rank - a.rank);
  return c[0] || null;
}
function adSlot(code, filter) {
  const a = pickAd(code, filter); if (!a) return '';
  return `<div class="adslot"><div class="adhead"><span class="tag ad">AD</span><span class="small muted">${esc(a.p.brand)} 후원 · ${code} 적합도 기준을 통과한 광고예요</span><button class="adwhy" data-act="adwhy" data-pid="${a.pid}">왜 보이나요?</button></div>
    ${prodRow(a.p, null, code, `<span class="tag gold">${esc(a.copy)}</span>`)}</div>`;
}
act('adwhy', a => {
  const code = myCode(), ad = ADS.find(x => x.pid === a.dataset.pid), p = D.prodById[ad.pid], an = analyze(p.ing, code);
  modal(`<span class="tag ad">AD</span><h3 class="h2" style="margin:12px 0 6px">왜 이 광고가 보이나요?</h3>
   <div class="adcheck"><div><b>✓</b> ${code} 다움 점수 <b class="${scClass(an.score)}">${an.score}</b> · 노출 기준 ${AD_MIN}점 이상</div>
   <div><b>✓</b> 내 서랍(안 맞았던 제품)의 의심 성분이 들어 있지 않아요</div>
   <div><b>✓</b> 이미 선반에 있는 제품이 아니에요</div>
   <div><b>·</b> 잘 맞는 이유: ${an.good.slice(0, 3).map(g => esc(g.ing.ko.split('(')[0])).join(', ') || '-'}</div>
   ${an.warn.length ? `<div><b>·</b> 주의할 점도 그대로 보여드려요: ${an.warn.slice(0, 3).map(g => esc(g.ing.ko.split('(')[0])).join(', ')}</div>` : ''}</div>
   <p class="small muted" style="margin:12px 0 16px">${esc(p.brand)}가 이 자리를 후원했지만, 기준을 넘지 못하는 광고는 아무리 입찰가가 높아도 보여드리지 않아요. 순서는 '입찰가 × 내 피부 적합도'로 정해요. (수업 시연용 가상 캠페인)</p>
   <div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn dark" href="#product-${p.id}" data-act="close">전성분 보기</a><button class="btn" data-act="admute" data-brand="${esc(p.brand)}">${esc(p.brand)} 광고 그만 보기</button></div>`);
});
act('admute', a => { const m = st().mutedAds = st().mutedAds || []; if (!m.includes(a.dataset.brand)) m.push(a.dataset.brand); S.save(); closeModal(); render(); toast(`${a.dataset.brand} 광고를 숨겼어요`); });
