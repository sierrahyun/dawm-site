/* ================= DAWM PARTNERS (브랜드 대상 소개 페이지) =================
   D 문제 → A 다움 소개 → W 브랜드가 함께할 이유 → M 앞으로의 길. 숫자는 실제 DB와 점수 엔진에서 계산하고, 예시 브랜드명은 가명으로 표시. */
const PT_LOGO = { vb: '44.6 -6.1 864.2 947.5', d: 'M477.5,655.6 L477.5,647.8 L477.5,639.9 L477.5,632.1 L477.5,624.2 L477.5,616.4 L477.5,608.5 L477.5,600.7 L477.5,592.9 L477.5,585.0 L477.5,577.2 L477.5,569.3 L477.5,561.5 L477.5,553.6 L477.5,545.8 L477.5,537.9 L477.5,530.1 L477.5,522.2 L477.5,514.4 L477.5,506.6 L477.5,498.7 L477.5,490.9 L477.5,483.0 L477.5,475.2 L477.5,467.3 L477.5,459.5 L477.5,451.6 L477.5,443.8 L477.5,436.0 L477.5,428.1 L477.5,420.3 L477.5,412.4 L477.5,404.6 L477.5,396.7 L477.5,388.9 L477.5,381.1 L477.5,373.2 L477.5,365.4 L477.5,357.5 L477.5,349.7 L477.5,341.8 L477.5,334.0 L477.5,326.1 L477.5,318.3 L477.3,310.4 L477.2,302.7 L469.5,302.6 L461.6,302.9 L453.8,303.7 L446.1,304.8 L438.4,306.4 L430.8,308.4 L423.3,310.8 L416.0,313.6 L408.8,316.7 L401.8,320.2 L395.0,324.1 L388.3,328.2 L381.9,332.7 L375.7,337.5 L369.7,342.6 L363.9,347.9 L358.4,353.5 L353.1,359.3 L348.1,365.3 L343.4,371.6 L338.9,378.0 L334.6,384.6 L330.6,391.3 L326.9,398.2 L323.4,405.3 L320.3,412.4 L317.4,419.7 L314.8,427.1 L312.4,434.6 L310.4,442.2 L308.7,449.9 L307.3,457.6 L306.2,465.3 L305.4,473.1 L304.9,481.0 L304.8,488.8 L305.0,496.7 L305.5,504.5 L306.4,512.3 L307.5,520.0 L309.0,527.7 L310.9,535.4 L313.0,542.9 L315.4,550.4 L318.2,557.7 L321.3,564.9 L324.7,572.0 L328.4,578.9 L332.4,585.6 L336.7,592.2 L341.3,598.5 L346.2,604.7 L351.4,610.5 L356.9,616.1 L362.7,621.5 L368.7,626.5 L374.9,631.2 L381.4,635.6 L388.1,639.7 L395.1,643.4 L402.2,646.7 L409.4,649.7 L416.9,652.2 L424.4,654.4 L432.1,656.1 L439.8,657.4 L447.6,658.3 L455.4,658.8 L463.2,658.9 L471.1,658.6 L478.9,658.0 L486.7,657.4 L494.6,656.7 L502.4,655.9 L510.1,654.8 L517.9,653.5 L525.5,651.8 L533.1,649.7 L540.5,647.2 L547.8,644.3 L554.9,641.0 L561.9,637.4 L568.7,633.5 L575.4,629.5 L582.0,625.1 L588.4,620.6 L594.6,615.9 L600.7,611.0 L606.7,605.9 L612.5,600.6 L618.1,595.2 L623.6,589.6 L629.0,583.8 L634.2,578.0 L639.4,572.0 L644.3,566.0 L649.2,559.8 L653.9,553.5 L658.4,547.1 L662.8,540.6 L667.0,534.0 L671.1,527.3 L675.1,520.5 L678.9,513.7 L682.6,506.8 L686.1,499.8 L689.6,492.7 L692.9,485.6 L696.1,478.5 L699.1,471.2 L702.0,463.9 L704.8,456.6 L707.4,449.2 L709.8,441.7 L712.1,434.2 L714.2,426.7 L716.2,419.1 L718.0,411.4 L719.5,403.8 L721.0,396.0 L722.2,388.3 L723.4,380.5 L724.4,372.8 L725.2,365.0 L725.8,357.1 L726.2,349.3 L726.3,341.4 L726.3,333.6 L726.2,325.8 L725.8,317.9 L725.2,310.1 L724.5,302.3 L723.5,294.5 L722.3,286.8 L721.0,279.0 L719.5,271.3 L717.8,263.7 L715.9,256.1 L713.7,248.5 L711.4,241.0 L708.8,233.6 L706.0,226.3 L703.1,219.0 L700.0,211.8 L696.6,204.7 L693.1,197.7 L689.5,190.8 L685.6,183.9 L681.5,177.2 L677.3,170.6 L672.9,164.1 L668.3,157.8 L663.5,151.6 L658.5,145.5 L653.4,139.6 L648.1,133.8 L642.7,128.1 L637.1,122.6 L631.4,117.2 L625.6,111.9 L619.6,106.8 L613.5,101.9 L607.3,97.1 L600.9,92.6 L594.4,88.2 L587.8,83.9 L581.1,79.9 L574.3,76.0 L567.3,72.4 L560.3,69.0 L553.1,65.7 L545.9,62.7 L538.5,59.9 L531.1,57.3 L523.7,55.0 L516.1,52.8 L508.5,50.8 L500.9,49.1 L493.2,47.5 L485.5,46.1 L477.7,44.9 L469.9,44.0 L462.1,43.3 L454.3,42.9 L446.4,42.6 L438.6,42.5 L430.8,42.6 L422.9,42.9 L415.1,43.3 L407.3,44.0 L399.5,44.9 L391.7,46.1 L384.0,47.4 L376.3,48.8 L368.6,50.4 L360.9,52.2 L353.4,54.2 L345.8,56.4 L338.4,58.8 L331.0,61.5 L323.7,64.4 L316.5,67.5 L309.4,70.8 L302.3,74.2 L295.4,77.8 L288.5,81.6 L281.6,85.4 L274.9,89.5 L268.3,93.7 L261.8,98.1 L255.4,102.6 L249.2,107.3 L243.0,112.2 L237.0,117.2 L231.0,122.4 L225.2,127.7 L219.6,133.1 L214.1,138.7 L208.7,144.4 L203.4,150.2 L198.3,156.1 L193.2,162.1 L188.3,168.3 L183.6,174.5 L178.9,180.8 L174.4,187.2 L170.1,193.7 L165.8,200.3 L161.7,207.0 L157.6,213.7 L153.8,220.5 L150.0,227.4 L146.3,234.4 L142.8,241.4 L139.4,248.4 L136.1,255.6 L133.0,262.8 L130.0,270.0 L127.1,277.3 L124.3,284.6 L121.7,292.0 L119.2,299.5 L116.8,306.9 L114.6,314.5 L112.5,322.0 L110.4,329.6 L108.5,337.2 L106.8,344.9 L105.1,352.5 L103.5,360.2 L102.1,367.9 L100.8,375.6 L99.6,383.4 L98.5,391.2 L97.4,398.9 L96.6,406.7 L95.8,414.6 L95.1,422.4 L94.5,430.2 L94.0,438.0 L93.6,445.9 L93.4,453.7 L93.2,461.5 L93.2,469.4 L93.2,477.2 L93.3,485.1 L93.5,492.9 L93.8,500.8 L94.3,508.6 L94.9,516.4 L95.6,524.2 L96.3,532.0 L97.2,539.8 L98.1,547.6 L99.2,555.4 L100.4,563.1 L101.7,570.9 L103.0,578.6 L104.5,586.3 L106.2,594.0 L107.9,601.6 L109.8,609.2 L111.7,616.8 L113.8,624.4 L116.0,631.9 L118.3,639.4 L120.8,646.9 L123.4,654.3 L126.1,661.6 L129.0,668.9 L131.9,676.2 L135.0,683.4 L138.2,690.6 L141.6,697.7 L145.1,704.7 L148.7,711.7 L152.4,718.6 L156.2,725.4 L160.2,732.2 L164.3,738.9 L168.5,745.5 L172.8,752.0 L177.3,758.5 L181.9,764.8 L186.6,771.1 L191.5,777.2 L196.5,783.3 L201.6,789.2 L206.9,795.1 L212.2,800.8 L217.8,806.3 L223.4,811.8 L229.2,817.1 L235.1,822.3 L241.1,827.3 L247.2,832.2 L253.5,836.9 L259.9,841.5 L266.4,845.9 L272.9,850.2 L279.6,854.3 L286.4,858.2 L293.3,861.9 L300.3,865.5 L307.4,868.8 L314.6,871.9 L321.9,874.8 L329.3,877.6 L336.7,880.1 L344.2,882.4 L351.7,884.5 L359.4,886.3 L367.1,888.0 L374.8,889.3 L382.5,890.5 L390.3,891.4 L398.1,892.0 L406.0,892.5 L413.8,892.8 L421.7,892.8 L429.5,892.5 L437.3,892.0 L445.1,891.2 L452.9,890.1 L460.6,888.7 L468.3,887.0 L475.8,885.0 L483.3,882.6 L490.7,879.9 L498.0,877.0 L505.1,873.7 L512.2,870.3 L519.1,866.7 L526.0,862.8 L532.7,858.8 L539.3,854.6 L545.9,850.4 L552.4,845.9 L558.8,841.4 L565.1,836.8 L571.4,832.1 L577.6,827.3 L583.8,822.5 L589.9,817.6 L596.0,812.6 L602.1,807.6 L608.1,802.6 L614.1,797.6 L620.1,792.5 L626.0,787.4 L631.9,782.2 L637.7,776.9 L643.5,771.6 L649.2,766.2 L654.7,760.6 L660.2,755.0 L665.5,749.2 L670.7,743.4 L675.8,737.4 L680.9,731.4 L685.8,725.3 L690.6,719.1 L695.3,712.8 L699.8,706.4 L704.1,699.9 L708.2,693.1 L712.0,686.3 L715.5,679.3 L718.7,672.1 L721.6,664.8 L724.4,657.5 L727.1,650.1 L729.8,642.8 L732.8,635.5 L736.7,628.7 L743.1,624.8 L748.9,629.6 L751.9,636.9 L754.1,644.4 L756.0,652.0 L758.0,659.6 L760.0,667.2 L762.2,674.7 L764.8,682.1 L767.7,689.4 L771.0,696.5 L774.6,703.5 L778.6,710.2 L782.8,716.8 L787.4,723.2 L792.2,729.4 L797.4,735.3 L802.8,741.0 L808.6,746.3 L814.7,751.2 L821.2,755.6 L828.0,759.4 L835.2,762.7 L842.5,765.4 L850.0,767.7 L857.6,769.8 L860.1,770.4' };
const PT_CODES = (() => { const a = []; for (const o of 'OD') for (const s of 'SR') for (const p of 'PN') for (const w of 'WT') a.push(o + s + p + w); return a; })();
const PT_HEAT = [['anua-heartleaf77-toner', 'B사 진정 토너'], ['anua-cleansing-oil', 'B사 클렌징 오일'], ['anua-heartleaf80-ampoule', 'B사 진정 앰플'], ['anua-niacinamide-txa-serum', 'B사 톤업 세럼']];

