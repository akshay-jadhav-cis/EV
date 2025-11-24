
import { Routes, Route } from "react-router-dom";
import { Container, Box, Typography } from "@mui/material";

import Home from "./Home.jsx";
import AllBatery from "./battery/AllBatery.jsx";
import AddBatery from "./battery/AddBatery.jsx";
import ViewBatery from "./battery/ViewBatery.jsx";
import EditBatery from "./battery/EditBatery.jsx";
import UserSignupPage from "./users/UserSignupPage.jsx";
import UserLoginPage from "./users/UserLoginPage.jsx";

import Nav from "./components/Nav";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <>
      <Nav />
      <Container maxWidth="lg" className="main-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/batteries/all" element={<AllBatery />} />

          {/* Protected Routes */}
          <Route
            path="/batteries/add"
            element={
              <ProtectedRoute>
                <AddBatery />
              </ProtectedRoute>
            }
          />

          <Route
            path="/batteries/:id/view"
            element={
              <ProtectedRoute>
                <ViewBatery />
              </ProtectedRoute>
            }
          />

          <Route
            path="/batteries/:id/edit"
            element={
              <ProtectedRoute>
                <EditBatery />
              </ProtectedRoute>
            }
          />

          <Route path="/users/signup" element={<UserSignupPage />} />
          <Route path="/users/login" element={<UserLoginPage />} />
        </Routes>
      </Container>
      <Box component="footer" className="footer">
        <Typography variant="body2">
          © {new Date().getFullYear()} Battery Management App
        </Typography>
      </Box>
    </>
  );
}

export default App;
