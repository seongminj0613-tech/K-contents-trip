'use client';

import { useEffect, useState } from 'react';

type RecommendationItem = {
  id: number;
  name: string;
  category: string;
  district: string;
  score: number;
  summary: string;
};

type Step = 'intro' | 'language' | 'form';

export default function Home() {
  const [userType, setUserType] = useState('solo');
  const [district, setDistrict] = useState('해운대');
  const [budget, setBudget] = useState('medium');
  const [selectedTags, setSelectedTags] = useState<string[]>(['혼밥', '포토스팟']);
  const [results, setResults] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>('intro');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: 'Welcome to Busan',
      subtitle: 'Feel the ocean, lights, and stories of Busan.',
      image: '/images/busan1.jpg',
    },
    {
      title: 'Discover the City Your Way',
      subtitle: 'Ocean views, local food, culture, and night vibes await you.',
      image: '/images/busan2.jpg',
    },
    {
      title: 'Walk Through the Streets',
      subtitle: 'Experience the real life of Busan.',
      image: '/images/busan3.jpg',
    },
    {
      title: 'Start Your Travel Course',
      subtitle: 'Choose your language and begin your Busan journey.',
      image: '/images/busan4.jpg',
    },
  ];
  
  const allTags = [
    '혼밥',
    '포토스팟',
    '야간이동',
    '유모차접근',
    '가족',
    '조용함',
    '공유오피스',
    '장기체류',
    '바다뷰'
  ];

  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((item) => item !== tag)
        : [...prev, tag]
    );
  };
  
  useEffect(() => {
    if (step !== 'intro') return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev === slides.length - 1) {
          clearInterval(timer);
          setTimeout(() => {
             setStep('language');
          }, 800);
          return prev;
        }
        return prev + 1;
     });
    }, 2200);

    return () => clearInterval(timer);
  }, [step, slides.length]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setStep('form');
  };

  const handleSubmit = async () => {
    setLoading(true);


    try {
      const response = await fetch(`${API_URL}/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_type: userType,
          district,
          budget,
          preferred_tags: selectedTags,
        }),
      });

      if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
      }


      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('추천 요청 실패:', error);
      alert('백엔드 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };


  if (step === 'intro') {
    const slide = slides[currentSlide];

    return (
      <main
        style={{
          position: 'relative',
          minHeight: '100vh',
          backgroundImage: `url(${slide.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            pointerEvents: 'none',
         }}
        />

        <section
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            maxWidth: '720px',
          }}
        >
          <p
            style={{
             fontSize: '14px',
             letterSpacing: '0.3em',
             textTransform: 'uppercase',
             opacity: 0.7,
             marginBottom: '16px',
             }}
          >

            Busan Travel Guide
          </p>

          <h1 style={{ fontSize: '52px', fontWeight: 'bold', marginBottom: '20px' }}>
            {slide.title}
          </h1>

          <p style={{ fontSize: '20px', opacity: 0.85, lineHeight: 1.6 }}>
            {slide.subtitle}
          </p>

          <div
            style={{
              marginTop: '36px',
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            {slides.map((_, index) => (
              <span
                key={index}
                style={{
                  width: currentSlide === index ? '36px' : '10px',
                  height: '10px',
                  borderRadius: '999px',
                  backgroundColor: currentSlide === index ? '#fff' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.3s ease',
               }}
              />
            ))}
          </div>

          <button
            onClick={() => setStep('language')}
            style={{
              marginTop: '40px',
              padding: '12px 22px',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '15px',
            }}
          >
            Skip Intro
          </button>
        </section>
      </main>
    );
  }

  if (step === 'language') {
    return (
      <main
        style={{
          position: 'relative',
          minHeight: '100vh',
          backgroundColor: '#020617',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
        }}
      >

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            pointerEvents: 'none',
          }}
        />

        <section
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '760px',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            padding: '36px',
            backgroundColor: 'rgba(255,255,255,0.04)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          }}
        >
          <p
            style={{
              textAlign: 'center',
              fontSize: '13px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#7dd3fc',
              marginBottom: '12px',
            }}
          >
            Language Selection
          </p>

          <h1 style={{ textAlign: 'center', fontSize: '42px', fontWeight: 'bold', marginBottom: '14px' }}>
            Choose Your Language
          </h1>

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>
            Please select your preferred language to continue planning your Busan trip.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '16px',
            }}
          >
            {['English', '中文', 'Français', '한국어'].map((language) => (
              <button
                key={language}
                onClick={() => handleLanguageSelect(language)}
                style={{
                  padding: '20px',
                  borderRadius: '18px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {language}
              </button>
            ))}
          </div>
        </section>
      </main>
    ); 
  }

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      <p style={{ marginBottom: '12px', color: '#2563eb', fontWeight: 'bold' }}>
        Selected Language: {selectedLanguage}
      </p>

      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '12px' }}>
        부산 여행 추천
      </h1>

      <p style={{ marginBottom: '32px', color: '#555' }}>
        여행 유형과 선호 조건을 입력하면 부산 내 추천 장소를 보여줍니다.
      </p>

      <section
        style={{
          border: '1px solid #ddd',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
            여행 유형
          </label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            style={{ width: '100%', padding: '10px' }}
          >
            <option value="solo">솔로 여행자</option>
            <option value="family">가족 여행자</option>
            <option value="workation">워케이션</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
            지역
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            style={{ width: '100%', padding: '10px' }}
          >
            <option value="해운대">해운대</option>
            <option value="광안리">광안리</option>
            <option value="서면">서면</option>
            <option value="남포동">남포동</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
            예산
          </label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            style={{ width: '100%', padding: '10px' }}
          >
            <option value="low">낮음</option>
            <option value="medium">중간</option>
            <option value="high">높음</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
            선호 태그
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {allTags.map((tag) => (
              <label
                key={tag}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '20px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  backgroundColor: selectedTags.includes(tag) ? '#e6f3ff' : '#fff',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                  style={{ marginRight: '6px' }}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: '12px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#111',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {loading ? '추천 불러오는 중...' : '추천 받기'}
        </button>
      </section>

      <section>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          추천 결과
        </h2>

        {results.length === 0 ? (
          <p style={{ color: '#666' }}>아직 추천 결과가 없습니다.</p>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {results.map((item) => (
              <div
                key={item.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {item.name}
                </h3>
                <p><strong>카테고리:</strong> {item.category}</p>
                <p><strong>지역:</strong> {item.district}</p>
                <p><strong>점수:</strong> {item.score}</p>
                <p style={{ marginTop: '8px', color: '#444' }}>
                  <strong>추천 이유:</strong> {item.summary}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}