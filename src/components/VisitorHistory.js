import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const VisitorHistory = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visitors, setVisitors] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  });

  useEffect(() => {
    loadVisitors();
  }, [selectedDate]);

  const loadVisitors = () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const storedVisitors = localStorage.getItem(`visitors_${dateStr}`);
    const visitorsList = storedVisitors ? JSON.parse(storedVisitors) : [];
    setVisitors(visitorsList);

    // Calculate statistics
    const stats = visitorsList.reduce(
      (acc, visitor) => {
        acc.total++;
        acc[visitor.status]++;
        return acc;
      },
      { total: 0, approved: 0, rejected: 0, pending: 0 }
    );
    setStatistics(stats);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Visitor History
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>

        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Total Visitors</Typography>
                <Typography variant="h4">{statistics.total}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper
                elevation={2}
                sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}
              >
                <Typography variant="h6">Approved</Typography>
                <Typography variant="h4">{statistics.approved}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper
                elevation={2}
                sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}
              >
                <Typography variant="h6">Rejected</Typography>
                <Typography variant="h4">{statistics.rejected}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper
                elevation={2}
                sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}
              >
                <Typography variant="h6">Pending</Typography>
                <Typography variant="h4">{statistics.pending}</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Grid container spacing={2}>
        {visitors.map((visitor) => (
          <Grid item xs={12} md={6} key={visitor.id}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography variant="h6">{visitor.name}</Typography>
                    <Typography color="textSecondary">
                      Purpose: {visitor.purpose}
                    </Typography>
                    <Typography color="textSecondary">
                      Phone: {visitor.phone}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography color="textSecondary">
                      Entry: {visitor.entryTime}
                    </Typography>
                    <Typography color="textSecondary">
                      Exit: {visitor.exitTime || 'Not exited yet'}
                    </Typography>
                    <Typography
                      color={
                        visitor.status === 'approved'
                          ? 'success.main'
                          : visitor.status === 'rejected'
                          ? 'error.main'
                          : 'warning.main'
                      }
                      variant="subtitle1"
                      sx={{ mt: 1 }}
                    >
                      Status: {visitor.status}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <img
                      src={visitor.photo}
                      alt="Visitor"
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '4px',
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default VisitorHistory;