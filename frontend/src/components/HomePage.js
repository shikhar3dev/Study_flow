import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import {
  School as SchoolIcon,
  Timeline as TimelineIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';

const FeatureCard = ({ icon, title, description }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          {icon}
        </Box>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Smart Planning',
      description: 'Get personalized study schedules based on your subjects and exam dates.',
    },
    {
      icon: <TimelineIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Progress Tracking',
      description: 'Monitor your study progress and adjust your plan as needed.',
    },
    {
      icon: <CalendarIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Flexible Scheduling',
      description: 'Create and modify study plans that fit your daily routine.',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to StudyFlow
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your personal AI-powered study planning assistant
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/create-plan')}
          sx={{ mt: 2 }}
        >
          Create Study Plan
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ mb: 8 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <FeatureCard {...feature} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h4" gutterBottom>
          Ready to optimize your study time?
        </Typography>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/create-plan')}
          sx={{ mt: 2 }}
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;