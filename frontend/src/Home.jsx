import { Box, Typography, Button, Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" className="home-container">
      <Box className="home-content" textAlign="center">
        <ElectricBoltIcon className="home-icon" />
        <Typography variant="h3" className="home-title" gutterBottom>
          EV Battery Dashboard
        </Typography>

        <Typography variant="subtitle1" className="home-subtitle" gutterBottom>
          Manage, monitor, and optimize your EV battery data seamlessly.
        </Typography>

        {/* Button group */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            className="home-btn"
            onClick={() => navigate("/batteries/all")}
          >
            View All Batteries
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => navigate("/users/login")}
          >
            Login
          </Button>

          <Button
            variant="outlined"
            color="success"
            size="large"
            onClick={() => navigate("/users/signup")}
          >
            Signup
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
