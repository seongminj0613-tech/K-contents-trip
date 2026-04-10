"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Preferences = {
  companion: string;
  dietary: string[];
  accessibility: string[];
};

type ResultData = {
  language: string;
  preferences: Preferences | null;
  duration: string;
  style: string[] | string;
};

export default function ResultsPage() {
  const router = useRouter();

  const [resultData, setResultData] = useState<ResultData>({
    language: "",
    preferences: null,
    duration: "",
    style: [],
  });

  const [loading, setLoading] = useState(true);

  // ✅ 추천 상태 (여기 있어야 함)
  const [recommendation, setRecommendation] = useState<any>(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "";
    const savedDuration = localStorage.getItem("duration") || "";
    const savedStyle = localStorage.getItem("style");
    const savedPreferences = localStorage.getItem("preferences");

    let parsedStyle: string[] | string = [];
    let parsedPreferences: Preferences | null = null;

    try {
      if (savedStyle) {
        parsedStyle = JSON.parse(savedStyle);
      }
    } catch {
      parsedStyle = savedStyle || [];
    }

    try {
      if (savedPreferences) {
        parsedPreferences = JSON.parse(savedPreferences);
      }
    } catch {
      parsedPreferences = null;
    }

    setResultData({
      language: savedLanguage,
      preferences: parsedPreferences,
      duration: savedDuration,
      style: parsedStyle,
    });

    setLoading(false);
  }, []);

  // ✅ 추천 생성 함수
  const generateRecommendation = () => {
    setRecommendation({
      place: "Haeundae Beach",
      food: "Grilled Clams",
      cafe: "Ocean View Cafe",
      reason: "Perfect for your selected travel style and duration",
    });
  };

  const styleText = Array.isArray(resultData.style)
    ? resultData.style.length > 0
      ? resultData.style.join(", ")
      : "Not selected"
    : resultData.style || "Not selected";

  const dietaryText =
    resultData.preferences?.dietary?.length
      ? resultData.preferences.dietary.join(", ")
      : "Not selected";

  const accessibilityText =
    resultData.preferences?.accessibility?.length
      ? resultData.preferences.accessibility.join(", ")
      : "None";

  const companionText =
    resultData.preferences?.companion || "Not selected";

  const isDataMissing =
    !resultData.language ||
    !resultData.duration ||
    !resultData.preferences ||
    !resultData.preferences.companion ||
    !resultData.preferences.dietary?.length ||
    !styleText ||
    styleText === "Not selected";

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold">Loading your trip summary...</h1>
          <p className="mt-3 text-gray-400">
            We’re gathering your selections.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
          Result Summary
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Your Busan trip, personalized
        </h1>

        <p className="mt-3 max-w-2xl text-gray-300">
          Here’s a summary of your selections. This page can later connect
          directly to your backend API and AI recommendation flow.
        </p>

        {isDataMissing && (
          <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-200">
            Some selections are missing. Complete all steps for the full result.
          </div>
        )}

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-zinc-900/80 p-6">
            <p className="text-sm text-cyan-400">1. Language</p>
            <h2 className="mt-2 text-2xl font-semibold">
              {resultData.language || "Not selected"}
            </h2>
          </section>

          <section className="rounded-2xl border border-white/10 bg-zinc-900/80 p-6">
            <p className="text-sm text-cyan-400">2. Travel Preferences</p>
            <div className="mt-4 space-y-3 text-sm text-gray-200">
              <div>Companion: {companionText}</div>
              <div>Dietary: {dietaryText}</div>
              <div>Accessibility: {accessibilityText}</div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-zinc-900/80 p-6">
            <p className="text-sm text-cyan-400">3. Duration</p>
            <h2 className="mt-2 text-2xl font-semibold">
              {resultData.duration || "Not selected"}
            </h2>
          </section>

          <section className="rounded-2xl border border-white/10 bg-zinc-900/80 p-6">
            <p className="text-sm text-cyan-400">4. Travel Style</p>
            <h2 className="mt-2 text-2xl font-semibold">{styleText}</h2>
          </section>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => router.push("/style")}
            className="rounded-xl border border-gray-500 px-5 py-3 hover:border-gray-300"
          >
            Back
          </button>

          <button
            onClick={generateRecommendation}
            className="rounded-xl bg-white px-5 py-3 text-black hover:bg-gray-200"
          >
            Generate Recommendation
          </button>
        </div>

        {/* ✅ 추천 결과 */}
        {recommendation && (
          <section className="mt-10 rounded-2xl border border-green-500/30 bg-green-500/10 p-6">
            <h2 className="text-2xl font-semibold text-green-300">
              Recommended Plan
            </h2>

            <div className="mt-4 space-y-2 text-sm text-gray-200">
              <div><strong>Place:</strong> {recommendation.place}</div>
              <div><strong>Food:</strong> {recommendation.food}</div>
              <div><strong>Cafe:</strong> {recommendation.cafe}</div>
              <div><strong>Why:</strong> {recommendation.reason}</div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}