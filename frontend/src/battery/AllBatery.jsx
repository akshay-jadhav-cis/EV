import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Grid,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AllBattery() {
  const navigate = useNavigate();
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:1000/batteries/all", { withCredentials: true })
      .then((res) => setBatteries(res.data))
      .catch((err) => console.error("Error fetching batteries:", err))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Function to check session before navigating
  const handleAddBatteryClick = async () => {
    try {
      const res = await axios.get("http://localhost:1000/users/check-session", {
        withCredentials: true,
      });

      if (res.data.loggedIn) {
        navigate("/batteries/add");
      } else {
        alert("You must log in before adding a battery.");
        navigate("/users/login");
      }
    } catch (err) {
      console.error("Error checking login:", err);
      alert("Session check failed. Please log in again.");
      navigate("/users/login");
    }
  };

  return (
    <>
      <Box sx={{ p: 4 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          🔋 All Batteries
        </Typography>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {batteries.map((battery, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  onClick={() => navigate(`/batteries/${battery._id}/view`)}
                  sx={{
                    borderRadius: 3,
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  {battery.image && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={`http://localhost:1000/uploads/${battery.image}`}
                      alt={battery.batteryname}
                      sx={{ objectFit: "cover" }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {battery.batteryname}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Voltage:</strong> {battery.voltage}V
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Weight:</strong> {battery.batteryWeight} kg
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Size:</strong> {battery.sized}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Type:</strong> {battery.batteryType}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* ✅ Protected Add Battery Button */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          onClick={handleAddBatteryClick}
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
            py: 1,
            fontWeight: 600,
            "&:hover": { backgroundColor: "#125ca1" },
          }}
        >
          ➕ Add New Battery
        </Button>
      </Box>
    </>
  );
}
