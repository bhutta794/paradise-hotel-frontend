import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Menu, MenuItem } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowDropDown } from '@mui/icons-material';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [adminAnchorEl, setAdminAnchorEl] = useState(null);

  const handleAdminMenuOpen = (event) => {
    setAdminAnchorEl(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" color="primary" sx={{ mb: 4 }}>
      <Container>
        <Toolbar sx={{ justifyContent: 'space-between', px: 0 }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ textDecoration: 'none', color: 'white' }}
          >
            🌴 Paradise Hotel
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button color="inherit" component={RouterLink} to="/">Home</Button>
            <Button color="inherit" component={RouterLink} to="/about">About</Button>
            <Button color="inherit" component={RouterLink} to="/search">Find Room</Button>

            {user ? (
              <>
                <Button color="inherit" component={RouterLink} to="/reservations">
                  My Reservations
                </Button>
                
                {user.role === 'admin' && (
                  <>
                    <Button 
                      color="inherit" 
                      onClick={handleAdminMenuOpen}
                      endIcon={<ArrowDropDown />}
                    >
                      Admin Panel
                    </Button>
                    <Menu
                      anchorEl={adminAnchorEl}
                      open={Boolean(adminAnchorEl)}
                      onClose={handleAdminMenuClose}
                    >
                      <MenuItem component={RouterLink} to="/admin" onClick={handleAdminMenuClose}>
                        📊 Dashboard
                      </MenuItem>
                      <MenuItem component={RouterLink} to="/admin/reservations" onClick={handleAdminMenuClose}>
                        📅 All Reservations
                      </MenuItem>
                      <MenuItem component={RouterLink} to="/admin/locations" onClick={handleAdminMenuClose}>
                        🏨 Manage Locations
                      </MenuItem>
                      <MenuItem component={RouterLink} to="/admin/rooms" onClick={handleAdminMenuClose}>
                        🛏️ Manage Rooms
                      </MenuItem>
                    </Menu>
                  </>
                )}
                
                <Button color="inherit" onClick={handleLogout}>
                  Logout ({user.name})
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/login">Login</Button>
                <Button color="inherit" component={RouterLink} to="/register">Register</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;