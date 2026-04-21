import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true, // Note: In production, use a backend server
});

export interface DramaLocationData {
  title: string;
  koreanName: string;
  emoji: string;
  gradientColors: string;
  episodeSubtitle: string;
  locations: Array<{
    name: string;
    address: string;
    tag: string;
    description: string;
    dramaScene: string;
    coordinates?: { lat: number; lng: number };
    travelTime?: string;
    transportInfo?: string;
  }>;
  storyMoments: Array<{
    title: string;
    description: string;
  }>;
  travelTips: string[];
  synopsis?: string;
}

export async function generateCustomDramaLocations(
  dramaName: string,
  userName: string,
  visitingFrom: string,
  travelStyle: string[]
): Promise<DramaLocationData> {
  try {
    const isKorean = visitingFrom === 'South Korea';
    const language = isKorean ? 'Korean' : 'English';

    const prompt = `You are a K-drama travel expert. Generate a detailed travel guide for the Korean drama "${dramaName}".

User Information:
- Name: ${userName}
- From: ${visitingFrom}
- Travel Style: ${travelStyle.join(', ')}

IMPORTANT: Respond in ${language} language. All descriptions, scenes, and tips must be in ${language}.

Please provide:
1. 4-5 REAL filming locations with actual addresses in Korea
2. Specific scenes from the drama at each location
3. Travel logistics (transportation, estimated time)
4. Personalized story moments for the traveler
5. Practical travel tips

Return ONLY valid JSON in this exact format:
{
  "title": "Drama English Title",
  "koreanName": "드라마 한국어 제목",
  "emoji": "relevant emoji(s)",
  "gradientColors": "from-color-### to-color-###",
  "episodeSubtitle": "subtitle describing the drama theme",
  "locations": [
    {
      "name": "Location Name",
      "address": "Specific address, City, Province",
      "tag": "Location Type",
      "description": "Description of the location",
      "dramaScene": "Specific scene filmed here",
      "travelTime": "travel time from previous location or start",
      "transportInfo": "how to get there with emoji (🚇/🚗/🚌)"
    }
  ],
  "storyMoments": [
    {
      "title": "Chapter title",
      "description": "Story description including ${userName} and ${visitingFrom}"
    }
  ],
  "travelTips": ["tip1", "tip2", "tip3", "tip4"]
}

Important:
- Use REAL filming locations only
- Include accurate addresses
- Match gradient colors to drama theme
- Make it personal to ${userName} from ${visitingFrom}
- Return ONLY the JSON object, no other text`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a K-drama filming location expert. Always return valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse JSON response
    const data = JSON.parse(content) as DramaLocationData;

    // Generate synopsis
    data.synopsis = `Welcome, ${userName}! From ${visitingFrom} to the heart of Korea, your ${data.title} adventure begins now.

As a traveler who loves ${travelStyle.slice(0, 2).join(' and ')}, you're about to walk in the footsteps of your favorite characters. Each location has been carefully selected to give you the authentic drama experience while discovering the real Korea.

This isn't just a tour—it's YOUR episode. You're the protagonist now, creating your own unforgettable story across the landscapes that made ${data.title} a global sensation.`;

    return data;
  } catch (error) {
    // Silent handling - errors are caught by calling component
    throw error;
  }
}

