import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  Box,
  CircularProgress,
  Paper,
  Divider,
  LinearProgress
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HealthPredictionForm = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    currentSmoker: '',
    cigsPerDay: '',
    BPMeds: '',
    prevalentStroke: '',
    prevalentHyp: '',
    diabetes: '',
    sysBP: '',
    diaBP: '',
    height: '',
    weight: '',
    BMI: ''
    
  });

  const getBMIColor = (bmi) => {
    if (!bmi) return '#f5f5f5';
    if (bmi < 18.5) return '#bbdefb';
    if (bmi < 25) return '#c8e6c9';
    if (bmi < 30) return '#fff9c4';
    return '#ffcdd2';
  };

  const getBMITextColor = (bmi) => {
    if (!bmi) return '#616161';
    if (bmi < 18.5) return '#1976d2';
    if (bmi < 25) return '#2e7d32';
    if (bmi < 30) return '#f57f17';
    return '#d32f2f';
  };

  const getBPColor = (sysBP, diaBP) => {
    if (!sysBP || !diaBP) return '#f5f5f5';
    if (sysBP < 120 && diaBP < 80) return '#c8e6c9';
    if (sysBP < 130 && diaBP < 80) return '#fff9c4';
    if (sysBP < 140 && diaBP < 90) return '#ffcc80';
    return '#ffcdd2';
  };

  const getBPCategory = (sysBP, diaBP) => {
    if (!sysBP || !diaBP) return '';
    if (sysBP < 120 && diaBP < 80) return 'Normal';
    if (sysBP < 130 && diaBP < 80) return 'Elevated';
    if (sysBP < 140 && diaBP < 90) return 'Stage 1 Hypertension';
    return 'Stage 2 Hypertension';
  };

  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const weight = parseFloat(formData.weight);
      if (heightInMeters > 0 && weight > 0) {
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
        setFormData(prev => ({
          ...prev,
          BMI: bmi
        }));
      }
    }
  }, [formData.height, formData.weight]);

  const calculateProgress = () => {
    const requiredFields = [
      'gender',
      'age',
      'currentSmoker',
      'BPMeds',
      'prevalentStroke',
      'prevalentHyp',
      'diabetes',
      'sysBP',
      'diaBP',
      'height',
      'weight'
    ];
    
    const filledFields = requiredFields.filter(field => formData[field] !== '').length;
    const newProgress = (filledFields / requiredFields.length) * 100;
    setProgress(newProgress);
  };

  useEffect(() => {
    calculateProgress();
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getBMIDescription = (bmi) => {
    if (!bmi) return '';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const getDiseaseRiskData = (riskScore) => {
    return [
      {
        name: 'Heart Disease',
        risk: riskScore * 100
      },
      {
        name: 'Stroke',
        risk: riskScore * 80
      },
      {
        name: 'Hypertension',
        risk: riskScore * 90
      }
    ];
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const processedData = {
            data: [{
                gender: parseInt(formData.gender) || 0,
                age: parseInt(formData.age) || 0,
                currentSmoker: parseInt(formData.currentSmoker) || 0,
                cigsPerDay: parseFloat(formData.cigsPerDay) || 0.0,
                BPMeds: parseInt(formData.BPMeds) || 0,
                prevalentStroke: parseInt(formData.prevalentStroke) || 0,
                prevalentHyp: parseInt(formData.prevalentHyp) || 0,
                diabetes: parseInt(formData.diabetes) || 0,
                sysBP: parseFloat(formData.sysBP) || 0.0,
                diaBP: parseFloat(formData.diaBP) || 0.0,
                BMI: parseFloat(formData.BMI) || 0.0
            }]
        };
      const response = await fetch('http://localhost:3001/dpmodel/predictData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(processedData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed: ${errorText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setResult(data.result);
      } else {
        throw new Error(data.error || 'Prediction failed');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 900, margin: '20px auto', p: 2 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom align="center">
          Health Risk Prediction
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom align="center">
          Enter your health information to get a risk assessment
        </Typography>

        <Box sx={{ width: '100%', mb: 4 }}>
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
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Personal Information
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
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

          <Divider sx={{ my: 3 }} />

          {/* Physical Measurements Section */}
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Physical Measurements
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
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

          {formData.BMI && (
            <Paper
              sx={{
                p: 2,
                mb: 4,
                backgroundColor: getBMIColor(formData.BMI),
                color: getBMITextColor(formData.BMI)
              }}
            >
              <Grid container spacing={2} textAlign="center">
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Your BMI
                  </Typography>
                  <Typography variant="h4">
                    {formData.BMI}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="h5">
                    {getBMIDescription(formData.BMI)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Blood Pressure Section */}
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Blood Pressure Information
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
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

          {formData.sysBP && formData.diaBP && (
            <Paper
              sx={{
                p: 2,
                mb: 4,
                backgroundColor: getBPColor(formData.sysBP, formData.diaBP)
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
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Medical History
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
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
                <InputLabel>Previous Stroke</InputLabel>
                <Select
                  name="prevalentStroke"
                  value={formData.prevalentStroke}
                  onChange={handleInputChange}
                  label="Previous Stroke"
                >
                  <MenuItem value="0">No</MenuItem>
                  <MenuItem value="1">Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Hypertension</InputLabel>
                <Select
                  name="prevalentHyp"
                  value={formData.prevalentHyp}
                  onChange={handleInputChange}
                  label="Hypertension"
                >
                  <MenuItem value="0">No</MenuItem>
                  <MenuItem value="1">Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Smoking Section */}
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Smoking History
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
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
                  label="Cigarettes Per Day"
                  name="cigsPerDay"
                  type="number"
                  value={formData.cigsPerDay}
                  onChange={handleInputChange}
                  helperText="Average number of cigarettes"
                />
              </Grid>
            )}
          </Grid>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 2, py: 1.5 }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Processing
              </>
            ) : (
              'Get Prediction'
            )}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {result && (
          <>
            <Alert severity={result.riskLevel === 'Low' ? 'success' : 
                            result.riskLevel === 'Moderate' ? 'warning' : 'error'} 
                   sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Prediction Results</Typography>
              <Typography variant="body1">Risk Level: {result.riskLevel}</Typography>
              <Typography variant="body1">Risk Score: {(result.riskScore * 100).toFixed(1)}%</Typography>
              <Typography variant="body1">Confidence: {(result.confidence * 100).toFixed(1)}%</Typography>
            </Alert>
            
            <Box sx={{ mt: 4, height: 300 }}>
              <Typography variant="h6" gutterBottom>Disease Risk Analysis</Typography>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getDiseaseRiskData(result.riskScore)}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Risk (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="risk" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthPredictionForm;