# 소상공인 특화 관리 툴 프로젝트

## 프로젝트 목표
**내가** 소상공인을 타겟으로 월 30-50만원 수익을 벌 수 있는 관리 툴 개발

## 핵심 전략
- **타겟**: 엑셀/수기 관리에서 벗어나고 싶은 1인~소규모 사업자
- **내 수익 목표**: 월 30-50만원
- **수익 모델**: 프리미엄 구독 월 9,900원 × 50명 = 49.5만원 OR 월 4,900원 × 100명 = 49만원
- **차별점**: 특정 업종에 최적화된 단순함 (범용 툴의 복잡함 제거)
- **마케팅**: 무료 버전으로 해당 업종 커뮤니티 공략 → 입소문

## 개발 방식
- **주 개발 도구**: Vibe 코딩 (Claude artifacts 활용)
- **기술 스택**: React + Tailwind CSS (프론트엔드), 백엔드는 단계적 결정
- **개발 시간**: 풀타임 50% + 부업 50% 투입
- **MVP 우선**: 핵심 기능만 빠르게 출시 후 피드백 기반 개선

## 개발자 배경
- 바이브 코딩 없이 5개 프로젝트 경험 (팀 협업 툴 등)
- 마케팅/운영 학습 의지 있음
- 수익 구조 학습이 주요 관심사

## 1단계: 업종 선정 ✅
**확정: 미용실 (헤어샵)**

**선정 이유:**
- [x] 고객 관리 니즈 명확 (시술 이력, 예약, 담당 디자이너)
- [x] 온라인 커뮤니티 활발 (미용사 카페, 인스타)
- [x] 1인 샵, 소규모 샵 많음 (POS기 부담스러워함)
- [x] 기존 솔루션 복잡하거나 비쌈

**타겟 페르소나:**
- 1인~3인 규모 동네 미용실
- 예약은 카톡/전화로 받음
- 고객 정보를 수첩/엑셀로 관리 중
- 단골 고객 위주 (20~50명)

## 2단계: MVP 핵심 기능 (미용실 특화)

**Phase 1 - 최소 기능 (2-3주 목표):**
1. **고객 관리**
   - 고객 등록 (이름, 전화번호, 메모)
   - 고객 목록 보기/검색
   - 시술 이력 간단 기록

2. **시술 관리**
   - 시술 메뉴 등록 (컷, 펌, 염색 등 + 가격)
   - 시술 기록 (날짜, 메뉴, 가격, 담당자)

3. **간단한 통계**
   - 오늘/이번 달 매출
   - 고객별 총 방문 횟수

**Phase 2 - 유료 전환 기능:**
- 예약 캘린더
- 문자 알림 (예약 확인, 리마인더)
- 고객 사진 첨부 (시술 전/후)
- 엑셀 내보내기

**Phase 3 - 확장:**
- 담당 디자이너 배정
- 재방문 주기 분석
- 단골 고객 자동 태그

## 3단계: 수익화 전략
**무료 버전:**
- 고객 10명까지
- 기본 기능만

**프리미엄 (월 9,900원):**
- 무제한 고객
- 통계/리포트
- 문자 발송
- 데이터 백업

