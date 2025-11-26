import { Routes, Route } from "react-router-dom";
import { Container, Box, Typography } from "@mui/material";

import Home from "./Home.jsx";
import AddBattery from "./battery/AddBatery.jsx";
import AllBattery from "./battery/AllBatery.jsx";
import EditBattery from "./battery/EditBatery.jsx";
import ViewBattery from "./battery/ViewBatery.jsx";


import UserSignupPage from "./users/UserSignupPage.jsx";
import UserLoginPage from "./users/UserLoginPage.jsx";

import UserProfile from "./users/UserProfile.jsx";
import UserHaveOwnBattery from "./users/UserHaveOwnBattery.jsx";

import Nav from "./components/Nav";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Nav />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/batteries/all" element={<AllBattery />} />

          <Route
            path="/batteries/add"
            element={
              <ProtectedRoute>
                <AddBattery />
              </ProtectedRoute>
            }
          />

          <Route
            path="/batteries/:id/view"
            element={
              <ProtectedRoute>
                <ViewBattery />
              </ProtectedRoute>
            }
          />

          <Route
            path="/batteries/:id/edit"
            element={
              <ProtectedRoute>
                <EditBattery />
              </ProtectedRoute>
            }
          />

          <Route path="/users/signup" element={<UserSignupPage />} />
          <Route path="/users/login" element={<UserLoginPage />} />

          <Route path="/users/profile" element={<UserProfile />} />

          <Route
            path="/users/profile/:id/ownbattery"
            element={<UserHaveOwnBattery />}
          />
        </Routes>
      </Container>
    </>
  );
}
