import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import http from '../../http';

const validationSchema = Yup.object({
  moduleCode: Yup.string().required("Module Code is required"),
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  school: Yup.string().required("School is required"),
  credit: Yup.number().required("Credit is required").positive().integer(),
  domain: Yup.string().required("Domain is required"),
  certifications: Yup.array().of(Yup.string()),
});

function EditModuleForm({ module: propModule, onClose }) {
  const [loading, setLoading] = useState(!propModule);
  const navigate = useNavigate();
  const { moduleCode: urlModuleCode } = useParams();
  const [module, setModule] = useState(propModule || null);

  useEffect(() => {
    if (!propModule && urlModuleCode) {
      const fetchModule = async () => {
        try {
          const response = await http.get(`/module/${urlModuleCode}`);
          setModule(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching module:", error);
          setLoading(false);
        }
      };
      fetchModule();
    }
  }, [propModule, urlModuleCode]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: module ? {
      moduleCode: module.moduleCode,
      title: module.title,
      description: module.description,
      school: module.school,
      credit: module.credit,
      domain: module.domain,
      certifications: module.certifications || [],
    } : {
      moduleCode: "",
      title: "",
      description: "",
      school: "",
      credit: "",
      domain: "",
      certifications: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await http.put(`/module/${values.moduleCode}`, values);
        if (onClose) {
          onClose();
        } else {
          navigate("/admin/modules");
        }
      } catch (error) {
        console.error("Error updating module:", error);
      }
    },
  });

  const handleAddCertification = () => {
    formik.setFieldValue("certifications", [
      ...formik.values.certifications,
      "",
    ]);
  };

  const handleRemoveCertification = (index) => {
    const newCertifications = [...formik.values.certifications];
    newCertifications.splice(index, 1);
    formik.setFieldValue("certifications", newCertifications);
  };

  const handleCertificationChange = (index, value) => {
    const newCertifications = [...formik.values.certifications];
    newCertifications[index] = value;
    formik.setFieldValue("certifications", newCertifications);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="moduleCode"
              name="moduleCode"
              label="Module Code"
              value={formik.values.moduleCode}
              onChange={formik.handleChange}
              error={formik.touched.moduleCode && Boolean(formik.errors.moduleCode)}
              helperText={formik.touched.moduleCode && formik.errors.moduleCode}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="school"
              name="school"
              label="School"
              value={formik.values.school}
              onChange={formik.handleChange}
              error={formik.touched.school && Boolean(formik.errors.school)}
              helperText={formik.touched.school && formik.errors.school}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="credit"
              name="credit"
              label="Credit"
              type="number"
              value={formik.values.credit}
              onChange={formik.handleChange}
              error={formik.touched.credit && Boolean(formik.errors.credit)}
              helperText={formik.touched.credit && formik.errors.credit}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="domain"
              name="domain"
              label="Domain"
              value={formik.values.domain}
              onChange={formik.handleChange}
              error={formik.touched.domain && Boolean(formik.errors.domain)}
              helperText={formik.touched.domain && formik.errors.domain}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Certifications</Typography>
            {formik.values.certifications.map((certification, index) => (
              <Box key={index} display="flex" alignItems="center" mb={1}>
                <TextField
                  fullWidth
                  value={certification}
                  onChange={(e) => handleCertificationChange(index, e.target.value)}
                  label={`Certification ${index + 1}`}
                />
                <IconButton onClick={() => handleRemoveCertification(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddCertification}
              variant="outlined"
              sx={{ mt: 1 }}
            >
              Add Certification
            </Button>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            type="button" 
            onClick={onClose ? onClose : () => navigate("/admin/modules")} 
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Update Module
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default EditModuleForm;