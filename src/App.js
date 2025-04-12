import React from "react";
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

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100vw;
  height: calc(100vh - 4rem);
`;

function App() {
  return (
    <Router>
      <Container>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/pairs" replace />} />
          <Route path="/pairs" element={<Pairs />} />
          <Route path="/votes" element={<Votes />} />
          <Route path="/device" element={<Device />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
