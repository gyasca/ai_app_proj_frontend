import React, { useContext } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";

export function Footer() {
  return (
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
  );
}
