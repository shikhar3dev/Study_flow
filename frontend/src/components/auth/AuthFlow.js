import React, { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';
import OnboardingCarousel from './OnboardingCarousel';
import AuthScreen from './AuthScreen';

const AuthFlow = ({ onAuth }) => {
  const [step, setStep] = useState('splash'); // 'splash' | 'onboarding' | 'auth'

  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => setStep('onboarding'), 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (step === 'splash') {
    return <SplashScreen />;
  }
  if (step === 'onboarding') {
    return <OnboardingCarousel onFinish={() => setStep('auth')} />;
  }
  return <AuthScreen onAuth={onAuth} />;
};

export default AuthFlow; 