import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        textAlign: "center",
        mt: 10,
      }}
    >
      <Typography variant="h3" gutterBottom>
        ⚡ Welcome to EV Battery Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Manage and view all your EV batteries efficiently.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3, borderRadius: 2 }}
        onClick={() => navigate("/batteries/all")}
      >
        View All Batteries
      </Button>
    </Box>
  );
}
