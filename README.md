# 다움 DAWM — 초개인화 뷰티 큐레이션 (수업 프로젝트 프로토타입)

정적 사이트(HTML/CSS/JS)라서 빌드 없이 그대로 Vercel·GitHub Pages에 올릴 수 있어요.

## 흐름
비로그인 홈 → `로그인하고 진단 시작` → 로그인(`dawmtest` / `dawmtest`) → 피부진단 16문항 → 스킨코드 결과 → 회원 홈(툴바 확장) → My room(위젯 편집) · 나움 · 내 루틴 · 이웃

## 폴더
- `index.html`, `css/app.css`, `js/*.js` — 화면과 동작 (해시 라우팅: `#home`, `#login`, `#diagnosis`, `#myroom`, `#naum`, `#dict`, `#ing-<id>`, `#ranking`, `#recommend`, `#product-<id>`, `#community`, `#room-<id>`, `#routine`, `#neighbors`)
- `data/ingredients.json` — 성분 272개 (A: 다움 해석 109개 / B: 전성분 연동 보조 성분, 국문은 참고 표기)
- `data/products.json` — LG생활건강·아모레퍼시픽 21개 제품, 전성분 출처 URL·확인일 포함
- `data/skincode.json` — 4축(유분 O/D · 민감 S/R · 색소 P/N · 탄력 W/T) 16문항, 16타입 이름
- `data/community.json` — 커뮤니티 예시 대화(@멘션)
- `img/` — 실사 이미지 자리 (파일명: banner-*.jpg, myroom-morning|day|evening|night.jpg, login-bg.jpg, diagnosis-bg.jpg, room-*.jpg). 없으면 그라데이션이 대신 보여요.
- `tools/` — 데이터 생성 스크립트 (`python3 tools/build_data.py`)

## 로컬 실행
`python3 -m http.server` 후 http://localhost:8000

## 다음 단계
- 식약처 화장품 원료성분정보 API로 국문 표준명 교체 (배포 서버에서 호출)
- 제품 DB 확장(LG생활건강 비중↑, 색조·선케어)
- Supabase로 실제 회원·커뮤니티 저장, 나움에 OCR·AI 연결
