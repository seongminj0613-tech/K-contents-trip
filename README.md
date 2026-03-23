Busan Travel Recommender

사용자의 여행 유형, 지역, 예산, 선호 태그를 바탕으로 부산 내 맞춤 장소를 추천하는 토이프로젝트입니다.

프로젝트 개요

이 프로젝트는 부산 여행자를 위한 간단한 추천 MVP입니다.  
사용자가 조건을 선택하면, 백엔드에서 더미 데이터(JSON)를 기반으로 규칙 기반 점수화를 수행하고 추천 결과를 반환합니다.

주요 기능

- 여행 유형 선택
- 지역 선택
- 예산 선택
- 선호 태그 선택
- 추천 점수 기반 장소 추천
- 추천 이유(summary) 제공

기술 스택

- Frontend: Next.js
- Backend: FastAPI
- Data: JSON
- Recommendation Logic: Rule-based scoring

폴더 구조

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

## 실행 방법

### Backend 실행
```bash
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload

Backend 주소
http://127.0.0.1:8000

### Frontend 주소
http://localhost:3000

```md
※ 프론트엔드와 백엔드는 각각 별도 터미널에서 동시에 실행해야 합니다.