**마케팅 채널:**
- 네이버 카페 (미용사 모임, 창업 카페)
- 인스타그램 (#미용실창업 #헤어샵운영 등)
- 유튜브 쇼츠 (미용실 운영 팁 + 앱 소개)
- 당근마켓 동네 미용실에 DM

## 4단계: 기술 스택 & 프로젝트 세팅 ✅

**최종 확정 스택:**

**플랫폼:**
- 웹 + 모바일 반응형 (PWA)
- 노트북, 태블릿, 모바일 모두 지원

**프론트엔드:**
- ✅ React + Vite + TypeScript
- ✅ Tailwind CSS
- 상태관리: Context API (간단하게 시작)
- PWA 설정 (앱처럼 설치 가능)

**백엔드:**
- ✅ **Firebase** (선택 이유: 빠른 시작, 풍부한 레퍼런스)
  - Firebase Authentication (로그인/회원가입)
  - Firestore (NoSQL 데이터베이스)
  - Firebase Storage (이미지 업로드)
  - Firebase Hosting (선택사항)

**문서 생성:**
- ✅ xlsx (엑셀 내보내기)
- ✅ jspdf (PDF 생성)

**결제 (Phase 2):**
- 토스페이먼츠 또는 아임포트

**배포:**
- ✅ Vercel (프론트엔드 배포)
- Firebase 콘솔 (백엔드 관리)

**프로젝트 이름 후보 (세련된 버전):**
- [O] Mane (메인)
- [ ] Stylus (스타일러스)
- [ ] Cut (컷)
- [ ] Salon (살롱)
- [ ] Cliently (클라이언틀리)
- [ ] (TBD)

## Claude 협업 방식
1. **아이디어 단계**: 브레인스토밍, 시장 조사 도움
2. **설계 단계**: 기능 명세, 화면 설계, DB 스키마
3. **개발 단계**: Vibe 코딩으로 프로토타입 빠르게 제작
4. **피드백 단계**: 개선 방향 제안, 버그 수정

## 현재 결정 필요 사항
- [x] 타겟 업종 최종 선정 → **미용실**
- [x] MVP 핵심 기능 3-4가지 확정 → **고객관리 + 시술관리 + 간단통계**
- [x] 기술 스택 결정 → **React + Vite + TS + Firebase**
- [O] 프로젝트 이름 확정 (Mane, Stylus, Cut 등) -> **MANE**
- [ ] 디자인 컨셉 결정
- [ ] Cursor 프로젝트 생성 및 초기 세팅
- [ ] Firebase 프로젝트 생성

## 참고 자료

**경쟁 서비스 분석:**
- 프리미오 (미용실 전문, 월 5-10만원대, 복잡함)
- 노티드 (예약 위주, 기능 많음)
- 네이버 예약 (무료지만 제한적)
- 카카오톡 상담톡 (예약만 가능)

**벤치마킹 포인트:**
- 우리는 더 단순하게
- 우리는 더 저렴하게 (월 5,000~10,000원)
- 1인샵 특화

**타겟 커뮤니티:**
- 네이버 카페: "미용실 창업", "헤어샵 운영" 등
- 인스타: #미용실창업 #헤어샵운영 팔로우
- 유튜브: 미용실 브이로그, 운영 팁 채널

**기술 참고:**
- (개발 진행하며 추가)

---

## 작업 로그

### 2026-02-05
- 프로젝트 기획 시작
- Claude.md 초안 작성
- **타겟 업종 확정: 미용실**
- MVP 기능 정의 완료
- **기술 스택 확정: React + Vite + TS + Firebase**
- 프로젝트 이름 후보 선정 (세련된 버전)
- 다음: 프로젝트명 확정 → Cursor 세팅 → 첫 화면 개발

---

## 개발 시작 명령어

**Cursor 프로젝트 생성:**
```bash
npm create vite@latest [프로젝트명] -- --template react-ts
cd [프로젝트명]
npm install
npm install firebase tailwindcss xlsx jspdf react-router-dom date-fns
npm install -D @types/node postcss autoprefixer
npx tailwindcss init -p
```

**Firebase 설정:**
1. https://console.firebase.google.com 접속
2. 프로젝트 추가
3. Authentication, Firestore, Storage 활성화
4. 웹 앱 config 복사

## FRONTEND
1. UI 컴포넌트 라이브러리
bash# shadcn/ui (제일 핫함, Tailwind 기반)
npx shadcn-ui@latest init
**Material-UI**
npm install @mui/material @emotion/react @emotion/styled
**Ant Design**
npm install antd

2. 디자인 도구
**Figma (무료)** - 디자인 먼저 그리기
**v0.dev (Vercel AI)** - AI가 UI 디자인해줌
**uiverse.io** - 예쁜 컴포넌트 복붙

3. CSS 프레임워크
**Tailwind CSS** (이미 설치 예정) ✅
**DaisyUI (Tailwind + 예쁜 컴포넌트)**
bashnpm install daisyui

4. 아이콘
bash# Lucide React (깔끔함)
**npm install lucide-react**

**React Icons** (종류 많음)
npm install react-icons

5. AI 도구
**v0.dev** - "미용실 고객 목록 UI" 치면 코드 생성
**Claude** - "shadcn/ui로 카드 디자인해줘"

MANE 프로젝트 추천:
bash# shadcn/ui + lucide-react 조합
npx shadcn-ui@latest init
npm install lucide-react
이게 제일 트렌디하고 예뻐요! Sonnet 4.5