import React from "react";
import styled from "styled-components";

const StyledButton = styled.button.attrs(({ variant, isActive, disabled }) => ({
  variant,
  isActive,
  disabled
}))`
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
  min-width: 10.5rem;
  height: 3rem; /* 48px */
  padding: 0 1rem;
  background-color: ${(props) => {
    if (props.isActive) {
      if (props.variant === "secondary") return "rgba(0, 0, 0, 0.2)";
      if (props.variant === "destructive") return "#b82532";
      return "#000000";
    }
    if (props.variant === "secondary") return "rgba(0, 0, 0, 0.1)";
    if (props.variant === "destructive") return "#dc3545";
    return "#000000";
  }};
  color: ${(props) =>
    props.variant === "secondary" ? "rgba(0, 0, 0, 0.7)" : "white"};
  border: none;
  border-radius: 0.75rem;
  font-size: ${(props) => (props.variant === "small" ? "1rem" : "1.125rem")};
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:focus {
    outline: none;
    box-shadow: none;
  }

  ${({ disabled, variant }) =>
    disabled &&
    `
      opacity: ${variant === "primary" ? "0.25" : "0.5"};
    `}

  &:hover:not(:disabled) {
    background-color: ${(props) => {
      if (props.variant === "secondary") return "rgba(0, 0, 0, 0.15)";
      if (props.variant === "destructive") return "#c82333";
      return "rgba(0, 0, 0, 0.8)";
    }};
  }

  &:active:not(:disabled) {
    background-color: ${(props) => {
      if (props.variant === "secondary") return "rgba(0, 0, 0, 0.3)";
      if (props.variant === "destructive") return "#b82532";
      return "#000000";
    }};
    transform: scale(0.95);
  }
`;

const Button = ({
  children,
  variant = "default",
  fullWidth = false,
  isLoading = false,
  disabled = false,
  isActive = false,
  onClick,
  ...props
}) => {
  const handleClick = (e) => {
    if (disabled || isLoading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <StyledButton
      variant={variant}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      isActive={isActive}
      onClick={handleClick}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
