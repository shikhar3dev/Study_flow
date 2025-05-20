import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Tab,
  Tabs,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  BarChart as StatsIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import StudyStats from './StudyStats';
import axios from 'axios';
import api from '../services/api';

const StudyTimer = () => {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [settings, setSettings] = useState({
    studyDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: true,
    autoStartPomodoros: false,
    notifications: true,
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveStudySession = async (duration, type) => {
    try {
      await api.post('/study-sessions', {
        duration,
        type,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving study session:', error);
    }
  };

  const handleTimerComplete = useCallback(async () => {
    if (settings.notifications) {
      new Notification(isBreak ? 'Break is over!' : 'Pomodoro completed!', {
        body: isBreak ? 'Time to get back to studying!' : 'Take a well-deserved break!',
        icon: '/logo192.png',
      });
    }

    if (isBreak) {
      setIsBreak(false);
      setTime(settings.studyDuration * 60);
      if (settings.autoStartPomodoros) {
        setIsRunning(true);
      }
    } else {
      const newPomodoroCount = pomodoroCount + 1;
      setPomodoroCount(newPomodoroCount);
      setIsBreak(true);
      setTime(
        newPomodoroCount % settings.longBreakInterval === 0
          ? settings.longBreakDuration * 60
          : settings.shortBreakDuration * 60
      );
      if (settings.autoStartBreaks) {
        setIsRunning(true);
      }
      // Save completed study session
      await saveStudySession(settings.studyDuration, 'pomodoro');
    }
  }, [isBreak, settings, pomodoroCount]);

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, time, handleTimerComplete]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = async () => {
    if (isRunning && !isBreak) {
      const completedMinutes = settings.studyDuration - Math.ceil(time / 60);
      if (completedMinutes > 0) {
        await saveStudySession(completedMinutes, 'partial');
      }
    }
    setIsRunning(false);
    setTime(settings.studyDuration * 60);
    setIsBreak(false);
  };

  const handleSettingsChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSettings = () => {
    setTime(settings.studyDuration * 60);
    setShowSettings(false);
  };

  const requestNotificationPermission = async () => {
    if (settings.notifications && Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, [settings.notifications]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const adjustTime = (amount) => {
    setTime((prevTime) => Math.max(0, prevTime + amount));
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Card sx={{ maxWidth: 600, mx: 'auto', bgcolor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            {isBreak ? 'Break Time' : 'Study Timer'}
          </Typography>
          
          <Box sx={{ position: 'relative', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
            <CircularProgress
              variant="determinate"
              value={(time / (isBreak ? 5 * 60 : 25 * 60)) * 100}
              size={isMobile ? 200 : 300}
              thickness={4}
              sx={{ color: isBreak ? 'secondary.main' : 'primary.main' }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h2" component="div" color="text.primary">
                {formatTime(time)}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
            <Grid item>
              <IconButton onClick={() => adjustTime(-60)} disabled={isRunning}>
                <RemoveIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color={isBreak ? 'secondary' : 'primary'}
                onClick={isRunning ? handlePause : handleStart}
                startIcon={isRunning ? <PauseIcon /> : <PlayIcon />}
                size={isMobile ? 'medium' : 'large'}
              >
                {isRunning ? 'Pause' : 'Start'}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleStop}
                startIcon={<StopIcon />}
                size={isMobile ? 'medium' : 'large'}
              >
                Stop
              </Button>
            </Grid>
            <Grid item>
              <IconButton onClick={() => adjustTime(60)} disabled={isRunning}>
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>

          <Typography variant="body2" color="text.secondary">
            Completed Pomodoros: {pomodoroCount}
          </Typography>
        </CardContent>
      </Card>

      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        centered
        sx={{ mt: 2 }}
      >
        <Tab label="Timer" />
        <Tab label="Statistics" />
      </Tabs>

      {currentTab === 0 ? (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={(time / (isBreak ? 5 * 60 : 25 * 60)) * 100}
              size={200}
              thickness={4}
              sx={{ color: isBreak ? 'secondary.main' : 'primary.main' }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h3" component="div">
                {formatTime(time)}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {isBreak ? 'Break Time' : 'Study Time'}
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={2}>
            {!isRunning ? (
              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                onClick={handleStart}
                size="large"
              >
                Start
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<PauseIcon />}
                onClick={handlePause}
                size="large"
              >
                Pause
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<StopIcon />}
              onClick={handleStop}
              size="large"
            >
              Stop
            </Button>
            <IconButton
              color="primary"
              onClick={() => setShowSettings(true)}
              size="large"
            >
              <SettingsIcon />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => setCurrentTab(1)}
              size="large"
            >
              <StatsIcon />
            </IconButton>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Completed Pomodoros: {pomodoroCount}
          </Typography>
        </Paper>
      ) : (
        <StudyStats />
      )}

      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Timer Settings</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Study Duration (minutes)"
              type="number"
              value={settings.studyDuration}
              onChange={(e) => handleSettingsChange('studyDuration', parseInt(e.target.value))}
              inputProps={{ min: 1, max: 60 }}
            />
            <TextField
              label="Short Break Duration (minutes)"
              type="number"
              value={settings.shortBreakDuration}
              onChange={(e) => handleSettingsChange('shortBreakDuration', parseInt(e.target.value))}
              inputProps={{ min: 1, max: 30 }}
            />
            <TextField
              label="Long Break Duration (minutes)"
              type="number"
              value={settings.longBreakDuration}
              onChange={(e) => handleSettingsChange('longBreakDuration', parseInt(e.target.value))}
              inputProps={{ min: 1, max: 60 }}
            />
            <TextField
              label="Long Break Interval (pomodoros)"
              type="number"
              value={settings.longBreakInterval}
              onChange={(e) => handleSettingsChange('longBreakInterval', parseInt(e.target.value))}
              inputProps={{ min: 1, max: 10 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoStartBreaks}
                  onChange={(e) => handleSettingsChange('autoStartBreaks', e.target.checked)}
                />
              }
              label="Auto-start breaks"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoStartPomodoros}
                  onChange={(e) => handleSettingsChange('autoStartPomodoros', e.target.checked)}
                />
              }
              label="Auto-start pomodoros"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications}
                  onChange={(e) => handleSettingsChange('notifications', e.target.checked)}
                />
              }
              label="Enable notifications"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Cancel</Button>
          <Button onClick={handleSaveSettings} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudyTimer; 