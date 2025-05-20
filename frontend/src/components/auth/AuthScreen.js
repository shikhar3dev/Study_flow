import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
  TextField,
  Link,
  CircularProgress,
  Alert,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import axios from 'axios';
import { auth, provider, signInWithPopup } from '../../firebase'; // Corrected Import Path
import api from '../../services/api'; // Import the configured axios instance

const AuthScreen = ({ onAuth }) => {
  const [mode, setMode] = useState('signIn'); // 'signIn' | 'signUp' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSocial = async (providerName) => {
    if (providerName === 'Google') {
      setLoading(true);
      setError('');
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Get Firebase ID token and send to backend
        const idToken = await user.getIdToken();
        const res = await api.post('/api/auth/google', { idToken }); // Use the configured api instance

        // Store backend JWT and authenticate
        localStorage.setItem('access_token', res.data.access_token);
        if (onAuth) onAuth();

      } catch (error) {
        console.error('Google login failed:', error);
        setError(error.message || 'Google login failed.');
      } finally {
        setLoading(false);
      }
    } else {
      alert(`Social login with ${providerName} coming soon!`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signIn') {
        const res = await axios.post('/api/auth/login', { email, password });
        localStorage.setItem('access_token', res.data.access_token);
        if (onAuth) onAuth();
      } else if (mode === 'signUp') {
        const res = await axios.post('/api/auth/register', { email, password });
        localStorage.setItem('access_token', res.data.access_token);
        if (onAuth) onAuth();
      } else if (mode === 'forgot') {
        // Implement forgot password logic if needed
        setError('Forgot password is not implemented yet.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'grey.900',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper elevation={6} sx={{ maxWidth: 400, width: '100%', p: 4, borderRadius: 4, textAlign: 'center', bgcolor: 'grey.900', color: 'white' }}>
        <img src="/logo192.svg" alt="StudyFlow Logo" style={{ width: 60, marginBottom: 16 }} />
        <Typography variant="h5" fontWeight="bold" mb={2}>
          StudyFlow
        </Typography>
        <Typography variant="subtitle1" mb={3}>
          {mode === 'signIn' && "Let's dive in to your account!"}
          {mode === 'signUp' && 'Create your StudyFlow account!'}
          {mode === 'forgot' && 'Reset your password'}
        </Typography>
        <Stack spacing={2} mb={2}>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            fullWidth
            onClick={() => handleSocial('Google')}
            sx={{ color: 'white', borderColor: 'grey.700', '&:hover': { borderColor: 'primary.main' } }}
            disabled={loading}
          >
            Continue with Google
          </Button>
          <Button
            variant="outlined"
            startIcon={<AppleIcon />}
            fullWidth
            onClick={() => handleSocial('Apple')}
            sx={{ color: 'white', borderColor: 'grey.700', '&:hover': { borderColor: 'primary.main' } }}
            disabled={loading}
          >
            Continue with Apple
          </Button>
          <Button
            variant="outlined"
            startIcon={<FacebookIcon />}
            fullWidth
            onClick={() => handleSocial('Facebook')}
            sx={{ color: 'white', borderColor: 'grey.700', '&:hover': { borderColor: 'primary.main' } }}
            disabled={loading}
          >
            Continue with Facebook
          </Button>
          <Button
            variant="outlined"
            startIcon={<TwitterIcon />}
            fullWidth
            onClick={() => handleSocial('Twitter')}
            sx={{ color: 'white', borderColor: 'grey.700', '&:hover': { borderColor: 'primary.main' } }}
            disabled={loading}
          >
            Continue with Twitter
          </Button>
        </Stack>
        <Divider sx={{ my: 3, bgcolor: 'grey.800' }}>or</Divider>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {mode !== 'forgot' && (
          <form onSubmit={handleSubmit}>
            <Stack spacing={2} mb={2}>
              <TextField
                label="Email"
                type="email"
                variant="filled"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{ style: { color: 'white', background: '#222' } }}
                InputLabelProps={{ style: { color: '#bbb' } }}
                disabled={loading}
              />
              <TextField
                label="Password"
                type="password"
                variant="filled"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{ style: { color: 'white', background: '#222' } }}
                InputLabelProps={{ style: { color: '#bbb' } }}
                disabled={loading}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : (mode === 'signIn' ? 'Sign in' : 'Sign up')}
              </Button>
            </Stack>
          </form>
        )}
        {mode === 'forgot' && (
          <form onSubmit={handleSubmit}>
            <Stack spacing={2} mb={2}>
              <TextField
                label="Email"
                type="email"
                variant="filled"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{ style: { color: 'white', background: '#222' } }}
                InputLabelProps={{ style: { color: '#bbb' } }}
                disabled={loading}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
              </Button>
            </Stack>
          </form>
        )}
        <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
          {mode === 'signIn' && (
            <>
              <Typography variant="body2" color="grey.400">Don't have an account?</Typography>
              <Link component="button" color="primary" onClick={() => setMode('signUp')}>Sign up</Link>
            </>
          )}
          {mode === 'signUp' && (
            <>
              <Typography variant="body2" color="grey.400">Already have an account?</Typography>
              <Link component="button" color="primary" onClick={() => setMode('signIn')}>Sign in</Link>
            </>
          )}
        </Stack>
        {mode !== 'forgot' && (
          <Box mt={1}>
            <Link component="button" color="primary" onClick={() => setMode('forgot')}>
              Forgot password?
            </Link>
          </Box>
        )}
        <Box mt={4}>
          <Typography variant="caption" color="grey.500">
            Privacy Policy • Terms of Service
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthScreen;