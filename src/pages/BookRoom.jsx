import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Button, Box, Alert, CircularProgress, Card, CardContent, Grid } from '@mui/material';
import { createReservation } from '../services/api';

const BookRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId, checkIn, checkOut, guests } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirmBooking = async () => {
    setLoading(true);
    setError('');
    try {
      await createReservation({ roomId, checkIn: checkIn.toISOString().split('T')[0], checkOut: checkOut.toISOString().split('T')[0], guests });
      navigate('/reservations', { state: { message: 'Reservation created successfully!' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create reservation');
    } finally { setLoading(false); }
  };

  if (!roomId || !checkIn || !checkOut) {
    return (<Container><Alert severity="error">Invalid booking request. Please search for rooms again.</Alert><Button onClick={() => navigate('/search')} sx={{ mt: 2 }}>Back to Search</Button></Container>);
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Confirm Your Booking</Typography>
      <Card sx={{ mb: 3 }}><CardContent><Typography variant="h6" gutterBottom>Booking Summary</Typography><Grid container spacing={2}><Grid item xs={6}><Typography variant="body2" color="text.secondary">Check-in Date</Typography><Typography>{checkIn.toLocaleDateString()}</Typography></Grid><Grid item xs={6}><Typography variant="body2" color="text.secondary">Check-out Date</Typography><Typography>{checkOut.toLocaleDateString()}</Typography></Grid><Grid item xs={12}><Typography variant="body2" color="text.secondary">Number of Guests</Typography><Typography>{guests}</Typography></Grid></Grid></CardContent></Card>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}><Button variant="outlined" onClick={() => navigate('/search')}>Back</Button><Button variant="contained" onClick={handleConfirmBooking} disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Confirm Booking'}</Button></Box>
    </Container>
  );
};

export default BookRoom;
