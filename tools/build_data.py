import json,re,sys
sys.path.insert(0,'.')
from ing_core import A
from ing_core2 import A2, EXTRA_INCI, EXTRA_DESC
from ing_b import B, group_of
from ing_b2 import B2, SPECIAL2
from products_src import P, SRC
from products_src2 import P2
from concepts import C
def slug(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
ings=[];idx={};byid={}
for (i,ko,inci,g,role,desc,good,cau,tags) in A+A2:
    inci=list(inci)+EXTRA_INCI.get(i,[])
    d=dict(id=i,ko=ko,inci=inci,group=g,role=role,desc=EXTRA_DESC.get(i,desc),good=good,caution=cau,tags=[t for t in tags.split(',') if t],tier='A',concepts=[])
    ings.append(d); byid[i]=d
    for x in inci: idx[x.lower()]=i
for inci,ko in list(B.items())+list(B2.items()):
    if inci.lower() in idx: continue
    g,role=SPECIAL2.get(inci) or group_of(inci); i='x-'+slug(inci)
    d=dict(id=i,ko=ko,inci=[inci],group=g,role=role,desc='',good='',caution='',tags=[],tier='B',concepts=[])
    ings.append(d); byid[i]=d; idx[inci.lower()]=i
concepts=[]
for c in C:
    for m in c['m']: byid[m[0]]['concepts'].append(c['id'])
    concepts.append(dict(id=c['id'],name=c['name'],en=c['en'],aliases=c['aliases'],sum=c['sum'],desc=c['desc'],chain=c.get('chain'),cols=c['cols'],
        members=[dict(id=m[0],v=list(m[1:])) for m in c['m']],rel=[dict(id=r[0],t=r[1]) for r in c['rel']]))
TAG={"estra-atobarrier-cream":"아토베리어365크림","estra-hydro-soothing":"하이드로수딩크림","estra-cera-ha-ampoule":"세라히알앰플","estra-theracne-toner":"테라크네토너",
"estra-uv365-mineral":"UV365무기자차","laneige-waterbank-cream":"워터뱅크블루크림","laneige-waterbank-serum":"워터뱅크세럼","laneige-cream-skin":"크림스킨",
"innisfree-greentea-serum":"그린티씨드세럼","innisfree-retinol-cica":"레티놀시카앰플","innisfree-nosebum-powder":"노세범파우더","sulwhasoo-fcas":"윤조에센스",
"sulwhasoo-cushion":"설화수퍼펙팅쿠션","hera-black-cushion":"헤라블랙쿠션","iope-retinol-expert":"레티놀엑스퍼트","illiyoon-ceramide-cream":"일리윤세라마이드크림",
"belif-aquabomb":"아쿠아밤","belif-moisturizing-bomb":"모이스춰라이징밤","belif-vita-water":"비타워터크림","cnp-propolis-ampule":"프로폴리스앰플","physiogel-dmt-cream":"피지오겔DMT크림",
"anua-heartleaf77-toner":"어성초77토너","anua-cleansing-oil":"아누아클렌징오일","anua-heartleaf80-ampoule":"어성초80앰플","torriden-divein-serum":"다이브인세럼","torriden-divein-toner":"다이브인토너",
"torriden-divein-cream":"다이브인수딩크림","torriden-cica-cream":"토리든시카크림","numbuzin-no3-serum":"넘버즈인3번세럼","numbuzin-no1-cream":"넘버즈인1번크림","numbuzin-no5-pad":"넘버즈인5번패드",
"clio-mesh-glow-cushion":"킬커버메쉬글로우","clio-founwear-cushion":"킬커버파운웨어","thesaem-tip-concealer":"더샘팁컨실러","thesaem-pink-sun":"더샘핑크선크림","thesaem-aloe-gel":"알로에수딩젤",
"cnp-propolis-rescue":"프로폴리스레스큐앰플","cnp-milky-toner":"CNP밀키토너","cnp-sunquid":"애프터레이선퀴드","innisfree-greentea-ha-cream":"그린티히알루론산크림"}
POP={"estra-atobarrier-cream":9420,"belif-aquabomb":8810,"laneige-waterbank-cream":7650,"illiyoon-ceramide-cream":7120,"cnp-propolis-ampule":6980,"estra-uv365-mineral":6540,
"innisfree-nosebum-powder":6400,"sulwhasoo-fcas":6120,"hera-black-cushion":5980,"laneige-cream-skin":5710,"innisfree-greentea-serum":5530,"estra-hydro-soothing":5210,
"physiogel-dmt-cream":4870,"iope-retinol-expert":4650,"innisfree-retinol-cica":4420,"sulwhasoo-cushion":4180,"estra-theracne-toner":3990,"laneige-waterbank-serum":3760,
"estra-cera-ha-ampoule":3540,"belif-moisturizing-bomb":3310,"belif-vita-water":2980,
"anua-heartleaf77-toner":9880,"torriden-divein-serum":9640,"anua-cleansing-oil":8420,"clio-founwear-cushion":7980,"numbuzin-no3-serum":7410,"torriden-divein-toner":7020,
"thesaem-tip-concealer":6890,"numbuzin-no5-pad":6260,"torriden-divein-cream":5890,"clio-mesh-glow-cushion":5640,"anua-heartleaf80-ampoule":5420,"thesaem-aloe-gel":5080,
"torriden-cica-cream":4730,"numbuzin-no1-cream":4310,"thesaem-pink-sun":3880,"cnp-propolis-rescue":3720,"cnp-sunquid":3160,"cnp-milky-toner":2890,"innisfree-greentea-ha-cream":3420}
prods=[]
for (pid,brand,grp,name,cat,tex,price,vol,sl,inci),chk in [(p,"2026-11-20") for p in P]+[(p,"2026-11-21") for p in P2]:
    lst=[x.strip() for x in inci.split(', ')]
    prods.append(dict(id=pid,brand=brand,company=grp,name=name,cat=cat,texture=tex,price=price,vol=vol,tag=TAG[pid],pop=POP[pid],
        src=SRC+sl,checked=chk,inci=lst,ing=[idx[x.lower()] for x in lst]))
for n,o in [('ingredients',ings),('products',prods),('concepts',concepts)]:
    json.dump(o,open(f'../data/{n}.json','w'),ensure_ascii=False,separators=(',',':'))
print(len(ings),len(prods),len(concepts))
