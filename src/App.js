import React, { useState, useEffect } from "react";
import "./fontAwesome"; // Import Font Awesome configuration
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import styled from "styled-components";
import Navbar from "./components/Navbar";
import Pairs from "./pages/Pairs";
import Votes from "./pages/Votes";
import Device from "./pages/Device";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Spinner from "./components/Spinner";

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: row;
  gap: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedApiKey = localStorage.getItem("apiKey");
      if (!storedApiKey) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/validate-api-key?key=${storedApiKey}`
        );
        const data = await response.json();
        setIsAuthenticated(data.valid);
      } catch (err) {
        setIsAuthenticated(false);
        localStorage.removeItem("apiKey");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/pairs" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <AppContainer>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Navigate to="/pairs" />} />
                  <Route
                    path="/pairs"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <Pairs />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/votes"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <Votes />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/device"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <Device />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </AppContainer>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
