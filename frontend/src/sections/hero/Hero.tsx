import { Sparkles, Heart, MapPin } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden bg-black">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Logo/Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full mb-8 shadow-lg border border-white/10">
          <Sparkles className="w-5 h-5 text-rose-400" />
          <span className="text-sm text-gray-300">Your K-Drama Adventure Awaits</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl mb-6 bg-gradient-to-r from-rose-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">
          K-씬스틸러
        </h1>
        <h2 className="text-3xl md:text-4xl mb-6 text-white/90">
          Become the Star of
          <br />
          Your Own K-Drama
        </h2>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Create your personalized Korean drama episode as you explore filming locations across Korea.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <Heart className="w-5 h-5 text-rose-400" />
            <span className="text-gray-300">Personalized Stories</span>
          </div>
          <div className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <MapPin className="w-5 h-5 text-purple-400" />
            <span className="text-gray-300">Real Filming Locations</span>
          </div>
          <div className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <span className="text-gray-300">AI-Powered Episodes</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onStart}
          className="group px-12 py-5 bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-rose-500/50 transition-all duration-300 hover:scale-105"
        >
          <span className="flex items-center gap-3">
            <span className="text-lg">Start Your Episode</span>
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </span>
        </button>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <div className="text-3xl mb-2 bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">1000+</div>
            <div className="text-sm text-gray-500">Episodes Created</div>
          </div>
          <div>
            <div className="text-3xl mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">50+</div>
            <div className="text-sm text-gray-500">Filming Locations</div>
          </div>
          <div>
            <div className="text-3xl mb-2 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">25+</div>
            <div className="text-sm text-gray-500">Countries</div>
          </div>
        </div>
      </div>
    </div>
  );
}
