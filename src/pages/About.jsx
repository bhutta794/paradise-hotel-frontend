import React from 'react';
import { Container, Typography, Paper, Grid, Box } from '@mui/material';
import { EmojiEmotions, LocationCity, BeachAccess, Spa } from '@mui/icons-material';

const About = () => {
  const values = [
    { icon: <EmojiEmotions fontSize="large" />, title: 'Exceptional Service', description: 'We pride ourselves on providing the highest level of hospitality.' },
    { icon: <LocationCity fontSize="large" />, title: 'Prime Locations', description: 'Properties in the most desirable locations across Bulgaria.' },
    { icon: <BeachAccess fontSize="large" />, title: 'Luxury Amenities', description: 'From pools to fine dining, we have everything you need.' },
    { icon: <Spa fontSize="large" />, title: 'Wellness Focus', description: 'Relax and rejuvenate at our world-class spa facilities.' },
  ];

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
        <Typography variant="h2" gutterBottom>About Paradise Hotel</Typography>
        <Typography variant="h5">Creating Unforgettable Experiences Since 2010</Typography>
      </Paper>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb" alt="Paradise Hotel Lobby" style={{ width: '100%', borderRadius: '8px' }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>Our Story</Typography>
          <Typography paragraph>Paradise Hotel was founded with a simple vision: to provide exceptional hospitality in Bulgaria's most beautiful locations.</Typography>
          <Typography paragraph>Each of our properties is carefully designed to reflect the unique character of its location while maintaining the highest standards of comfort and service.</Typography>
        </Grid>
      </Grid>

      <Typography variant="h4" gutterBottom textAlign="center" sx={{ mt: 6 }}>Our Values</Typography>
      <Grid container spacing={4} sx={{ mt: 2, mb: 6 }}>
        {values.map((value, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Box sx={{ color: 'primary.main', mb: 2 }}>{value.icon}</Box>
              <Typography variant="h6" gutterBottom>{value.title}</Typography>
              <Typography variant="body2" color="text.secondary">{value.description}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default About;
