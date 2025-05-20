import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import InputFormPage from './components/InputFormPage';
import GeneratedPlanPage from './components/GeneratedPlanPage';
import Dashboard from './components/Dashboard';
import AIChatbot from './components/AIChatbot';
import StudyTimer from './components/StudyTimer';
import AuthFlow from './components/auth/AuthFlow';
import PremiumUpsell from './components/auth/PremiumUpsell';
import { auth } from './firebase'; // Import Firebase auth instance
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'; // Import Firebase auth state listener and signOut
import api from './services/api'; // Import the configured axios instance

// Axios interceptor to attach JWT
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Removed unused variable

  // Persistent login: Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in with Firebase
        setIsAuthenticated(true);
        // Optionally, fetch custom token from backend or user data
        // user.getIdToken().then(idToken => {
        //   localStorage.setItem('access_token', idToken); // Store Firebase ID token if using backend verification
        //   axios.get('/api/user/me') // Fetch user data including premium status
        //     .then(res => setIsPremium(res.data.is_premium))
        //     .catch(() => setIsPremium(false));
        // });
         api.get('/user/me') // Use the configured api instance
           .then(res => setIsPremium(res.data.is_premium))
           .catch(() => setIsPremium(false));

      } else {
        // User is signed out
        setIsAuthenticated(false);
        setIsPremium(false);
        localStorage.removeItem('access_token'); // Clear local token on Firebase sign out
      }
    });
    return () => unsubscribe(); // Clean up subscription
  }, []);

  // Removed the redundant useEffect for fetching user/me based on isAuthenticated
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     axios.get('/api/user/me')
  //       .then(res => setIsPremium(res.data.is_premium))
  //       .catch(() => setIsPremium(false));
  //   }
  // }, [isAuthenticated]);


  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth); // Sign out from Firebase
      // onAuthStateChanged listener will handle clearing local state and token
    } catch (error) {
      console.error('Error signing out from Firebase:', error);
      // Manual cleanup if Firebase sign out fails
      localStorage.removeItem('access_token');
      setIsAuthenticated(false);
      setIsPremium(false);
    }
  };

  if (!isAuthenticated) {
    return <AuthFlow onAuth={() => setIsAuthenticated(true)} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-plan" element={<InputFormPage />} />
            <Route path="/generated-plan" element={<GeneratedPlanPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/ai-chat"
              element={
                isPremium ? (
                  <AIChatbot />
                ) : (
                  <PremiumUpsell onUpgrade={() => setIsPremium(true)} />
                )
              }
            />
            <Route path="/study-timer" element={<StudyTimer />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;