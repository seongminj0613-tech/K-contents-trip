import { MapPin, Mountain, Waves, Building2, TreePine, Landmark, ArrowLeft } from 'lucide-react';

interface RegionSelectionProps {
  onSelect: (region: string) => void;
  onBack: () => void;
  dramaTheme?: string;
}

const regions = [
  {
    id: 'seoul',
    name: 'Seoul',
    koreanName: '서울',
    icon: Building2,
    color: 'from-blue-500 to-indigo-600',
    description: 'Modern city life, traditional palaces, and vibrant culture',
    koreanDescription: '현대적 도시 생활, 전통 궁궐, 그리고 활기찬 문화',
    dramaExperience: {
      heartwarming: 'Visit family-run hanok guesthouses, meet local artisans, share tea',
      'game-food': 'Explore night food markets, try street games, taste pojangmacha snacks',
    },
    koreanDramaExperience: {
      heartwarming: '가족이 운영하는 한옥 게스트하우스 방문, 현지 장인 만나기, 차 나누기',
      'game-food': '야시장 탐방, 길거리 게임 체험, 포장마차 간식 맛보기',
    },
    highlights: ['Gangnam', 'Hongdae', 'Myeongdong', 'Hanok Villages'],
  },
  {
    id: 'jeju',
    name: 'Jeju Island',
    koreanName: '제주도',
    icon: Waves,
    color: 'from-teal-400 to-cyan-500',
    description: 'Volcanic landscapes, beaches, and island paradise',
    koreanDescription: '화산 풍경, 해변, 그리고 섬 낙원',
    dramaExperience: {
      heartwarming: 'Work with haenyeo divers, stay with local families, share island stories',
      'game-food': 'Visit seafood markets, try black pork BBQ, explore food villages',
    },
    koreanDramaExperience: {
      heartwarming: '해녀 할머니와 함께 일하기, 현지 가정 스테이, 섬 이야기 나누기',
      'game-food': '해산물 시장 방문, 흑돼지 구이 맛보기, 맛집 마을 탐방',
    },
    highlights: ['Seongsan Peak', 'Beaches', 'Lava Caves', 'Tangerine Farms'],
  },
  {
    id: 'busan',
    name: 'Busan',
    koreanName: '부산',
    icon: Waves,
    color: 'from-orange-400 to-red-500',
    description: 'Coastal city with beaches, mountains, and seafood',
    koreanDescription: '해변, 산, 그리고 해산물이 있는 해안 도시',
    dramaExperience: {
      heartwarming: 'Connect with fishing village families, share meals at local homes',
      'game-food': 'Explore Jagalchi fish market, try ssiat hotteok, night food streets',
    },
    koreanDramaExperience: {
      heartwarming: '어촌 마을 가족과 교류, 현지 가정에서 식사 나누기',
      'game-food': '자갈치 시장 탐방, 씨앗호떡 맛보기, 야시장 음식 거리',
    },
    highlights: ['Haeundae Beach', 'Gamcheon Village', 'Markets', 'Temples'],
  },
  {
    id: 'gangwon',
    name: 'Gangwon Province',
    koreanName: '강원도',
    icon: Mountain,
    color: 'from-green-500 to-emerald-600',
    description: 'Mountains, ski resorts, and natural beauty',
    koreanDescription: '산, 스키장, 그리고 자연의 아름다움',
    dramaExperience: {
      heartwarming: 'Stay at mountain village homes, learn from rural communities',
      'game-food': 'Try mountain vegetable dishes, visit ski resort food courts, corn BBQ',
    },
    koreanDramaExperience: {
      heartwarming: '산골 마을 민박 체험, 시골 공동체에서 배우기',
      'game-food': '산나물 요리 맛보기, 스키장 푸드코트, 옥수수 구이',
    },
    highlights: ['Nami Island', 'Pyeongchang', 'East Sea Coast', 'Mountain Trails'],
  },
  {
    id: 'gyeonggi',
    name: 'Gyeonggi Province',
    koreanName: '경기도',
    icon: TreePine,
    color: 'from-lime-500 to-green-600',
    description: 'DMZ, folk villages, and Seoul suburbs',
    koreanDescription: 'DMZ, 민속촌, 그리고 서울 근교',
    dramaExperience: {
      heartwarming: 'Experience folk village life, connect with traditional craftspeople',
      'game-food': 'Play traditional games at folk village, try Suwon galbi, market snacks',
    },
    koreanDramaExperience: {
      heartwarming: '민속촌 생활 체험, 전통 장인들과 교류',
      'game-food': '민속촌에서 전통 놀이, 수원 갈비 맛보기, 시장 간식',
    },
    highlights: ['DMZ Tour', 'Suwon Fortress', 'Korean Folk Village', 'Theme Parks'],
  },
  {
    id: 'gyeongsang',
    name: 'Gyeongsang Province',
    koreanName: '경상도',
    icon: Landmark,
    color: 'from-purple-500 to-pink-600',
    description: 'Ancient temples, traditional culture, and history',
    koreanDescription: '고대 사찰, 전통 문화, 그리고 역사',
    dramaExperience: {
      heartwarming: 'Temple stay with monks, visit Andong traditional families, cultural exchange',
      'game-food': 'Try Andong jjimdak, explore historic market foods, makgeolli tasting',
    },
    koreanDramaExperience: {
      heartwarming: '스님들과 템플스테이, 안동 전통 가문 방문, 문화 교류',
      'game-food': '안동찜닭 맛보기, 전통시장 음식 탐방, 막걸리 시음',
    },
    highlights: ['Gyeongju', 'Andong', 'Historic Sites', 'Traditional Villages'],
  },
];

export function RegionSelection({ onSelect, onBack, dramaTheme = 'heartwarming' }: RegionSelectionProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-black">
      <div className="max-w-6xl mx-auto w-full">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Drama Selection
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full mb-6 border border-white/10">
            <MapPin className="w-5 h-5 text-rose-400" />
            <span className="text-sm text-gray-400">📍 Choose Your Region</span>
          </div>
          <h2 className="text-4xl md:text-6xl mb-4 bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
            Select a Region
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Explore K-drama filming locations across different regions of Korea
          </p>
        </div>

        {/* Region Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region) => {
            const Icon = region.icon;
            return (
              <button
                key={region.id}
                onClick={() => onSelect(region.id)}
                className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border-2 border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl group text-left"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${region.color} flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="mb-3">
                  <h3 className="text-2xl text-white mb-1">{region.name}</h3>
                  <p className="text-lg text-gray-400 mb-3">{region.koreanName}</p>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-300">{region.description}</p>
                    <p className="text-sm text-gray-400">{region.koreanDescription}</p>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-xs text-gray-400 mb-1">
                    {dramaTheme === 'heartwarming' ? '💝 Heartwarming Experience:' : '🎮 Game & Food Experience:'}
                  </p>
                  <p className="text-sm text-gray-200">
                    {typeof region.dramaExperience === 'object'
                      ? region.dramaExperience[dramaTheme as keyof typeof region.dramaExperience]
                      : region.dramaExperience}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {typeof region.koreanDramaExperience === 'object'
                      ? region.koreanDramaExperience[dramaTheme as keyof typeof region.koreanDramaExperience]
                      : region.koreanDramaExperience}
                  </p>
                </div>

                {/* Highlights */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Popular Areas:</p>
                  <div className="flex flex-wrap gap-2">
                    {region.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300 border border-white/20"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6 flex items-center gap-2 text-gray-300 group-hover:gap-4 transition-all">
                  <span>Explore {region.name}</span>
                  <span className="text-xl">→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
