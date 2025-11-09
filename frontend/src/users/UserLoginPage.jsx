import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/system";

export default function UserLoginPage() {
  const navigate = useNavigate();
  const [data, setData] = useState({ name: "", password: "" });
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: data }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("Login successful!");
        console.log("User data:", result.user);
        navigate("/batteries/all");
      } else {
        alert(result.error || "Login failed");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <Box
      className="login-container"
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
            label="Name"
            name="name"
            variant="outlined"
            value={data.name}
            onChange={handleChange}
            InputProps={{
              style: { borderRadius: 12 },
            }}
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            value={data.password}
            onChange={handleChange}
            InputProps={{
              style: { borderRadius: 12 },
            }}
            required
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

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 3, color: "#555" }}
        >
          Don’t have an account?{" "}
          <a
            href="/users/signup"
            style={{
              textDecoration: "none",
              color: "#9CD3D9",
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
