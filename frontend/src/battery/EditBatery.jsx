import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Stack,
  Alert,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./EditBatery.css";

export default function EditBattery() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [batteryData, setBatteryData] = useState({
    batteryname: "",
    image: "",
    voltage: "",
    batteryWeight: "",
    batteryType: "",
    sized: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Check login + fetch battery details
  useEffect(() => {
    const checkLoginAndFetchBattery = async () => {
      try {
        // Check if user is logged in
        const sessionRes = await axios.get("http://localhost:1000/users/check-session", {
          withCredentials: true,
        });

        if (!sessionRes.data.loggedIn) {
          alert("Please log in to edit this battery.");
          navigate("/users/login");
          return;
        }

        // Fetch battery details
        const res = await axios.get(`http://localhost:1000/batteries/${id}/edit`, {
          withCredentials: true,
        });
        setBatteryData(res.data);
      } catch (err) {
        console.error("Error fetching battery:", err);
        setError("Failed to load battery details. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    checkLoginAndFetchBattery();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBatteryData({ ...batteryData, [name]: value });
  };

  const handleFileChange = (e) => {
    setBatteryData({ ...batteryData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in batteryData) {
        if (["_id", "__v"].includes(key)) continue;
        if (key !== "image" || batteryData.image instanceof File) {
          formData.append(key, batteryData[key]);
        }
      }

      const res = await fetch(`http://localhost:1000/batteries/${id}/edit`, {
        method: "PUT",
        body: formData,
        credentials: "include", // ✅ include cookie
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("✅ Battery updated successfully!");
      navigate("/batteries/all");
    } catch (error) {
      console.error("Error updating battery:", error);
      setError("Failed to update battery: " + error.message);
    }
  };

  if (loading)
    return (
      <Box className="loading-box">
        <CircularProgress size={50} color="primary" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading battery details...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" sx={{ mt: 5, mx: "auto", width: "fit-content" }}>
        {error}
      </Alert>
    );

  return (
    <Box className="editbattery-container">
      <Card className="editbattery-card" elevation={4}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Edit Battery Details
          </Typography>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Stack spacing={3}>
              <TextField
                label="Battery Name"
                name="batteryname"
                value={batteryData.batteryname}
                onChange={handleChange}
                fullWidth
                required
              />

              <Button variant="outlined" component="label">
                Upload New Image
                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
              </Button>

              <TextField
                label="Voltage (V)"
                name="voltage"
                value={batteryData.voltage}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                label="Weight (kg)"
                name="batteryWeight"
                value={batteryData.batteryWeight}
                onChange={handleChange}
                fullWidth
                type="number"
                required
              />

              <FormControl fullWidth required>
                <InputLabel>Battery Type</InputLabel>
                <Select
                  name="batteryType"
                  value={batteryData.batteryType}
                  onChange={handleChange}
                  label="Battery Type"
                >
                  <MenuItem value="c-type">C-type</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="roll">Roll</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel>Size</InputLabel>
                <Select
                  name="sized"
                  value={batteryData.sized}
                  onChange={handleChange}
                  label="Size"
                >
                  <MenuItem value="small">Small</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="large">Large</MenuItem>
                </Select>
              </FormControl>

              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  sx={{ borderRadius: "25px", px: 4 }}
                >
                  Update
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate("/batteries/all")}
                  sx={{ borderRadius: "25px", px: 3 }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
