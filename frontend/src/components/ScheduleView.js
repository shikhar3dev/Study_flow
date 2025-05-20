import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Box,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';

function ScheduleView() {
  const [schedule, setSchedule] = useState([]);
  const [dailyHours, setDailyHours] = useState(4);
  const [startDate, setStartDate] = useState(new Date());
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const generateSchedule = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/schedule', {
        subjects,
        daily_hours: dailyHours,
        start_date: startDate.toISOString().split('T')[0],
      });
      setSchedule(response.data);
    } catch (error) {
      console.error('Error generating schedule:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Study Schedule
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Daily Study Hours"
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                inputProps={{ min: 1, max: 24, step: 0.5 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={generateSchedule}
                fullWidth
              >
                Generate Schedule
              </Button>
            </Grid>
          </Grid>
        </Box>

        {schedule.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Chapter</TableCell>
                  <TableCell align="right">Hours</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedule.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.subject}</TableCell>
                    <TableCell>{item.chapter}</TableCell>
                    <TableCell align="right">{item.hours}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" color="text.secondary" align="center">
            No schedule generated yet. Set your preferences and click "Generate Schedule".
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default ScheduleView; 