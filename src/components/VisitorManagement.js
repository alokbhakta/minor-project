import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

const VisitorManagement = () => {
  const [visitorData, setVisitorData] = useState({
    name: '',
    purpose: '',
    phone: '',
    photo: null,
    entryTime: '',
    exitTime: '',
  });
  const [visitors, setVisitors] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Load visitors from localStorage on component mount
  useEffect(() => {
    loadVisitors();
  }, [selectedDate]);

  const loadVisitors = () => {
    const storedVisitors = localStorage.getItem(`visitors_${selectedDate}`);
    if (storedVisitors) {
      setVisitors(JSON.parse(storedVisitors));
    } else {
      setVisitors([]);
    }
  };

  // Save visitors to localStorage
  const saveVisitors = (updatedVisitors) => {
    localStorage.setItem(
      `visitors_${selectedDate}`,
      JSON.stringify(updatedVisitors)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVisitorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setVisitorData((prev) => ({
      ...prev,
      photo: imageSrc,
    }));
    setShowCamera(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentTime = new Date().toLocaleTimeString();
    const newVisitor = {
      ...visitorData,
      id: Date.now(),
      status: 'pending',
      entryTime: currentTime,
      exitTime: '',
      date: selectedDate,
      timestamp: new Date().toLocaleString(),
    };
    const updatedVisitors = [...visitors, newVisitor];
    setVisitors(updatedVisitors);
    saveVisitors(updatedVisitors);
    setVisitorData({
      name: '',
      purpose: '',
      phone: '',
      photo: null,
      entryTime: '',
      exitTime: '',
    });
  };

  const handleApproval = (id, status) => {
    const updatedVisitors = visitors.map((visitor) =>
      visitor.id === id ? { ...visitor, status } : visitor
    );
    setVisitors(updatedVisitors);
    saveVisitors(updatedVisitors);
  };

  const handleExit = (id) => {
    const currentTime = new Date().toLocaleTimeString();
    const updatedVisitors = visitors.map((visitor) =>
      visitor.id === id ? { ...visitor, exitTime: currentTime } : visitor
    );
    setVisitors(updatedVisitors);
    saveVisitors(updatedVisitors);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              New Visitor Registration
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Visitor Name"
                name="name"
                value={visitorData.name}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Purpose"
                name="purpose"
                value={visitorData.purpose}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={visitorData.phone}
                onChange={handleInputChange}
                margin="normal"
                required
              />

              {!showCamera && !visitorData.photo && (
                <Button
                  variant="contained"
                  startIcon={<PhotoCamera />}
                  onClick={() => setShowCamera(true)}
                  sx={{ mt: 2 }}
                >
                  Take Photo
                </Button>
              )}

              {showCamera && (
                <div>
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    style={{ marginTop: '20px', width: '100%' }}
                    />
                    <Button
                      variant="contained"
                      onClick={capturePhoto}
                      sx={{ mt: 2 }}
                    >
                      Capture Photo
                    </Button>
                  </div>
                )}
  
                {visitorData.photo && (
                  <div>
                    <img
                      src={visitorData.photo}
                      alt="Visitor"
                      style={{ marginTop: '20px', width: '100%' }}
                    />
                    <Button
                      variant="outlined"
                      onClick={() =>
                        setVisitorData((prev) => ({ ...prev, photo: null }))
                      }
                      sx={{ mt: 2 }}
                    >
                      Retake Photo
                    </Button>
                  </div>
                )}
  
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 3 }}
                  disabled={!visitorData.photo}
                >
                  Submit
                </Button>
              </form>
            </Paper>
          </Grid>
  
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Today's Visitors
              </Typography>
              <TextField
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Paper>
  
            {visitors.map((visitor) => (
              <Card key={visitor.id} sx={{ mb: 2, p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography variant="h6">{visitor.name}</Typography>
                    <Typography color="textSecondary">
                      Purpose: {visitor.purpose}
                    </Typography>
                    <Typography color="textSecondary">
                      Phone: {visitor.phone}
                    </Typography>
                    <Typography color="textSecondary">
                      Entry Time: {visitor.entryTime}
                    </Typography>
                    <Typography color="textSecondary">
                      Exit Time: {visitor.exitTime || 'Not exited yet'}
                    </Typography>
                    <Typography
                      color={
                        visitor.status === 'approved'
                          ? 'success.main'
                          : visitor.status === 'rejected'
                          ? 'error.main'
                          : 'warning.main'
                      }
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
  
                <Grid container spacing={1} sx={{ mt: 2 }}>
                  {visitor.status === 'pending' && (
                    <>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleApproval(visitor.id, 'approved')}
                        >
                          Approve
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleApproval(visitor.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </Grid>
                    </>
                  )}
                  {!visitor.exitTime && visitor.status === 'approved' && (
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleExit(visitor.id)}
                      >
                        Mark Exit
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Card>
            ))}
          </Grid>
        </Grid>
      </Container>
    );
  };
  
  export default VisitorManagement;