import json
import os


def load_places():
    current_dir = os.path.dirname(__file__)
    data_path = os.path.join(current_dir, "..", "data", "places.json")

    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)


def calculate_score(place, user_input):
    score = 0
    reasons = []

    if place["district"] == user_input["district"]:
        score += 30
        reasons.append("선택한 지역과 일치")

    if place["budget_level"] == user_input["budget"]:
        score += 20
        reasons.append("예산 수준이 유사")

    matched_tags = set(place["tags"]) & set(user_input["preferred_tags"])
    if matched_tags:
        tag_score = len(matched_tags) * 15
        score += tag_score
        reasons.append(f"선호 태그 일치: {', '.join(matched_tags)}")

    user_type = user_input["user_type"]

    if user_type == "solo":
        if "혼밥" in place["tags"]:
            score += 10
            reasons.append("솔로 여행자에게 적합한 혼밥 옵션")
        if "포토스팟" in place["tags"]:
            score += 10
            reasons.append("사진 촬영에 적합")

    elif user_type == "family":
        if "유모차접근" in place["tags"]:
            score += 15
            reasons.append("유모차 접근 가능")
        if "가족" in place["tags"]:
            score += 10
            reasons.append("가족 여행에 적합")

    elif user_type == "workation":
        if "조용함" in place["tags"]:
            score += 15
            reasons.append("조용한 업무 환경 제공")
        if "공유오피스" in place["tags"]:
            score += 15
            reasons.append("공유오피스 활용 가능")
        if "장기체류" in place["tags"]:
            score += 10
            reasons.append("장기 체류에 적합")

    return score, reasons


def recommend_places(user_input):
    places = load_places()
    results = []

    for place in places:
        score, reasons = calculate_score(place, user_input)

        if not reasons:
            summary = f"{place['name']}은(는) 기본 조건을 바탕으로 추천됩니다."
        else:
            summary = f"{place['name']}은(는) " + ", ".join(reasons) + " 조건에 적합하여 추천됩니다."

        results.append({
            "id": place["id"],
            "name": place["name"],
            "category": place["category"],
            "district": place["district"],
            "score": score,
            "summary": summary
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:5]