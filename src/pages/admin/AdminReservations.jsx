import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Box, Alert, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getAllReservations } from '../../services/api';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', status: 'all' });

  useEffect(() => { loadReservations(); }, []);
  useEffect(() => { filterReservations(); }, [filters, reservations]);

  const loadReservations = async () => {
    try {
      const response = await getAllReservations();
      setReservations(response.data.reservations);
      setFilteredReservations(response.data.reservations);
    } catch (err) { setError('Failed to load reservations');
    } finally { setLoading(false); }
  };

  const filterReservations = () => {
    let filtered = [...reservations];
    if (filters.search) { const searchLower = filters.search.toLowerCase(); filtered = filtered.filter((r) => r.guestName?.toLowerCase().includes(searchLower) || r.guestEmail?.toLowerCase().includes(searchLower) || r.locationName?.toLowerCase().includes(searchLower) || r.roomName?.toLowerCase().includes(searchLower)); }
    if (filters.status !== 'all') { filtered = filtered.filter((r) => r.status === filters.status); }
    setFilteredReservations(filtered);
  };

  const getStatusChip = (status) => status === 'active' ? <Chip label="Active" color="success" size="small" /> : <Chip label="Cancelled" color="error" size="small" />;

  if (loading) return (<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>All Reservations</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper sx={{ p: 2, mb: 3 }}><Typography variant="subtitle1" gutterBottom>Filters</Typography><Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}><TextField label="Search" variant="outlined" size="small" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} sx={{ minWidth: 200 }} placeholder="Name, email, hotel, room..." /><FormControl size="small" sx={{ minWidth: 150 }}><InputLabel>Status</InputLabel><Select value={filters.status} label="Status" onChange={(e) => setFilters({ ...filters, status: e.target.value })}><MenuItem value="all">All</MenuItem><MenuItem value="active">Active</MenuItem><MenuItem value="cancelled">Cancelled</MenuItem></Select></FormControl><Typography variant="body2" sx={{ alignSelf: 'center', ml: 'auto' }}>{filteredReservations.length} reservations found</Typography></Box></Paper>
      <TableContainer component={Paper}><Table><TableHead><TableRow><TableCell>Guest</TableCell><TableCell>Contact</TableCell><TableCell>Hotel & Room</TableCell><TableCell>Check-in</TableCell><TableCell>Check-out</TableCell><TableCell>Guests</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>{filteredReservations.map((res) => (<TableRow key={res.id}><TableCell><strong>{res.guestName}</strong></TableCell><TableCell>{res.guestEmail}</TableCell><TableCell><strong>{res.locationName}</strong><br /><Typography variant="caption" color="text.secondary">{res.roomName} ({res.roomType})</Typography></TableCell><TableCell>{res.checkIn}</TableCell><TableCell>{res.checkOut}</TableCell><TableCell>{res.guests}</TableCell><TableCell>{getStatusChip(res.status)}</TableCell></TableRow>))}</TableBody></Table></TableContainer>
      {filteredReservations.length === 0 && !loading && (<Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}><Typography variant="h6" color="text.secondary">No reservations found</Typography></Paper>)}
    </Container>
  );
};

export default AdminReservations;
