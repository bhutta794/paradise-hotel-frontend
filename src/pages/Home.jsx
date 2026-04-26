import React from 'react';
import { Container, Box, Typography, Button, Grid, Paper, Card, CardMedia, CardContent, Stack, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { BeachAccess, Spa, LocalParking, Restaurant, Wifi, FitnessCenter } from '@mui/icons-material';

const Home = () => {
  const features = [
    { icon: <BeachAccess sx={{ fontSize: 50 }} />, title: 'Prime Locations', description: 'Beautiful properties across Bulgaria\'s best destinations' },
    { icon: <Spa sx={{ fontSize: 50 }} />, title: 'Luxury Spa', description: 'Relax and rejuvenate at our world-class wellness centers' },
    { icon: <LocalParking sx={{ fontSize: 50 }} />, title: 'Free Parking', description: 'Complimentary parking at all our locations' },
    { icon: <Restaurant sx={{ fontSize: 50 }} />, title: 'Fine Dining', description: 'Exquisite restaurants with local and international cuisine' },
    { icon: <Wifi sx={{ fontSize: 50 }} />, title: 'Free WiFi', description: 'Stay connected with high-speed internet throughout' },
    { icon: <FitnessCenter sx={{ fontSize: 50 }} />, title: 'Fitness Center', description: 'State-of-the-art gym facilities for your workout' },
  ];

  const featuredLocations = [
    { 
      name: 'Paradise Marina', 
      city: 'Varna', 
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      description: 'Seaside luxury with stunning ocean views'
    },
    { 
      name: 'Paradise Central', 
      city: 'Sofia', 
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      description: 'Urban elegance in the heart of the capital'
    },
    { 
      name: 'Paradise Spa Retreat', 
      city: 'Velingrad', 
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
      description: 'Mountain wellness and relaxation haven'
    },
    { 
      name: 'Paradise Riverside', 
      city: 'Plovdiv', 
      image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=800&q=80',
      description: 'Boutique charm along the riverbank'
    },
  ];

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 700,
              mb: 2,
            }}
          >
            Welcome to Paradise Hotel
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              fontSize: { xs: '1.1rem', md: '1.5rem' },
              mb: 4,
              opacity: 0.95,
            }}
          >
            Experience luxury and comfort at our premier locations across Bulgaria
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            component={Link} 
            to="/search"
            sx={{
              bgcolor: 'white',
              color: '#2E7D32',
              px: 5,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#f5f5f5',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Book Your Stay Now
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              fontWeight: 600,
              mb: 1
            }}
          >
            Why Choose Paradise Hotel?
          </Typography>
          <Divider sx={{ width: 80, mx: 'auto', my: 2, borderColor: '#2E7D32', borderWidth: 2 }} />
          <Typography variant="body1" color="text.secondary">
            We provide exceptional service and amenities to make your stay unforgettable
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                  borderRadius: 3,
                }}
              >
                <Box sx={{ color: '#2E7D32', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Locations Section */}
      <Box sx={{ bgcolor: '#f5f5f5', py: { xs: 6, md: 8 } }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                fontWeight: 600,
                mb: 1
              }}
            >
              Our Featured Locations
            </Typography>
            <Divider sx={{ width: 80, mx: 'auto', my: 2, borderColor: '#2E7D32', borderWidth: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Discover our beautiful properties in the most desirable destinations
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {featuredLocations.map((location, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8,
                    },
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <CardMedia
                    component="img"
                    height="220"
                    image={location.image}
                    alt={location.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      {location.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {location.city}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {location.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
          color: 'white',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Ready for an Unforgettable Experience?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.95 }}>
            Book your stay today and enjoy luxury accommodation at competitive prices
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              size="large" 
              component={Link} 
              to="/search"
              sx={{
                bgcolor: 'white',
                color: '#2E7D32',
                px: 4,
                py: 1.2,
                '&:hover': {
                  bgcolor: '#f5f5f5',
                },
              }}
            >
              Search Rooms
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              component={Link} 
              to="/about"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.2,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Learn More
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;