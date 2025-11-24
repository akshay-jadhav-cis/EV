import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { BatteryChargingFull } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Nav() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
  try {
    await fetch("http://localhost:1000/auth/logout", {
      method: "GET",
      credentials: "include",
    });

    setUser(null);  
    navigate("/"); 
  } catch (error) {
    console.log("Logout error:", error);
  }
};


  return (
    <AppBar position="static" sx={{ bgcolor: "#daf2ee" }}>
      <Toolbar className="navbar">
        {/* Left Section */}
        <Box display="flex" alignItems="center" gap={1}>
          <BatteryChargingFull fontSize="large" />
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 600, color: "black", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Battery Management
          </Typography>
        </Box>

        {/* Right Side Links */}
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

          {/* ========= NOT LOGGED IN ========= */}
          {!user && (
            <>
              <Button
                sx={{ color: "black" }}
                component={Link}
                to="/users/login"
              >
                Login
              </Button>

              <Button
                sx={{ color: "black" }}
                component={Link}
                to="/users/signup"
              >
                Signup
              </Button>
            </>
          )}

          {/* ========= LOGGED IN ========= */}
          {user && (
            <>
              <Typography sx={{ color: "black", fontWeight: 600 }}>
                Hi, {user.name}
              </Typography>
              <Button
                sx={{ color: "red", fontWeight: 600 }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
