import { useMemo, useState } from 'react';

import { Hero } from '@/sections/hero';
import { DramaSelection } from '@/sections/drama-selection';
import { RegionSelection } from '@/sections/region-selection';
import { StoryForm } from '@/sections/story-form';
import { StoryPreview } from '@/sections/story-preview';
import { EpisodeResult } from '@/sections/episode-result';

import type { Step, UserData } from '@/types/user';

export type { UserData } from '@/types/user';

type DraftUserData = Partial<UserData>;

const dramaThemeMap: Record<string, string> = {
  'when-life-gives-you-tangerines': 'heartwarming',
  custom: 'game-food',
  default: 'game-food',
};

function hasRequiredFlowData(data: DraftUserData): data is UserData {
  return Boolean(data.drama && data.region);
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('hero');
  const [userData, setUserData] = useState<DraftUserData>({});

  const dramaTheme = useMemo(() => {
    const key = userData.drama ?? 'default';
    return dramaThemeMap[key] ?? dramaThemeMap.default;
  }, [userData.drama]);

  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };

  const resetApp = () => {
    setUserData({});
    setCurrentStep('hero');
  };

  const updateUserData = (nextData: DraftUserData) => {
    setUserData((prev) => ({
      ...prev,
      ...nextData,
    }));
  };

  const handleStart = () => {
    goToStep('drama');
  };

  const handleDramaSelect = (drama: string) => {
    updateUserData({
      drama,
      customDramaName: undefined,
    });
    goToStep('region');
  };

  const handleCustomDrama = (dramaName: string) => {
    updateUserData({
      drama: 'custom',
      customDramaName: dramaName,
    });
    goToStep('region');
  };

  const handleRegionSelect = (region: string) => {
    updateUserData({ region });
    goToStep('form');
  };

  const handleFormSubmit = (formData: DraftUserData) => {
    updateUserData(formData);
    goToStep('preview');
  };

  const handlePlanConfirm = (adjustedData: DraftUserData) => {
    updateUserData(adjustedData);
    goToStep('result');
  };

  const handleBackToDrama = () => {
    goToStep('drama');
  };

  const handleBackToRegion = () => {
    goToStep('region');
  };

  return (
    <div className="min-h-screen bg-black">
      {currentStep === 'hero' && <Hero onStart={handleStart} />}

      {currentStep === 'drama' && (
        <DramaSelection
          onSelect={handleDramaSelect}
          onCustomDrama={handleCustomDrama}
        />
      )}

      {currentStep === 'region' && (
        <RegionSelection
          onSelect={handleRegionSelect}
          onBack={handleBackToDrama}
          dramaTheme={dramaTheme}
        />
      )}

      {currentStep === 'form' && (
        <StoryForm
          initialData={userData}
          onSubmit={handleFormSubmit}
          onBack={handleBackToRegion}
        />
      )}

      {currentStep === 'preview' && hasRequiredFlowData(userData) && (
        <StoryPreview
          userData={userData}
          onConfirm={handlePlanConfirm}
        />
      )}

      {currentStep === 'result' && hasRequiredFlowData(userData) && (
        <EpisodeResult
          userData={userData}
          onReset={resetApp}
        />
      )}
    </div>
  );
}