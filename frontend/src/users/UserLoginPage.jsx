import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  useMediaQuery,
  Alert,
} from "@mui/material";

export default function UserLoginPage() {
  const navigate = useNavigate();
  const [data, setData] = useState({ name: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");

  // ✅ Handle input changes
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error on typing
  };

  // ✅ Validate inputs before submitting
  const validateForm = () => {
    let newErrors = {};
    if (!data.name.trim()) newErrors.name = "Username is required";
    else if (data.name.length < 3)
      newErrors.name = "Username must be at least 3 characters long";

    if (!data.password.trim()) newErrors.password = "Password is required";
    else if (data.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");

    if (!validateForm()) return; // Stop if validation fails

    try {
      const res = await fetch("http://localhost:1000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ⬅️ Important for sessions
        body: JSON.stringify({ user: data }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setServerMessage("✅ Login successful!");
        console.log("User data:", result.user);
        navigate("/batteries/all");
      } else {
        setServerMessage(result.error || result.message || "Login failed");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setServerMessage("❌ Server error, please try again later.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f6fa"
    >
      <Paper
        elevation={4}
        sx={{
          p: isMobile ? 3 : 5,
          width: isMobile ? "85%" : "400px",
          borderRadius: "20px",
          backgroundColor: "white",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          align="center"
          gutterBottom
          color="#333"
        >
          User Login
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}
        >
          <TextField
            fullWidth
            label="Username"
            name="name"
            variant="outlined"
            value={data.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            InputProps={{
              style: { borderRadius: 12 },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            value={data.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              style: { borderRadius: 12 },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              textTransform: "none",
              py: 1.3,
              borderRadius: "12px",
              fontSize: "1rem",
              ":hover": {
                backgroundColor: "#125ca1",
              },
            }}
          >
            Login
          </Button>
        </Box>
        {serverMessage && (
          <Alert
            severity={
              serverMessage.includes("✅") ? "success" : "error"
            }
            sx={{ mt: 3, borderRadius: "10px" }}
          >
            {serverMessage}
          </Alert>
        )}

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 3, color: "#555" }}
        >
          Don’t have an account?{" "}
          <a
            href="http://localhost:2000/users/signup"
            style={{
              textDecoration: "none",
              color: "#1976d2",
              fontWeight: "bold",
            }}
          >
            Register
          </a>
        </Typography>
      </Paper>
    </Box>
  );
}
