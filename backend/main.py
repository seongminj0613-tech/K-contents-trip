from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import RecommendationRequest
from recommender import recommend_places

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Busan Travel Recommendation API is running"}


@app.post("/recommend")
def get_recommendations(request: RecommendationRequest):
    user_input = {
        "user_type": request.user_type,
        "district": request.district,
        "budget": request.budget,
        "preferred_tags": request.preferred_tags
    }

    results = recommend_places(user_input)
    return {"results": results}