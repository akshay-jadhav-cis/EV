import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import "./AddBatery.css";

export default function AddBattery() {
  const navigate = useNavigate();
  const [batteryData, setBatteryData] = useState({
    batteryname: "",
    sized: "",
    image: "",
    voltage: "",
    batteryWeight: "",
    batteryType: "",
  });
  const [previewImage, setPreviewImage] = useState(null);

  // ✅ check login when page loads
  useEffect(() => {
    axios
      .get("http://localhost:1000/users/check-session", { withCredentials: true })
      .then((res) => {
        if (!res.data.loggedIn) {
          alert("Please log in to add a battery.");
          navigate("/users/login");
        }
      })
      .catch((err) => {
        console.error("Error checking session:", err);
        navigate("/users/login");
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBatteryData({ ...batteryData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBatteryData({ ...batteryData, image: file });
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      for (const key in batteryData) {
        formData.append(key, batteryData[key]);
      }

      const res = await axios.post("http://localhost:1000/batteries/add", formData, {
        withCredentials: true, // ✅ include session cookie
      });

      if (res.data.success) {
        alert("Battery added successfully!");
        navigate("/batteries/all");
      } else {
        alert(res.data.message || "Failed to add battery");
      }
    } catch (error) {
      console.error("Error submitting battery:", error);
      alert("You must be logged in to add a battery.");
      navigate("/users/login");
    }
  };

  return (
    <Box className="addbattery-container">
      <Card className="addbattery-card" elevation={4}>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 600 }} gutterBottom>
            Add New Battery
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
                Upload Image
                <input
                  type="file"
                  name="image"
                  hidden
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Button>

              {previewImage && (
                <Box sx={{ textAlign: "center" }}>
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="preview-image"
                    required
                  />
                </Box>
              )}

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
                type="number"
                value={batteryData.batteryWeight}
                onChange={handleChange}
                fullWidth
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

              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                sx={{ mt: 2 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleIcon />}
                  sx={{ borderRadius: "25px", px: 4 }}
                >
                  Submit
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
