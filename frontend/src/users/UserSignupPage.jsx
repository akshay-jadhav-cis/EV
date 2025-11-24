import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  FormHelperText,
  InputAdornment,
  Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import HomeIcon from "@mui/icons-material/Home";
import LockIcon from "@mui/icons-material/Lock";
import "./Signup.css";

export default function UserSignupPage() {
  const [user, setUser] = useState({
    name: "",
    password: "",
    location: "",
    mobilenumber: "",
    hasvehicle: "no",
  });
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!user.name.trim()) err.name = "Name is required";
    if (!user.password || user.password.length < 6)
      err.password = "Password must be at least 6 characters";
    if (!user.location.trim()) err.location = "Location is required";
    if (!/^\d{10}$/.test(user.mobilenumber))
      err.mobilenumber = "Enter a valid 10-digit mobile number";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setServerMessage("");

    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:1000/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ user }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      setServerMessage("✅ Signup successful! Redirecting...");
      setTimeout(() => navigate("/batteries/all"), 1500);
    } catch (error) {
      setServerError(error.message || "Something went wrong during signup");
    }
  };

  // 🌟 GOOGLE SIGN-UP / LOGIN
  const handleGoogleSignup = () => {
    window.open("http://localhost:1000/auth/google", "_self");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f7fb",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: isMobile ? "92%" : 420,
          borderRadius: 3,
          p: isMobile ? 3 : 5,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
          <PersonIcon sx={{ fontSize: 32, color: "#1976d2" }} />
          <Typography variant="h6" fontWeight={700}>
            Create an account
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Quick sign up — you’ll be redirected after successful registration.
        </Typography>

        {serverMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {serverMessage}
          </Alert>
        )}
        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Full name"
            name="name"
            value={user.name}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={user.password}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
            error={!!errors.password}
            helperText={errors.password || "Minimum 6 characters"}
          />

          <TextField
            fullWidth
            label="Location / Address"
            name="location"
            value={user.location}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon />
                </InputAdornment>
              ),
            }}
            error={!!errors.location}
            helperText={errors.location}
          />

          <TextField
            fullWidth
            label="Mobile number"
            name="mobilenumber"
            value={user.mobilenumber}
            onChange={handleChange}
            margin="normal"
            inputProps={{ maxLength: 10 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneAndroidIcon />
                </InputAdornment>
              ),
            }}
            error={!!errors.mobilenumber}
            helperText={errors.mobilenumber}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="vehicle-label">Do you have a vehicle?</InputLabel>
            <Select
              labelId="vehicle-label"
              value={user.hasvehicle}
              label="Do you have a vehicle?"
              name="hasvehicle"
              onChange={handleChange}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
            <FormHelperText>
              This helps match delivery options (optional)
            </FormHelperText>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.2,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Sign up
          </Button>
        </Box>

        {/* 🌟 GOOGLE SIGNUP BUTTON */}
        <Button
          fullWidth
          onClick={handleGoogleSignup}
          sx={{
            mt: 2,
            py: 1.2,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            backgroundColor: "#DB4437",
            color: "white",
            ":hover": { backgroundColor: "#B33A2E" },
          }}
        >
          Sign up with Google
        </Button>

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 2, color: "text.secondary" }}
        >
          Already registered?{" "}
          <a href="/users/login" style={{ color: "#1976d2", textDecoration: "none" }}>
            Log in
          </a>
        </Typography>
      </Paper>
    </Box>
  );
}
