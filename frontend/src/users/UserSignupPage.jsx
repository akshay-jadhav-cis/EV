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
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import HomeIcon from "@mui/icons-material/Home";
import LockIcon from "@mui/icons-material/Lock";
import './Signup.css';
export default function UserSignupPage() {
  const [user, setUser] = useState({
    name: "",
    password: "",
    location: "",
    mobilenumber: "",
    hasvehicle: "no",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // keep mobile number numeric string (can sanitize on server)
    setUser((prev) => ({ ...prev, [name]: value }));
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
    if (!validate()) return;

    try {
      // use relative path in production; change to full URL if needed
      const res = await fetch("/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Signup failed");
      }

      const data = await res.json();
      // optionally show success notification here
      navigate("/batteries/all");
    } catch (error) {
      console.error("Signup error:", error);
      // you can replace alert with a snackbar/toast
      alert(error.message || "Something went wrong during signup");
    }
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

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Full name"
            name="name"
            value={user.name}
            onChange={handleChange}
            margin="normal"
            InputProps={{ startAdornment: <PersonIcon sx={{ mr: 1 }} /> }}
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
            InputProps={{ startAdornment: <LockIcon sx={{ mr: 1 }} /> }}
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
            InputProps={{ startAdornment: <HomeIcon sx={{ mr: 1 }} /> }}
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
            InputProps={{ startAdornment: <PhoneAndroidIcon sx={{ mr: 1 }} /> }}
            error={!!errors.mobilenumber}
            helperText={errors.mobilenumber}
          />

          <FormControl fullWidth margin="normal" error={!!errors.hasvehicle}>
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

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 2, color: "text.secondary" }}
        >
          Already registered?{" "}
          <a href="/login" style={{ color: "#1976d2", textDecoration: "none" }}>
            Log in
          </a>
        </Typography>
      </Paper>
    </Box>
  );
}
