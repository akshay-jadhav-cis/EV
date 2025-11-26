import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { BatteryChargingFull } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Nav() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:1000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Logout failed", res.status);
        alert("Logout failed. Try again.");
        return;
      }

      // update client state
      logout(); // clears localStorage and user state
      navigate("/");
    } catch (error) {
      console.log("Logout error:", error);
      alert("Logout error. See console.");
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#daf2ee" }}>
      <Toolbar className="navbar" sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" gap={1} sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <BatteryChargingFull fontSize="large" />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "black" }}>
            Battery Management
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Button sx={{ color: "black" }} component={Link} to="/">
            Home
          </Button>

          <Button sx={{ color: "black" }} component={Link} to="/batteries/all">
            All Batteries
          </Button>

          {user && (
            <Button sx={{ color: "black" }} component={Link} to="/batteries/add">
              Add Battery
            </Button>
          )}

          {!user && (
            <>
              <Button sx={{ color: "black" }} component={Link} to="/users/login">
                Login
              </Button>

              <Button sx={{ color: "black" }} component={Link} to="/users/signup">
                Signup
              </Button>
            </>
          )}

          {user && (
            <>
              <Typography sx={{ color: "black", fontWeight: 600 }}>
                Hi, {user.name}
              </Typography>
              <Button sx={{ color: "red", fontWeight: 600 }} onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
