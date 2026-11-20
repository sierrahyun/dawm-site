// 링크 미리보기: 제품 페이지가 공유용으로 공개한 대표 이미지(og:image)와 제목을 읽어 돌려줘요.
// 이미지는 저장하지 않고 원래 주소 그대로 보여주며, 항상 원본 페이지 링크와 함께 표시해요.
const ALLOW = ['skinsort.com', 'amoremall.com', 'lgcaremall.com', 'belifcosmetic.com', 'cnpcosmetics.com', 'innisfree.com', 'anua.kr', 'anua.com', 'torriden.com', 'numbuzin.com', 'clubclio.co.kr', 'thesaemcosmetic.com', 'aestura.com', 'laneige.com', 'sulwhasoo.com', 'iope.com', 'hera.com', 'illiyoon.com', 'physiogel.co.kr'];
const pick = (html, key) => {
  const a = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']+)["']`, 'i'));
  const b = html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${key}["']`, 'i'));
  return (a && a[1]) || (b && b[1]) || null;
};
const unesc = s => s && s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
module.exports = async (req, res) => {
  let u;
  try { u = new URL(String(req.query.url || '')); } catch (e) { return res.status(400).json({ error: 'bad url' }); }
  if (u.protocol !== 'https:' || !ALLOW.some(d => u.hostname === d || u.hostname.endsWith('.' + d))) return res.status(403).json({ error: 'domain not allowed' });
  try {
    const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 8000);
    const r = await fetch(u.href, { signal: ctrl.signal, redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (compatible; DawmLinkPreview/1.0; +https://dawm-site.vercel.app)', accept: 'text/html' } });
    clearTimeout(t);
    if (!r.ok) return res.status(502).json({ error: 'upstream ' + r.status });
    const html = (await r.text()).slice(0, 500000);
    let image = unesc(pick(html, 'og:image') || pick(html, 'twitter:image'));
    if (image) image = new URL(image, u.href).href;
    const title = unesc(pick(html, 'og:title') || ((html.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1] || '').trim());
    res.setHeader('Cache-Control', 'public, s-maxage=604800, stale-while-revalidate=86400');
    return res.status(200).json({ image, title, site: u.hostname.replace(/^www\./, ''), url: u.href });
  } catch (e) {
    return res.status(504).json({ error: 'fetch failed' });
  }
};
