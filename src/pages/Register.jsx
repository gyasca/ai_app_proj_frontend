import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../main";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";

function Register() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "@",
      role: "user",  // Default role set to 'user'
      confirmPassword: "",
      yearOfStudy: 1,
      staffId: "",
      department: "",
      position: "",
    },
    validationSchema: yup.object({
      username: yup
        .string()
        .trim()
        .min(1, "Username must be at least 1 character")
        .max(50, "Username must be at most 50 characters")
        .required("Username is required")
        .matches(
          /^[a-zA-Z '-,.]+$/,
          "Only allow letters, spaces and characters: ' - , ."
        ),
      email: yup
        .string()
        .trim()
        .email("Enter a valid email")
        .max(50, "Email must be at most 50 characters")
        .required("Email is required"),
      password: yup
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
          "At least 1 letter and 1 number"
        ),
      confirmPassword: yup
        .string()
        .trim()
        .required("Confirm password is required")
        .oneOf([yup.ref("password")], "Passwords must match"),
      role: yup.string().required("Role is required"),
      adminNumber: yup.string().when("role", {
        is: "student",
        then: yup.string().required("Admin number is required for students"),
      }),
      course: yup.string().when("role", {
        is: "student",
        then: yup.string().required("Course is required for students"),
      }),
      yearOfStudy: yup.number().when("role", {
        is: "student",
        then: yup
          .number()
          .required("Year of study is required for students")
          .min(1, "Year of study must be at least 1")
          .max(5, "Year of study must be at most 5"),
      }),
      staffId: yup.string().when("role", {
        is: "staff",
        then: yup.string().required("Staff ID is required for staff"),
      }),
      department: yup.string().when("role", {
        is: "staff",
        then: yup.string().required("Department is required for staff"),
      }),
      position: yup.string().when("role", {
        is: "staff",
        then: yup.string().required("Position is required for staff"),
      }),
    }),
    onSubmit: (data) => {
      const userData = {
        email: data.email.trim().toLowerCase(),
        password: data.password,
        username: data.username,
        role: data.role,
        adminNumber: data.role === "student" ? data.adminNumber : null,
        course: data.role === "student" ? data.course : null,
        yearOfStudy: data.role === "student" ? data.yearOfStudy : null,
        staffId: data.role === "staff" ? data.staffId : null,
        department: data.role === "staff" ? data.department : null,
        position: data.role === "staff" ? data.position : null,
      };

      http
        .post("/user/register", userData)
        .then((res) => {
          console.log(res.data);
          toast.success("Registration successful. Please log in.");
          navigate("/login");
        })
        .catch((err) => {
          toast.error(`Registration failed: ${err.response?.data?.message || "Unknown error"}`);
        });
    },
  });

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log(decoded);

    const userData = {
      email: decoded.email,
      password: "googlesecretpasswordxx94n2a", // You might want to generate a random password here
      username: decoded.username,
      role: "student", // Default role for Google sign-ups
      profilePictureFilePath: decoded.picture,
      // adminNumber: decoded.sub, // Using Google's sub as a placeholder
      // course: "Not specified",
      // yearOfStudy: 1,
    };

    http
      .get(`/user/email/${decoded.email}`)
      .then((res) => {
        console.log("User already exists:", res.data);
        loginUser(decoded.email);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        http
          .post("/user/register", userData)
          .then((res) => {
            console.log("New user registered:", res.data);
            loginUser(decoded.email);
          })
          .catch((err) => {
            toast.error(`Registration failed: ${err.response?.data?.message || "Unknown error"}`);
          });
      });
  };

  const loginUser = (email) => {
    const loginRequest = {
      email: email,
      password: "googlesecretpasswordxx94n2a",
    };
    http
      .post("/user/login", loginRequest)
      .then((res) => {
        localStorage.setItem("accessToken", res.data.accessToken);
        setUser(res.data);
        navigate("/");
      })
      .catch((err) => {
        toast.error(`Login failed: ${err.response?.data?.message || "Unknown error"}`);
      });
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" sx={{ my: 2 }}>
        Register
      </Typography>
      <Box
        sx={{
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            console.log("Login Failed");
            toast.error("Google login failed");
          }}
        />
        <Typography variant="body2" sx={{ my: 2 }}>
          OR
        </Typography>
      </Box>
      <Box
        component="form"
        sx={{ maxWidth: "500px" }}
        onSubmit={formik.handleSubmit}
      >
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Username"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{ my: 2 }}
        >
          Register
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default Register;
