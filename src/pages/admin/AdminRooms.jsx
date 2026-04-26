import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Box, Alert, CircularProgress, Chip, MenuItem, Select, InputLabel, FormControl,
  Grid
} from '@mui/material';
import { Edit, Delete, Add, MeetingRoom } from '@mui/icons-material';
import { getLocationsAdmin, createRoom, updateRoom, deleteRoom, getRooms } from '../../services/api';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [formData, setFormData] = useState({
    locationId: '',
    name: '',
    type: '',
    capacity: '',
    pricePerNight: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch both rooms and locations
      const [roomsRes, locationsRes] = await Promise.all([
        getRooms(),
        getLocationsAdmin()
      ]);
      setRooms(roomsRes.data.rooms);
      setLocations(locationsRes.data.locations);
    } catch (err) {
      setError('Failed to load data');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateDialog = () => {
    setEditingRoom(null);
    setFormData({
      locationId: locations[0]?.id || '',
      name: '',
      type: '',
      capacity: '',
      pricePerNight: '',
      description: '',
      imageUrl: ''
    });
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (room) => {
    setEditingRoom(room);
    setFormData({
      locationId: room.locationId,
      name: room.name,
      type: room.type,
      capacity: room.capacity,
      pricePerNight: room.pricePerNight,
      description: room.description,
      imageUrl: room.imageUrl || ''
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingRoom(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.locationId) {
      setError('Please select a location');
      return;
    }
    if (!formData.name.trim()) {
      setError('Room name is required');
      return;
    }
    if (!formData.type) {
      setError('Room type is required');
      return;
    }
    if (!formData.capacity || formData.capacity < 1) {
      setError('Capacity must be at least 1');
      return;
    }
    if (!formData.pricePerNight || formData.pricePerNight <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    try {
      setLoading(true);
      if (editingRoom) {
        await updateRoom(editingRoom.id, formData);
        setSuccess('Room updated successfully!');
      } else {
        await createRoom(formData);
        setSuccess('Room created successfully!');
      }
      handleCloseDialog();
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (room) => {
    setRoomToDelete(room);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await deleteRoom(roomToDelete.id);
      setSuccess('Room deleted successfully!');
      setDeleteDialogOpen(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete room');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setRoomToDelete(null);
  };

  const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Executive', 'Family', 'Studio', 'Boutique'];

  if (loading && rooms.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Header with Add Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Manage Rooms
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenCreateDialog}
          disabled={locations.length === 0}
        >
          Add Room
        </Button>
      </Box>

      {locations.length === 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please add a location first before adding rooms.
        </Alert>
      )}

      {/* Success and Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Rooms Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Room Name</strong></TableCell>
              <TableCell><strong>Location</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Capacity</strong></TableCell>
              <TableCell><strong>Price/Night</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>
                  <strong>{room.name}</strong>
                  <Typography variant="caption" display="block" color="text.secondary">
                    {room.description.substring(0, 60)}...
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={room.location?.name || 'Unknown'} size="small" color="primary" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip label={room.type} size="small" />
                </TableCell>
                <TableCell>{room.capacity} guests</TableCell>
                <TableCell>
                  <Typography color="primary" fontWeight="bold">
                    €{room.pricePerNight}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleOpenEditDialog(room)}
                    title="Edit Room"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDeleteClick(room)}
                    title="Delete Room"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {rooms.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
          <Typography variant="h6" color="text.secondary">
            No rooms found. Click "Add Room" to create one.
          </Typography>
        </Paper>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MeetingRoom />
            {editingRoom ? 'Edit Room' : 'Add New Room'}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {/* Location Selection */}
            <FormControl fullWidth required>
              <InputLabel>Location / Hotel</InputLabel>
              <Select
                value={formData.locationId}
                label="Location / Hotel"
                onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
              >
                {locations.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.name} - {location.city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Room Name */}
            <TextField
              label="Room Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Ocean View Suite, Executive Room"
            />

            {/* Room Type and Capacity Row */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Room Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Room Type"
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    {roomTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Capacity (guests)"
                  type="number"
                  fullWidth
                  required
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || '' })}
                  inputProps={{ min: 1, max: 20 }}
                />
              </Grid>
            </Grid>

            {/* Price */}
            <TextField
              label="Price per Night (€)"
              type="number"
              fullWidth
              required
              value={formData.pricePerNight}
              onChange={(e) => setFormData({ ...formData, pricePerNight: parseFloat(e.target.value) || '' })}
              inputProps={{ min: 0, step: 5 }}
            />

            {/* Description */}
            <TextField
              label="Room Description"
              fullWidth
              required
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the room, amenities, view, etc."
            />

            {/* Image URL */}
            <TextField
              label="Image URL (optional)"
              fullWidth
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/room-image.jpg"
              helperText="Enter a URL for the room image"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? 'Saving...' : (editingRoom ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{roomToDelete?.name}"?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Note: Rooms with existing reservations cannot be deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminRooms;