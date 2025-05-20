import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

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

  const calculateProgress = (chapters) => {
    if (!chapters || chapters.length === 0) return 0;
    const totalHours = chapters.reduce((sum, chapter) => sum + chapter.hours_required, 0);
    const completedHours = chapters.reduce((sum, chapter) => {
      // This is a placeholder - in a real app, you'd track completed hours
      return sum + (chapter.completed ? chapter.hours_required : 0);
    }, 0);
    return Math.round((completedHours / totalHours) * 100);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h1" variant="h4" gutterBottom>
              Study Dashboard
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/add-subject')}
              >
                Add New Subject
              </Button>
            </Box>
          </Paper>
        </Grid>

        {subjects.map((subject) => (
          <Grid item xs={12} md={6} lg={4} key={subject.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {subject.name}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                  {subject.chapters.length} Chapters
                </Typography>
                <Typography variant="body2">
                  Progress: {calculateProgress(subject.chapters)}%
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/schedule')}>
                  View Schedule
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}

        {subjects.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No subjects added yet. Click "Add New Subject" to get started!
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default Dashboard; 