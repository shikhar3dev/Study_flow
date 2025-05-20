import React, { useState } from 'react';
import { 
  Button, TextField, Typography, Box, Table, 
  TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, IconButton, CircularProgress, Alert 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InputFormPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({ name: '', chapters: '', examDate: null });
  const [dailyHours, setDailyHours] = useState(4);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddSubject = () => {
    if (newSubject.name && newSubject.chapters && newSubject.examDate) {
      setSubjects([...subjects, newSubject]);
      setNewSubject({ name: '', chapters: '', examDate: null });
    }
  };

  const handleDeleteSubject = (index) => {
    const updatedSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(updatedSubjects);
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const formattedSubjects = subjects.map(subject => ({
        name: subject.name,
        chapters: Array.from({ length: parseInt(subject.chapters) }, (_, i) => ({
          name: `Chapter ${i + 1}`,
          exam_date: subject.examDate.toISOString().split('T')[0],
          difficulty: 3,
          hours_required: 2
        }))
      }));

      const response = await axios.post('http://localhost:5000/api/schedule', {
        subjects: formattedSubjects,
        daily_hours: parseFloat(dailyHours),
        start_date: new Date().toISOString().split('T')[0]
      });
      
      if (response.data && response.data.length > 0) {
        navigate('/plan', { state: { plan: response.data } });
      } else {
        setError('No schedule could be generated. Please check your inputs.');
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      setError(error.response?.data?.error || 'Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Input Study Details</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subject Name</TableCell>
              <TableCell>Chapters</TableCell>
              <TableCell>Exam Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject, index) => (
              <TableRow key={index}>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.chapters}</TableCell>
                <TableCell>{subject.examDate.toDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteSubject(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2}>
        <TextField
          label="Subject Name"
          value={newSubject.name}
          onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
        />
        <TextField
          label="Chapters"
          type="number"
          value={newSubject.chapters}
          onChange={(e) => setNewSubject({...newSubject, chapters: e.target.value})}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Exam Date"
            value={newSubject.examDate}
            onChange={(date) => setNewSubject({...newSubject, examDate: date})}
          />
        </LocalizationProvider>
        <Button onClick={handleAddSubject}>Add Subject</Button>
      </Box>
      <Box mt={2}>
        <TextField
          label="Hours per Day"
          type="number"
          value={dailyHours}
          onChange={(e) => setDailyHours(parseInt(e.target.value))}
        />
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleGeneratePlan} 
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Generate Study Plan'}
      </Button>
    </Box>
  );
};

export default InputFormPage;