# PWA 아이콘 생성 가이드

PWA로 앱처럼 설치하려면 아이콘이 필요합니다.

## 📱 필요한 아이콘

- `icon-192.png` (192x192 픽셀)
- `icon-512.png` (512x512 픽셀)
- `favicon.ico` (32x32 픽셀, 선택)

**위치:** `/public/` 폴더

---

## 🎨 아이콘 디자인 아이디어

### 옵션 1: 텍스트 기반
```
배경: 보라색 (#8b5cf6)
텍스트: "M" (흰색, 굵은 폰트)
```

### 옵션 2: 가위 아이콘
```
배경: 보라색 그라디언트
아이콘: 흰색 가위 실루엣
```

### 옵션 3: 미용사 실루엣
```
배경: 보라색
아이콘: 흰색 미용사 머리 실루엣
```

---

## 🛠️ 아이콘 생성 방법

### 방법 1: Canva (추천, 무료)
1. https://www.canva.com 접속
2. "Custom size" → 512 x 512 px
3. 배경색 설정: #8b5cf6 (보라색)
4. 텍스트 "M" 또는 아이콘 추가 (흰색)
5. 다운로드:
   - PNG로 저장 → `icon-512.png`
   - 크기 조정 192x192 → `icon-192.png`

### 방법 2: Figma (무료)
1. https://www.figma.com 접속
2. 512x512 프레임 생성
3. 디자인
4. Export as PNG

### 방법 3: 온라인 도구
1. https://realfavicongenerator.net/ 접속
2. 이미지 업로드
3. PWA 아이콘 자동 생성
4. 다운로드

### 방법 4: AI 도구 (가장 빠름)
```
프롬프트:
"Create a simple app icon for a hair salon management app called MANE.
Purple background (#8b5cf6), white letter M or scissors icon,
minimalist design, 512x512px"
```

**AI 도구:**
- DALL-E (ChatGPT)
- Midjourney
- Stable Diffusion

---

## ✅ 아이콘 적용 후 테스트

### 데스크톱 (Chrome)
1. 개발 서버 실행 (`npm run dev`)
2. Chrome에서 접속
3. 주소창 우측 "설치" 아이콘 확인
4. 클릭하여 설치 테스트

### 모바일 (Android/iOS)
1. 배포된 사이트 접속
2. 브라우저 메뉴 → "홈 화면에 추가"
3. 아이콘 확인

---

## 📝 임시 아이콘

아이콘이 없어도 PWA는 작동하지만, 기본 아이콘이 표시됩니다.
빠르게 테스트하려면 임시로 단색 이미지라도 만들어주세요!

**간단한 임시 아이콘 (온라인 도구):**
- https://www.iconarchive.com/
- 무료 아이콘 다운로드 → 크기 조정

---

**완료 후 체크리스트:**
- [ ] `icon-192.png` 생성 및 `/public/` 폴더에 저장
- [ ] `icon-512.png` 생성 및 `/public/` 폴더에 저장
- [ ] 개발 서버 재시작
- [ ] 브라우저에서 설치 아이콘 확인

---

**마지막 업데이트:** 2026년 2월 6일
