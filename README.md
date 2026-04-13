# K-Contents trip

K-Drama 기반 감성 여행 추천 서비스  
드라마 속 장면을 따라 실제 장소와 음식, 문화를 경험할 수 있도록 연결하는 프로젝트입니다.

---

##  프로젝트 개요

K-콘텐츠(K-Drama)를 통해 한국을 방문하는 외국인 관광객이 증가하고 있습니다.  
하지만 실제 여행은 서울 중심의 관광으로 집중되며,  
드라마 속 지역 감성과 음식, 생활 문화는 충분히 체험되지 못하는 문제가 있습니다.

본 프로젝트는 이러한 문제를 해결하기 위해  
**드라마 장면(Scene) 기반으로 장소, 음식, 카페, 문화 체험을 연결하는  
감성 중심 여행 추천 서비스**를 구현하는 것을 목표로 합니다.

---
##  핵심 아이디어

“드라마를 보는 경험을, 실제 여행 경험으로 확장한다”

- Scene 기반 UX (장면 선택 중심)
- 드라마 감성 → 장소 → 음식 → 체험 연결
- 단순 추천이 아닌 **스토리 기반 여행 경험 제공**

---

##  주요 기능

### 1. Scene 기반 여행 추천
- 드라마 장면 선택 (감성 중심)
- 장면과 연결된 지역 자동 매핑

### 2. 위치 기반 추천 시스템
- 촬영지 또는 유사 지역 제공
- 지도 기반 장소 시각화

### 3. 식도락 여행 연결
- 🍜 음식 추천
- ☕ 카페 추천
- 📸 포토 스팟
- 🎭 문화 체험

### 4. 추천 이유 제공
- 선택 조건 기반 추천 이유 설명
- 사용자 맞춤형 경험 제공

---

## AI 적용 (확장 기능)

- 장면 기반 여행 설명 생성 (AI Guide)
- 추천 이유 자동 생성
- 사용자 선택 기반 인터랙션 (Food / Cafe / Experience)

---

##  기술 스택

- **Frontend**: Next.js
- **Backend**: FastAPI
- **Data**: JSON
- **Recommendation Logic**: Rule-based Scoring
- **(확장 예정)**: Generative AI (Claude, GPT)

---

## 프로젝트 구조

```bash
busan-travel-recommender/
├─ backend/
│  ├─ main.py
│  ├─ models.py
│  └─ recommender.py
├─ data/
│  └─ places.json
├─ frontend/
│  ├─ app/
│  ├─ package.json
│  └─ tsconfig.json
└─ .gitignore
