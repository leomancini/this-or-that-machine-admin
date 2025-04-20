import React from "react";
import styled, { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledSelect = styled.select`
  height: 3rem;
  padding: 0 1rem;
  min-width: 10.5rem;
  background-color: rgba(0, 0, 0, 0.05);
  font-size: 1rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 2.5rem;
  color: rgba(0, 0, 0, 0.7);

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: rgba(0, 0, 0, 0.5);
  font-size: 0.875rem;
`;

const Dropdown = ({
  options,
  value,
  onChange,
  name,
  disabled = false,
  ...props
}) => {
  return (
    <StyleSheetManager shouldForwardProp={isPropValid}>
      <DropdownContainer>
        <StyledSelect
          value={value}
          onChange={onChange}
          name={name}
          disabled={disabled}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </StyledSelect>
        <IconWrapper>
          <FontAwesomeIcon icon={faChevronDown} />
        </IconWrapper>
      </DropdownContainer>
    </StyleSheetManager>
  );
};

export default React.memo(Dropdown);
