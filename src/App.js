import React, { useState, useEffect } from "react";
import "./fontAwesome"; // Import Font Awesome configuration
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import styled, { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import Navbar from "./components/Navbar";
import Pairs from "./pages/Pairs";
import Votes from "./pages/Votes";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Spinner from "./components/Spinner";
import Simulator from "./pages/Simulator";

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

// Custom shouldForwardProp function that allows FontAwesome props
const shouldForwardProp = (prop, defaultValidatorFn) => {
  // Allow all FontAwesome props to pass through
  if (
    prop.startsWith("fa") ||
    prop === "icon" ||
    prop === "size" ||
    prop === "color"
  ) {
    return true;
  }
  // Use the default validator for other props
  return defaultValidatorFn(prop);
};

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
      <StyleSheetManager
        shouldForwardProp={(prop) => shouldForwardProp(prop, isPropValid)}
      >
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      </StyleSheetManager>
    );
  }

  return (
    <StyleSheetManager
      shouldForwardProp={(prop) => shouldForwardProp(prop, isPropValid)}
    >
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
                      path="/simulator"
                      element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                          <Simulator />
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
    </StyleSheetManager>
  );
}

export default App;
