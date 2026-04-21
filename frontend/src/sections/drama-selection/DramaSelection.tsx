import { Heart, Skull, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface DramaSelectionProps {
  onSelect: (drama: string) => void;
  onCustomDrama: (dramaName: string) => void;
}

const dramas = [
  {
    id: 'when-life-gives-you-tangerines',
    name: 'When Life Gives You Tangerines',
    koreanName: '폭싹 속았수다',
    icon: Heart,
    color: 'from-orange-400 to-amber-500',
    bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50',
    description: 'Feel the warmth of human connection and island community',
    koreanDescription: '사람과의 따뜻한 유대감과 섬 공동체를 느껴보세요',
    experience: 'Meet local families, share traditional meals, harvest with villagers',
    koreanExperience: '현지 가족 만나기, 전통 식사 나누기, 마을 사람들과 수확하기',
    highlights: ['Local Community', 'Family-run Farms', 'Village Gatherings', 'Seaside Conversations'],
    vibe: '💝 Warmth & Human Connection',
    theme: 'heartwarming',
  },
  {
    id: 'squid-game',
    name: 'Squid Game',
    koreanName: '오징어게임',
    icon: Skull,
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-gradient-to-br from-red-50 to-pink-50',
    description: 'Play childhood games and taste authentic Korean street food',
    koreanDescription: '어린시절 놀이를 즐기고 진짜 한국 길거리 음식을 맛보세요',
    experience: 'Try traditional games, explore food markets, make dalgona candy',
    koreanExperience: '전통 놀이 체험, 먹자골목 탐방, 달고나 만들기 도전',
    highlights: ['Street Food Markets', 'Game Experiences', 'Night Food Tours', 'Traditional Snacks'],
    vibe: '🎮 Games & Street Food',
    theme: 'game-food',
  },
];

export function DramaSelection({ onSelect, onCustomDrama }: DramaSelectionProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customDramaName, setCustomDramaName] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDramaName.trim()) {
      onCustomDrama(customDramaName.trim());
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-black">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full mb-6 border border-white/10">
            <span className="text-sm text-gray-400">🎬 Featured K-Dramas</span>
          </div>
          <h2 className="text-4xl md:text-6xl mb-4 bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
            Choose Your Drama
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Select a legendary K-drama and explore the real filming locations where iconic scenes came to life
          </p>
        </div>

        {/* Drama Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {dramas.map((drama) => {
            const Icon = drama.icon;
            return (
              <button
                key={drama.id}
                onClick={() => {
                  console.log('Button clicked for:', drama.id);
                  onSelect(drama.id);
                }}
                className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border-2 border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl group text-left relative overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <Icon className="w-full h-full" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${drama.color} flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="mb-3">
                    <h3 className="text-3xl text-white mb-1">{drama.name}</h3>
                    <p className="text-lg text-gray-400 mb-3">{drama.koreanName}</p>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-300">{drama.description}</p>
                      <p className="text-sm text-gray-400">{drama.koreanDescription}</p>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs text-gray-400 mb-1">✨ Drama Experience:</p>
                    <p className="text-sm text-gray-200">{drama.experience}</p>
                    <p className="text-sm text-gray-400 mt-1">{drama.koreanExperience}</p>
                  </div>

                  {/* Filming Locations Preview */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300">📍 Famous Locations:</p>
                    <div className="flex flex-wrap gap-2">
                      {drama.highlights.map((location, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-gray-300 border border-white/20"
                        >
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 flex items-center gap-2 text-gray-300 group-hover:gap-4 transition-all">
                    <span className="">Explore this drama</span>
                    <span className="text-xl">→</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Drama Section */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 max-w-2xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl text-white">Want a Different Drama?</h3>
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-gray-300 mb-6">
              Use AI to generate a custom travel guide for ANY K-drama!
            </p>

            {!showCustomInput ? (
              <button
                onClick={() => setShowCustomInput(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Create Custom Drama Tour
                </span>
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="space-y-4">
                <input
                  type="text"
                  value={customDramaName}
                  onChange={(e) => setCustomDramaName(e.target.value)}
                  placeholder="Enter drama name (e.g., Itaewon Class, Extraordinary Attorney Woo)"
                  className="w-full px-6 py-4 bg-white/10 border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white placeholder:text-gray-500"
                  autoFocus
                  required
                />
                <div className="flex gap-3 justify-center">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    Generate with AI ✨
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomDramaName('');
                    }}
                    className="px-8 py-3 bg-white/10 text-gray-300 rounded-full hover:bg-white/20 transition-all border border-white/20"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
            <p className="text-sm text-gray-400">
              ✨ Each drama includes real filming locations, story moments, and personalized experiences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
