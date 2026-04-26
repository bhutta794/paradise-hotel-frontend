import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Paper, Box, Card, CardContent,
  CircularProgress, Alert
} from '@mui/material';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getAdminDashboard } from '../../services/api';

const COLORS = ['#2E7D32', '#FFA726', '#D32F2F'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getAdminDashboard();
      setData(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!data) return null;

  const { summary, reservationsByMonth, reservationsByLocation, reservationsByStatus } = data;

  const summaryCards = [
    { title: 'Total Reservations', value: summary.totalReservations, color: '#2E7D32' },
    { title: 'Active Reservations', value: summary.activeReservations, color: '#4CAF50' },
    { title: 'Cancelled Reservations', value: summary.cancelledReservations, color: '#D32F2F' },
    { title: 'Total Users', value: summary.totalUsers, color: '#FFA726' },
    { title: 'Total Locations', value: summary.totalLocations, color: '#2196F3' },
    { title: 'Total Rooms', value: summary.totalRooms, color: '#9C27B0' },
  ];

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ bgcolor: card.color, color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{card.title}</Typography>
                <Typography variant="h3">{card.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Reservations Over Time Chart */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Reservations Over Time (Last 6 Months)
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={reservationsByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#2E7D32" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      <Grid container spacing={4}>
        {/* Reservations by Location */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reservations by Location
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reservationsByLocation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#2E7D32" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Reservations by Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reservations by Status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reservationsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {reservationsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;