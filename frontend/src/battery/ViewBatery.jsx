import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./ViewBattery.css";

export default function ViewBattery() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [battery, setBattery] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Check login + fetch battery details
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: Check session
        const sessionRes = await axios.get("http://localhost:1000/users/check-session", {
          withCredentials: true,
        });

        if (!sessionRes.data.loggedIn) {
          alert("Please log in to view this battery.");
          navigate("/users/login");
          return;
        }

        setCurrentUser(sessionRes.data.user);

        // Step 2: Fetch battery details
        const batteryRes = await axios.get(`http://localhost:1000/batteries/${id}/view`, {
          withCredentials: true,
        });

        setBattery(batteryRes.data);
      } catch (err) {
        console.error("Error fetching battery details:", err);
        setError("Failed to load battery details. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // ✅ Delete function (only if owner)
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this battery?")) {
      try {
        const res = await fetch(`http://localhost:1000/batteries/${id}/delete`, {
          method: "DELETE",
          credentials: "include", // send cookie/session info
        });

        const data = await res.json();
        if (data.success) {
          alert("✅ Battery deleted successfully!");
          navigate("/batteries/all");
        } else {
          alert(data.message || "You are not authorized to delete this battery.");
        }
      } catch (error) {
        console.error("Error during deletion:", error);
        alert("Session expired. Please log in again.");
        navigate("/users/login");
      }
    }
  };

  // ✅ Loading State
  if (loading)
    return (
      <Box className="loading-box">
        <CircularProgress size={60} color="primary" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading battery details...
        </Typography>
      </Box>
    );

  // ✅ Error State
  if (error)
    return (
      <Alert severity="error" sx={{ mt: 5, mx: "auto", width: "fit-content" }}>
        {error}
      </Alert>
    );

  // ✅ Empty Battery Check
  if (!battery)
    return (
      <Typography align="center" sx={{ mt: 5 }}>
        No battery data found.
      </Typography>
    );

  // ✅ Ownership Check
  const isOwner =
    currentUser && battery.owner && battery.owner === currentUser.id;

  return (
    <Box className="viewbattery-container">
      <Card className="viewbattery-card" elevation={4}>
        {battery.image && (
          <CardMedia
            component="img"
            image={`http://localhost:1000/uploads/${battery.image}`}
            alt={battery.batteryname}
            className="battery-image"
          />
        )}

        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            {battery.batteryname}
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Voltage:</strong> {battery.voltage}V
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Weight:</strong> {battery.batteryWeight} kg
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Type:</strong> {battery.batteryType}
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Size:</strong> {battery.sized}
          </Typography>

          {battery.owner && (
            <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
              <strong>Created by:</strong>{" "}
              {battery.ownerName || "You"} {/* optional field if you populate */}
            </Typography>
          )}

          {/* ✅ Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
            {isOwner && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/batteries/${id}/edit`)}
                >
                  Edit
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </>
            )}

            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/batteries/all")}
            >
              Back
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
