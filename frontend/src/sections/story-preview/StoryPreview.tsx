import { useState, useRef, useEffect } from 'react';
import { ArrowRight, Send, Bot, User, Sparkles, Calendar, MapPin, Clock } from 'lucide-react';
import type { UserData } from '@/types/user';
import { chatWithPlanningAssistant } from '@/lib/openai';
import { getRegionLocations } from '@/lib/regionData';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface StoryPreviewProps {
  userData: UserData;
  onConfirm: (updatedData: UserData) => void;
}

export function StoryPreview({ userData, onConfirm }: StoryPreviewProps) {
  const isKorean = userData.visitingFrom === 'South Korea';

  // Get locations for the itinerary
  const dramaTheme = userData.drama === 'when-life-gives-you-tangerines' ? 'heartwarming' : 'game-food';
  const locations = getRegionLocations(userData.region, dramaTheme, isKorean);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: isKorean
        ? `안녕하세요, ${userData.name}님! ✨\n\n밑의 선택을 통해서 스토리를 조정한 뒤에 추가 입력 사항이 있다면 입력해주세요!`
        : `Hello, ${userData.name}! ✨\n\nUse the options below to adjust your story, then add any additional requests if needed!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [planAdjustments, setPlanAdjustments] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithPlanningAssistant(
        [...messages, userMessage],
        userData,
        isKorean
      );

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Track adjustments
      setPlanAdjustments((prev) => [...prev, input]);
    } catch (error) {
      // Silently handle API errors - fallback system provides responses
      // Provide a fallback response based on common requests
      let fallbackContent = '';
      const lowerInput = input.toLowerCase();

      if (isKorean) {
        if (lowerInput.includes('여유') || lowerInput.includes('천천히')) {
          fallbackContent = `좋은 선택이에요! ✨\n\n하루에 2-3곳만 방문하며 천천히 둘러보는 건 어떨까요? 각 장소에서 최소 2시간씩 머물며, 그곳의 이야기를 충분히 느껴보세요.\n\n점심은 서두르지 말고 현지인들과 함께 천천히 즐기고, 저녁 무렵엔 카페에 앉아 하루를 되돌아보는 시간도 가져보세요.\n\n이렇게 조정하면 어떨까요?`;
        } else if (lowerInput.includes('맛집') || lowerInput.includes('음식') || lowerInput.includes('먹')) {
          fallbackContent = `맛있는 이야기를 더 추가하는군요! 🍜\n\n아침은 전통 시장에서 할머니들의 손맛으로, 점심은 숨은 맛집에서 현지인처럼, 저녁은 분위기 있는 식당에서 하루를 마무리하는 건 어떨까요?\n\n각 식사마다 특별한 이야기가 담겨 있을 거예요.\n\n다른 조정도 원하시나요?`;
        } else if (lowerInput.includes('일출') || lowerInput.includes('일몰') || lowerInput.includes('새벽')) {
          fallbackContent = `특별한 순간을 담고 싶으시군요! 🌅\n\n첫날 새벽, 일출을 보며 여행을 시작하는 건 어떨까요? 고요한 아침, 하늘이 물들어가는 그 순간, 당신만의 이야기가 시작됩니다.\n\n그리고 마지막 날은 일몰을 보며 여정을 마무리해요. 따뜻한 빛 속에서 지난 날들을 추억하는 시간이 될 거예요.\n\n이런 장면들을 넣어볼까요?`;
        } else {
          fallbackContent = `${input}에 대해 생각해봤어요. ✨\n\n당신의 이야기를 그렇게 만들어가는 것도 멋질 것 같아요! 조금 더 구체적으로 말씀해주시면, 더 자세히 도와드릴 수 있어요.\n\n예를 들어:\n• 며칠로 조정하고 싶으신가요?\n• 어떤 장면을 추가하고 싶으신가요?\n• 어떤 분위기로 바꾸고 싶으신가요?\n\n편하게 말씀해주세요!`;
        }
      } else {
        if (lowerInput.includes('slow') || lowerInput.includes('leisurely') || lowerInput.includes('relax')) {
          fallbackContent = `Great choice! ✨\n\nHow about visiting just 2-3 places per day? Spend at least 2 hours at each location, truly feeling the story of each place.\n\nTake your time with lunch alongside locals, and in the evening, sit at a cafe to reflect on the day.\n\nShall we adjust it this way?`;
        } else if (lowerInput.includes('food') || lowerInput.includes('restaurant') || lowerInput.includes('eat')) {
          fallbackContent = `Adding more delicious stories! 🍜\n\nBreakfast at traditional markets with grandmas' cooking, lunch at hidden local spots, dinner at atmospheric restaurants to end each day.\n\nEvery meal will have its own special story.\n\nAny other adjustments?`;
        } else if (lowerInput.includes('sunrise') || lowerInput.includes('sunset') || lowerInput.includes('dawn')) {
          fallbackContent = `You want to capture special moments! 🌅\n\nHow about starting your journey at dawn with sunrise? In that quiet morning, as the sky colors, your story begins.\n\nEnd the last day watching sunset, reminiscing about your journey in warm light.\n\nShall we add these scenes?`;
        } else {
          fallbackContent = `I've thought about "${input}". ✨\n\nThat sounds like a wonderful way to shape your story! Tell me more specifically, and I can help you better.\n\nFor example:\n• How many days would you like?\n• What scenes would you like to add?\n• What atmosphere are you looking for?\n\nFeel free to share!`;
        }
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: fallbackContent,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setPlanAdjustments((prev) => [...prev, input]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleConfirm = () => {
    // Pass adjusted plan to parent
    onConfirm(userData);
  };

  const dramaInfo = {
    'when-life-gives-you-tangerines': {
      title: isKorean ? '폭싹 속았수다' : 'When Life Gives You Tangerines',
      emoji: '🍊☀️',
      theme: isKorean ? '따뜻한 인정 이야기' : 'Heartwarming Human Connection',
    },
    'squid-game': {
      title: isKorean ? '오징어게임' : 'Squid Game',
      emoji: '🦑🎮',
      theme: isKorean ? '게임과 먹거리 여정' : 'Games & Street Food Journey',
    },
  };

  const currentDrama = dramaInfo[userData.drama as keyof typeof dramaInfo] || dramaInfo['when-life-gives-you-tangerines'];

  // Generate story narrative
  const generateStoryNarrative = () => {
    const isHeartwarming = userData.drama === 'when-life-gives-you-tangerines';

    if (isKorean) {
      if (isHeartwarming) {
        return `${userData.name}님, 당신은 ${userData.visitingFrom}에서 ${userData.region}로 떠나는 특별한 여정의 주인공입니다.

${userData.region === 'jeju' ? '제주의 황금빛 귤밭 사이로' : userData.region === 'seoul' ? '서울의 한옥 골목을 거닐며' : `${userData.region}의 정겨운 마을을 누비며`}, 당신은 드라마 속 주인공처럼 따뜻한 사람들을 만나게 됩니다.

${userData.travelStyle.includes('Cultural Immersion') ? '현지 사람들과 깊이 교류하고 싶다는 당신의 마음이 이 여정을 더욱 특별하게 만들 거예요.' : userData.travelStyle.includes('Food Explorer') ? '음식을 통해 그들의 삶과 이야기를 나누며, 진짜 한국을 맛보게 될 거예요.' : '천천히, 여유롭게 그들의 일상 속으로 들어가 보세요.'}

이건 단순한 여행이 아닙니다. 당신이 주인공이 되어 써내려가는, 따뜻한 인연의 이야기입니다.`;
      } else {
        return `${userData.name}님, 당신은 ${userData.visitingFrom}에서 ${userData.region}로 떠나는 스릴 넘치는 여정의 주인공입니다.

${userData.region === 'seoul' ? '서울의 활기찬 거리와 야시장을' : `${userData.region}의 숨겨진 맛집들을`} 누비며, 당신은 드라마 속 주인공처럼 새로운 도전과 맛의 세계를 경험하게 됩니다.

${userData.travelStyle.includes('Food Explorer') ? '길거리 음식부터 전통 시장의 숨은 맛집까지, 먹방 여정이 펼쳐집니다.' : userData.travelStyle.includes('Adventure') ? '게임처럼 즐기는 여행, 매 순간이 새로운 미션이 될 거예요.' : '도시의 숨결을 느끼며, 현지인만 아는 특별한 장소들을 발견하게 될 거예요.'}

이건 단순한 관광이 아닙니다. 당신이 주인공이 되어 만들어가는, 짜릿한 모험의 이야기입니다.`;
      }
    } else {
      if (isHeartwarming) {
        return `${userData.name}, you are the protagonist of a special journey from ${userData.visitingFrom} to ${userData.region}.

${userData.region === 'jeju' ? 'Walking through golden tangerine groves' : userData.region === 'seoul' ? 'Wandering Seoul\'s hanok alleys' : `Exploring ${userData.region}'s charming villages`}, you'll meet warm-hearted people just like the drama's protagonist.

${userData.travelStyle.includes('Cultural Immersion') ? 'Your desire for deep connections with locals will make this journey truly special.' : userData.travelStyle.includes('Food Explorer') ? 'Through food, you\'ll share their lives and stories, tasting the real Korea.' : 'Slowly, leisurely step into their daily lives.'}

This isn't just a trip. It's a heartwarming story of connections, with you as the protagonist.`;
      } else {
        return `${userData.name}, you are the protagonist of a thrilling journey from ${userData.visitingFrom} to ${userData.region}.

${userData.region === 'seoul' ? 'Navigating Seoul\'s vibrant streets and night markets' : `Discovering ${userData.region}'s hidden food gems`}, you'll experience new challenges and flavors like the drama's protagonist.

${userData.travelStyle.includes('Food Explorer') ? 'From street food to hidden market treasures, a foodie adventure awaits.' : userData.travelStyle.includes('Adventure') ? 'Travel like a game - every moment becomes a new mission.' : 'Feel the city\'s pulse and discover special places only locals know.'}

This isn't just sightseeing. It's an exciting adventure story, with you as the protagonist.`;
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-black">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{currentDrama.emoji}</div>
          <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent font-light">
            {isKorean ? '당신의 이야기가 시작됩니다' : 'Your Story Begins'}
          </h2>
          <p className="text-lg text-gray-400">
            {isKorean
              ? '스토리 가이드와 함께 당신만의 드라마를 만들어보세요'
              : 'Create your own drama with your Story Guide'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Story Itinerary */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 max-h-[700px] overflow-y-auto">
            <h3 className="text-2xl mb-6 text-white flex items-center gap-3">
              <Calendar className="w-6 h-6 text-rose-400" />
              {isKorean ? '당신의 이야기' : 'Your Story'}
            </h3>

            {/* Trip Overview */}
            <div className="space-y-4 mb-8">
              <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-gray-400 mb-1">{isKorean ? '여행자' : 'Traveler'}</p>
                <p className="text-white text-lg">{userData.name}</p>
                <p className="text-gray-400 text-sm">{isKorean ? '출발지' : 'From'}: {userData.visitingFrom}</p>
              </div>

              <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-gray-400 mb-1">{isKorean ? '드라마 테마' : 'Drama Theme'}</p>
                <p className="text-white text-lg">{currentDrama.title}</p>
                <p className="text-gray-400 text-sm">{currentDrama.theme}</p>
              </div>

              <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-gray-400 mb-1">{isKorean ? '여행 지역' : 'Region'}</p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <p className="text-white text-lg capitalize">{userData.region}</p>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-gray-400 mb-1">{isKorean ? '여행 스타일' : 'Travel Style'}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {userData.travelStyle.map((style, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-rose-500 to-purple-500 rounded-full text-white text-sm"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>

              {userData.travelDates && (
                <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-400 mb-1">{isKorean ? '여행 날짜' : 'Travel Dates'}</p>
                  <p className="text-white text-lg">{userData.travelDates}</p>
                </div>
              )}

              {planAdjustments.length > 0 && (
                <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-400 mb-2">{isKorean ? '조정 내역' : 'Adjustments Made'}</p>
                  <ul className="space-y-1">
                    {planAdjustments.slice(-3).map((adjustment, index) => (
                      <li key={index} className="text-sm text-gray-300">• {adjustment}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Story Narrative */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <h4 className="text-xl text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                {isKorean ? '당신의 여정' : 'Your Journey'}
              </h4>

              <div className="bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-rose-500/10 p-6 rounded-2xl border border-yellow-400/30 mb-6">
                <p className="text-gray-200 leading-relaxed whitespace-pre-line text-sm">
                  {generateStoryNarrative()}
                </p>
              </div>

              <div className="bg-black/30 p-4 rounded-xl border border-white/10 mb-4">
                <p className="text-sm text-gray-400 text-center">
                  {isKorean
                    ? '💫 저는 당신의 여정을 함께하는 스토리 가이드입니다. 우측에서 원하는 스타일을 이야기해주시면 당신만의 이야기로 다시 써드릴게요.'
                    : '💫 I\'m your Story Guide on this journey. Share your preferred style on the right, and I\'ll rewrite it as your unique story.'}
                </p>
              </div>
            </div>

            {/* Itinerary Details */}
            <div className="mt-6">
              <h4 className="text-lg text-gray-400 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                {isKorean ? '📋 여행 일정 참고' : '📋 Itinerary Reference'}
              </h4>
              <p className="text-xs text-gray-500 mb-4">
                {isKorean ? '아래 일정을 참고하세요. 스토리 가이드와 대화하며 언제든 수정 가능합니다.' : 'Refer to the schedule below. You can modify it anytime by chatting with your Story Guide.'}
              </p>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {locations.map((location: any, index: number) => {
                  const dayNumber = location.dayNumber || Math.ceil((index + 1) / 2);
                  const isNewDay = index === 0 || dayNumber !== (locations[index - 1]?.dayNumber || Math.ceil(index / 2));

                  return (
                    <div key={index}>
                      {/* Day Header */}
                      {isNewDay && (
                        <div className="mb-2 flex items-center gap-2">
                          <div className="px-2 py-1 bg-gradient-to-r from-rose-500 to-purple-500 rounded-full">
                            <p className="text-white text-xs">
                              {isKorean ? `${dayNumber}일차` : `Day ${dayNumber}`}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Location Card - Compact */}
                      <div className="bg-black/20 p-3 rounded-lg border border-white/5 ml-3">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs">{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-white text-sm mb-1 truncate">{location.name}</h5>
                            <p className="text-xs text-gray-400">
                              {location.timeSlot && (
                                <span className="mr-2">
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {location.timeSlot}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI Story Guide Chat */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
            <h3 className="text-2xl mb-6 text-white flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              {isKorean ? '스토리 가이드' : 'Story Guide'}
              <Bot className="w-5 h-5 text-purple-400 animate-pulse" />
            </h3>

            {/* Chat Messages */}
            <div className="bg-black/30 rounded-2xl p-6 mb-4 h-[400px] overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message, index) => (
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
                          : 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-400/50'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-white" />
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
                            : 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 text-gray-100 border border-yellow-400/20'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-400/50 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Selection Buttons */}
            <div className="mb-4">
              <p className="text-sm text-gray-300 mb-3">
                {isKorean ? '✨ 스토리를 조정해보세요' : '✨ Adjust Your Story'}
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => setInput(isKorean ? '힐링 중심으로 여유롭게 조정해주세요' : 'Adjust for a more relaxing, healing-focused experience')}
                  className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-teal-500/20 hover:from-green-500/30 hover:to-teal-500/30 border border-green-400/30 rounded-lg text-sm text-green-300 transition-all text-center"
                >
                  🌿 {isKorean ? '힐링 중심' : 'Healing Focus'}
                </button>
                <button
                  onClick={() => setInput(isKorean ? '맛집과 음식 체험을 더 추가해주세요' : 'Add more food and restaurant experiences')}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 border border-orange-400/30 rounded-lg text-sm text-orange-300 transition-all text-center"
                >
                  🍜 {isKorean ? '음식 추가' : 'More Food'}
                </button>
                <button
                  onClick={() => setInput(isKorean ? '감성적인 순간들을 더 강화해주세요' : 'Enhance emotional and meaningful moments')}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-400/30 rounded-lg text-sm text-pink-300 transition-all text-center"
                >
                  💫 {isKorean ? '감성 강화' : 'More Emotion'}
                </button>
                <button
                  onClick={() => setInput(isKorean ? '일정을 더 여유롭게 조정해주세요' : 'Make the schedule more relaxed and flexible')}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-400/30 rounded-lg text-sm text-blue-300 transition-all text-center"
                >
                  ⏰ {isKorean ? '일정 여유' : 'More Time'}
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 my-4"></div>

              {/* Direct Input Label */}
              <p className="text-sm text-gray-400 mb-3">
                {isKorean ? '💬 원하는 스타일을 직접 입력해보세요 (선택)' : '💬 Or type your own request (optional)'}
              </p>
            </div>

            {/* Input Area */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isKorean
                    ? '예: 카페 투어를 추가해주세요...'
                    : 'e.g., Add a cafe tour...'
                }
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white placeholder:text-gray-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              className="w-full px-8 py-4 bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 text-white rounded-xl shadow-2xl hover:shadow-rose-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
            >
              <span className="text-lg font-light">
                {isKorean ? '이야기 시작하기 ✨' : 'Begin Your Story ✨'}
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              {isKorean
                ? '준비되면 언제든지 당신의 여행을 시작하세요'
                : 'Start your journey whenever you\'re ready'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
