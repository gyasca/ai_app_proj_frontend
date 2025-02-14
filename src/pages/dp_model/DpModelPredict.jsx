import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  Divider,
  LinearProgress,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from "recharts";

function FormComponent() {
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    height: "",
    weight: "",
    sysBP: "",
    diaBP: "",
    BPMeds: "",
    diabetes: "",
    prevalentStroke: "",
    prevalentHyp: "",
    currentSmoker: "",
    cigsPerDay: "",
  });

  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const filledFields = Object.values(formData).filter((value) => value !== "").length;
    const totalFields = Object.keys(formData).length;
    setProgress((filledFields / totalFields) * 100);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation
    if (
      !formData.gender ||
      !formData.age ||
      !formData.height ||
      !formData.weight ||
      !formData.sysBP ||
      !formData.diaBP ||
      !formData.BPMeds ||
      !formData.diabetes ||
      !formData.prevalentStroke ||
      !formData.prevalentHyp ||
      !formData.currentSmoker ||
      !formData.cigsPerDay
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate prediction result after form submission
    setTimeout(() => {
      setResult({
        riskLevel: "Moderate",
        riskScore: Math.random(),
        confidence: Math.random(),
      });
      setLoading(false);
    }, 2000);
  };

  const getDiseaseRiskData = (riskScore) => [
    { name: "Heart Disease", risk: riskScore * 100 },
    { name: "Stroke", risk: riskScore * 50 },
    { name: "Diabetes", risk: riskScore * 70 },
  ];

  const getBMIColor = (BMI) => {
    if (BMI < 18.5) return "#ffebee";
    if (BMI < 25) return "#c8e6c9";
    return "#ffcc80";
  };

  const getBMITextColor = (BMI) => (BMI < 18.5 || BMI >= 25 ? "black" : "white");

  const getBMIDescription = (BMI) => {
    if (BMI < 18.5) return "Underweight";
    if (BMI < 25) return "Normal weight";
    return "Overweight";
  };

  const getBPColor = (sysBP, diaBP) => {
    if (sysBP < 120 && diaBP < 80) return "#c8e6c9";
    if (sysBP < 140 && diaBP < 90) return "#ffebee";
    return "#ffcc80";
  };

  const getBPCategory = (sysBP, diaBP) => {
    if (sysBP < 120 && diaBP < 80) return "Normal";
    if (sysBP < 140 && diaBP < 90) return "Elevated";
    return "High";
  };

  // Calculating BMI
  const calculateBMI = () => {
    const heightInMeters = formData.height / 100; // Convert height to meters
    return (formData.weight / (heightInMeters * heightInMeters)).toFixed(2); // BMI formula
  };

  return (
    <Card sx={{ maxWidth: 900, margin: "20px auto", p: 2 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom align="center">
          Health Risk Prediction
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom align="center">
          Enter your health information to get a risk assessment
        </Typography>

        <Box sx={{ width: "100%", mb: 4 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Form Completion Progress
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="text.secondary" align="right">
            {Math.round(progress)}%
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          {/* Personal Information Section */}
          <Box sx={{ border: "1px solid #ccc", p: 2, mb: 4, borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Personal Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    label="Gender"
                  >
                    <MenuItem value="0">Female</MenuItem>
                    <MenuItem value="1">Male</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Physical Measurements Section */}
          <Box sx={{ border: "1px solid #ccc", p: 2, mb: 4, borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Physical Measurements
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange}
                  helperText="Enter height in centimeters"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                  helperText="Enter weight in kilograms"
                />
              </Grid>
            </Grid>
          </Box>

          {formData.height && formData.weight && (
            <Paper
              sx={{
                p: 2,
                mb: 4,
                backgroundColor: getBMIColor(calculateBMI()),
                color: getBMITextColor(calculateBMI()),
              }}
            >
              <Grid container spacing={2} textAlign="center">
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Your BMI
                  </Typography>
                  <Typography variant="h4">{calculateBMI()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="h5">
                    {getBMIDescription(calculateBMI())}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Blood Pressure Section */}
          <Box sx={{ border: "1px solid #ccc", p: 2, mb: 4, borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Blood Pressure Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Systolic BP"
                  name="sysBP"
                  type="number"
                  value={formData.sysBP}
                  onChange={handleInputChange}
                  helperText="mmHg"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Diastolic BP"
                  name="diaBP"
                  type="number"
                  value={formData.diaBP}
                  onChange={handleInputChange}
                  helperText="mmHg"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Blood Pressure Medication</InputLabel>
                  <Select
                    name="BPMeds"
                    value={formData.BPMeds}
                    onChange={handleInputChange}
                    label="Blood Pressure Medication"
                  >
                    <MenuItem value="0">No</MenuItem>
                    <MenuItem value="1">Yes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {formData.sysBP && formData.diaBP && (
            <Paper
              sx={{
                p: 2,
                mb: 4,
                backgroundColor: getBPColor(formData.sysBP, formData.diaBP),
              }}
            >
              <Grid container spacing={2} textAlign="center">
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Blood Pressure
                  </Typography>
                  <Typography variant="h4">
                    {formData.sysBP}/{formData.diaBP}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="h5">
                    {getBPCategory(formData.sysBP, formData.diaBP)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Medical History Section */}
          <Box sx={{ border: "1px solid #ccc", p: 2, mb: 4, borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Medical History
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Diabetes</InputLabel>
                  <Select
                    name="diabetes"
                    value={formData.diabetes}
                    onChange={handleInputChange}
                    label="Diabetes"
                  >
                    <MenuItem value="0">No</MenuItem>
                    <MenuItem value="1">Yes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Prevalent Stroke</InputLabel>
                  <Select
                    name="prevalentStroke"
                    value={formData.prevalentStroke}
                    onChange={handleInputChange}
                    label="Prevalent Stroke"
                  >
                    <MenuItem value="0">No</MenuItem>
                    <MenuItem value="1">Yes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Prevalent Hypertension</InputLabel>
                  <Select
                    name="prevalentHyp"
                    value={formData.prevalentHyp}
                    onChange={handleInputChange}
                    label="Prevalent Hypertension"
                  >
                    <MenuItem value="0">No</MenuItem>
                    <MenuItem value="1">Yes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Lifestyle Section */}
          <Box sx={{ border: "1px solid #ccc", p: 2, mb: 4, borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Lifestyle Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Current Smoker</InputLabel>
                  <Select
                    name="currentSmoker"
                    value={formData.currentSmoker}
                    onChange={handleInputChange}
                    label="Current Smoker"
                  >
                    <MenuItem value="0">No</MenuItem>
                    <MenuItem value="1">Yes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {formData.currentSmoker === "1" && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cigarettes per day"
                    name="cigsPerDay"
                    type="number"
                    value={formData.cigsPerDay}
                    onChange={handleInputChange}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
          {/* Other Health Conditions Section */}
          <Box sx={{ border: "1px solid #ccc", p: 2, mb: 4, borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Other Health Conditions
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Diabetes</InputLabel>
                  <Select
                    name="diabetes"
                    value={formData.diabetes}
                    onChange={handleInputChange}
                    label="Diabetes"
                  >
                    <MenuItem value="0">No</MenuItem>
                    <MenuItem value="1">Yes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Prevalent Stroke</InputLabel>
                  <Select
                    name="prevalentStroke"
                    value={formData.prevalentStroke}
                    onChange={handleInputChange}
                    label="Prevalent Stroke"
                  >
                    <MenuItem value="0">No</MenuItem>
                    <MenuItem value="1">Yes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>


          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Risk Assessment Results
            </Typography>
            <Typography variant="body1">
              Risk Level: {result.riskLevel}
            </Typography>
            <Typography variant="body1">
              Confidence Score: {Math.round(result.confidence * 100)}%
            </Typography>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getDiseaseRiskData(result.riskScore)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="risk" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default FormComponent;