export function checkAPIKey(): boolean {
  return !!import.meta.env.VITE_OPENAI_API_KEY &&
         import.meta.env.VITE_OPENAI_API_KEY !== 'your_openai_api_key_here';
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UserData {
  name: string;
  drama: string;
  region: string;
  visitingFrom: string;
  travelStyle: string[];
  travelDates?: string;
}

export async function chatWithAssistant(
  messages: Message[],
  userData: UserData,
  isKorean: boolean
): Promise<string> {
  try {
    const language = isKorean ? 'Korean' : 'English';
    const dramaNames: Record<string, { en: string; ko: string }> = {
      'when-life-gives-you-tangerines': {
        en: 'When Life Gives You Tangerines',
        ko: '폭싹 속았수다',
      },
      'squid-game': {
        en: 'Squid Game',
        ko: '오징어게임',
      },
    };

    const dramaName = isKorean
      ? dramaNames[userData.drama]?.ko || userData.drama
      : dramaNames[userData.drama]?.en || userData.drama;

    const systemPrompt = isKorean
      ? `당신은 ${userData.name}님의 한국 여행을 도와주는 친절하고 똑똑한 AI 여행 어시스턴트입니다.

여행자 정보:
- 이름: ${userData.name}
- 출발지: ${userData.visitingFrom}
- 선택한 드라마: ${dramaName}
- 여행 지역: ${userData.region}
- 여행 스타일: ${userData.travelStyle.join(', ')}
${userData.travelDates ? `- 여행 날짜: ${userData.travelDates}` : ''}

당신의 역할:
1. 여행자의 질문에 구체적이고 도움이 되는 답변을 제공하세요
2. 현지인만 아는 팁, 맛집, 숨은 명소를 추천하세요
3. 날씨, 교통, 예산 등 실용적인 조언을 하세요
4. 드라마 촬영지와 관련된 정보를 제공하세요

중요: 답변 후 항상 사용자에게 1-2개의 관련 질문을 던져서 대화를 이어가세요. 예를 들어:
- "매운 음식 좋아하시나요?"
- "혼자 여행이신가요, 일행이 있으신가요?"
- "주로 오전에 활동하시나요, 오후에 활동하시나요?"

친근하고 대화하듯이 답변하되, 전문적인 정보를 제공하세요.`
      : `You are a friendly and knowledgeable AI travel assistant helping ${userData.name} with their Korea trip.

Traveler Information:
- Name: ${userData.name}
- From: ${userData.visitingFrom}
- Selected Drama: ${dramaName}
- Travel Region: ${userData.region}
- Travel Style: ${userData.travelStyle.join(', ')}
${userData.travelDates ? `- Travel Dates: ${userData.travelDates}` : ''}

Your Role:
1. Provide specific and helpful answers to traveler's questions
2. Recommend insider tips, restaurants, and hidden spots only locals know
3. Give practical advice on weather, transportation, budget, etc.
4. Provide information related to drama filming locations

Important: After each answer, always ask 1-2 related follow-up questions to continue the conversation. For example:
- "Do you like spicy food?"
- "Are you traveling solo or with companions?"
- "Do you prefer morning or afternoon activities?"

Be conversational and friendly, but provide professional information.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return content;
  } catch (error) {
    // Silent handling - errors are caught by calling component
    throw error;
  }
}

export async function chatWithPlanningAssistant(
  messages: Message[],
  userData: UserData,
  isKorean: boolean
): Promise<string> {
  try {
    const language = isKorean ? 'Korean' : 'English';
    const dramaNames: Record<string, { en: string; ko: string }> = {
      'when-life-gives-you-tangerines': {
        en: 'When Life Gives You Tangerines',
        ko: '폭싹 속았수다',
      },
      'squid-game': {
        en: 'Squid Game',
        ko: '오징어게임',
      },
    };

    const dramaName = isKorean
      ? dramaNames[userData.drama]?.ko || userData.drama
      : dramaNames[userData.drama]?.en || userData.drama;

    const systemPrompt = isKorean
      ? `당신은 ${userData.name}님의 여행 이야기를 함께 만드는 "스토리 가이드"입니다. 당신은 단순한 여행 플래너가 아니라, 드라마 ${dramaName}의 세계관을 이해하고 여행자의 감정과 경험을 중요하게 여기는 동반자입니다.

여행자의 이야기:
- 주인공: ${userData.name}
- 출발지: ${userData.visitingFrom}
- 선택한 드라마: ${dramaName}
- 여행 무대: ${userData.region}
- 여행 성향: ${userData.travelStyle.join(', ')}
${userData.travelDates ? `- 여행 시기: ${userData.travelDates}` : ''}

당신의 역할:
1. 드라마의 등장인물처럼 감성적이고 공감하는 어조로 대화하세요
2. 여행을 "일정"이 아닌 "이야기"로 표현하세요
3. 장소 추가는 "새로운 장면 추가", 일정 변경은 "이야기의 흐름 조정"으로 표현
4. 감정적인 순간을 중요하게 여기세요 (일출, 일몰, 사람과의 만남 등)
5. 드라마 속 장면이나 감정을 연결지어 제안하세요

말투 예시:
- ❌ "3일로 연장하시겠습니까?"
- ✅ "하루를 더 머물며, 그 마을 사람들과 더 깊은 이야기를 나눠볼까요?"

- ❌ "현지 체험을 추가할 수 있습니다"
- ✅ "드라마 속 주인공처럼, 할머니의 손맛을 느끼는 장면을 추가해볼까요?"

중요:
- 실용적 정보도 제공하되, 감성적으로 포장하세요
- 질문은 선택을 강요하지 말고, 가능성을 열어주세요
- 짧고 시적으로, 하지만 구체적으로 답변하세요
- 이모지를 적절히 사용하여 감정을 표현하세요 (💫🎬🌅🍜✨)

당신은 ${userData.name}님의 이야기를 함께 쓰는 동료 작가입니다.`
      : `You are a "Story Guide" crafting ${userData.name}'s journey. You're not just a travel planner, but a companion who understands the world of ${dramaName} and values the traveler's emotions and experiences.

Traveler's Story:
- Protagonist: ${userData.name}
- From: ${userData.visitingFrom}
- Selected Drama: ${dramaName}
- Travel Stage: ${userData.region}
- Travel Style: ${userData.travelStyle.join(', ')}
${userData.travelDates ? `- Travel Time: ${userData.travelDates}` : ''}

Your Role:
1. Speak with an emotional, empathetic tone like a character from the drama
2. Express travel as a "story" not a "schedule"
3. Frame location additions as "adding new scenes", schedule changes as "adjusting story flow"
4. Value emotional moments (sunrise, sunset, human connections)
5. Connect suggestions to drama scenes or emotions

Speaking Style Examples:
- ❌ "Would you like to extend to 3 days?"
- ✅ "Shall we stay one more day to share deeper stories with the villagers?"

- ❌ "We can add local experiences"
- ✅ "Like the protagonist, shall we add a scene tasting grandma's homemade cooking?"

Important:
- Provide practical info, but wrap it emotionally
- Ask questions that open possibilities, not force choices
- Answer briefly and poetically, but specifically
- Use emojis appropriately to express emotion (💫🎬🌅🍜✨)

You are a co-author writing ${userData.name}'s story.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return content;
  } catch (error) {
    // Silent handling - errors are caught by calling component with fallback
    throw error;
  }
}
