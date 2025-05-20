import React, { useState } from 'react';
import { Box, Paper, Typography, Button, MobileStepper, useTheme } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

const slides = [
  {
    image: '/onboarding1.svg',
    title: 'Your Smart Study Assistant',
    description: 'Plan, track, and optimize your study sessions with AI-powered recommendations and insights.',
  },
  {
    image: '/onboarding2.svg',
    title: 'AI Chat & Flashcards',
    description: 'Chat with your AI assistant, upload materials, and generate flashcards for smarter revision.',
  },
  {
    image: '/onboarding3.svg',
    title: 'Visual Progress & Streaks',
    description: 'Stay motivated with visual progress tracking, streaks, and personalized study stats.',
  },
  {
    image: '/onboarding4.svg',
    title: 'Go Premium for More',
    description: 'Unlock advanced features, priority support, and an ad-free experience with StudyFlow Pro.',
  },
];

const OnboardingCarousel = ({ onFinish }) => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const maxSteps = slides.length;

  const handleNext = () => {
    if (activeStep === maxSteps - 1) {
      if (onFinish) onFinish();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSkip = () => {
    if (onFinish) onFinish();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper elevation={4} sx={{ maxWidth: 400, width: '100%', p: 4, borderRadius: 4, textAlign: 'center' }}>
        <img
          src={slides[activeStep].image}
          alt={slides[activeStep].title}
          style={{ width: '100%', maxHeight: 180, objectFit: 'contain', marginBottom: 24 }}
        />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {slides[activeStep].title}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          {slides[activeStep].description}
        </Typography>
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{ justifyContent: 'center', mb: 2, bgcolor: 'transparent' }}
          nextButton={
            <Button size="small" onClick={handleNext} variant="contained">
              {activeStep === maxSteps - 1 ? 'Get Started' : 'Continue'}
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              Back
            </Button>
          }
        />
        <Button onClick={handleSkip} color="primary" sx={{ mt: 1 }}>
          Skip
        </Button>
      </Paper>
    </Box>
  );
};

export default OnboardingCarousel; 