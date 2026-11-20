/* bootstrap */
(async function () {
  S.load();
  bindActions(); bindSearch();
  try { await loadData(); }
  catch (e) { $('#view').innerHTML = '<div class="wrap blk">데이터를 불러오지 못했어요. 새로고침해 주세요.</div>'; return; }
  window.addEventListener('hashchange', render);
  render();
})();
