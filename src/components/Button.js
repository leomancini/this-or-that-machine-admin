import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
  min-width: 10.5rem;
  height: 3rem; /* 48px */
  padding: 0 1rem;
  background-color: ${(props) => {
    if (props.variant?.includes("secondary")) return "#6c757d";
    if (props.variant?.includes("danger")) return "#dc3545";
    if (props.variant?.includes("primary")) return "#000000";
    return "#000000";
  }};
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: ${(props) =>
    props.variant?.includes("small") ? "1rem" : "1.125rem"};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${(props) => {
      if (props.variant?.includes("secondary")) return "#5a6268";
      if (props.variant?.includes("danger")) return "#c82333";
      if (props.variant?.includes("primary")) return "#333333";
      return "#333333";
    }};
  }

  &:active:not(:disabled) {
    background-color: ${(props) => {
      if (props.variant?.includes("secondary")) return "#40464c";
      if (props.variant?.includes("danger")) return "#b82532";
      if (props.variant?.includes("primary")) return "#212529";
      return "#212529";
    }};
    transform: scale(0.95);
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
