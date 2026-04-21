# K 씬스틸러 (K Scene Stealer)

K-드라마 촬영지를 따라 떠나는 **나만의 한국 여행 경험**을 만들어주는 웹 앱입니다.
Figma Make로 디자인한 화면을 Vite + React + TypeScript 기반 프로젝트로 정리했습니다.

## 기술 스택

- **Vite 6** + **React 18** + **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite` 플러그인)
- **shadcn/ui** + **Radix UI** (UI 컴포넌트)
- **MUI (Material-UI) + Emotion** (일부 입력/아이콘)
- **lucide-react** (아이콘), **motion** (애니메이션), **recharts** (차트)
- **OpenAI SDK** (커스텀 드라마 / AI 여행 어시스턴트)

## 빠른 시작

### 1) 의존성 설치

```bash
# pnpm 권장
pnpm install

# 또는
npm install
```

### 2) 환경 변수 설정

`.env.example` 파일을 복사해 `.env` 파일을 만든 뒤 OpenAI API 키를 넣어주세요.

```bash
cp .env.example .env
```

```env
VITE_OPENAI_API_KEY=sk-...
```

> API 키가 없어도 프리셋 드라마(폭싹 속았수다, 오징어게임)는 동작합니다.
> 커스텀 드라마 생성 / 여행 어시스턴트 기능에만 키가 필요합니다.

### 3) 개발 서버 실행

```bash
pnpm dev
# 또는
npm run dev
```

기본 주소: <http://localhost:5173>

### 4) 빌드 & 미리보기

```bash
pnpm build       # tsc 타입 체크 + vite build
pnpm preview     # 빌드된 결과 미리보기
```

## 프로젝트 구조

```
k-scene-stealer/
├─ index.html                # Vite 엔트리 HTML
├─ package.json
├─ tsconfig.json             # 앱 TS 설정
├─ tsconfig.node.json        # vite.config.ts용 TS 설정
├─ vite.config.ts            # Vite + Tailwind + figma:asset 리졸버
├─ postcss.config.mjs
├─ .env.example              # 환경 변수 템플릿
├─ .gitignore
└─ src/
   ├─ main.tsx               # React 진입점
   ├─ vite-env.d.ts          # import.meta.env 타입
   ├─ app/
   │  ├─ App.tsx             # 6단계 플로우 상태머신 (hero→drama→region→form→preview→result)
   │  └─ components/
   │     ├─ Hero.tsx
   │     ├─ GenreSelection.tsx
   │     ├─ DramaSelection.tsx
   │     ├─ RegionSelection.tsx
   │     ├─ StoryForm.tsx
   │     ├─ StoryPreview.tsx
   │     ├─ EpisodeResult.tsx
   │     ├─ MapView.tsx
   │     ├─ TransportGuide.tsx
   │     ├─ TravelAssistant.tsx
   │     ├─ figma/
   │     │  └─ ImageWithFallback.tsx
   │     └─ ui/               # shadcn/ui 컴포넌트 모음
   ├─ lib/
   │  ├─ openai.ts           # OpenAI 클라이언트 + 커스텀 드라마/챗 API
   │  └─ regionData.ts       # 지역별 촬영지/체험 데이터
   ├─ styles/
   │  ├─ index.css           # fonts + tailwind + theme 임포트
   │  ├─ fonts.css           # Pretendard / Inter 폰트
   │  ├─ tailwind.css        # Tailwind v4 설정
   │  └─ theme.css           # CSS 변수(컬러/라디우스) + @theme inline
   └─ imports/                # Figma에서 내보낸 원본 이미지
```

## 유저 플로우

1. **Hero** – 랜딩 화면, 시작하기 버튼
2. **DramaSelection** – 프리셋 드라마 선택 or 커스텀 드라마 이름 입력
3. **RegionSelection** – 여행 지역 선택 (드라마 테마에 따라 필터링)
4. **StoryForm** – 이름, 출발지, 여행 스타일, 날짜 입력
5. **StoryPreview** – AI 스토리 가이드와 대화하며 일정 조정
6. **EpisodeResult** – 최종 에피소드(여행 일정) 결과

## 주요 기능 플래그

| 기능 | OpenAI 키 필요 | 비고 |
| --- | --- | --- |
| 프리셋 드라마 (폭싹 속았수다, 오징어게임) | ❌ | `EpisodeResult.tsx` 하드코딩 데이터 |
| 커스텀 드라마 생성 | ✅ | `generateCustomDramaLocations()` (gpt-4o-mini) |
| 여행 어시스턴트 챗 | ✅ | `chatWithAssistant()` |
| 스토리 가이드 (감성형 챗) | ✅ | `chatWithPlanningAssistant()` |

## 배포 시 주의사항

`lib/openai.ts`는 `dangerouslyAllowBrowser: true`로 브라우저에서 직접 OpenAI를 호출합니다.
실제 배포 시에는 **반드시 백엔드 프록시**를 두고 API 키를 서버에서만 쓰세요.

## 앞으로 할 일

- [ ] OpenAI 호출을 서버리스 함수(예: Vercel Edge / Cloudflare Workers)로 이관
- [ ] 진짜 Google Maps API 연동 (현재 `MapView`는 시각화 모드)
- [ ] 여행 일정 PDF 다운로드
- [ ] 다국어 지원 (영/일/중)
- [ ] 결과 공유 링크 / OG 이미지
