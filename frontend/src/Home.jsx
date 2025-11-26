import { Box, Typography, Button, Container, Stack } from "@mui/material";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container>
      <Box textAlign="center" mt={5}>
        <ElectricBoltIcon sx={{ fontSize: 80 }} />

        <Typography variant="h3">EV Battery Dashboard</Typography>

        <Typography mt={1}>
          Manage and optimize your EV battery data.
        </Typography>

        <Stack direction="row" gap={2} justifyContent="center" mt={3}>
          <Button variant="contained" onClick={() => navigate("/batteries/all")}>
            View All Batteries
          </Button>

          {!user && (
            <>
              <Button variant="outlined" onClick={() => navigate("/users/login")}>
                Login
              </Button>

              <Button variant="outlined" onClick={() => navigate("/users/signup")}>
                Signup
              </Button>
            </>
          )}

          {user && (
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate("/users/profile")}
            >
              My Account
            </Button>
          )}
        </Stack>
      </Box>
    </Container>
  );
}
