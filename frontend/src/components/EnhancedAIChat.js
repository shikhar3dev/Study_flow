import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Chip,
  Stack,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  SmartToy as BotIcon,
  Person as UserIcon,
  Timer as TimerIcon,
  Summarize as SummarizeIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import axios from 'axios';

const EnhancedAIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI study assistant. I can help you with:\n• Creating study plans\n• Summarizing materials\n• Generating flashcards\n• Providing study tips\n• Tracking your progress\nHow can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = selectedFiles.filter(file => {
      const validTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      return validTypes.includes(file.type);
    });
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!input.trim() && files.length === 0) return;

    const newMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('message', input);
      files.forEach(file => formData.append('files', file));

      const response = await axios.post('http://localhost:5000/api/chat', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const botResponse = {
        id: messages.length + 2,
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text',
      };

      setMessages(prev => [...prev, botResponse]);
      setFiles([]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'error',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleFeatureClick = (feature) => {
    const featureMessages = {
      summarize: "I'll help you summarize your study materials. Please upload the document you'd like me to analyze.",
      flashcards: "I'll create flashcards from your study materials. Please upload the content you'd like to convert.",
      timer: "I'll help you set up a study timer. How long would you like to study for?",
      tips: "Here are some study tips based on your current subjects:\n1. Break down complex topics into smaller chunks\n2. Use active recall techniques\n3. Take regular breaks\n4. Review your notes regularly\n5. Practice with past papers",
    };

    const newMessage = {
      id: messages.length + 1,
      text: featureMessages[feature],
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, newMessage]);
    setShowFeatures(false);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">AI Study Assistant</Typography>
        <Button
          variant="outlined"
          startIcon={<SchoolIcon />}
          onClick={() => setShowFeatures(true)}
        >
          Features
        </Button>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          flex: 1,
          mb: 2,
          p: 2,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                maxWidth: '70%',
              }}
            >
              {message.sender === 'bot' && (
                <BotIcon sx={{ mr: 1, color: 'primary.main' }} />
              )}
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  backgroundColor: message.sender === 'user' ? 'primary.light' : 'background.paper',
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ whiteSpace: 'pre-line' }}
                >
                  {message.text}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 1,
                    color: message.sender === 'user' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                  }}
                >
                  {message.timestamp.toLocaleTimeString()}
                </Typography>
              </Paper>
              {message.sender === 'user' && (
                <UserIcon sx={{ ml: 1, color: 'primary.main' }} />
              )}
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Paper>

      {files.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}
        >
          {files.map((file, index) => (
            <Chip
              key={index}
              label={file.name}
              onDelete={() => handleRemoveFile(index)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Stack>
      )}

      <Paper
        elevation={3}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          ref={fileInputRef}
          accept=".pdf,.txt,.doc,.docx"
        />
        <Tooltip title="Attach files">
          <IconButton
            onClick={() => fileInputRef.current.click()}
            color="primary"
          >
            <AttachFileIcon />
          </IconButton>
        </Tooltip>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={4}
          disabled={isProcessing}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={isProcessing || (!input.trim() && files.length === 0)}
        >
          {isProcessing ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Paper>

      <Dialog
        open={showFeatures}
        onClose={() => setShowFeatures(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>AI Study Assistant Features</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<SummarizeIcon />}
              onClick={() => handleFeatureClick('summarize')}
              fullWidth
            >
              Summarize Study Materials
            </Button>
            <Button
              variant="outlined"
              startIcon={<SchoolIcon />}
              onClick={() => handleFeatureClick('flashcards')}
              fullWidth
            >
              Generate Flashcards
            </Button>
            <Button
              variant="outlined"
              startIcon={<TimerIcon />}
              onClick={() => handleFeatureClick('timer')}
              fullWidth
            >
              Study Timer
            </Button>
            <Button
              variant="outlined"
              startIcon={<SchoolIcon />}
              onClick={() => handleFeatureClick('tips')}
              fullWidth
            >
              Get Study Tips
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFeatures(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnhancedAIChat; 