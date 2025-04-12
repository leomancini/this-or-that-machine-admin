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

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
  flex-direction: row;
  gap: 1rem;
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
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <AppContainer>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/pairs" replace />} />
          <Route path="/pairs" element={<Pairs />} />
          <Route path="/votes" element={<Votes />} />
          <Route path="/device" element={<Device />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
