'use client';

import { useAppStore, type AppStep } from '@/lib/store';
import VideoPreview from './VideoPreview';
import ContentStep from './steps/ContentStep';
import VoiceStep from './steps/VoiceStep';
import DesignStep from './steps/DesignStep';
import ExportStep from './steps/ExportStep';
import QuranBrowser from './QuranBrowser';
import Image from 'next/image';
import {
  BookOpen,
  Mic,
  Palette,
  Download,
  Check,
  Book,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps: { id: AppStep; label: string; icon: typeof BookOpen }[] = [
  { id: 'content', label: 'المحتوى', icon: BookOpen },
  { id: 'voice', label: 'الصوت', icon: Mic },
  { id: 'design', label: 'التصميم', icon: Palette },
  { id: 'export', label: 'التصدير', icon: Download },
];

export default function QudraApp() {
  const {
    appMode,
    setAppMode,
    currentStep,
    setCurrentStep,
    completedSteps,
    selectedVerses,
    hadithData,
    showQuranBrowser,
  } = useAppStore();

  const canProceed = () => {
    switch (currentStep) {
      case 'content':
        return appMode === 'quran' ? selectedVerses.length > 0 : hadithData.text.trim().length > 0;
      case 'voice':
        return true; // Voice is optional
      case 'design':
        return true;
      case 'export':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      useAppStore.getState().markStepCompleted(currentStep);
      setCurrentStep(nextStep.id);
    }
  };

  const handlePrev = () => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const renderStepContent = () => {
    switch (currentStep) {
      case 'content':
        return <ContentStep />;
      case 'voice':
        return <VoiceStep />;
      case 'design':
        return <DesignStep />;
      case 'export':
        return <ExportStep />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/qudra-logo.png"
              alt="Qudra Studio"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-foreground arabic-text">قدرة استوديو</span>
              <span className="text-[10px] text-muted-foreground tracking-wide">QUDRA STUDIO</span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
            <button
              onClick={() => setAppMode('quran')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                appMode === 'quran'
                  ? 'bg-qudra text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Book className="w-3.5 h-3.5" />
              <span className="arabic-text">فيديو قرآني</span>
            </button>
            <button
              onClick={() => setAppMode('hadith')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                appMode === 'hadith'
                  ? 'bg-qudra text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="arabic-text">فيديو حديث</span>
            </button>
          </div>

          {/* Empty space for balance */}
          <div className="w-[120px]" />
        </div>
      </header>

      {/* Step Navigation */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 h-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = completedSteps.includes(step.id);
              const isPast = index < currentStepIndex;

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => {
                      if (isPast || isCompleted) setCurrentStep(step.id);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-qudra/10 text-qudra'
                        : isCompleted
                        ? 'text-sage hover:bg-sage/10'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isActive
                          ? 'bg-qudra text-white'
                          : isCompleted
                          ? 'bg-sage text-white'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
                    </div>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="arabic-text hidden sm:inline">{step.label}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-px bg-border mx-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Video Preview */}
          <div className="lg:w-[400px] xl:w-[440px] flex-shrink-0 lg:sticky lg:top-[120px] lg:self-start">
            <VideoPreview />
          </div>

          {/* Step Content */}
          <div className="flex-1 min-w-0">
            <div className="surface rounded-xl overflow-hidden">
              <div className="p-5 sm:p-6">
                {renderStepContent()}
              </div>

              {/* Step Navigation Buttons */}
              <div className="border-t border-border p-4 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="arabic-text">السابق</span>
                </Button>

                <div className="flex items-center gap-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        index === currentStepIndex
                          ? 'bg-qudra w-4'
                          : index < currentStepIndex || completedSteps.includes(steps[index].id)
                          ? 'bg-sage'
                          : 'bg-border'
                      }`}
                    />
                  ))}
                </div>

                {currentStepIndex < steps.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`${
                      canProceed()
                        ? 'bg-qudra hover:bg-qudra-dark text-white'
                        : 'bg-secondary text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    <span className="arabic-text">التالي</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => useAppStore.getState().refreshPreview()}
                    className="bg-qudra hover:bg-qudra-dark text-white"
                  >
                    <span className="arabic-text">تصدير</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-auto">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/qudra-logo.png"
              alt="Qudra Studio"
              width={20}
              height={20}
              className="rounded"
            />
            <span className="text-xs text-muted-foreground">قدرة استوديو © 2025</span>
          </div>
          <span className="text-xs text-muted-foreground">Qudra Studio v1.0</span>
        </div>
      </footer>

      {/* Quran Browser Modal */}
      <QuranBrowser />
    </div>
  );
}
