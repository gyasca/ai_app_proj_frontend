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
    backgroundImage: `url('/competence_background.jpeg')`,
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
    document.title = "CM App - Competence Mapping";
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
                health info 1
              </Typography>
              <Typography variant="body1">
                health info 1 description
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} className={classes.featureItem}>
              <Typography variant="h6" component="h3">
                testimonial 1
              </Typography>
              <Typography variant="body1">
                testimonial 1 info
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} className={classes.featureItem}>
              <Typography variant="h6" component="h3">
                feature list
              </Typography>
              <Typography variant="body1">
               feature list description
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default LandingPage;
