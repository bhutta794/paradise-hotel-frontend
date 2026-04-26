import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Grid, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Card, CardContent,
  Rating, Box, Chip, Alert, CircularProgress, FormGroup, FormControlLabel, Checkbox,
  Stack, Autocomplete
} from '@mui/material';
import { Search, CalendarMonth, People, LocationOn, Star, Hotel } from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getAvailableRooms, getLocations } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SearchRooms = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  
  const [filters, setFilters] = useState({
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    guests: 2,
    search: '',
    city: '',
    rating: '',
    freeParking: false,
    wellnessCenter: false,
  });

  // Fetch locations from backend on component mount
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoadingLocations(true);
    try {
      const response = await getLocations();
      setLocations(response.data.locations);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    } finally {
      setLoadingLocations(false);
    }
  };

  // Get unique cities from locations
  const uniqueCities = ['All Cities', ...new Set(locations.map(loc => loc.city))];

  // Get unique hotel names for autocomplete
  const hotelNames = locations.map(loc => loc.name);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {
        checkIn: filters.checkIn.toISOString().split('T')[0],
        checkOut: filters.checkOut.toISOString().split('T')[0],
        guests: filters.guests,
        ...(filters.search && { search: filters.search }),
        ...(filters.city && filters.city !== 'All Cities' && { city: filters.city }),
        ...(filters.rating && { rating: filters.rating }),
        ...(filters.freeParking && { freeParking: true }),
        ...(filters.wellnessCenter && { wellnessCenter: true }),
      };
      const response = await getAvailableRooms(params);
      setRooms(response.data.rooms);
      setSearchPerformed(true);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (roomId) => {
    if (!user) {
      navigate('/login', { state: { from: '/search', message: 'Please login to book a room' } });
      return;
    }
    navigate(`/book/${roomId}`, { 
      state: { 
        roomId, 
        checkIn: filters.checkIn, 
        checkOut: filters.checkOut, 
        guests: filters.guests 
      } 
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Find Your Perfect Room
      </Typography>

      {/* Search Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Check-in Date */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              <CalendarMonth fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
              Check-in
            </Typography>
            <DatePicker
              selected={filters.checkIn}
              onChange={(date) => setFilters({ ...filters, checkIn: date })}
              selectsStart
              startDate={filters.checkIn}
              endDate={filters.checkOut}
              minDate={new Date()}
              className="form-control"
              placeholderText="Select date"
            />
          </Grid>

          {/* Check-out Date */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              <CalendarMonth fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
              Check-out
            </Typography>
            <DatePicker
              selected={filters.checkOut}
              onChange={(date) => setFilters({ ...filters, checkOut: date })}
              selectsEnd
              startDate={filters.checkIn}
              endDate={filters.checkOut}
              minDate={filters.checkIn}
              className="form-control"
              placeholderText="Select date"
            />
          </Grid>

          {/* Guests */}
          <Grid item xs={12} sm={6} md={1.8}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              <People fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
              Guests
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={filters.guests}
              onChange={(e) => setFilters({ ...filters, guests: Math.max(1, parseInt(e.target.value) || 1) })}
              inputProps={{ min: 1, max: 10, style: { padding: '12px' } }}
              size="small"
            />
          </Grid>

          {/* Hotel Name Search with Autocomplete */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              <Hotel fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
              Hotel Name
            </Typography>
            <Autocomplete
              freeSolo
              options={hotelNames}
              loading={loadingLocations}
              value={filters.search}
              onInputChange={(event, newValue) => setFilters({ ...filters, search: newValue || '' })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Type or select hotel..."
                  size="small"
                />
              )}
            />
          </Grid>

          {/* City Dropdown */}
          <Grid item xs={12} sm={6} md={1.8}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              <LocationOn fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
              City
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                displayEmpty
              >
                {uniqueCities.map(city => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Search Button */}
          <Grid item xs={12} md={1.2}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSearch}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              sx={{ 
                mt: { xs: 1, md: 2.5 },
                py: 1.2,
                bgcolor: '#2E7D32',
                '&:hover': { bgcolor: '#1B5E20' }
              }}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Grid>
        </Grid>

        {/* Filters Row */}
        <Grid container spacing={2} sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <Star fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
              Minimum Rating
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={filters.rating}
                onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                displayEmpty
              >
                <MenuItem value="">Any Rating</MenuItem>
                <MenuItem value={3}>⭐⭐⭐ 3+ Stars</MenuItem>
                <MenuItem value={4}>⭐⭐⭐⭐ 4+ Stars</MenuItem>
                <MenuItem value={4.5}>⭐⭐⭐⭐⭐ 4.5+ Stars</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Amenities
            </Typography>
            <Stack direction="row" spacing={2}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={filters.freeParking} 
                    onChange={(e) => setFilters({ ...filters, freeParking: e.target.checked })}
                    size="small"
                  />
                }
                label="Free Parking"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={filters.wellnessCenter} 
                    onChange={(e) => setFilters({ ...filters, wellnessCenter: e.target.checked })}
                    size="small"
                  />
                }
                label="Wellness Center"
              />
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Section */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : searchPerformed && rooms.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No rooms available for the selected criteria. Please try different dates or filters.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {rooms.map((room) => (
            <Grid item xs={12} key={room.id}>
              <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, borderRadius: 2 }}>
                {/* Image Section */}
                <Box sx={{ width: { xs: '100%', md: 300 }, minHeight: 200 }}>
                  <img
                    src={room.imageUrl || room.location.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                    alt={room.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderTopLeftRadius: 8,
                      borderBottomLeftRadius: { xs: 0, md: 8 },
                      borderTopRightRadius: { xs: 8, md: 0 }
                    }}
                  />
                </Box>

                {/* Content Section */}
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={7}>
                      <Typography variant="h5" gutterBottom fontWeight={600}>
                        {room.name}
                      </Typography>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        {room.location.name} - {room.location.city}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
                        <Rating value={room.location.rating} precision={0.5} readOnly />
                        <Typography variant="body2" color="text.secondary">
                          ({room.location.rating} stars)
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {room.description}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                        <Chip label={`Capacity: ${room.capacity} guests`} size="small" variant="outlined" />
                        <Chip label={`Type: ${room.type}`} size="small" variant="outlined" />
                        {room.location.hasFreeParking && <Chip label="Free Parking" size="small" color="success" />}
                        {room.location.hasWellnessCenter && <Chip label="Wellness Center" size="small" color="info" />}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={5}>
                      <Box sx={{ textAlign: 'right', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h3" color="primary" fontWeight={600}>
                            €{room.pricePerNight}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            per night
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => handleBook(room.id)}
                          sx={{ mt: 2, px: 4, bgcolor: '#2E7D32', '&:hover': { bgcolor: '#1B5E20' } }}
                        >
                          Book Now
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* CSS for DatePicker */}
      <style>{`
        .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker__input-container input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 0.875rem;
          background-color: white;
          transition: all 0.2s;
        }
        .react-datepicker__input-container input:hover {
          border-color: #2E7D32;
        }
        .react-datepicker__input-container input:focus {
          border-color: #2E7D32;
          box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.1);
          outline: none;
        }
        @media (max-width: 600px) {
          .react-datepicker__input-container input {
            padding: 10px;
            font-size: 14px;
          }
        }
      `}</style>
    </Container>
  );
};

export default SearchRooms;