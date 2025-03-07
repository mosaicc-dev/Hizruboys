import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../library/helper";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [user, setUser] = useState(null); // Store the user data
  const navigate = useNavigate();
  const API_URL = API_BASE_URL;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const notifyErr = (text) =>
    toast.error(`${text}`, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Slide,
    });

  const notifySuccess = (text) =>
    toast.success(`${text}`, {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Slide,
    });


  const handleLogin = async (event) => {
    event.preventDefault();
    const lowercaseEmail = email.toLowerCase();

    // Navigate based on role
    notifySuccess(`Welcome, User!`);
    setTimeout(() => {
      navigate("/user/dashboard");
    }, 1000);

    setPassword("");
    setEmail("");
  };

  const handleForgotPassword = () => {
  };

  const handleBackToLogin = () => {
  };

  const handleGoToPage = () => {
    notifySuccess(`Welcome back, User!`);
    setTimeout(() => {
      navigate("/pre_approved_guest");
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    setUser(null); // Clear the user state
    notifySuccess("Logged out successfully!");
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: 3,
        borderRadius: "12px",
        width: "100%",
        maxWidth: "350px",
        mx: "auto",
        "@media (max-width: 600px)": {
          fontSize: "12px",
        },
      }}
    >
      {!user ? (
        !showForgotPassword ? (
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                "& input": {
                  padding: "10px 12px",
                  "@media (max-width: 600px)": {
                    padding: "8px 10px",
                  },
                },
              },
              "@media (max-width: 600px)": {
                fontSize: "12px",
              },
            }}
          >
            <TextField
              label="Email"
              value={email}
              onChange={handleEmailChange}
              fullWidth
              margin="normal"
              variant="outlined"
              autoComplete="email"
              required
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              fullWidth
              margin="normal"
              variant="outlined"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                py: 1.2,
                borderRadius: "10px",
                fontSize: "15px",
                "@media (max-width: 600px)": {
                  fontSize: "12px",
                  py: 1,
                },
              }}
            >
              Sign in
            </Button>
            <Typography
              variant="body2"
              color="primary"
              align="center"
              sx={{
                mt: 2,
                cursor: "pointer",
                "@media (max-width: 600px)": {
                  fontSize: "12px",
                },
              }}
              onClick={handleForgotPassword}
            >
              Forgot your password?
            </Typography>
          </Box>
        ) : (
          <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
        )
      ) : (
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoToPage}
            fullWidth
            sx={{
              mt: 2,
              py: 1.2,
              borderRadius: "10px",
              fontSize: "15px",
              "@media (max-width: 600px)": {
                fontSize: "12px",
                py: 1,
              },
            }}
          >
            Go to Page
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleLogout}
            fullWidth
            sx={{
              mt: 2,
              py: 1.2,
              borderRadius: "10px",
              fontSize: "15px",
              "@media (max-width: 600px)": {
                fontSize: "12px",
                py: 1,
              },
            }}
          >
            Logout
          </Button>
        </Box>
      )}
      <ToastContainer />
    </Paper>
  );
}

export default LoginForm;
