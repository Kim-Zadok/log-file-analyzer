import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Feeds from "./pages/Feeds";
import Visualizations from "./pages/Visualizations";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import { authService } from "./services/authService";

// Create a protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="search" element={<Search />} />
            <Route path="feeds" element={<Feeds />} />
            <Route path="visualizations" element={<Visualizations />} />
            <Route path="reports" element={<Reports />} />
            <Route path="compliance" element={<Reports />} />{" "}
            {/* Reusing Reports component for now */}
            <Route
              path="settings"
              element={<div>Settings Page (To be implemented)</div>}
            />
            <Route
              path="profile"
              element={<div>User Profile (To be implemented)</div>}
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
