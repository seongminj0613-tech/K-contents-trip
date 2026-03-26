'use client';

import { useState } from 'react';

type RecommendationItem = {
  id: number;
  name: string;
  category: string;
  district: string;
  score: number;
  summary: string;
};

export default function Home() {
  const [userType, setUserType] = useState('solo');
  const [district, setDistrict] = useState('해운대');
  const [budget, setBudget] = useState('medium');
  const [selectedTags, setSelectedTags] = useState<string[]>(['혼밥', '포토스팟']);
  const [results, setResults] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(false);

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

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '12px' }}>
        부산 여행 추천 토이프로젝트
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