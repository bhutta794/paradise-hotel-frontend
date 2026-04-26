import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControlLabel, Checkbox, Rating, Box, Alert, CircularProgress,
  Chip, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { getLocationsAdmin, createLocation, updateLocation, deleteLocation } from '../../services/api';

const AdminLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    description: '',
    rating: 4,
    hasFreeParking: false,
    hasWellnessCenter: false,
    imageUrl: ''
  });

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const response = await getLocationsAdmin();
      setLocations(response.data.locations);
    } catch (err) {
      setError('Failed to load locations');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateDialog = () => {
    setEditingLocation(null);
    setFormData({
      name: '',
      city: '',
      address: '',
      description: '',
      rating: 4,
      hasFreeParking: false,
      hasWellnessCenter: false,
      imageUrl: ''
    });
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      city: location.city,
      address: location.address,
      description: location.description,
      rating: location.rating,
      hasFreeParking: location.hasFreeParking,
      hasWellnessCenter: location.hasWellnessCenter,
      imageUrl: location.imageUrl || ''
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingLocation(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      setError('Location name is required');
      return;
    }
    if (!formData.city) {
      setError('City is required');
      return;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    try {
      setLoading(true);
      if (editingLocation) {
        await updateLocation(editingLocation.id, formData);
        setSuccess('Location updated successfully!');
      } else {
        await createLocation(formData);
        setSuccess('Location created successfully!');
      }
      handleCloseDialog();
      loadLocations();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (location) => {
    setLocationToDelete(location);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await deleteLocation(locationToDelete.id);
      setSuccess('Location deleted successfully!');
      setDeleteDialogOpen(false);
      loadLocations();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete location');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setLocationToDelete(null);
  };

  const cities = ['Sofia', 'Varna', 'Plovdiv', 'Velingrad', 'Burgas', 'Other'];

  if (loading && locations.length === 0) {
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
          Manage Locations
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenCreateDialog}
        >
          Add Location
        </Button>
      </Box>

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

      {/* Locations Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>City</strong></TableCell>
              <TableCell><strong>Rating</strong></TableCell>
              <TableCell><strong>Amenities</strong></TableCell>
              <TableCell><strong>Rooms</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell>
                  <strong>{location.name}</strong>
                  <Typography variant="caption" display="block" color="text.secondary">
                    {location.address}
                  </Typography>
                </TableCell>
                <TableCell>{location.city}</TableCell>
                <TableCell>
                  <Rating value={location.rating} precision={0.5} readOnly size="small" />
                  <Typography variant="caption">({location.rating})</Typography>
                </TableCell>
                <TableCell>
                  {location.hasFreeParking && <Chip label="Free Parking" size="small" sx={{ mr: 0.5 }} />}
                  {location.hasWellnessCenter && <Chip label="Wellness Center" size="small" />}
                </TableCell>
                <TableCell>{location.roomCount || 0}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleOpenEditDialog(location)}
                    title="Edit Location"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDeleteClick(location)}
                    title="Delete Location"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {locations.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
          <Typography variant="h6" color="text.secondary">
            No locations found. Click "Add Location" to create one.
          </Typography>
        </Paper>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingLocation ? 'Edit Location' : 'Add New Location'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Hotel Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Paradise Marina"
            />
            
            <FormControl fullWidth required>
              <InputLabel>City</InputLabel>
              <Select
                value={formData.city}
                label="City"
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              >
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Address"
              fullWidth
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full street address"
            />
            
            <TextField
              label="Description"
              fullWidth
              required
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the hotel, its features, and what makes it special"
            />
            
            <Box>
              <Typography component="legend">Rating (1-5 stars)</Typography>
              <Rating
                value={formData.rating}
                precision={0.5}
                onChange={(e, newValue) => setFormData({ ...formData, rating: newValue || 0 })}
              />
            </Box>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.hasFreeParking}
                  onChange={(e) => setFormData({ ...formData, hasFreeParking: e.target.checked })}
                />
              }
              label="Free Parking Available"
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.hasWellnessCenter}
                  onChange={(e) => setFormData({ ...formData, hasWellnessCenter: e.target.checked })}
                />
              }
              label="Wellness Center / Spa"
            />
            
            <TextField
              label="Image URL (optional)"
              fullWidth
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/hotel-image.jpg"
              helperText="Enter a URL for the hotel image"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? 'Saving...' : (editingLocation ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{locationToDelete?.name}"?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Note: Locations with existing reservations cannot be deleted.
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

export default AdminLocations;