import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import TextField from "../components/TextField";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const LoginForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const Title = styled.h1`
  margin: 0 0 1rem 0;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  margin-top: 2rem;
  text-align: center;
  font-weight: 500;
`;

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/validate-api-key?key=${apiKey}`
      );
      const data = await response.json();

      if (data.valid) {
        localStorage.setItem("apiKey", apiKey);
        onLogin();
        navigate("/pairs");
      } else {
        setError("Sorry, something went wrong. Please try again.");
        setApiKey("");
      }
    } catch (err) {
      setError("Sorry, something went wrong. Please try again.");
      setApiKey("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginForm id="login-form" method="POST" onSubmit={handleSubmit}>
        <Title>This or That Machine</Title>
        <TextField
          id="api-key"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter API key"
          name="password"
          required
          disabled={isLoading}
          fullWidth
          autoFocus
        />
        <Button type="submit" fullWidth isLoading={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