function ptChapter(L, phrase, ko, dark) {
  return `<section class="pt-chap rv${dark ? ' dark' : ''}"><div class="dw">${'DAWM'.split('').map(c => c === L ? `<span class="tg">${c}</span><span class="rest">${esc(phrase.slice(1))}</span>` : `<span class="ot">${c}</span>`).join('')}</div><p class="ko">${esc(ko)}</p></section>`;
}

route('partners', v => {
  const sc = (id, c) => D.prodById[id] ? productScore(D.prodById[id], c) : null;
  const ex = 'estra-atobarrier-cream', exs = PT_CODES.map(c => [c, sc(ex, c)]).filter(x => x[1] != null).sort((a, b) => b[1] - a[1]);
  const hi = exs[0] || ['DSPW', 98], lo = exs[exs.length - 1] || ['ORNT', 72];
  const adPass = sc('celimax-retinal-booster', 'OSPW') || 85;
  const adFail = D.prod.filter(p => p.cat !== '색조').map(p => productScore(p, 'OSPW')).filter(s => s < 70).sort((a, b) => b - a).slice(0, 2);
  while (adFail.length < 2) adFail.push(62);
  const heat = PT_HEAT.filter(([id]) => D.prodById[id]).map(([id, n]) => ({ n, s: PT_CODES.map(c => sc(id, c)) }));
  const hmax = Math.max(...heat.flatMap(h => h.s));
  const col = s => { const t = Math.max(0, Math.min(1, (s - 55) / 43)), a = [250, 240, 244], b = [150, 29, 100]; return `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * t)).join(',')})`; };
  const ax = D.sc.axes.map(a => ({ n: a.name, hi: a.hi, hiN: a.hiName.split(' ')[0].replace('·탄력', ''), lo: a.lo, loN: a.loName }));
  const name = c => (D.sc.names || {})[c] || '';

  v.innerHTML = `<div class="pt">
  <section class="pt-hero">
    <svg class="pt-logo" viewBox="${PT_LOGO.vb}" aria-hidden="true"><path d="${PT_LOGO.d}"/></svg>
    <div class="eb">DAWM PARTNERS</div>
    <h1 class="mask"><span>백 명은 백 개의 아름다움</span></h1>
    <p class="lead">다움은 한 사람의 피부를 기억하고, 그 피부에 맞는 답을 찾는 뷰티 큐레이션 플랫폼이다.</p>
    <div class="cta"><a class="pt-btn" href="#pt-contact">다움과 함께하기</a><a class="pt-btn ghost" href="#films">브랜드 필름 보기 ▶</a></div>
    <div class="scrollhint">SCROLL</div>
  </section>

  ${ptChapter('D', 'DIFFERENT SKIN, DIFFERENT ANSWER', '피부가 다르면, 답도 달라야 한다')}
  <section class="pt-sec rv pt-q"><div class="eb">QUESTION</div><h2>가장 어려운 질문은 여전히 하나다</h2>
    <p class="qline"><span class="typed" data-text="“그래서, 내 피부엔 뭐가 맞지?”"></span></p>
    <div class="tags"><i>건성</i><i>지성</i><i>복합성</i></div>
    <div class="axes4">${ax.map(a => `<span>${esc(a.n)}</span>`).join('')}</div>
    <p class="hint">피부도 MBTI처럼, 네 가지 축으로 읽어야 한다</p>
    <p class="body">스킨케어 정보는 넘쳐나지만, 소비자에게 남는 질문은 결국 하나다. 건성, 지성, 복합성 같은 한 가지 구분만으로는 각자의 피부 고민을 설명하기 어렵다.</p></section>
  <section class="pt-sec rv"><div class="eb">FINDING</div><h2>소비자는 ‘나와 같은 피부’부터 찾는다</h2>
    <div class="stats"><div><b data-count="58.4" data-dec="1">0</b><small>%</small><span>상세페이지 탐색 시간 중<br>리뷰 확인 비중</span></div><div><b data-count="9">0</b><small>/10</small><span>상세페이지가<br>잘 이해되지 않는다</span></div><div><b data-count="71.8" data-dec="1">0</b><small>%</small><span>‘시술 같은 효과’ 문구를<br>과장으로 인식</span></div></div>
    <p class="src">출처: 다움 자체 화장품 쇼핑 앱 UX 리서치(20대 여성 10명, 실제 앱 탐색 관찰) 및 자체 소비자 설문(110명)</p></section>
  <section class="pt-sec rv pt-gap"><div class="eb">GAP</div><h2>소비자는 답을 모르고,<br>브랜드는 고객을 모른다</h2>
    <div class="gapv"><div class="side l"><small>소비자</small><b>나에게 맞는 답</b></div><div class="mid"><i></i><span>연결이 없다</span></div><div class="side r"><small>브랜드</small><b>누가 우리 고객인지</b></div></div>
    <p class="body">소비자는 나에게 맞는 답을 찾지 못하고, 브랜드는 그 소비자가 누구인지 모른 채 모두에게 같은 광고를 보낸다. <b>다움은 이 사이를 잇는다.</b></p></section>

  ${ptChapter('A', 'ALL ABOUT DAWM', '다움을 소개합니다')}
  <section class="pt-sec rv pt-intro"><svg class="pt-logo sm" viewBox="${PT_LOGO.vb}" aria-hidden="true"><path d="${PT_LOGO.d}"/></svg>
    <div><div class="eb">WHAT IS DAWM</div><h2>다움, 나다운 피부의 기준</h2><p class="body">지문처럼 사람마다 다른 피부를 하나의 기준으로 정리하고, 그 기준으로 모든 제품을 다시 읽어주는 플랫폼이다.</p></div></section>
  <section class="pt-sec rv pt-code"><div class="eb">SKIN CODE</div><h2>16가지 피부의 언어, 스킨코드</h2>
    <div class="codev"><div class="axes">${ax.map((a, k) => `<div class="ax" data-k="${k}"><small>${esc(a.n)}</small><span class="pole on"><em>${a.hi}</em>${esc(a.hiN)}</span><span class="pole"><em>${a.lo}</em>${esc(a.loN)}</span></div>`).join('')}</div>
      <div class="res"><div class="codebox">${'OSPW'.split('').map(c => `<span>${c}</span>`).join('')}</div><b class="nm">${esc(name('OSPW'))}</b><small>16가지 중 하나</small></div></div>
    <p class="body">네 가지 질문으로 피부를 읽는다. 축마다 한쪽 글자가 정해지고, 네 글자가 모이면 그 사람만의 스킨코드가 된다. 코드마다 ‘${esc(name('OSPW'))}’처럼 이름이 붙는다.</p>
    <p class="src">피부과에서 쓰는 피부 유형 분류(바우만 피부 타입)를 다움 방식으로 재구성</p></section>
  <section class="pt-steps"><div class="stick"><div class="pt-sec"><div class="eb">HOW IT WORKS</div><h2>진단, 기록, 해석, 큐레이션</h2>
    <div class="stepv"><ol>${[['진단', '16문항으로 나의 스킨코드를 찾는다'], ['기록', '쓴 제품과 맞지 않았던 경험을 남긴다'], ['해석', '성분과 그 관계로 이유를 설명한다'], ['큐레이션', '내 피부 기준의 점수로 제품을 다시 보여준다']].map(([t, d], i) => `<li data-i="${i}"><b>${t}</b><span>${d}</span></li>`).join('')}</ol>
    <div class="phone">${[['스킨코드', 'OSPW', name('OSPW')], ['내 기록', '맞음 · 안 맞음', '트러블 난 성분까지'], ['성분 해석', '네트워크', '성분을 관계로 읽기'], ['내 피부 점수', String(adPass), '같은 제품도 사람마다']].map(([a, b, c], i) => `<div class="scr" data-i="${i}"><small>${a}</small><b>${esc(b)}</b><span>${esc(c)}</span></div>`).join('')}</div></div></div></div></section>
  <section class="pt-sec rv pt-score"><div class="eb">PERSONAL SCORE</div><h2>같은 크림, ${hi[1]}점과 ${lo[1]}점</h2>
    <div class="duo"><div class="pd"><small>A사</small><b>장벽 크림</b></div><div class="sc"><small>${hi[0]}</small><b data-count="${hi[1]}">0</b></div><div class="sc lo"><small>${lo[0]}</small><b data-count="${lo[1]}">0</b></div></div>
    <p class="body">다움의 점수는 별점이 아니다. 내 스킨코드와 기록을 기준으로 계산한 ‘나에게 맞는 정도’다.</p><p class="src">실제 다움 DB 제품의 점수, 브랜드와 제품명은 가명</p></section>
  <section class="pt-sec rv pt-film"><div class="eb">FILM</div><h2>다움이 그리는 장면</h2>
    <div class="films">${[['media/dawm-ai-film.mp4', 'media/poster-film.jpg', 'AI 영화 · 답을 찾는 밤', '광고 속에서 길을 잃은 한 사람이 나만의 답을 만나기까지'], ['media/dawm-motion-graphic.mp4', 'media/poster-motion.jpg', '모션그래픽 · 나에게 꼭 맞는 뷰티의 답', '스킨코드 진단부터 큐레이션까지, 서비스 콘셉트']].map(([s, p, t, d]) => `<button class="fcard" type="button" data-src="${s}"><video muted loop playsinline preload="none" poster="${p}" src="${s}"></video><span class="play">▶</span><b>${t}</b><small>${d}</small></button>`).join('')}</div></section>

  <div class="pt-w">
  ${ptChapter('W', 'WHY WITH DAWM', '브랜드가 다움과 함께해야 하는 이유', true)}
  <section class="pt-sec rv"><div class="eb">STRENGTH</div><h2>다움의 고객은 자기 피부를 알고 온다</h2>
    <div class="cards3">${[['01', '스킨코드로 고객을 이해한다', '16가지 코드로 나뉜 고객이 스스로 진단하고 들어온다'], ['02', '성분을 관계로 해석한다', '왜 맞는지, 왜 안 맞는지 이유까지 설명한다'], ['03', '같은 코드끼리 기록을 쌓는다', '코드별 방에서 실제 사용 경험이 모인다']].map(([n, t, d]) => `<div class="c3"><small>${n}</small><b>${t}</b><span>${d}</span></div>`).join('')}</div></section>
  <section class="pt-hz"><div class="stick"><div class="pt-sec"><div class="eb">PARTNER PROGRAM</div><h2>다움과 함께하는 네 가지 방법</h2></div>
    <div class="track">${[['맞춤 노출 광고', '그 고객의 스킨코드 기준 점수를 넘은 제품만 노출한다', '성과에 따라 비용(클릭, 구매)'], ['코드 시딩', '신제품에 맞는 스킨코드 고객에게 체험 제품을 연결한다', '캠페인 단위 비용'], ['다움 리포트', '코드별 관심 성분, 트러블 성분, 탐색 흐름을 익명 집계로 제공한다', '월 구독'], ['함께 만드는 제품', '코드 방 고객과 콘셉트 테스트부터 공동 기획한다', '프로젝트 단위 계약']].map(([t, d, m], i) => `<div class="pc"><small>0${i + 1}</small><b>${t}</b><span>${d}</span><em>${m}</em></div>`).join('')}<div class="pc note"><b>고객은 무료</b><span>구매로 이어지면 제휴 판매 수수료</span></div></div></div></section>
  <section class="pt-sec rv pt-ad"><div class="eb">AD PRINCIPLE</div><h2>광고도 같은 기준을 통과해야 보인다</h2>
    <div class="adv"><div class="ads"><span class="f">광고 A<b>${adFail[0]}점</b></span><span class="pass">광고 B<b>${adPass}점</b></span><span class="f">광고 C<b>${adFail[1]}점</b></span></div><div class="gate">OSPW 기준선 70점</div><div class="why">OSPW 기준 ${adPass}점이라 보여드려요</div></div>
    <p class="body">기준을 넘지 못한 광고는 보이지 않는다. 보이는 광고에는 그 이유가 함께 붙는다. 그래서 다움의 광고는 추천의 신뢰를 깨지 않는다.</p><p class="src">실제 DB 제품의 OSPW 점수, 브랜드명은 가명</p></section>
  <section class="pt-sec rv pt-cycle"><div class="eb">상생구조</div><h2>고객의 기록이,<br>고객에게 맞는 제품으로 돌아온다</h2>
    <div class="cyc"><div class="ring">${['고객의 기록', '익명 집계', '브랜드 인사이트', '맞춤 제품', '더 맞는 선택'].map((t, i) => `<span style="--i:${i}">${t}</span>`).join('')}<b>상생</b></div>
      <ul>${['개인을 알아볼 수 있는 정보는 제공하지 않는다', '동의한 기록만 집계한다', '언제든 철회할 수 있다', '시딩 연결은 다움이 대신한다'].map(t => `<li>${t}</li>`).join('')}</ul></div></section>
  <section class="pt-sec rv pt-heat"><div class="eb">DASHBOARD</div><h2>우리 제품은 어떤 피부에 가장 잘 맞을까</h2>
    <div class="heatwrap"><div class="heat" style="--n:${PT_CODES.length}"><div></div>${PT_CODES.map(c => `<div class="hh">${c}</div>`).join('')}
      ${heat.map((h, r) => `<div class="hn">${esc(h.n)}</div>` + h.s.map((s, c) => `<div class="hc" style="--bg:${col(s)};--fg:${s > 86 ? '#fff' : '#4a2a3a'};transition-delay:${(r + c) * 35}ms" title="${PT_CODES[c]} ${s}점">${s}</div>`).join('')).join('')}</div></div>
    <p class="body">다움 점수 엔진으로 계산한 제품별, 스킨코드별 적합도다. 브랜드는 이 지도로 타깃 코드를 고르고, 시딩과 광고를 그 코드에 집중한다.</p><p class="src">실제 DB 한 브랜드의 제품 ${heat.length}개 × 16개 스킨코드 점수, 브랜드와 제품명은 가명</p></section>
  </div>

  ${ptChapter('M', 'MOVE FORWARD TOGETHER', '다움과 함께 나아갈 길')}
  <section class="pt-sec rv"><div class="eb">NOW</div><h2>이미 움직이고 있는 다움</h2>
    <div class="nums">${[[D.prod.length, '제품'], [D.ing.length, '성분'], [D.con.length, '성분 개념'], [PT_CODES.length, '스킨코드']].map(([n, t]) => `<div><b data-count="${n}">0</b><span>${t}</span></div>`).join('')}</div>
    <p class="body">사용성 테스트 결과를 반영해 진단 흐름과 성분사전을 개선했고, 지금도 데이터를 넓혀가고 있다.</p></section>
  <section class="pt-sec rv pt-road"><div class="eb">ROADMAP</div><h2>다움이 나아갈 길</h2>
    <div class="road"><div class="line"><i></i></div>${[['2026 Q4', '서비스 배포', true], ['2027 상반기', '루틴 충돌 검사, 대체품 찾기, 브랜드 대시보드'], ['2027 하반기', '코드 시딩, 다움 리포트'], ['이후', '피부 기록 기반 공동 개발']].map(([t, d, now], i) => `<div class="ms${now ? ' now' : ''}" style="--i:${i}"><b>${t}</b><span>${d}</span></div>`).join('')}</div></section>
  <section class="pt-sec rv pt-scen"><div class="eb">SCENARIO</div><h2>이렇게 함께할 수 있다</h2>
    <div class="scen"><div class="st" data-i="0"><small>01 코드 선택</small><div class="cpick">${['DSPW', 'DSNW', 'ORNT', 'OSPW'].map((c, i) => `<span class="${i < 2 ? 'pick' : ''}">${c}</span>`).join('')}</div><p>대시보드에서 점수가 높은 코드를 고른다</p></div>
      <div class="st" data-i="1"><small>02 코드 시딩</small><div class="seed"><b class="box">신제품</b><span>DSPW</span><span>DSPW</span><span>DSNW</span></div><p>그 코드 고객에게만 체험 제품이 간다</p></div>
      <div class="st" data-i="2"><small>03 후기 → 노출</small><div class="room"><span>DSPW 방 · 촉촉하고 자극 없어요</span><span>DSNW 방 · 겨울에 딱</span><em>DSPW 기준 점수를 넘어 노출</em></div><p>같은 코드 방에 후기가 쌓이고, 맞춤 노출 광고로 넓힌다</p></div></div>
    <p class="src">실제 사례가 아닌 시나리오</p></section>
  <section class="pt-sec rv"><div class="eb">PLAN</div><h2>브랜드 규모에 맞춰 시작한다</h2>
    <div class="plans">${[['베이직', '다움 리포트', '월 구독 · 예시'], ['프로', '다움 리포트, 브랜드 대시보드, 맞춤 노출 광고', '월 구독 + 광고 성과 비용 · 예시'], ['엔터프라이즈', '코드 시딩, 함께 만드는 제품', '맞춤 견적']].map(([t, d, p], i) => `<div class="pl${i === 1 ? ' pro' : ''}"><b>${t}</b><span>${d}</span><em>${p}</em></div>`).join('')}</div></section>
  <section class="pt-sec rv pt-contact" id="pt-contact"><div class="eb">CONTACT</div><h2>당신의 고객을, 더 정확하게</h2>
    <form class="pform" onsubmit="return false"><input placeholder="회사명" required><input placeholder="담당자 이름" required><input placeholder="연락처 또는 이메일" required>
      <div class="chk">${['맞춤 노출 광고', '코드 시딩', '다움 리포트', '함께 만드는 제품'].map(t => `<label><input type="checkbox"> ${t}</label>`).join('')}</div>
      <textarea placeholder="문의 내용" rows="3"></textarea><button class="pt-btn" type="submit">다움과 함께하기</button></form>
    <p class="src">발표용 프로토타입이라 실제로 전송되지는 않아요.</p></section>
  </div>`;
  ptInit(v);
});

