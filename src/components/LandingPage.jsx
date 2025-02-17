import React, { useContext, useEffect } from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  AppBar,
  Toolbar,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import HeroText from "./HeroText";
import { Link } from "react-router-dom";
import { UserContext } from "../main";

const useStyles = makeStyles((theme) => ({
  hero: {
    // backgroundImage: `url('/competence_background.jpeg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "70vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },
  blurredBackground: {
    position: "absolute",
    left: 0,
    width: "100%",
    height: "75vh",
    backgroundImage: `url('/healthbackgroundsmallcropped.png')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(3px)", // Apply blur here
    zIndex: -1, // Place behind content
  },
  content: {
    textAlign: "center",
    padding: theme.spacing(4),
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: "30px",
  },
  features: {
    padding: theme.spacing(8, 0),
  },
  featureItem: {
    textAlign: "center",
    padding: theme.spacing(4),
  },
  appBar: {
    backgroundColor: "#333",
  },
  toolbar: {
    justifyContent: "space-between",
  },
  logo: {
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
}));

const LandingPage = () => {
  const classes = useStyles();
  const { user } = useContext(UserContext);

  useEffect(() => {
    document.title = "HealthBuddy";
  }, []);

  return (
    <>
      <AppBar position="static" className={classes.appBar}>
        {/* <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.logo}>
            CM App
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar> */}
      </AppBar>
      {/* Old hero text and background together */}
      <Box className={classes.hero}>
        <Box className={classes.blurredBackground} /> {/* New element */}
        <Box className={classes.content}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Health Buddy
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            Your ultimate AI health tracker
          </Typography>
          {!user ? (
            <>
              <Button
                component={Link}
                variant="contained"
                color="white"
                sx={{ color: "primary.main" }}
                size="large"
                to="/login"
              >
                Get Started - Login to HealthBuddy
              </Button>
            </>
          ) : (
            <>
              {/* Render a different button or content if user is logged in */}
              <Button
                component={Link}
                variant="contained"
                color="white"
                sx={{ color: "primary.main" }}
                size="large"
                to="/dashboard"
              >
                Enter Health Dashboard
              </Button>
            </>
          )}
        </Box>
      </Box>
      {/* End of old hero text and background together */}
      {/* <HeroText /> Add the HeroText component here */}
      <Container maxWidth="md" className={classes.features}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} className={classes.featureItem}>
              <Typography variant="h6" component="h3">
                Easy, quick diagnosis
              </Typography>
              <Typography variant="body1">
                AI powered diagnosis for early detection of potential conditions
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} className={classes.featureItem}>
              <Typography variant="h6" component="h3">
                Seamless health tracking
              </Typography>
              <Typography variant="body1">
                All-in-one app to track different physical health aspects
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} className={classes.featureItem}>
              <Typography variant="h6" component="h3">
                4 Key physical health components
              </Typography>
              <Typography variant="body1">
               Oral Health, Disease risk, Diet & Nutrition, Dermatology
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default LandingPage;
