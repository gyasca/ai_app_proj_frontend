import React, { useContext } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import {
  ChevronRight,
  Settings,
  Camera,
  Clock,
  Heart,
  Search,
  Bell,
  User,
  Home,
  Activity,
  Calendar,
} from "lucide-react";
import { UserContext } from "../main";
import { Link } from "react-router-dom";

const HealthDashboard = () => {
  // Assuming UserContext provides user data
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NavBar */}
      {/* <Box className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
        <Box className="max-w-7xl mx-auto px-4">
          <Box className="flex justify-between h-16">
            <Box className="flex items-center">
              <Typography variant="h6" color="primary">
                HealthTrack
              </Typography>
              <Box className="hidden md:flex items-center space-x-8 ml-10">
                <Button
                  variant="text"
                  color="inherit"
                  startIcon={<Home />}
                  href="#"
                >
                  Dashboard
                </Button>
                <Button
                  variant="text"
                  color="inherit"
                  startIcon={<Activity />}
                  href="#"
                >
                  Analytics
                </Button>
                <Button
                  variant="text"
                  color="inherit"
                  startIcon={<Calendar />}
                  href="#"
                >
                  Schedule
                </Button>
              </Box>
            </Box>
            <Box className="flex items-center space-x-4">
              <IconButton>
                <Search size={20} />
              </IconButton>
              <IconButton>
                <Bell size={20} />
              </IconButton>
              <IconButton>
                <User size={20} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box> */}

      {/* Main Dashboard Content */}
      <Box className="pt-20 pb-8">
        <Box className="max-w-2xl mx-auto p-6 bg-white rounded-xl">
          <Box className="flex justify-between items-center mb-8">
            <Box>
              <Typography variant="h5" className="font-semibold">
                Health Dashboard
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Welcome back, {user?.username}
              </Typography>
            </Box>
            <Settings className="text-gray-400" />
          </Box>

          <Box className="mb-8">
            <Box className="flex justify-between items-center mb-4">
              <Typography variant="h6" className="font-medium">
                Daily Overview
              </Typography>
              <Typography variant="body2" color="primary">
                Today
              </Typography>
            </Box>

            <Grid container spacing={4} mb={6}>
              <Grid item xs={4} className="text-center">
                <Box className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-2 flex items-center justify-center">
                  <Typography variant="h6" className="font-semibold">
                    85%
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Food Analysis
                </Typography>
              </Grid>
              <Grid item xs={4} className="text-center">
                <Box className="w-16 h-16 rounded-full bg-blue-100 mx-auto mb-2 flex items-center justify-center">
                  <Typography variant="h6" className="font-semibold">
                    92%
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Activity Score
                </Typography>
              </Grid>
              <Grid item xs={4} className="text-center">
                <Box className="w-16 h-16 rounded-full bg-purple-100 mx-auto mb-2 flex items-center justify-center">
                  <Typography variant="h6" className="font-semibold">
                    78%
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Health Index
                </Typography>
              </Grid>
              {/* /oral-health/analyse */}
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={6}>
                <Paper
                  sx={{
                    backgroundColor: "blue.500",
                    color: "white",
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Box className="flex items-center justify-between mb-2">
                    <Box className="flex items-center gap-2">
                      <Camera size={20} />
                      <Typography variant="body2">Food Tracker</Typography>
                    </Box>
                    <ChevronRight size={20} />
                  </Box>
                  <Typography variant="body1" className="font-bold mb-1">
                    1,840 kcal
                  </Typography>
                  <Typography variant="body2">93% accuracy</Typography>
                </Paper>
              </Grid>

              <Grid item xs={6}>
                <Paper
                  sx={{
                    backgroundColor: "purple.500",
                    color: "white",
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Box className="flex items-center justify-between mb-2">
                    <Box className="flex items-center gap-2">
                      <Clock size={20} />
                      <Typography variant="body2">Skin Analysis</Typography>
                    </Box>
                    <ChevronRight size={20} />
                  </Box>
                  <Typography variant="h6" className="font-semibold mb-1">
                    Healthy
                  </Typography>
                  <Typography variant="body2">Last scan: 2h ago</Typography>
                  <Typography variant="body2">No issues</Typography>
                </Paper>
              </Grid>

              <Grid item xs={6}>
                <Paper
                  sx={{
                    backgroundColor: "red.500",
                    color: "white",
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Box className="flex items-center justify-between mb-2">
                    <Box className="flex items-center gap-2">
                      <Heart size={20} />
                      <Typography variant="body2">Blood Pressure</Typography>
                    </Box>
                    <ChevronRight size={20} />
                  </Box>
                  <Typography variant="h6" className="font-semibold mb-1">
                    120/80
                  </Typography>
                  <Typography variant="body2">Normal range</Typography>
                  <Typography variant="body2">95% accuracy</Typography>
                </Paper>
              </Grid>

              <Grid item xs={6}>
                <Paper
                  sx={{
                    backgroundColor: "green.500",
                    color: "white",
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Box className="flex items-center justify-between mb-2">
                    <Box className="flex items-center gap-2">
                      <span className="w-5 h-5">🦷</span>
                      <Typography variant="body2">Oral Health</Typography>
                    </Box>
                    <ChevronRight size={20} />
                  </Box>
                  {/* /oral-health/analyse */}
                  <Typography variant="h6" className="font-semibold mb-1">
                    Good
                  </Typography>
                  <Typography variant="body2">Last check: 15 ago</Typography>
                  <Typography variant="body2">All clear</Typography>
                  <Button
                    component={Link}
                    variant="contained"
                    color="white"
                    sx={{ color: "primary.main" }}
                    size="large"
                    to="/dashboard"
                  >
                    Enter Oral Dashboard
                  </Button>
                  <br/>
                  <Button
                    component={Link}
                    variant="contained"
                    color="white"
                    sx={{ color: "primary.main" }}
                    size="large"
                    to="/oral-health/analyse"
                  >
                    Quick access: Check Oral Health
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Box className="flex justify-between items-center mb-4">
              <Typography variant="h6" className="font-medium">
                Recent Activity
              </Typography>
              <Typography variant="body2" color="primary">
                View All
              </Typography>
            </Box>

            <Box className="space-y-4">
              {[
                { activity: "Food Analysis", time: "2h ago" },
                { activity: "Skin Scan", time: "4h ago" },
                { activity: "Blood Pressure", time: "1d ago" },
              ].map((item, index) => (
                <Box key={index} className="flex justify-between items-center">
                  <Box>
                    <Typography variant="body2" className="font-medium">
                      {item.activity}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.time}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="success.main">
                    Completed
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box className="bg-white border-t border-gray-200">
        <Box className="max-w-7xl mx-auto px-4 py-6">
          <Grid container spacing={8}>
            <Grid item xs={6} sm={3}>
              <Typography
                variant="body2"
                fontWeight="fontWeightBold"
                color="textPrimary"
              >
                Features
              </Typography>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Health Tracking
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Analytics
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Reports
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography
                variant="body2"
                fontWeight="fontWeightBold"
                color="textPrimary"
              >
                Support
              </Typography>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Help Center
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Privacy
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Terms
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography
                variant="body2"
                fontWeight="fontWeightBold"
                color="textPrimary"
              >
                Resources
              </Typography>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Blog
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Documentation
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography
                variant="body2"
                fontWeight="fontWeightBold"
                color="textPrimary"
              >
                Company
              </Typography>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  About
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Careers
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Contact
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default HealthDashboard;