function ptInit(v) {
  const root = v.querySelector('.pt'), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.querySelectorAll('.pt-logo path').forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = reduce ? 0 : L; p.style.setProperty('--L', L); });
  requestAnimationFrame(() => root.querySelector('.pt-hero').classList.add('in'));
  const countUp = el => { const to = +el.dataset.count, dec = +(el.dataset.dec || 0); if (reduce) { el.textContent = to.toFixed(dec); return; } const t0 = performance.now(); const f = t => { const p = Math.min(1, (t - t0) / 1100), e = 1 - Math.pow(1 - p, 3); el.textContent = (to * e).toFixed(dec); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); };
  const onIn = sec => {
    sec.querySelectorAll('[data-count]').forEach(countUp);
    const ty = sec.querySelector('.typed'); if (ty) { const s = ty.dataset.text; if (reduce) { ty.textContent = s; sec.classList.add('done'); } else { let i = 0; const it = setInterval(() => { ty.textContent = s.slice(0, ++i); if (i >= s.length) { clearInterval(it); setTimeout(() => sec.classList.add('done'), 500); } }, 70); } }
    if (sec.classList.contains('pt-code')) ptCode(sec, reduce);
    if (sec.classList.contains('pt-cycle')) { const sp = sec.querySelectorAll('.ring span'); sp.forEach((s, i) => setTimeout(() => s.classList.add('on'), reduce ? 0 : 400 + i * 450)); setTimeout(() => sec.classList.add('done'), reduce ? 0 : 400 + sp.length * 450); }
    if (sec.classList.contains('pt-scen')) { const st = sec.querySelectorAll('.st'); st.forEach((s, i) => setTimeout(() => { st.forEach(x => x.classList.remove('cur')); s.classList.add('on', 'cur'); }, reduce ? 0 : i * 1600)); }
    sec.querySelectorAll('video').forEach(vd => { vd.preload = 'metadata'; vd.play && vd.play().catch(() => { }); });
  };
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); onIn(e.target); } }), { threshold: .28 });
  root.querySelectorAll('.rv').forEach(s => io.observe(s));
  // sticky steps & horizontal programs
  const steps = root.querySelector('.pt-steps'), hz = root.querySelector('.pt-hz');
  const onScroll = () => {
    if (!document.body.contains(root)) { removeEventListener('scroll', onScroll); return; }
    const vh = innerHeight;
    if (steps) { const r = steps.getBoundingClientRect(), p = Math.max(0, Math.min(.999, -r.top / (r.height - vh))), i = Math.floor(p * 4); steps.dataset.step = i; }
    if (hz) { const r = hz.getBoundingClientRect(), p = Math.max(0, Math.min(1, -r.top / (r.height - vh))), tr = hz.querySelector('.track'); tr.style.transform = `translateX(${-p * Math.max(0, tr.scrollWidth - hz.clientWidth + 48)}px)`; }
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  // films
  root.querySelectorAll('.fcard').forEach(b => b.onclick = () => {
    const m = document.createElement('div'); m.className = 'pt-modal';
    m.innerHTML = `<div class="box"><video controls autoplay playsinline src="${b.dataset.src}"></video><button type="button" aria-label="닫기">×</button></div>`;
    const close = () => m.remove(); m.onclick = e => { if (e.target === m || e.target.tagName === 'BUTTON') close(); };
    document.body.appendChild(m);
  });
  root.querySelector('.pform').addEventListener('submit', e => { e.preventDefault(); if (!e.target.checkValidity()) return; toast('문의가 접수됐어요(발표용 예시라 실제 전송은 없어요)'); e.target.reset(); });
  if (reduce) root.querySelectorAll('.rv').forEach(s => s.classList.add('in'));
}

