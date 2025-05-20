import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const SplashScreen = () => (
  <Box
    sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'primary.main',
      color: 'white',
    }}
  >
    <img src="/logo192.svg" alt="StudyFlow Logo" style={{ width: 80, marginBottom: 24 }} />
    <Typography variant="h4" fontWeight="bold" mb={2}>
      StudyFlow
    </Typography>
    <CircularProgress color="inherit" />
  </Box>
);

export default SplashScreen; 