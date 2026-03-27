"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    {
      title: "Welcome to Busan",
      subtitle: "Feel the ocean, lights, and stories of Busan.",
      image: "/images/busan1.jpg",
    },
    {
      title: "Discover the City Your Way",
      subtitle: "Ocean views, local food, culture, and night vibes await you.",
      image: "/images/busan2.jpg",
    },
    {
      title: "Walk Through the Streets",
      subtitle: "Experience the real life of Busan.",
      image: "/images/busan3.jpg",
    },
    {
      title: "Start Your Travel Course",
      subtitle: "Choose your language and begin your Busan journey.",
      image: "/images/busan4.jpg",
    },
  ];

  useEffect(() => {
    if (isTransitioning) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2200);

    return () => clearInterval(timer);
  }, [slides.length, isTransitioning]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const moveSlideWithDelay = (direction: "prev" | "next") => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    timeoutRef.current = setTimeout(() => {
      setCurrentSlide((prev) => {
        if (direction === "prev") {
          return (prev - 1 + slides.length) % slides.length;
        }
        return (prev + 1) % slides.length;
      });

      setIsTransitioning(false);
    }, 280);
  };

  const slide = slides[currentSlide];

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundImage: `url(${slide.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        transition: "background-image 0.3s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          pointerEvents: "none",
        }}
      />

      <section
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: "720px",
          opacity: isTransitioning ? 0.88 : 1,
          transform: isTransitioning ? "scale(0.995)" : "scale(1)",
          transition: "all 0.28s ease",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            opacity: 0.7,
            marginBottom: "16px",
          }}
        >
          Busan Travel Guide
        </p>

        <h1
          style={{
            fontSize: "52px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          {slide.title}
        </h1>

        <p
          style={{
            fontSize: "20px",
            opacity: 0.85,
            lineHeight: 1.6,
          }}
        >
          {slide.subtitle}
        </p>

        <div
          style={{
            marginTop: "28px",
            display: "flex",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <button
            type="button"
            onClick={() => moveSlideWithDelay("prev")}
            disabled={isTransitioning}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              cursor: isTransitioning ? "default" : "pointer",
              fontSize: "20px",
              opacity: isTransitioning ? 0.7 : 1,
              transition: "all 0.2s ease",
            }}
            aria-label="Previous slide"
          >
            ←
          </button>

          <button
            type="button"
            onClick={() => moveSlideWithDelay("next")}
            disabled={isTransitioning}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              cursor: isTransitioning ? "default" : "pointer",
              fontSize: "20px",
              opacity: isTransitioning ? 0.7 : 1,
              transition: "all 0.2s ease",
            }}
            aria-label="Next slide"
          >
            →
          </button>
        </div>

        <div
          style={{
            marginTop: "36px",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => !isTransitioning && setCurrentSlide(index)}
              style={{
                width: currentSlide === index ? "36px" : "10px",
                height: "10px",
                borderRadius: "999px",
                backgroundColor:
                  currentSlide === index
                    ? "#fff"
                    : "rgba(255,255,255,0.4)",
                transition: "all 0.3s ease",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => router.push("/language")}
          style={{
            marginTop: "40px",
            padding: "12px 22px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.1)",
            color: "white",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          Start
        </button>
      </section>
    </main>
  );
}