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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./ViewBattery.css";

export default function ViewBattery() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [viewbatteryData, setViewbatteryData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBattery = async () => {
      try {
        setDataLoading(true);
        const res = await axios.get(`http://localhost:1000/batteries/${id}/view`);
        setViewbatteryData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load battery details.");
      } finally {
        setDataLoading(false);
      }
    };
    fetchBattery();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this battery?")) {
      try {
        const res = await fetch(`http://localhost:1000/batteries/${id}/delete`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          navigate("/batteries/all");
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error during deletion:", error);
      }
    }
  };

  if (dataLoading)
    return (
      <Box className="loading-box">
        <CircularProgress size={60} color="primary" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading battery details...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" sx={{ mt: 5 }}>
        {error}
      </Typography>
    );

  if (!viewbatteryData)
    return (
      <Typography align="center" sx={{ mt: 5 }}>
        No battery data found.
      </Typography>
    );

  return (
    <Box className="viewbattery-container">
      <Card className="viewbattery-card" elevation={4}>
        <CardMedia
          component="img"
          image={`http://localhost:1000/uploads/${viewbatteryData.image}`}
          alt={viewbatteryData.batteryname}
          className="battery-image"
        />
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            {viewbatteryData.batteryname}
          </Typography>
          <Typography variant="body1">
            <strong>Voltage:</strong> {viewbatteryData.voltage}V
          </Typography>
          <Typography variant="body1">
            <strong>Weight:</strong> {viewbatteryData.batteryWeight} kg
          </Typography>
          <Typography variant="body1">
            <strong>Type:</strong> {viewbatteryData.batteryType}
          </Typography>
          <Typography variant="body1">
            <strong>Size:</strong> {viewbatteryData.sized}
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
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
