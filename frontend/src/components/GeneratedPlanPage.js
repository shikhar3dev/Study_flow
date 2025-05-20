import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Typography, Box, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Checkbox,
  LinearProgress, Button
} from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const GeneratedPlanPage = () => {
  // ... existing code ...

  const pdfRef = useRef();

  const handleShare = async () => {
    const element = pdfRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('study_plan.pdf');
  };

  return (
    <Box p={3} ref={pdfRef}>
      {/* ... existing code ... */}
      <Button variant="contained" color="primary" onClick={handleShare} style={{ marginTop: '20px' }}>
        Share Plan
      </Button>
    </Box>
  );
};

export default GeneratedPlanPage;