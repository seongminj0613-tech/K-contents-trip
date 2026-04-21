import { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { UserData } from '@/types/user';

interface StoryFormProps {
  initialData: Partial<UserData>;
  onSubmit: (data: UserData) => void;
  onBack: () => void;
}

const countries = [
  'South Korea', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'France', 'Japan', 'China', 'Taiwan',
  'Thailand', 'Singapore', 'Malaysia', 'Philippines', 'India',
  'Brazil', 'Mexico', 'Spain', 'Italy', 'Netherlands', 'Other'
];

const travelStyleOptions = [
  'Photography', 'Adventure', 'Relaxed & Slow', 'Food Explorer',
  'Cultural Immersion', 'Shopping', 'Nature & Hiking', 'City Life',
  'Meeting Locals', 'Solo Travel'
];

export function StoryForm({ initialData, onSubmit, onBack }: StoryFormProps) {
  const [formData, setFormData] = useState<Partial<UserData>>({
    ...initialData,
    name: initialData.name || '',
    visitingFrom: initialData.visitingFrom || '',
    travelStyle: initialData.travelStyle || [],
    travelDates: initialData.travelDates || '',
  });

  const toggleTravelStyle = (style: string) => {
    setFormData((prev) => {
      const current = prev.travelStyle ?? [];
      return {
        ...prev,
        travelStyle: current.includes(style)
          ? current.filter((s) => s !== style)
          : [...current, style],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    if (formData.name && formData.visitingFrom && formData.travelStyle && formData.travelStyle.length > 0 && formData.drama) {
      console.log('Form validation passed, calling onSubmit');
      onSubmit(formData as UserData);
    } else {
      console.log('Form validation failed:', {
        hasName: !!formData.name,
        hasVisitingFrom: !!formData.visitingFrom,
        hasTravelStyle: formData.travelStyle && formData.travelStyle.length > 0,
        hasDrama: !!formData.drama,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-black">
      <div className="max-w-3xl mx-auto w-full">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Region Selection
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
            Tell Us About Yourself
          </h2>
          <p className="text-lg text-gray-400">
            We'll create a personalized K-drama episode just for you
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12 space-y-8">
          {/* Name Input */}
          <div>
            <label className="block text-gray-300 mb-3">Your Name (or nickname)</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
              className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white placeholder:text-gray-500"
              required
            />
          </div>

          {/* Country Selection */}
          <div>
            <label className="block text-gray-300 mb-3">Where are you visiting from?</label>
            <select
              value={formData.visitingFrom}
              onChange={(e) => setFormData({ ...formData, visitingFrom: e.target.value })}
              className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white [&>option]:bg-gray-900 [&>option]:text-white"
              required
            >
              <option value="" className="bg-gray-900 text-white">Select your country</option>
              {countries.map((country) => (
                <option key={country} value={country} className="bg-gray-900 text-white">
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Travel Dates */}
          <div>
            <label className="block text-gray-300 mb-3">Travel Dates (optional)</label>
            <input
              type="text"
              value={formData.travelDates}
              onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
              placeholder="e.g., May 2026"
              className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white placeholder:text-gray-500"
            />
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-gray-300 mb-3">
              What's your travel style? (Select at least one)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {travelStyleOptions.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleTravelStyle(style)}
                  className={`px-4 py-3 rounded-xl border-2 transition-all ${
                    (formData.travelStyle ?? []).includes(style)
                      ? 'bg-gradient-to-r from-rose-500 to-purple-500 text-white border-transparent'
                      : 'bg-white/10 border-white/20 text-gray-300 hover:border-purple-400'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!formData.name || !formData.visitingFrom || !formData.travelStyle || formData.travelStyle.length === 0}
            className="w-full px-12 py-5 bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-rose-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="flex items-center justify-center gap-3">
              <span className="text-lg">Generate My Episode</span>
              <Sparkles className="w-5 h-5" />
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
