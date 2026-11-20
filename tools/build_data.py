import json,re,sys
sys.path.insert(0,'.')
from ing_core import A
from ing_b import B, group_of
from products_src import P, SRC
def slug(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
ings=[];idx={}
for (i,ko,inci,g,role,desc,good,cau,tags) in A:
    ings.append(dict(id=i,ko=ko,inci=inci,group=g,role=role,desc=desc,good=good,caution=cau,tags=[t for t in tags.split(',') if t],tier='A'))
    for x in inci: idx[x.lower()]=i
for inci,ko in B.items():
    if inci.lower() in idx: continue
    g,role=group_of(inci); i='x-'+slug(inci)
    ings.append(dict(id=i,ko=ko,inci=[inci],group=g,role=role,desc='',good='',caution='',tags=[],tier='B'))
    idx[inci.lower()]=i
TAG={"estra-atobarrier-cream":"아토베리어365크림","estra-hydro-soothing":"하이드로수딩크림","estra-cera-ha-ampoule":"세라히알앰플","estra-theracne-toner":"테라크네토너",
"estra-uv365-mineral":"UV365무기자차","laneige-waterbank-cream":"워터뱅크블루크림","laneige-waterbank-serum":"워터뱅크세럼","laneige-cream-skin":"크림스킨",
"innisfree-greentea-serum":"그린티씨드세럼","innisfree-retinol-cica":"레티놀시카앰플","innisfree-nosebum-powder":"노세범파우더","sulwhasoo-fcas":"윤조에센스",
"sulwhasoo-cushion":"설화수퍼펙팅쿠션","hera-black-cushion":"헤라블랙쿠션","iope-retinol-expert":"레티놀엑스퍼트","illiyoon-ceramide-cream":"일리윤세라마이드크림",
"belif-aquabomb":"아쿠아밤","belif-moisturizing-bomb":"모이스춰라이징밤","belif-vita-water":"비타워터크림","cnp-propolis-ampule":"프로폴리스앰플","physiogel-dmt-cream":"피지오겔DMT크림"}
POP={"estra-atobarrier-cream":9420,"belif-aquabomb":8810,"laneige-waterbank-cream":7650,"illiyoon-ceramide-cream":7120,"cnp-propolis-ampule":6980,"estra-uv365-mineral":6540,
"innisfree-nosebum-powder":6400,"sulwhasoo-fcas":6120,"hera-black-cushion":5980,"laneige-cream-skin":5710,"innisfree-greentea-serum":5530,"estra-hydro-soothing":5210,
"physiogel-dmt-cream":4870,"iope-retinol-expert":4650,"innisfree-retinol-cica":4420,"sulwhasoo-cushion":4180,"estra-theracne-toner":3990,"laneige-waterbank-serum":3760,
"estra-cera-ha-ampoule":3540,"belif-moisturizing-bomb":3310,"belif-vita-water":2980}
prods=[]
for (pid,brand,grp,name,cat,tex,price,vol,sl,inci) in P:
    lst=[x.strip() for x in inci.split(', ')]
    prods.append(dict(id=pid,brand=brand,company=grp,name=name,cat=cat,texture=tex,price=price,vol=vol,tag=TAG[pid],pop=POP[pid],
        src=SRC+sl,checked="2026-11-20",inci=lst,ing=[idx[x.lower()] for x in lst]))
json.dump(ings,open('../data/ingredients.json','w'),ensure_ascii=False,separators=(',',':'))
json.dump(prods,open('../data/products.json','w'),ensure_ascii=False,separators=(',',':'))
print(len(ings),len(prods))