function ptCode(sec, reduce) {
  const axes = sec.querySelectorAll('.ax'), slots = sec.querySelectorAll('.codebox span'), box = sec.querySelector('.codev');
  if (reduce) { axes.forEach(a => a.classList.add('on')); sec.classList.add('done'); return; }
  axes.forEach((a, k) => setTimeout(() => a.classList.add('on'), 300 + k * 380));
  setTimeout(() => {
    const br = box.getBoundingClientRect();
    axes.forEach((a, k) => {
      const from = a.querySelector('.pole.on em').getBoundingClientRect(), to = slots[k].getBoundingClientRect();
      const f = document.createElement('i'); f.className = 'fly'; f.textContent = slots[k].textContent;
      f.style.left = (from.left - br.left) + 'px'; f.style.top = (from.top - br.top) + 'px'; box.appendChild(f);
      f.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${to.left - from.left + (to.width - from.width) / 2}px,${to.top - from.top + (to.height - from.height) / 2}px) scale(1.4)`, opacity: 1, offset: .85 }, { transform: `translate(${to.left - from.left + (to.width - from.width) / 2}px,${to.top - from.top + (to.height - from.height) / 2}px) scale(1.4)`, opacity: 0 }],
        { duration: 750, delay: k * 120, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'forwards' }).onfinish = () => { slots[k].classList.add('on'); f.remove(); if (k === axes.length - 1) sec.classList.add('done'); };
    });
  }, 300 + axes.length * 380 + 250);
}
