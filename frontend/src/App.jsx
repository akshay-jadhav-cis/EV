// App.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";
import { BatteryChargingFull } from "@mui/icons-material";
import Home from "./Home.jsx";
import AllBatery from "./battery/AllBatery.jsx";
import AddBatery from "./battery/AddBatery.jsx";
import ViewBatery from "./battery/ViewBatery.jsx";
import EditBatery from "./battery/EditBatery.jsx";
import "./App.css";
import UserSignupPage from "./users/UserSignupPage.jsx";
import UserLoginPage from "./users/UserLoginPage.jsx";

function App() {
  return (
    <BrowserRouter>
      {/* Navbar */}
      <AppBar position="static" sx={{ bgcolor: "#daf2ee" }}>
        <Toolbar className="navbar">
          <Box display="flex" alignItems="center" gap={1}>
            <BatteryChargingFull fontSize="large" />
            <Typography variant="h6"  component="div" sx={{ fontWeight: 600 , color:"black"}}>
              Battery Management
            </Typography>
          </Box>
          <Box className="nav-links">
            <Button color="inherit"  sx={{ color:"black" }}component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} sx={{ color:"black" }} to="/batteries/all">All Batteries</Button>
            <Button color="inherit" sx={{ color:"black" }} component={Link} to="/batteries/add">Add Battery</Button>
          </Box>
        </Toolbar>
      </AppBar>

      
      <Container maxWidth="lg" className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/batteries/all" element={<AllBatery />} />
          <Route path="/batteries/add" element={<AddBatery />} />
          <Route path="/batteries/:id/view" element={<ViewBatery />} />
          <Route path="/batteries/:id/edit" element={<EditBatery />} />
          <Route path="/users/signup"element={<UserSignupPage/>}/>
          <Route path="/users/login" element={<UserLoginPage/>}/>
        </Routes>
      </Container> 
      <Box component="footer" className="footer">
        <Typography variant="body2">© {new Date().getFullYear()} Battery Management App</Typography>
      </Box>
    </BrowserRouter>
  );
}

export default App;
