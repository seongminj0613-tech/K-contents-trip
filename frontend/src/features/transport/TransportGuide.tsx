import { Bus, Car, Train, Plane, DollarSign } from 'lucide-react';

interface TransportGuideProps {
  drama: string;
  isKorean?: boolean;
  visitingFrom?: string;
}

export function TransportGuide({ drama, isKorean = false, visitingFrom = 'United States' }: TransportGuideProps) {
  const isJeju = drama === 'when-life-gives-you-tangerines';

  // Flight information based on country
  const getFlightInfo = () => {
    if (visitingFrom === 'South Korea') {
      return {
        duration: isKorean ? '1시간' : '1 hour',
        price: isKorean ? '50,000-150,000원' : '$50-150 USD',
        airlines: isKorean ? '대한항공, 제주항공, 진에어' : 'Korean Air, Jeju Air, Jin Air',
      };
    } else if (visitingFrom === 'United States' || visitingFrom === 'Canada') {
      return {
        duration: isKorean ? '서울 경유 (총 14-16시간)' : 'Via Seoul (14-16 hours total)',
        price: isKorean ? '$800-1500 USD' : '$800-1500 USD',
        airlines: isKorean ? '대한항공, 아시아나, 유나이티드' : 'Korean Air, Asiana, United',
      };
    } else if (visitingFrom === 'Japan') {
      return {
        duration: isKorean ? '2-3시간' : '2-3 hours',
        price: isKorean ? '$150-300 USD' : '$150-300 USD',
        airlines: isKorean ? '대한항공, 일본항공, 제주항공' : 'Korean Air, JAL, Jeju Air',
      };
    } else if (visitingFrom === 'China' || visitingFrom === 'Taiwan') {
      return {
        duration: isKorean ? '2-4시간' : '2-4 hours',
        price: isKorean ? '$200-400 USD' : '$200-400 USD',
        airlines: isKorean ? '대한항공, 중국국제항공, 아시아나' : 'Korean Air, Air China, Asiana',
      };
    } else {
      return {
        duration: isKorean ? '서울 경유' : 'Via Seoul',
        price: isKorean ? '$500-1200 USD' : '$500-1200 USD',
        airlines: isKorean ? '대한항공, 아시아나' : 'Korean Air, Asiana',
      };
    }
  };

  const flightInfo = getFlightInfo();

  const t = {
    title: isKorean ? '교통 안내' : 'How to Get Around',
    jeju: {
      gettingToJeju: isKorean ? '제주도 가는 법' : 'Getting to Jeju Island',
      gettingToJejuDesc: isKorean
        ? '서울(김포/인천), 부산, 또는 다른 주요 도시에서 제주국제공항으로 비행기를 타세요.'
        : 'Fly to Jeju International Airport from Seoul (Gimpo/Incheon), Busan, or other major cities.',
      rentalCar: isKorean ? '렌터카 (적극 추천)' : 'Rental Car (Highly Recommended)',
      rentalCarDesc: isKorean
        ? '자신의 속도로 제주를 탐험하는 가장 좋은 방법. 국제 면허증 사용 가능.'
        : 'The best way to explore Jeju at your own pace. International licenses accepted.',
      rentalCarTip: isKorean
        ? '⚠️ 팁: 미리 예약하고 국제 운전 면허증 + 여권 지참'
        : '⚠️ Tip: Book in advance and bring your international driving permit + passport',
      publicBus: isKorean ? '시내버스 (저렴한 옵션)' : 'Public Bus (Budget Option)',
      publicBusDesc: isKorean
        ? '제주 버스는 주요 관광지를 연결하지만 운행 횟수가 제한적입니다.'
        : 'Jeju\'s bus system connects major attractions, but schedules can be limited.',
      taxi: isKorean ? '택시 & 라이드 앱' : 'Taxi & Ride Apps',
      taxiDesc: isKorean
        ? '편리하지만 하루 종일 투어하기에는 비쌀 수 있습니다.'
        : 'Convenient but can be expensive for full-day touring.',
      perRide: isKorean ? '회당' : 'per ride',
      perDay: isKorean ? '/일' : '/day',
      baseFare: isKorean ? '기본요금' : 'base fare',
      limitedFrequency: isKorean ? '제한적 운행' : 'Limited frequency',
    },
    seoul: {
      metro: isKorean ? '서울 지하철 (추천)' : 'Seoul Metro (Recommended)',
      metroDesc: isKorean
        ? '빠르고 저렴하며 영어 안내판으로 쉽게 이용 가능.'
        : 'Fast, affordable, and easy to navigate with English signs throughout.',
      cityBus: isKorean ? '시내버스' : 'City Buses',
      cityBusDesc: isKorean
        ? '지하철이 닿지 않는 지역을 커버하는 광범위한 네트워크.'
        : 'Extensive network covering areas not served by metro.',
      taxi: isKorean ? '택시 & 카카오T' : 'Taxi & Kakao T',
      taxiDesc: isKorean
        ? '그룹이나 야간 여행에 빠르고 저렴합니다.'
        : 'Quick and affordable for groups or late-night travel.',
      squidGameTours: isKorean ? '오징어게임 투어 (원거리 장소용)' : 'Squid Game Tours (For remote locations)',
      squidGameToursDesc: isKorean
        ? '접근하기 어려운 섬과 촬영지로 가는 조직화된 투어.'
        : 'Organized tours to islands and filming locations not easily accessible.',
      includesTransport: isKorean ? '교통 포함' : 'Includes transport',
    },
    budget: {
      title: isKorean ? '예상 교통 예산' : 'Estimated Transport Budget',
      budget: isKorean ? '저렴: 1일 $10-30 USD (대중교통)' : 'Budget: $10-30 USD/day (public transport)',
      midRange: isKorean ? '중간: 1일 $40-70 USD (제주 렌터카)' : 'Mid-range: $40-70 USD/day (car rental in Jeju)',
      comfortable: isKorean ? '편안: 1일 $80-150 USD (택시 + 투어)' : 'Comfortable: $80-150 USD/day (taxi + tours)',
    },
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12 mb-8">
      <h3 className="text-2xl mb-6 text-white flex items-center gap-3">
        <Car className="w-6 h-6 text-blue-400" />
        {t.title}
      </h3>

      {isJeju ? (
        <div className="space-y-6">
          {/* Getting to Jeju */}
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg text-white mb-2">{t.jeju.gettingToJeju}</h4>
                <p className="text-gray-300 mb-3">
                  {t.jeju.gettingToJejuDesc}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">✈️ {flightInfo.duration}</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">💰 {flightInfo.price}</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">📱 {flightInfo.airlines}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rental Car (Recommended) */}
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg text-white mb-2">{t.jeju.rentalCar}</h4>
                <p className="text-gray-300 mb-3">
                  {t.jeju.rentalCarDesc}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">💰 $40-70 USD{t.jeju.perDay}</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">🚗 Lotte, SK, AJ Rent-a-Car</span>
                </div>
                <p className="text-sm text-gray-400">
                  {t.jeju.rentalCarTip}
                </p>
              </div>
            </div>
          </div>

          {/* Bus */}
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg text-white mb-2">{t.jeju.publicBus}</h4>
                <p className="text-gray-300 mb-3">
                  {t.jeju.publicBusDesc}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">💰 $1-3 USD {t.jeju.perRide}</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">📱 T-money</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">🕐 {t.jeju.limitedFrequency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Taxi */}
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg text-white mb-2">{t.jeju.taxi}</h4>
                <p className="text-gray-300 mb-3">
                  {t.jeju.taxiDesc}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">💰 $3-5 {t.jeju.baseFare}</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">📱 Kakao T</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Seoul Metro */}
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Train className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg text-white mb-2">{t.seoul.metro}</h4>
                <p className="text-gray-300 mb-3">
                  {t.seoul.metroDesc}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">💰 $1-2 USD {t.jeju.perRide}</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">📱 T-money</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">🗺️ {isKorean ? '영어 안내' : 'English navigation'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bus */}
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg text-white mb-2">{t.seoul.cityBus}</h4>
                <p className="text-gray-300 mb-3">
                  {t.seoul.cityBusDesc}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">💰 $1-2 USD</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">📱 Naver Map</span>
                </div>
              </div>
            </div>
          </div>

          {/* Taxi */}
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg text-white mb-2">{t.seoul.taxi}</h4>
                <p className="text-gray-300 mb-3">
                  {t.seoul.taxiDesc}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">💰 $3 {t.jeju.baseFare}</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">📱 Kakao T</span>
                </div>
              </div>
            </div>
          </div>

          {/* Day Tours */}
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg text-white mb-2">{t.seoul.squidGameTours}</h4>
                <p className="text-gray-300 mb-3">
                  {t.seoul.squidGameToursDesc}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">💰 $50-100 USD</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">🚌 {t.seoul.includesTransport}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Summary */}
      <div className="mt-8 bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-lg text-white mb-2">{t.budget.title}</h4>
            <div className="space-y-2">
              <p className="text-gray-300">💰 {t.budget.budget}</p>
              <p className="text-gray-300">💰 {t.budget.midRange}</p>
              <p className="text-gray-300">💰 {t.budget.comfortable}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
