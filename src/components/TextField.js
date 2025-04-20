import React from "react";
import styled from "styled-components";

const InputContainer = styled.div`
  flex: 1;
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #333;
`;

const StyledInput = styled.input`
  width: calc(100% - 2rem);
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  border: none;
  font-size: 1rem;
  transition: all 0.2s;
  background-color: rgba(0, 0, 0, 0.05);
  color: #333;
  outline: none;

  &:focus {
    background-color: rgba(0, 0, 0, 0.08);
  }

  &:disabled {
    background-color: rgba(0, 0, 0, 0.05);
    cursor: not-allowed;
  }

  &::placeholder {
    color: #999;
  }
`;

const ErrorText = styled.span`
  display: block;
  margin-top: 0.5rem;
  color: #333;
  font-size: 0.875rem;
`;

const TextField = ({ label, error, fullWidth = false, ...props }) => {
  return (
    <InputContainer fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      <StyledInput data-1p-ignore {...props} />
      {error && <ErrorText>{error}</ErrorText>}
    </InputContainer>
  );
};

export default TextField;
