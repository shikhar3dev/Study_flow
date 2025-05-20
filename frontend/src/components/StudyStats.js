import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  EmojiEvents as TrophyIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import api from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

const StudyStats = () => {
  const [stats, setStats] = useState({
    totalStudyTime: 0,
    totalPomodoros: 0,
    currentStreak: 0,
    longestStreak: 0,
    dailyGoal: 120, // minutes
    weeklyGoal: 840, // minutes
    dailyProgress: 0,
    weeklyProgress: 0,
    studyHistory: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/study-sessions/stats');
        console.log('Study stats response data:', response.data);
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching study stats:', err);
        setError('Failed to load study statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh stats every minute
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const studyHistoryData = {
    labels: stats.studyHistory.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Study Minutes',
        data: stats.studyHistory.map(item => item.minutes),
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 30,
        },
      },
    },
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Study Time
              </Typography>
              <Typography variant="h4">
                {Math.round(stats.totalStudyTime / 60)}h
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Pomodoros
              </Typography>
              <Typography variant="h4">
                {stats.totalPomodoros}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Streak
              </Typography>
              <Typography variant="h4">
                {stats.currentStreak} days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Longest Streak
              </Typography>
              <Typography variant="h4">
                {stats.longestStreak} days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Study History
              </Typography>
              <Box sx={{ height: isMobile ? 300 : 400 }}>
                <Line data={studyHistoryData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Daily Progress
              </Typography>
              <Box sx={{ height: isMobile ? 200 : 300 }}>
                <Bar
                  data={{
                    labels: ['Progress'],
                    datasets: [
                      {
                        label: 'Daily Goal',
                        data: [stats.dailyProgress],
                        backgroundColor: theme.palette.primary.main,
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          callback: (value) => `${value}%`,
                        },
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weekly Progress
              </Typography>
              <Box sx={{ height: isMobile ? 200 : 300 }}>
                <Bar
                  data={{
                    labels: ['Progress'],
                    datasets: [
                      {
                        label: 'Weekly Goal',
                        data: [stats.weeklyProgress],
                        backgroundColor: theme.palette.secondary.main,
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          callback: (value) => `${value}%`,
                        },
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudyStats; 