from pydantic import BaseModel
from typing import List


class RecommendationRequest(BaseModel):
    user_type: str
    district: str
    budget: str
    preferred_tags: List[str]


class Place(BaseModel):
    id: int
    name: str
    category: str
    district: str
    budget_level: str
    tags: List[str]
    description: str