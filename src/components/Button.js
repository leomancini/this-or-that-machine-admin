import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
  padding: 0.875rem 1rem;
  background-color: ${(props) => {
    if (props.variant === "secondary") return "#6c757d";
    if (props.variant === "danger") return "#dc3545";
    if (props.variant === "primary") return "#007bff";
    return "#000000";
  }};
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${(props) => {
      if (props.variant === "secondary") return "#5a6268";
      if (props.variant === "danger") return "#c82333";
      if (props.variant === "primary") return "#0056b3";
      return "#333333";
    }};
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Button = ({
  children,
  variant = "default",
  fullWidth = false,
  isLoading = false,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      fullWidth={fullWidth}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </StyledButton>
  );
};

export default Button;
