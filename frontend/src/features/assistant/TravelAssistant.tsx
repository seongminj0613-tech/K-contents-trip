import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import type { UserData } from '@/types/user';
import { chatWithAssistant } from '@/lib/openai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface TravelAssistantProps {
  userData: UserData;
  isKorean: boolean;
}

export function TravelAssistant({ userData, isKorean }: TravelAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: isKorean
        ? `안녕하세요 ${userData.name}님! 저는 당신의 ${userData.region} 여행을 도와줄 AI 여행 어시스턴트예요. 궁금한 것이 있으시면 무엇이든 물어보세요!\n\n예를 들어:\n• 날씨가 안 좋은데 뭘 하면 좋을까요?\n• 현지인처럼 즐길 수 있는 팁이 있나요?\n• 이 지역 맛집 추천해주세요\n\n어떤 것이 가장 궁금하세요?`
        : `Hi ${userData.name}! I'm your AI travel assistant for your ${userData.region} trip. Ask me anything!\n\nFor example:\n• What should I do if the weather is bad?\n• Any tips to enjoy like a local?\n• Recommend local restaurants\n\nWhat are you most curious about?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await chatWithAssistant(
        [...messages, userMessage],
        userData,
        isKorean
      );

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: isKorean
          ? '죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.'
          : 'Sorry, an error occurred. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
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

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12 mb-8">
      <h3 className="text-2xl mb-6 text-white flex items-center gap-3">
        <Bot className="w-6 h-6 text-purple-400" />
        {isKorean ? 'AI 여행 어시스턴트' : 'AI Travel Assistant'}
        <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
      </h3>

      {/* Chat Messages */}
      <div className="bg-black/30 rounded-2xl p-6 mb-4 h-96 overflow-y-auto">
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
                    ? 'bg-gradient-to-br from-rose-500 to-purple-500'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500'
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
                      : 'bg-white/10 text-gray-200 border border-white/10'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            isKorean
              ? '무엇이든 물어보세요...'
              : 'Ask me anything...'
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

      <p className="text-xs text-gray-500 mt-3 text-center">
        {isKorean
          ? 'AI가 여행 정보를 바탕으로 맞춤 추천을 제공합니다'
          : 'AI provides personalized recommendations based on your travel info'}
      </p>
    </div>
  );
}
