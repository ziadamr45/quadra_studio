'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Moon, Mic, Film, Rocket } from 'lucide-react';

const steps = [
  {
    title: 'مرحباً بك في نُور ✨',
    description:
      'منصة متكاملة لإنشاء فيديوهات قرآنية سينمائية بجودة عالية. حوّل الآيات القرآنية إلى فيديوهات مذهلة بسهولة ويسر.',
    icon: Moon,
    gradient: 'from-emerald-600/20 via-transparent to-copper/10',
  },
  {
    title: 'أصوات قرائية مميزة 🎙️',
    description:
      'اختر من بين أكثر من 30 قارئًا بأصوات قرائية مميزة وجودات متعددة. من عبد الباسط إلى السديس، كل الأصوات العريقة بين يديك.',
    icon: Mic,
    gradient: 'from-copper/20 via-transparent to-emerald-600/10',
  },
  {
    title: 'تصميمات سينمائية 🎬',
    description:
      '8 تصميمات سينمائية جاهزة مع خيارات تخصيص لا محدودة. أضف الزخارف الإسلامية والخطوط العربية والتأثيرات البصرية الاحترافية.',
    icon: Film,
    gradient: 'from-emerald-600/15 via-transparent to-copper/15',
  },
  {
    title: 'جاهز للبدء! 🚀',
    description:
      'كل شيء جاهز! اختر الآيات، حدد القارئ، خصّص التصميم، ثم صدّر الفيديو بجودة عالية. ابدأ رحلتك الآن!',
    icon: Rocket,
    gradient: 'from-copper/15 via-transparent to-emerald-600/20',
  },
];

export default function OnboardingModal() {
  const { showOnboarding, setShowOnboarding, onboardingStep, setOnboardingStep } =
    useAppStore();

  const handleNext = () => {
    if (onboardingStep < steps.length - 1) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
    }
  };

  const handleSkip = () => {
    setShowOnboarding(false);
  };

  const currentStep = steps[onboardingStep];
  const Icon = currentStep.icon;

  return (
    <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-card border-border">
        <div className={`relative min-h-[360px]`}>
          {/* Gradient background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${currentStep.gradient}`}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center p-8 pt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={onboardingStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center"
              >
                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl glass glow-emerald flex items-center justify-center mb-6">
                  <Icon className="w-10 h-10 text-emerald" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-foreground mb-4 arabic-text">
                  {currentStep.title}
                </h2>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed max-w-sm arabic-text">
                  {currentStep.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Dot indicators */}
            <div className="flex gap-2 mt-8">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setOnboardingStep(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === onboardingStep
                      ? 'w-8 bg-emerald'
                      : 'w-2 bg-border hover:bg-muted-foreground'
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-8 w-full">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                تخطي
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 bg-emerald hover:bg-emerald/90 text-emerald-foreground font-semibold"
              >
                {onboardingStep === steps.length - 1 ? 'ابدأ الآن' : 'التالي'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
