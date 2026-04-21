import { MapPin, Navigation, Clock, Bus, Car, Train } from 'lucide-react';

interface Location {
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
}

interface MapViewProps {
  locations: Location[];
  dramaColor: string;
  isKorean?: boolean;
}

export function MapView({ locations, dramaColor, isKorean = false }: MapViewProps) {
  console.log('MapView isKorean:', isKorean);
  const t = {
    title: isKorean ? '여행 경로 지도' : 'Your Travel Route Map',
    subtitle: isKorean ? '최적화된 드라마 투어 일정' : 'Optimized itinerary for your drama tour',
    interactiveMap: isKorean ? '인터랙티브 지도' : 'Interactive Map View',
    allLocations: isKorean ? '모든 장소가 방향과 함께 표시됨' : 'All locations marked with directions',
    openMaps: isKorean ? '구글맵에서 열기' : 'Open in Google Maps',
    getDirections: isKorean ? '길찾기' : 'Get Directions',
    totalDuration: isKorean ? '총 소요 시간' : 'Total Duration',
    totalDistance: isKorean ? '총 거리' : 'Total Distance',
    locations: isKorean ? '장소' : 'Locations',
    stops: isKorean ? '개 장소' : 'Stops',
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12 mb-8">
      <h3 className="text-3xl mb-2 text-white flex items-center gap-3">
        <Navigation className="w-7 h-7 text-purple-400" />
        {t.title}
      </h3>
      <p className="text-gray-400 mb-8">{t.subtitle}</p>

      {/* Visual Map with Route */}
      <div className="relative bg-black/50 rounded-2xl overflow-hidden mb-8 border-2 border-white/10 shadow-inner">
        <div className="aspect-video w-full relative bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20">
          {/* Map Grid Background */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#9ca3af" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Route Lines */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {locations.map((_, index) => {
              if (index === locations.length - 1) return null;
              const positions = [
                { x: 30, y: 20 },
                { x: 60, y: 40 },
                { x: 45, y: 60 },
                { x: 70, y: 70 },
                { x: 25, y: 50 },
              ];
              const from = positions[index];
              const to = positions[index + 1] || from;

              return (
                <line
                  key={index}
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke="#8b5cf6"
                  strokeWidth="3"
                  strokeDasharray="10,5"
                  className="animate-pulse"
                />
              );
            })}
          </svg>

          {/* Location Markers */}
          <div className="absolute inset-0">
            {locations.map((location, index) => {
              const positions = [
                { top: '20%', left: '30%' },
                { top: '40%', left: '60%' },
                { top: '60%', left: '45%' },
                { top: '70%', left: '70%' },
                { top: '50%', left: '25%' },
              ];
              const pos = positions[index] || { top: '50%', left: '50%' };

              return (
                <div
                  key={index}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ top: pos.top, left: pos.left }}
                >
                  {/* Marker Pin */}
                  <div className="relative">
                    {/* Pulse Effect */}
                    <div className={`absolute inset-0 w-12 h-12 rounded-full bg-gradient-to-br ${dramaColor} opacity-30 animate-ping`}></div>
                    {/* Main Marker */}
                    <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${dramaColor} flex items-center justify-center text-white shadow-2xl border-4 border-white transform hover:scale-125 transition-transform cursor-pointer`}>
                      <span className="text-lg font-bold">{index + 1}</span>
                    </div>
                    {/* Location Label */}
                    <div className="absolute top-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/30">
                        <p className="text-xs font-medium text-white">{location.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
            <p className="text-xs text-gray-300">📍 {t.allLocations}</p>
          </div>
        </div>
      </div>

      {/* Google Maps Link */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all hover:scale-105 shadow-lg">
          <MapPin className="w-5 h-5" />
          {t.openMaps}
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all hover:scale-105 shadow-lg">
          <Navigation className="w-5 h-5" />
          {t.getDirections}
        </button>
      </div>

      {/* Route Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl text-center">
          <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <p className="text-sm text-gray-400 mb-1">{t.totalDuration}</p>
          <p className="text-2xl text-white">{isKorean ? '1-2일' : '1-2 Days'}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl text-center">
          <MapPin className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <p className="text-sm text-gray-400 mb-1">{t.totalDistance}</p>
          <p className="text-2xl text-white">~50-80km</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl text-center">
          <Navigation className="w-8 h-8 text-pink-400 mx-auto mb-3" />
          <p className="text-sm text-gray-400 mb-1">{t.locations}</p>
          <p className="text-2xl text-white">{locations.length}{isKorean ? t.stops : ` ${t.stops}`}</p>
        </div>
      </div>
    </div>
  );
}
