import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Button,
  CardActionArea,
  Grid, 
} from "@mui/material";

import { useNavigate } from "react-router-dom";
export default function AllBatery() {
  const navigate = useNavigate();
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:1000/batteries/all")
      .then((res) => setBatteries(res.data))
      .catch((err) => console.error("Error fetching batteries:", err))
      .finally(() => setLoading(false));
  }, []);

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
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {batteries.map((battery, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
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

      <Box display="flex" justifyContent="center" mt={4}>
        <button
          onClick={() => navigate("/batteries/add")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ➕ Add New Battery
        </button>
      </Box>
    </>
  );
}
