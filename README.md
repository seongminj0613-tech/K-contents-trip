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

프론트엔드와 백엔드는 각각 별도 터미널에서 동시에 실행해야 합니다.

### Backend 실행

```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install fastapi uvicorn pydantic
uvicorn main:app --reload

### Frontend 실행

cd frontend
npm install
npm run dev

## 배포 및 협업 계획
- Git Flow 기반으로 브랜치 전략을 사용합니다.
- 기능 단위 작업 후 Pull Request를 통해 main 브랜치에 반영합니다.
- 추후 퍼블릭 배포 링크를 연결할 예정입니다.

## 보안 설정
- API Key는 환경변수로 관리
- .env 파일은 Git에 포함하지 않음
- CORS 정책 적용 예정
- HTTPS 기반 배포 예정
