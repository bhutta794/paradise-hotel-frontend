import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Alert, CircularProgress, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { getUserReservations, cancelReservation } from '../services/api';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelDialog, setCancelDialog] = useState({ open: false, id: null });

  useEffect(() => { loadReservations(); }, []);

  const loadReservations = async () => {
    try {
      const response = await getUserReservations();
      setReservations(response.data.reservations);
    } catch (err) { setError('Failed to load reservations');
    } finally { setLoading(false); }
  };

  const handleCancel = async () => {
    try {
      await cancelReservation(cancelDialog.id);
      setCancelDialog({ open: false, id: null });
      loadReservations();
    } catch (err) { setError('Failed to cancel reservation'); }
  };

  const getStatusChip = (status) => status === 'active' ? <Chip label="Active" color="success" size="small" /> : <Chip label="Cancelled" color="error" size="small" />;

  if (loading) return (<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>My Reservations</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {reservations.length === 0 ? (<Paper sx={{ p: 4, textAlign: 'center' }}><Typography variant="h6" color="text.secondary">You don't have any reservations yet.</Typography></Paper>) : (
        <TableContainer component={Paper}><Table><TableHead><TableRow><TableCell>Hotel</TableCell><TableCell>Room</TableCell><TableCell>Check-in</TableCell><TableCell>Check-out</TableCell><TableCell>Guests</TableCell><TableCell>Status</TableCell><TableCell>Actions</TableCell></TableRow></TableHead><TableBody>{reservations.map((res) => (<TableRow key={res.id}><TableCell><strong>{res.locationName}</strong><br /><Typography variant="caption" color="text.secondary">{res.locationCity}</Typography></TableCell><TableCell>{res.roomName}<br /><Typography variant="caption" color="text.secondary">{res.roomType}</Typography></TableCell><TableCell>{res.checkIn}</TableCell><TableCell>{res.checkOut}</TableCell><TableCell>{res.guests}</TableCell><TableCell>{getStatusChip(res.status)}</TableCell><TableCell>{res.status === 'active' && (<Button variant="outlined" color="error" size="small" onClick={() => setCancelDialog({ open: true, id: res.id })}>Cancel</Button>)}</TableCell></TableRow>))}</TableBody></Table></TableContainer>
      )}
      <Dialog open={cancelDialog.open} onClose={() => setCancelDialog({ open: false, id: null })}><DialogTitle>Cancel Reservation</DialogTitle><DialogContent><DialogContentText>Are you sure you want to cancel this reservation? This action cannot be undone.</DialogContentText></DialogContent><DialogActions><Button onClick={() => setCancelDialog({ open: false, id: null })}>No, Keep It</Button><Button onClick={handleCancel} color="error" autoFocus>Yes, Cancel</Button></DialogActions></Dialog>
    </Container>
  );
};

export default MyReservations;
