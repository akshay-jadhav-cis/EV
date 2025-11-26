import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { BatteryChargingFull } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Nav() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:1000/users/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        logout();
        navigate("/");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#daf2ee" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
          <BatteryChargingFull />
          <Typography variant="h6" sx={{ ml: 1, display: "inline" }}>
            Battery Management
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/batteries/all">
            All Batteries
          </Button>

          {user && (
            <Button color="inherit" component={Link} to="/batteries/add">
              Add Battery
            </Button>
          )}

          {!user ? (
            <>
              <Button color="inherit" component={Link} to="/users/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/users/signup">
                Signup
              </Button>
            </>
          ) : (
            <>
              <Typography sx={{ color: "black", fontWeight: 500 }}>
                Hi, {user.name}
              </Typography>
              <Button color="error" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
