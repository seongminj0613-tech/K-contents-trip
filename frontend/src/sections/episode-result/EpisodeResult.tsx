import { useState, useEffect, useRef } from 'react';
import { Share2, Download, RotateCcw, MapPin, Camera, Heart, Navigation, AlertCircle, Sparkles, DollarSign, Utensils, Film, Send, Bot, User } from 'lucide-react';
import type { UserData } from '@/types/user';
import { MapView } from '@/features/map';
import { TransportGuide } from '@/features/transport';
import { generateCustomDramaLocations, checkAPIKey, chatWithAssistant } from '@/lib/openai';
import { getRegionLocations } from '@/lib/regionData';

interface EpisodeResultProps {
  userData: UserData;
  onReset: () => void;
}

type TabType = 'story' | 'route' | 'places' | 'budget' | 'assistant';

export function EpisodeResult({ userData, onReset }: EpisodeResultProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [episode, setEpisode] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('story');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 한국어 사용 여부 결정
  const isKorean = userData.visitingFrom === 'South Korea';

  const translations = {
    loading: {
      title: isKorean ? 'K-드라마 여행 코스 생성 중...' : 'Crafting Your K-Drama Journey...',
      subtitle: isKorean ? '맞춤형 촬영지와 스토리 생성 중' : 'Creating personalized locations and story moments',
      customTitle: isKorean ? 'AI가 맞춤형 여행 코스를 생성하고 있어요...' : 'AI is generating your custom tour...',
      customSubtitle: isKorean ? '촬영지 정보를 조사하는 중입니다' : 'Researching filming locations',
    },
    result: {
      ready: isKorean ? '여행 코스가 준비되었습니다!' : 'Your Journey is Ready!',
      adventure: isKorean ? '님의 한국 여행' : "'s Adventure in Korea",
      from: isKorean ? '출발' : 'from',
      starring: isKorean ? '주연' : 'starring in',
      yourStory: isKorean ? '당신의 이야기' : 'Your Story',
      mapTitle: isKorean ? '여행 경로 지도' : 'Your Travel Route Map',
      mapSubtitle: isKorean ? '최적화된 드라마 투어 일정' : 'Optimized itinerary for your drama tour',
      openMaps: isKorean ? '구글맵에서 열기' : 'Open in Google Maps',
      getDirections: isKorean ? '길찾기' : 'Get Directions',
      totalDuration: isKorean ? '총 소요 시간' : 'Total Duration',
      totalDistance: isKorean ? '총 거리' : 'Total Distance',
      locations: isKorean ? '장소' : 'Locations',
      stops: isKorean ? '개 장소' : 'Stops',
      days: isKorean ? '1-2일' : '1-2 Days',
      transport: isKorean ? '교통 안내' : 'How to Get Around',
      filmingLocations: isKorean ? '촬영 장소 여행' : 'Your Filming Location Journey',
      visitLocations: isKorean ? '실제 드라마 촬영지를 방문해보세요' : 'Visit these iconic locations from the actual drama',
      dramaScene: isKorean ? '드라마 장면' : 'Drama Scene',
      tipForYou: isKorean ? '당신을 위한 팁' : 'Tip for you',
      storyMoments: isKorean ? '스토리 순간들' : 'Your Story Moments',
      travelTips: isKorean ? '여행 팁' : 'Travel Tips for Your Journey',
      share: isKorean ? '여행 공유' : 'Share Journey',
      download: isKorean ? '일정표 다운로드' : 'Download Itinerary',
      createNew: isKorean ? '새 여행 만들기' : 'Create New Journey',
    }
  };


  useEffect(() => {
    async function loadEpisode() {
      try {
        // If custom drama, use AI generation
        if (userData.drama === 'custom' && userData.customDramaName) {
          // Check if API key is configured
          if (!checkAPIKey()) {
            setError('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
            setIsGenerating(false);
            return;
          }

          const customData = await generateCustomDramaLocations(
            userData.customDramaName,
            userData.name,
            userData.visitingFrom,
            userData.travelStyle
          );
          setEpisode(customData);
        } else {
          // Use pre-defined drama data
          setTimeout(() => {
            setEpisode(generateEpisode(userData));
          }, 2500);
          return;
        }
      } catch (err) {
        console.error('Error generating episode:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate your drama tour. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    }

    loadEpisode();
  }, [userData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleChatSend = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = { role: 'user' as const, content: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await chatWithAssistant(
        [...chatMessages, userMessage],
        userData,
        isKorean
      );

      setChatMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      // Fallback response
      const fallbackResponse = isKorean
        ? '죄송합니다. 지금은 응답할 수 없습니다. 다른 질문을 해주시거나 나중에 다시 시도해주세요.'
        : 'Sorry, I cannot respond right now. Please try another question or try again later.';
      setChatMessages((prev) => [...prev, { role: 'assistant', content: fallbackResponse }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-8 mx-auto">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-3xl mb-4 text-gray-800">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          {!checkAPIKey() && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-8 text-left">
              <h3 className="text-lg mb-3 text-gray-800">How to set up OpenAI API:</h3>
              <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                <li>Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">OpenAI Platform</a></li>
                <li>Create a <code className="bg-gray-200 px-2 py-1 rounded">.env</code> file in your project root</li>
                <li>Add: <code className="bg-gray-200 px-2 py-1 rounded">VITE_OPENAI_API_KEY=your_key_here</code></li>
                <li>Restart the development server</li>
              </ol>
            </div>
          )}
          <button
            onClick={onReset}
            className="px-8 py-4 bg-gradient-to-r from-rose-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isGenerating || !episode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-8 mx-auto"></div>
          <h2 className="text-3xl mb-4 bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
            {userData.drama === 'custom' ? translations.loading.customTitle : translations.loading.title}
          </h2>
          <p className="text-gray-600">
            {userData.drama === 'custom'
              ? `${translations.loading.customSubtitle}${isKorean ? ': ' : ' for '}${userData.customDramaName}...`
              : translations.loading.subtitle}
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'story' as TabType, label: isKorean ? '당신의 이야기' : 'Your Story', icon: '📖' },
    { id: 'route' as TabType, label: isKorean ? '여행 경로' : 'Travel Route', icon: '🗺️' },
    { id: 'places' as TabType, label: isKorean ? '장소 가이드' : 'Places Guide', icon: '📍' },
    { id: 'budget' as TabType, label: isKorean ? '예산 & 팁' : 'Budget & Tips', icon: '💰' },
    { id: 'assistant' as TabType, label: isKorean ? 'AI 도우미' : 'AI Assistant', icon: '🤖' },
  ];

  return (
    <div className="min-h-screen px-4 py-16 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full mb-6 border border-white/10">
            <Heart className="w-5 h-5 text-rose-400 animate-pulse" />
            <span className="text-sm text-gray-300">{translations.result.ready}</span>
          </div>
          <h1 className="text-4xl md:text-6xl mb-4 bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
            {episode.title}
          </h1>
          <p className="text-xl text-gray-400">{userData.name}{translations.result.adventure}</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'story' && (
          <>
            {/* Episode Poster - Cinematic Script Style */}
        <div className="bg-black rounded-3xl mb-12 shadow-2xl border-2 border-white/20 overflow-hidden">
          <div className="relative p-16 text-center">
            {/* Spotlight effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent"></div>

            {/* Content */}
            <div className="relative z-10">
              <div className="text-7xl mb-6">{episode.emoji}</div>

              {/* Script-style presentation */}
              <div className="mb-8">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">{translations.result.starring}</p>
                <h2 className="text-5xl mb-3 text-white font-light tracking-wide">{userData.name}</h2>
                <p className="text-gray-400 text-sm mb-6">{translations.result.from} {userData.visitingFrom}</p>
              </div>

              {/* Drama title - dramatic presentation */}
              <div className="my-8 py-6 border-y border-white/20">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Featured in</p>
                <p className="text-4xl md:text-5xl bg-gradient-to-r from-rose-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-light">
                  {episode.title}
                </p>
              </div>

              <div className="mt-8">
                <p className="text-sm text-gray-400 italic">"{episode.episodeSubtitle}"</p>
              </div>
            </div>
          </div>
        </div>

            {/* Story Synopsis */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12 mb-8">
              <h3 className="text-2xl mb-4 text-white">{translations.result.yourStory}</h3>
              <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                {episode.synopsis}
              </p>
            </div>

            {/* Key Story Moments */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12 mb-8">
              <h3 className="text-2xl mb-6 text-white flex items-center gap-3">
                <Camera className="w-6 h-6 text-rose-400" />
                {translations.result.storyMoments}
              </h3>
              <div className="space-y-6">
                {episode.storyMoments.map((moment: any, index: number) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-6 py-2">
                    <h4 className="text-lg text-white mb-2">{moment.title}</h4>
                    <p className="text-gray-300">{moment.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'route' && (
          <>
            {/* Map View */}
        <MapView
          locations={episode.locations.map((loc: any) => ({
            name: loc.name,
            address: loc.address,
            coordinates: loc.coordinates || { lat: 0, lng: 0 },
          }))}
          dramaColor={episode.gradientColors}
          isKorean={isKorean}
        />

        {/* Transport Guide */}
        <TransportGuide drama={userData.drama} isKorean={isKorean} visitingFrom={userData.visitingFrom} />

        {/* Regional Experience Guide */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12 mb-8">
          <h3 className="text-3xl mb-4 text-white flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-yellow-400" />
            {isKorean ? `${userData.region} 지역 체험 가이드` : `${userData.region} Regional Experience Guide`}
          </h3>
          <p className="text-gray-400 mb-6">
            {isKorean
              ? '이 지역에서 꼭 경험해야 할 특별한 활동들을 소개합니다'
              : 'Discover unique experiences you must try in this region'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 rounded-2xl border border-purple-400/30">
              <div className="text-3xl mb-3">🎬</div>
              <h4 className="text-lg text-white mb-2">{isKorean ? '촬영지 투어' : 'Filming Location Tour'}</h4>
              <p className="text-sm text-gray-300">
                {isKorean
                  ? '드라마 속 장면이 실제로 촬영된 곳을 방문하고 주인공처럼 사진을 찍어보세요'
                  : 'Visit actual filming locations and take photos like the protagonist'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 rounded-2xl border border-orange-400/30">
              <div className="text-3xl mb-3">🍜</div>
              <h4 className="text-lg text-white mb-2">{isKorean ? '로컬 맛집 탐방' : 'Local Food Exploration'}</h4>
              <p className="text-sm text-gray-300">
                {isKorean
                  ? '현지인만 아는 맛집과 전통 시장에서 진짜 한국의 맛을 경험하세요'
                  : 'Experience authentic Korean flavors at local restaurants and traditional markets'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 p-6 rounded-2xl border border-green-400/30">
              <div className="text-3xl mb-3">🚶</div>
              <h4 className="text-lg text-white mb-2">{isKorean ? '산책 & 힐링 코스' : 'Walking & Healing Route'}</h4>
              <p className="text-sm text-gray-300">
                {isKorean
                  ? '드라마 속 감성을 느낄 수 있는 아름다운 산책로와 뷰포인트를 걸어보세요'
                  : 'Walk beautiful routes and viewpoints where you can feel the drama\'s emotions'}
              </p>
            </div>
          </div>
        </div>
          </>
        )}

        {activeTab === 'places' && (
          <>
        {/* Locations by Category */}
        <div className="space-y-8 mb-8">
          {/* Category Header */}
          <div className="text-center mb-8">
            <h3 className="text-3xl mb-2 text-white flex items-center justify-center gap-3">
              <MapPin className="w-7 h-7 text-purple-400" />
              {isKorean ? '카테고리별 여행지' : 'Locations by Category'}
            </h3>
            <p className="text-gray-400 mb-2">{isKorean ? '촬영지, 맛집, 산책 경로로 나누어 소개합니다' : 'Organized by filming locations, restaurants, and walking routes'}</p>
            <p className="text-purple-400 text-sm">
              {isKorean
                ? `📅 권장 일정: ${Math.ceil(episode.locations.length / 2)}-${Math.ceil(episode.locations.length / 1.5)}일`
                : `📅 Recommended Duration: ${Math.ceil(episode.locations.length / 2)}-${Math.ceil(episode.locations.length / 1.5)} Days`}
            </p>
          </div>

          {/* Filming Locations */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12">
            <h4 className="text-2xl mb-6 text-white flex items-center gap-3">
              <Film className="w-6 h-6 text-purple-400" />
              {isKorean ? '🎬 드라마 촬영지' : '🎬 Filming Locations'}
            </h4>
            <p className="text-gray-400 mb-6 text-sm">
              {isKorean
                ? '실제 드라마가 촬영된 장소에서 주인공의 감정을 느껴보세요'
                : 'Feel the protagonist\'s emotions at actual filming locations'}
            </p>

          <div className="space-y-8">
            {episode.locations.map((location: any, index: number) => {
              // Auto-assign day numbers if not provided
              const dayNumber = location.dayNumber || Math.ceil((index + 1) / 2);
              const isNewDay = index === 0 || dayNumber !== (episode.locations[index - 1]?.dayNumber || Math.ceil(index / 2));

              return (
                <div key={index}>
                  {/* Day Header */}
                  {isNewDay && (
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                      <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                        <p className="text-white text-sm font-medium">
                          {isKorean ? `${dayNumber}일차` : `Day ${dayNumber}`}
                        </p>
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                    </div>
                  )}

                  {/* Location Card */}
                  <div className="relative">
                {/* Connection Line */}
                {index < episode.locations.length - 1 && (
                  <div className="absolute left-6 top-20 w-0.5 h-full bg-gradient-to-b from-purple-300 to-transparent"></div>
                )}

                <div className="flex items-start gap-6 p-6 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-all border border-white/10">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${episode.gradientColors} flex items-center justify-center flex-shrink-0 shadow-lg relative z-10`}>
                    <span className="text-white">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-xl text-white mb-1">{location.name}</h4>
                        <p className="text-sm text-purple-400 mb-2">📍 {location.address}</p>
                      </div>
                      <div className={`px-3 py-1 bg-gradient-to-r ${episode.gradientColors} rounded-full`}>
                        <p className="text-xs text-white">{location.tag}</p>
                      </div>
                    </div>

                    {/* Travel Info */}
                    {location.travelTime && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30">
                          ⏱️ {location.travelTime}
                        </span>
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs border border-green-500/30">
                          {location.transportInfo}
                        </span>
                      </div>
                    )}

                    <p className="text-gray-300 mb-3">{location.description}</p>

                    {/* Why Recommended */}
                    {location.whyRecommended && (
                      <div className="bg-yellow-500/10 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-3">
                        <p className="text-sm text-gray-300">
                          <span className="text-yellow-400">⭐ {isKorean ? '추천 이유' : 'Why We Recommend'}: </span>
                          {location.whyRecommended}
                        </p>
                      </div>
                    )}

                    {/* Time Slot */}
                    {location.timeSlot && (
                      <div className="mb-3">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30">
                          🕐 {location.timeSlot}
                        </span>
                      </div>
                    )}

                    <div className="bg-purple-500/10 border-l-4 border-purple-400 p-4 rounded-r-lg mb-3">
                      <p className="text-sm text-gray-300">
                        <span className="text-purple-400">🎬 {translations.result.dramaScene}: </span>
                        {location.dramaScene}
                      </p>
                    </div>
                    {location.regionalExperience && (
                      <div className="bg-blue-500/10 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <p className="text-sm text-gray-300">
                          <span className="text-blue-400">🌏 {isKorean ? '지역 체험' : 'Regional Experience'}: </span>
                          {location.regionalExperience}
                        </p>
                      </div>
                    )}
                    {location.personalizedTip && (
                      <div className="mt-3 bg-rose-500/10 border-l-4 border-rose-400 p-4 rounded-r-lg">
                        <p className="text-sm text-gray-300">
                          <span className="text-rose-400">💡 {translations.result.tipForYou}: </span>
                          {location.personalizedTip}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            );
            })}
          </div>
          </div>

          {/* Restaurant Recommendations */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12">
            <h4 className="text-2xl mb-6 text-white flex items-center gap-3">
              <Utensils className="w-6 h-6 text-orange-400" />
              {isKorean ? '🍜 추천 맛집 & 로컬 음식' : '🍜 Recommended Restaurants & Local Food'}
            </h4>
            <p className="text-gray-400 mb-6 text-sm">
              {isKorean
                ? '현지인들이 사랑하는 맛집과 꼭 먹어봐야 할 음식들'
                : 'Beloved local restaurants and must-try dishes'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Generate restaurant recommendations based on region */}
              {userData.region === 'jeju' ? (
                <>
                  <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 rounded-2xl border border-orange-400/20">
                    <h5 className="text-lg text-white mb-2">🐷 {isKorean ? '제주 흑돼지 전문점' : 'Jeju Black Pork Restaurant'}</h5>
                    <p className="text-sm text-gray-300 mb-3">{isKorean ? '제주 특산 흑돼지 고기를 맛볼 수 있는 현지 맛집' : 'Local favorite for Jeju black pork specialty'}</p>
                    <p className="text-xs text-orange-300">{isKorean ? '💰 예상 비용: 1인당 25,000-35,000원' : '💰 Est. ₩25,000-35,000 per person'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 rounded-2xl border border-orange-400/20">
                    <h5 className="text-lg text-white mb-2">🍊 {isKorean ? '제주 귤 & 해산물 시장' : 'Tangerine & Seafood Market'}</h5>
                    <p className="text-sm text-gray-300 mb-3">{isKorean ? '신선한 귤과 해산물을 직접 골라 먹을 수 있는 전통 시장' : 'Traditional market with fresh tangerines and seafood'}</p>
                    <p className="text-xs text-orange-300">{isKorean ? '💰 예상 비용: 1인당 15,000-25,000원' : '💰 Est. ₩15,000-25,000 per person'}</p>
                  </div>
                </>
              ) : userData.region === 'seoul' ? (
                <>
                  <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 rounded-2xl border border-orange-400/20">
                    <h5 className="text-lg text-white mb-2">🍜 {isKorean ? '광장시장 빈대떡 골목' : 'Gwangjang Market Bindaetteok Alley'}</h5>
                    <p className="text-sm text-gray-300 mb-3">{isKorean ? '전통 녹두전과 마약김밥으로 유명한 서울의 명소' : 'Famous Seoul spot for traditional mung bean pancakes'}</p>
                    <p className="text-xs text-orange-300">{isKorean ? '💰 예상 비용: 1인당 10,000-15,000원' : '💰 Est. ₩10,000-15,000 per person'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 rounded-2xl border border-orange-400/20">
                    <h5 className="text-lg text-white mb-2">🥘 {isKorean ? '한옥 전통 한식당' : 'Hanok Traditional Korean Restaurant'}</h5>
                    <p className="text-sm text-gray-300 mb-3">{isKorean ? '북촌 한옥마을 근처 전통 한식 정식을 맛볼 수 있는 곳' : 'Traditional Korean full-course meal near Bukchon'}</p>
                    <p className="text-xs text-orange-300">{isKorean ? '💰 예상 비용: 1인당 20,000-40,000원' : '💰 Est. ₩20,000-40,000 per person'}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 rounded-2xl border border-orange-400/20">
                    <h5 className="text-lg text-white mb-2">🍲 {isKorean ? '지역 전통 맛집' : 'Regional Traditional Restaurant'}</h5>
                    <p className="text-sm text-gray-300 mb-3">{isKorean ? '그 지역만의 특색있는 향토 음식을 맛볼 수 있는 곳' : 'Taste unique local cuisine of the region'}</p>
                    <p className="text-xs text-orange-300">{isKorean ? '💰 예상 비용: 1인당 15,000-30,000원' : '💰 Est. ₩15,000-30,000 per person'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 rounded-2xl border border-orange-400/20">
                    <h5 className="text-lg text-white mb-2">☕ {isKorean ? '로컬 카페 & 디저트' : 'Local Cafe & Desserts'}</h5>
                    <p className="text-sm text-gray-300 mb-3">{isKorean ? '현지인들이 사랑하는 숨은 카페와 디저트 명소' : 'Hidden cafes and dessert spots loved by locals'}</p>
                    <p className="text-xs text-orange-300">{isKorean ? '💰 예상 비용: 1인당 8,000-15,000원' : '💰 Est. ₩8,000-15,000 per person'}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Walking Routes */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12">
            <h4 className="text-2xl mb-6 text-white flex items-center gap-3">
              <MapPin className="w-6 h-6 text-green-400" />
              {isKorean ? '🚶 추천 산책 & 뷰포인트' : '🚶 Recommended Walking Routes & Viewpoints'}
            </h4>
            <p className="text-gray-400 mb-6 text-sm">
              {isKorean
                ? '드라마 속 감성을 느낄 수 있는 산책 코스와 사진 명소'
                : 'Walking routes and photo spots to feel the drama\'s emotions'}
            </p>

            <div className="space-y-4">
              {userData.region === 'jeju' ? (
                <>
                  <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 p-6 rounded-2xl border border-green-400/20">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">🌅</div>
                      <div className="flex-1">
                        <h5 className="text-lg text-white mb-2">{isKorean ? '성산일출봉 트레킹' : 'Seongsan Sunrise Peak Trek'}</h5>
                        <p className="text-sm text-gray-300 mb-2">{isKorean ? '30분 코스 • 난이도: 중 • 일출 명소' : '30min route • Difficulty: Medium • Sunrise spot'}</p>
                        <p className="text-xs text-green-300">{isKorean ? '새벽 5시 출발 권장 / 운동화 필수' : 'Start at 5AM / Sneakers required'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 p-6 rounded-2xl border border-green-400/20">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">🌊</div>
                      <div className="flex-1">
                        <h5 className="text-lg text-white mb-2">{isKorean ? '올레길 해안 산책' : 'Olle Trail Coastal Walk'}</h5>
                        <p className="text-sm text-gray-300 mb-2">{isKorean ? '1-2시간 코스 • 난이도: 하 • 바다 뷰' : '1-2hr route • Difficulty: Easy • Ocean view'}</p>
                        <p className="text-xs text-green-300">{isKorean ? '편한 신발 착용 / 일몰 시간 추천' : 'Comfortable shoes / Sunset recommended'}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : userData.region === 'seoul' ? (
                <>
                  <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 p-6 rounded-2xl border border-green-400/20">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">🏯</div>
                      <div className="flex-1">
                        <h5 className="text-lg text-white mb-2">{isKorean ? '북촌 한옥마을 골목길' : 'Bukchon Hanok Village Alleys'}</h5>
                        <p className="text-sm text-gray-300 mb-2">{isKorean ? '1시간 코스 • 난이도: 하 • 전통 한옥 뷰' : '1hr route • Difficulty: Easy • Traditional hanok view'}</p>
                        <p className="text-xs text-green-300">{isKorean ? '오전 9-10시 또는 오후 4-5시 추천 (관광객 적은 시간)' : '9-10AM or 4-5PM recommended (less crowded)'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 p-6 rounded-2xl border border-green-400/20">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">🌃</div>
                      <div className="flex-1">
                        <h5 className="text-lg text-white mb-2">{isKorean ? '남산 야경 산책로' : 'Namsan Night View Walk'}</h5>
                        <p className="text-sm text-gray-300 mb-2">{isKorean ? '40분 코스 • 난이도: 중 • 서울 야경' : '40min route • Difficulty: Medium • Seoul night view'}</p>
                        <p className="text-xs text-green-300">{isKorean ? '저녁 7-9시 추천 / 케이블카 이용 가능' : '7-9PM recommended / Cable car available'}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 p-6 rounded-2xl border border-green-400/20">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">🌳</div>
                      <div className="flex-1">
                        <h5 className="text-lg text-white mb-2">{isKorean ? '지역 명소 탐방 코스' : 'Regional Landmark Route'}</h5>
                        <p className="text-sm text-gray-300 mb-2">{isKorean ? '1-2시간 코스 • 난이도: 하-중 • 지역 경관' : '1-2hr route • Difficulty: Easy-Medium • Regional scenery'}</p>
                        <p className="text-xs text-green-300">{isKorean ? '현지 관광 안내소에서 지도 받기' : 'Get map from local tourist center'}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
          </>
        )}

        {activeTab === 'budget' && (
          <>
        {/* Estimated Budget */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12 mb-8">
          <h3 className="text-3xl mb-6 text-white flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-green-400" />
            {isKorean ? '예상 여행 비용' : 'Estimated Travel Budget'}
          </h3>
          <p className="text-gray-400 mb-8">
            {isKorean
              ? `${Math.ceil(episode.locations.length / 2)}-${Math.ceil(episode.locations.length / 1.5)}일 기준 1인당 예상 비용입니다 (항공권 제외)`
              : `Estimated cost per person for ${Math.ceil(episode.locations.length / 2)}-${Math.ceil(episode.locations.length / 1.5)} days (excluding flights)`}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 rounded-2xl border border-blue-400/30">
              <div className="text-3xl mb-3">🚇</div>
              <h4 className="text-lg text-white mb-2">{isKorean ? '교통비' : 'Transportation'}</h4>
              <p className="text-2xl text-blue-300 mb-2">
                {userData.region === 'jeju'
                  ? (isKorean ? '₩80,000-150,000' : '₩80,000-150,000')
                  : (isKorean ? '₩30,000-50,000' : '₩30,000-50,000')
                }
              </p>
              <p className="text-xs text-gray-400">
                {userData.region === 'jeju'
                  ? (isKorean ? '렌터카 또는 택시' : 'Car rental or taxi')
                  : (isKorean ? '지하철, 버스' : 'Metro, bus')
                }
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 rounded-2xl border border-orange-400/30">
              <div className="text-3xl mb-3">🍜</div>
              <h4 className="text-lg text-white mb-2">{isKorean ? '식비' : 'Food'}</h4>
              <p className="text-2xl text-orange-300 mb-2">
                {isKorean ? '₩60,000-120,000' : '₩60,000-120,000'}
              </p>
              <p className="text-xs text-gray-400">
                {isKorean ? '하루 3끼 기준' : 'Based on 3 meals/day'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 rounded-2xl border border-purple-400/30">
              <div className="text-3xl mb-3">🏨</div>
              <h4 className="text-lg text-white mb-2">{isKorean ? '숙박비' : 'Accommodation'}</h4>
              <p className="text-2xl text-purple-300 mb-2">
                {userData.region === 'jeju'
                  ? (isKorean ? '₩100,000-200,000' : '₩100,000-200,000')
                  : (isKorean ? '₩60,000-150,000' : '₩60,000-150,000')
                }
              </p>
              <p className="text-xs text-gray-400">
                {isKorean ? '1박 기준' : 'Per night'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 p-6 rounded-2xl border border-green-400/30">
              <div className="text-3xl mb-3">🎫</div>
              <h4 className="text-lg text-white mb-2">{isKorean ? '입장료/체험' : 'Admission/Activities'}</h4>
              <p className="text-2xl text-green-300 mb-2">
                {isKorean ? '₩40,000-80,000' : '₩40,000-80,000'}
              </p>
              <p className="text-xs text-gray-400">
                {isKorean ? '관광지, 박물관 등' : 'Attractions, museums'}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-8 rounded-2xl border-2 border-yellow-400/40">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl text-white mb-2">{isKorean ? '총 예상 비용' : 'Total Estimated Cost'}</h4>
                <p className="text-sm text-gray-400">
                  {isKorean
                    ? `${Math.ceil(episode.locations.length / 2)}-${Math.ceil(episode.locations.length / 1.5)}일 여행 기준 (1인)`
                    : `For ${Math.ceil(episode.locations.length / 2)}-${Math.ceil(episode.locations.length / 1.5)} days trip (per person)`
                  }
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl text-yellow-300 mb-1">
                  {userData.region === 'jeju'
                    ? (isKorean ? '₩560,000-1,100,000' : '₩560,000-1,100,000')
                    : (isKorean ? '₩380,000-800,000' : '₩380,000-800,000')
                  }
                </p>
                <p className="text-xs text-gray-400">
                  {isKorean ? '약 $420-830 USD' : 'Approx. $420-830 USD'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-500/10 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <p className="text-sm text-gray-300">
              <span className="text-blue-400">💡 {isKorean ? '절약 팁' : 'Money-Saving Tip'}: </span>
              {isKorean
                ? '티머니 카드 구입(₩2,500), 전통 시장 이용, 점심 정식 활용으로 비용을 30% 절약할 수 있습니다'
                : 'Save 30% by getting T-money card (₩2,500), eating at traditional markets, and trying lunch specials'}
            </p>
          </div>
        </div>

        {/* Travel Tips */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12 mb-8">
          <h3 className="text-2xl mb-6 text-white flex items-center gap-3">
            <Navigation className="w-6 h-6 text-purple-400" />
            {translations.result.travelTips}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {episode.travelTips.map((tip: string, index: number) => (
              <div key={index} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                <span className="text-lg">✨</span>
                <p className="text-gray-300">{tip}</p>
              </div>
            ))}
          </div>
        </div>
          </>
        )}

        {activeTab === 'assistant' && (
          <>
        {/* AI Travel Assistant */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12 mb-12">
          <div className="mb-6">
            <h3 className="text-2xl mb-2 text-white flex items-center gap-3">
              <Bot className="w-6 h-6 text-purple-400 animate-pulse" />
              {isKorean ? '추가로 궁금한 점이 있으신가요?' : 'Any Questions About Your Trip?'}
            </h3>
            <p className="text-gray-400 text-sm">
              {isKorean
                ? '여행 계획, 추천 장소, 현지 팁 등 무엇이든 물어보세요!'
                : 'Ask anything about your travel plan, recommendations, local tips, and more!'}
            </p>
          </div>

          {/* Chat Messages */}
          {chatMessages.length > 0 && (
            <div className="bg-black/30 rounded-2xl p-6 mb-4 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-rose-500 to-purple-500 shadow-lg shadow-rose-500/50'
                          : 'bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/50'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`flex-1 ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div
                        className={`inline-block px-4 py-3 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-rose-500 to-purple-500 text-white'
                            : 'bg-white/10 text-gray-100 border border-white/20'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/50 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleChatKeyPress}
              placeholder={
                isKorean
                  ? '여행에 대해 궁금한 점을 물어보세요... (예: 제주도 날씨는 어때요?)'
                  : 'Ask anything about your trip... (e.g., What\'s the weather like in Jeju?)'
              }
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white placeholder:text-gray-500"
              disabled={isChatLoading}
            />
            <button
              onClick={handleChatSend}
              disabled={isChatLoading || !chatInput.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {chatMessages.length === 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setChatInput(isKorean ? '이 지역 날씨는 어때요?' : 'What\'s the weather like in this region?');
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 text-left transition-all"
              >
                💬 {isKorean ? '이 지역 날씨는 어때요?' : 'What\'s the weather like?'}
              </button>
              <button
                onClick={() => {
                  setChatInput(isKorean ? '현지인들이 추천하는 숨은 맛집이 있나요?' : 'Any hidden restaurants locals recommend?');
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 text-left transition-all"
              >
                💬 {isKorean ? '현지인 추천 맛집은?' : 'Local restaurant recommendations?'}
              </button>
              <button
                onClick={() => {
                  setChatInput(isKorean ? '대중교통 이용 팁 알려주세요' : 'Tips for using public transportation?');
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 text-left transition-all"
              >
                💬 {isKorean ? '대중교통 이용 팁은?' : 'Public transport tips?'}
              </button>
              <button
                onClick={() => {
                  setChatInput(isKorean ? '여행 일정을 하루 더 늘리고 싶어요' : 'I want to extend my trip by one more day');
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 text-left transition-all"
              >
                💬 {isKorean ? '일정 연장하고 싶어요' : 'Want to extend my trip'}
              </button>
            </div>
          )}
        </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="flex items-center gap-2 px-8 py-4 bg-white/10 text-gray-300 rounded-full border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
            <Share2 className="w-5 h-5" />
            {translations.result.share}
          </button>
          <button className="flex items-center gap-2 px-8 py-4 bg-white/10 text-gray-300 rounded-full border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
            <Download className="w-5 h-5" />
            {translations.result.download}
          </button>
          <button
            onClick={onReset}
            className={`flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${episode.gradientColors} text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105`}
          >
            <RotateCcw className="w-5 h-5" />
            {translations.result.createNew}
          </button>
        </div>
      </div>
    </div>
  );
}

function generateEpisode(userData: UserData) {
  const isKorean = userData.visitingFrom === 'South Korea';
  const isHeartwarming = userData.drama === 'when-life-gives-you-tangerines';
  const dramaTheme = isHeartwarming ? 'heartwarming' : 'game-food';

  // 선택한 지역에 맞는 장소 가져오기
  const selectedRegion = userData.region || 'seoul';
  const locations = getRegionLocations(selectedRegion, dramaTheme, isKorean);

  const dramaData: Record<string, any> = {
    'when-life-gives-you-tangerines': {
      title: isKorean ? '폭싹 속았수다' : 'When Life Gives You Tangerines',
      emoji: '🍊☀️',
      gradientColors: 'from-orange-400 via-amber-500 to-orange-600',
      episodeSubtitle: isKorean ? '따뜻한 인정 이야기' : 'A Heartwarming Story of Human Connection',
      locations: locations,
      _skip_originalLocations: [
        {
          name: isKorean ? '제주 귤 농장' : 'Jeju Tangerine Farm',
          address: isKorean ? '서귀포시, 제주도' : 'Seogwipo, Jeju Island',
          region: isKorean ? '제주도' : 'Jeju Island',
          tag: isKorean ? '대표 장소' : 'Iconic Location',
          description: isKorean ? '드라마의 따뜻한 이야기가 펼쳐지는 실제 귤 농장을 체험해보세요.' : 'Experience the authentic tangerine farms where the drama\'s heartwarming story unfolds.',
          dramaScene: isKorean ? '등장인물들이 섬 생활의 소박한 즐거움을 발견하는 황금빛 귤밭' : 'The golden tangerine groves where characters discover the simple joys of island life',
          regionalExperience: isKorean ? '🍊 제주 특산물: 신선한 귤 따기, 귤 초콜릿 만들기, 제주 흑돼지 고기 맛보기' : '🍊 Jeju Specialty: Pick fresh tangerines, make tangerine chocolate, taste Jeju black pork',
          personalizedTip: null,
          coordinates: { lat: 33.2541, lng: 126.5601 },
          travelTime: isKorean ? '여기서 시작' : 'Start here',
          transportInfo: isKorean ? '🚗 제주공항에서 30분' : '🚗 30 min from Jeju Airport',
        },
        {
          name: isKorean ? '성산일출봉' : 'Seongsan Ilchulbong (Sunrise Peak)',
          address: isKorean ? '성산읍, 서귀포시, 제주도' : 'Seongsan-eup, Seogwipo, Jeju',
          region: isKorean ? '제주도' : 'Jeju Island',
          tag: isKorean ? '유네스코 세계유산' : 'UNESCO Site',
          description: isKorean ? '화산 분화구를 오르며 바다 위로 펼쳐지는 숨막히는 일출을 감상하세요.' : 'Climb the volcanic crater for breathtaking sunrise views over the ocean.',
          dramaScene: isKorean ? '새로운 시작과 희망을 상징하는 극적인 일출 장면' : 'The dramatic sunrise scenes symbolizing new beginnings and hope',
          regionalExperience: isKorean ? '🌅 성산 지역: 해녀 물질 공연 관람, 싱싱한 해산물 회 맛보기, 일출 사진 촬영' : '🌅 Seongsan Area: Watch haenyeo diving performance, taste fresh seafood, capture sunrise photos',
          personalizedTip: null,
          coordinates: { lat: 33.4589, lng: 126.9426 },
          travelTime: isKorean ? '차로 45분' : '45 min drive',
          transportInfo: isKorean ? '🚗 이전 장소에서 40km' : '🚗 40km from previous location',
        },
        {
          name: isKorean ? '성읍민속마을' : 'Seongeup Folk Village',
          address: isKorean ? '표선면, 서귀포시, 제주도' : 'Pyoseon-myeon, Seogwipo, Jeju',
          region: isKorean ? '제주도' : 'Jeju Island',
          tag: isKorean ? '전통 문화' : 'Traditional Culture',
          description: isKorean ? '전통 초가집을 거닐며 옛 제주를 경험하세요.' : 'Walk through traditional thatched-roof houses and experience old Jeju.',
          dramaScene: isKorean ? '제주의 독특한 문화와 전통을 보여주는 매력적인 마을 장면' : 'The charming village scenes showcasing Jeju\'s unique culture and traditions',
          regionalExperience: isKorean ? '🏡 제주 전통: 돌하르방 만나기, 제주 방언 배우기, 전통 오메기떡 맛보기' : '🏡 Jeju Tradition: Meet dol hareubang statues, learn Jeju dialect, try traditional omegi-tteok',
          personalizedTip: null,
          coordinates: { lat: 33.3949, lng: 126.7967 },
          travelTime: isKorean ? '차로 25분' : '25 min drive',
          transportInfo: isKorean ? '🚗 성산에서 18km' : '🚗 18km from Seongsan',
        },
        {
          name: isKorean ? '명동 & 남산타워' : 'Myeongdong & N Seoul Tower',
          address: isKorean ? '중구, 서울' : 'Jung-gu, Seoul',
          region: isKorean ? '서울' : 'Seoul',
          tag: isKorean ? '도시 명소' : 'Urban Landmark',
          description: isKorean ? '드라마 속 서울의 화려한 도시 생활과 로맨틱한 전망을 경험하세요.' : 'Experience the glamorous Seoul city life and romantic views from the drama.',
          dramaScene: isKorean ? '주인공들이 서울의 밤 풍경을 보며 꿈을 이야기하는 남산타워 장면' : 'N Seoul Tower scenes where characters share their dreams under Seoul\'s night view',
          regionalExperience: isKorean ? '🌃 서울 체험: K-뷰티 쇼핑, 길거리 음식 투어, 남산 케이블카, 사랑의 자물쇠 걸기' : '🌃 Seoul Experience: K-beauty shopping, street food tour, Namsan cable car, love lock ceremony',
          personalizedTip: null,
          coordinates: { lat: 37.5512, lng: 126.9882 },
          travelTime: isKorean ? '제주에서 서울로 이동 (비행기 1시간)' : 'Fly from Jeju to Seoul (1 hour)',
          transportInfo: isKorean ? '✈️ 김포공항 → 🚇 명동역 (지하철 4호선)' : '✈️ Gimpo Airport → 🚇 Myeongdong Station (Line 4)',
        },
        {
          name: isKorean ? '북촌 한옥마을' : 'Bukchon Hanok Village',
          address: isKorean ? '종로구, 서울' : 'Jongno-gu, Seoul',
          region: isKorean ? '서울' : 'Seoul',
          tag: isKorean ? '한국 전통' : 'Korean Tradition',
          description: isKorean ? '전통 한옥 사이를 걸으며 드라마 속 한국의 아름다움을 느껴보세요.' : 'Walk among traditional hanok houses and feel the beauty of Korea from the drama.',
          dramaScene: isKorean ? '전통과 현대가 공존하는 서울의 모습을 보여주는 한옥 골목 장면' : 'Hanok alley scenes showing Seoul where tradition and modernity coexist',
          regionalExperience: isKorean ? '🏯 서울 문화: 한복 체험, 전통 찻집에서 차 마시기, 경복궁 방문, 인사동 구경' : '🏯 Seoul Culture: Hanbok experience, traditional tea house, visit Gyeongbokgung Palace, explore Insadong',
          personalizedTip: null,
          coordinates: { lat: 37.5826, lng: 126.9831 },
          travelTime: isKorean ? '지하철 20분' : '20 min by metro',
          transportInfo: isKorean ? '🚇 3호선 안국역' : '🚇 Anguk Station (Line 3)',
        },
      ],
      storyMoments: isKorean ? [
        {
          title: '1장: 섬으로의 초대',
          description: `${userData.name}님이 ${userData.visitingFrom}에서 아름다운 제주도에 도착합니다. "폭싹 속았수다"의 매력을 경험할 준비를 하세요.`,
        },
        {
          title: '2장: 황금빛 수확',
          description: '햇살 가득한 귤밭을 거닐며, 소박한 섬 생활의 달콤함을 발견하게 됩니다.',
        },
        {
          title: '3장: 일출의 깨달음',
          description: '새벽에 성산봉을 오르며, 인생의 관점을 바꾸는 일출을 목격합니다.',
        },
        {
          title: '4장: 섬의 마법',
          description: '전통 마을에서 깨끗한 해변까지, 제주의 독특한 정신과 따뜻함에 빠져듭니다.',
        },
      ] : [
        {
          title: 'Chapter 1: Island Welcome',
          description: `${userData.name} lands on beautiful Jeju Island from ${userData.visitingFrom}, ready to experience the charm of "When Life Gives You Tangerines."`,
        },
        {
          title: 'Chapter 2: Golden Harvest',
          description: 'Walking through sunlit tangerine orchards, you discover the sweetness of simple island living.',
        },
        {
          title: 'Chapter 3: Sunrise Awakening',
          description: 'Climbing Seongsan Peak at dawn, you witness a sunrise that changes your perspective on life.',
        },
        {
          title: 'Chapter 4: Island Magic',
          description: 'From traditional villages to pristine beaches, you fall in love with Jeju\'s unique spirit and warmth.',
        },
      ],
      travelTips: isKorean ? [
        '수확철(10월-1월)에 귤 농장을 방문하세요',
        '자신의 페이스로 제주를 탐험하려면 렌터카나 스쿠터를 빌리세요',
        '신선한 귤 주스와 귤 초콜릿을 맛보세요',
        '성산 일출을 보려면 일찍 일어나세요 - 그만한 가치가 있습니다!',
      ] : [
        'Visit tangerine farms during harvest season (October-January)',
        'Rent a car or scooter to explore Jeju at your own pace',
        'Try fresh tangerine juice and tangerine chocolate',
        'Wake up early for the Seongsan sunrise - it\'s worth it!',
      ],
    },
    'squid-game': {
      title: isKorean ? '오징어게임' : 'Squid Game',
      emoji: '🦑🎮',
      gradientColors: 'from-red-500 via-pink-500 to-red-600',
      episodeSubtitle: isKorean ? '게임과 먹거리 여정' : 'Games & Street Food Journey',
      locations: locations,
      _skip_originalLocations: [
        {
          name: isKorean ? '동대문디자인플라자 (DDP)' : 'Dongdaemun Design Plaza (DDP)',
          address: isKorean ? '중구, 서울' : 'Jung-gu, Seoul',
          region: isKorean ? '서울' : 'Seoul',
          tag: isKorean ? '현대 서울' : 'Modern Seoul',
          description: isKorean ? '현대 한국을 대표하는 미래지향적 건축물.' : 'A futuristic architectural marvel representing modern Korea.',
          dramaScene: isKorean ? '서울의 현대 건축을 보여주는 VIP 라운지 장면' : 'The VIP lounge scenes showcasing Seoul\'s contemporary architecture',
          regionalExperience: isKorean ? '🌆 동대문 지역: 24시간 쇼핑, 패션 도매시장 구경, 한국 디자인 전시 관람' : '🌆 Dongdaemun Area: 24-hour shopping, fashion wholesale markets, Korean design exhibitions',
          personalizedTip: null,
          coordinates: { lat: 37.5665, lng: 127.0095 },
          travelTime: isKorean ? '여기서 시작' : 'Start here',
          transportInfo: isKorean ? '🚇 지하철 2/4/5호선 동대문역사문화공원역' : '🚇 Metro Line 2/4/5 Dongdaemun History & Culture Park Station',
        },
        {
          name: isKorean ? '성수동 빈티지 동네' : 'Seongsu-dong Vintage Neighborhood',
          address: isKorean ? '성동구, 서울' : 'Seongdong-gu, Seoul',
          region: isKorean ? '서울' : 'Seoul',
          tag: isKorean ? '로컬 문화' : 'Local Culture',
          description: isKorean ? '어린 시절 놀이를 떠올리게 하는 레트로 분위기의 옛 서울 동네.' : 'Old Seoul neighborhood with retro vibes reminiscent of childhood games.',
          dramaScene: isKorean ? '회상 장면에서 나오는 향수 어린 한국 동네 분위기' : 'The nostalgic Korean neighborhood atmosphere from flashback scenes',
          regionalExperience: isKorean ? '☕ 성수동 힙스터: 개성있는 카페, 수제화 거리, 빈티지 상점, 젊은 아티스트들의 공방' : '☕ Seongsu Hipster: Unique cafes, handmade shoe street, vintage shops, young artists\' studios',
          personalizedTip: null,
          coordinates: { lat: 37.5443, lng: 127.0557 },
          travelTime: isKorean ? '지하철 15분' : '15 min metro',
          transportInfo: isKorean ? '🚇 지하철 2호선 성수역' : '🚇 Metro Line 2 Seongsu Station',
        },
        {
          name: isKorean ? '서울 지하철 & 전통 시장' : 'Seoul Subway & Traditional Markets',
          address: isKorean ? '서울 여러 지역' : 'Various locations, Seoul',
          region: isKorean ? '서울' : 'Seoul',
          tag: isKorean ? '도시 체험' : 'Urban Experience',
          description: isKorean ? '등장인물들을 절망으로 몰아넣은 번화한 도시 생활을 경험하세요.' : 'Experience the bustling city life that drove the characters to desperation.',
          dramaScene: isKorean ? '플레이어들이 신비한 카드 게임을 처음 만나는 모집 장면' : 'The recruitment scenes where players first encounter the mysterious card game',
          regionalExperience: isKorean ? '🍜 전통 시장: 남대문 시장에서 쇼핑, 광장시장 빈대떡과 마약김밥, 골목 음식 투어' : '🍜 Traditional Markets: Shopping at Namdaemun, Gwangjang bindaetteok & gimbap, alley food tour',
          personalizedTip: null,
          coordinates: { lat: 37.5665, lng: 126.9910 },
          travelTime: isKorean ? '지하철 20분' : '20 min metro',
          transportInfo: isKorean ? '🚇 남대문 또는 광장시장 방문' : '🚇 Visit Namdaemun or Gwangjang Market',
        },
        {
          name: isKorean ? '대부도' : 'Daebudo Island',
          address: isKorean ? '안산시, 경기도' : 'Ansan, Gyeonggi Province',
          region: isKorean ? '경기도' : 'Gyeonggi Province',
          tag: isKorean ? '주요 촬영지' : 'Main Filming Site',
          description: isKorean ? '여러 오징어게임 장면이 촬영된 해안 지역.' : 'Multiple Squid Game scenes were filmed in this coastal area.',
          dramaScene: isKorean ? '다양한 야외 게임 시퀀스와 최종 오징어게임 경기장' : 'Various outdoor game sequences and the final squid game arena',
          regionalExperience: isKorean ? '🏖️ 대부도: 해안 드라이브, 신선한 해산물 식사, 석양 감상, 갯벌 체험' : '🏖️ Daebudo: Coastal drive, fresh seafood dining, sunset views, tidal flat experience',
          personalizedTip: null,
          coordinates: { lat: 37.1877, lng: 126.5826 },
          travelTime: isKorean ? '서울에서 90분' : '90 min from Seoul',
          transportInfo: isKorean ? '🚌 서울에서 버스 또는 투어 참가' : '🚌 Bus from Seoul or join organized tour',
        },
        {
          name: isKorean ? '석모도 (유리다리 게임섬)' : 'Seongapdo Island',
          address: isKorean ? '인천' : 'Incheon',
          region: isKorean ? '인천' : 'Incheon',
          tag: isKorean ? '게임 장소' : 'Game Location',
          description: isKorean ? '극적인 유리 다리 게임 장면에 사용된 실제 섬.' : 'The actual island used for the dramatic glass bridge game scenes.',
          dramaScene: isKorean ? '플레이어들이 모든 것을 걸고 도전하는 무서운 유리 징검다리 게임' : 'The terrifying glass stepping stones game where players risk everything',
          regionalExperience: isKorean ? '⛵ 인천 섬: 배 타고 섬 여행, 섬마을 탐험, 인천 차이나타운 방문, 자유공원' : '⛵ Incheon Islands: Island hopping by boat, explore island villages, Incheon Chinatown, Jayu Park',
          personalizedTip: null,
          coordinates: { lat: 37.3297, lng: 126.5397 },
          travelTime: isKorean ? '서울에서 2시간' : '2 hours from Seoul',
          transportInfo: isKorean ? '🚌 투어 참가 추천 (배 포함)' : '🚌 Organized tour recommended (includes boat)',
        },
      ],
      storyMoments: isKorean ? [
        {
          title: '1장: 초대장',
          description: `${userData.name}님이 ${userData.visitingFrom}에서 세계적 현상의 실제 장소들을 발견하기 위한 스릴 넘치는 여정을 시작합니다.`,
        },
        {
          title: '2장: 게임의 섬',
          description: '게임이 촬영된 섬들에 서서, 전 세계 수백만 명을 사로잡은 긴장감과 드라마를 느낍니다.',
        },
        {
          title: '3장: 서울의 두 얼굴',
          description: '미래지향적 DDP에서 오래된 골목길까지, 한국의 현대성과 전통 사이의 대비를 목격합니다.',
        },
        {
          title: '4장: 진짜 게임',
          description: '진정한 보물은 한국 문화를 경험하고, 친구를 사귀고, 잊지 못할 추억을 만드는 것임을 발견합니다.',
        },
      ] : [
        {
          title: 'Chapter 1: The Invitation',
          description: `${userData.name} from ${userData.visitingFrom} embarks on a thrilling journey to uncover the real locations behind the global phenomenon.`,
        },
        {
          title: 'Chapter 2: Island of Games',
          description: 'Standing on the islands where games were filmed, you feel the intensity and drama that captivated millions worldwide.',
        },
        {
          title: 'Chapter 3: Seoul\'s Two Faces',
          description: 'From futuristic DDP to old neighborhood streets, you witness the contrast between Korea\'s modernity and tradition.',
        },
        {
          title: 'Chapter 4: The Real Game',
          description: 'You discover that the true treasure is experiencing Korean culture, making friends, and creating unforgettable memories.',
        },
      ],
      travelTips: isKorean ? [
        '전통 시장에서 달고나 만들기에 도전해보세요',
        '썰물 때 촬영지 섬을 방문하면 접근이 더 쉽습니다',
        '서울의 빈티지 동네를 탐험하며 진정한 분위기를 느껴보세요',
        '내부자 지식을 위해 오징어게임 테마 투어에 참여하세요',
      ] : [
        'Try making dalgona candy at traditional markets',
        'Visit the filming islands during low tide for better access',
        'Explore Seoul\'s vintage neighborhoods for authentic vibes',
        'Join a Squid Game-themed tour for insider knowledge',
      ],
    },
  };

  const drama = dramaData[userData.drama];

  // Personalize tips based on travel style
  drama.locations.forEach((location: any, index: number) => {
    if (userData.travelStyle.includes('Photography')) {
      location.personalizedTip = `Perfect spot for ${userData.travelStyle.includes('Photography') ? 'golden hour photography' : 'capturing memories'}!`;
    } else if (userData.travelStyle.includes('Food Explorer') && index === 3) {
      location.personalizedTip = 'Try local street food and traditional snacks near this location!';
    } else if (userData.travelStyle.includes('Cultural Immersion') && index === 0) {
      location.personalizedTip = 'Take time to learn about the historical significance from local guides.';
    }
  });

  // Add personalized travel tips
  if (userData.travelStyle.includes('Solo Travel')) {
    drama.travelTips.push('Join local meetup groups or drama fan tours to meet fellow travelers');
  }
  if (userData.travelStyle.includes('Food Explorer')) {
    drama.travelTips.push('Try the foods featured in the drama at authentic local restaurants');
  }

  const synopsis = isKorean
    ? `환영합니다, ${userData.name}님! ${userData.visitingFrom}에서 한국의 심장부까지, ${drama.title} 모험이 지금 시작됩니다.

${userData.travelStyle.slice(0, 2).join('과 ')}를 사랑하는 여행자로서, 당신은 좋아하는 캐릭터들의 발자취를 따라가게 될 것입니다. 각 장소는 진정한 드라마 경험을 제공하면서 실제 한국을 발견할 수 있도록 신중하게 선정되었습니다.

이것은 단순한 투어가 아닙니다—이것은 당신의 에피소드입니다. 이제 당신이 주인공이 되어, ${drama.title}를 세계적인 센세이션으로 만든 풍경 속에서 잊지 못할 자신만의 이야기를 만들어가세요.

${userData.travelDates ? `당신의 여정은 ${userData.travelDates}에 진행되며, 이 상징적인 장소들을 탐험하기에 완벽한 시기입니다.` : '전에 없던 한국을 경험할 준비를 하세요!'}`
    : `Welcome, ${userData.name}! From ${userData.visitingFrom} to the heart of Korea, your ${drama.title} adventure begins now.

As a traveler who loves ${userData.travelStyle.slice(0, 2).join(' and ')}, you're about to walk in the footsteps of your favorite characters. Each location has been carefully selected to give you the authentic drama experience while discovering the real Korea.

This isn't just a tour—it's YOUR episode. You're the protagonist now, creating your own unforgettable story across the landscapes that made ${drama.title} a global sensation.

${userData.travelDates ? `Your journey takes place during ${userData.travelDates}, the perfect time to explore these iconic locations.` : 'Get ready to experience Korea like never before!'}`;

  return {
    ...drama,
    synopsis,
  };
}
