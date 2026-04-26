import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchRooms from './pages/SearchRooms';
import MyReservations from './pages/MyReservations';
import BookRoom from './pages/BookRoom';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReservations from './pages/admin/AdminReservations';
import AdminLocations from './pages/admin/AdminLocations';
import AdminRooms from './pages/admin/AdminRooms';
const theme = createTheme({
  palette: {
    primary: { main: '#2E7D32' },
    secondary: { main: '#FFA726' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<SearchRooms />} />
              <Route path="/reservations" element={<ProtectedRoute><MyReservations /></ProtectedRoute>} />
              <Route path="/book/:roomId" element={<ProtectedRoute><BookRoom /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route 
  path="/admin/rooms" 
  element={
    <AdminRoute>
      <AdminRooms />
    </AdminRoute>
  } 
/>
              <Route path="/admin/reservations" element={<AdminRoute><AdminReservations /></AdminRoute>} />
              <Route path="/admin/locations" element={<AdminRoute><AdminLocations /></AdminRoute>} />
            </Routes>
          </Layout>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
