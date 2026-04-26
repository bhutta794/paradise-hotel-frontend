import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', py: 3, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" textAlign="center">
          © {new Date().getFullYear()} Paradise Hotel. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
